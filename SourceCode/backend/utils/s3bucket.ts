import { DeleteObjectCommand, PutObjectCommand, S3 } from "@aws-sdk/client-s3";
import * as process from "process";
import fs from "fs";
import path from "path";
import Settings from "../models/settings.model";
import { generateID } from "./helpers";

const LOCAL_PROVIDER = 'local';
const S3_PROVIDER = 's3';
const UPLOADS_DIR = path.join(process.cwd(), 'uploads');

const sanitizePathPart = (value = '') => value.replace(/\\/g, '/').replace(/^\/+|\/+$/g, '');

const sanitizeFileName = (value = 'file') => value.replace(/\s+/g, '-').replace(/[^a-zA-Z0-9._-]/g, '');

const getBaseUrl = (configuredBaseUrl?: string) => {
    const fallback = `http://localhost:${process.env.PORT || 8080}`;
    return (configuredBaseUrl || process.env.BACKEND_URL || fallback).replace(/\/+$/g, '');
};

const getLocalFileUrl = (relativePath: string, configuredBaseUrl?: string) => {
    return `${getBaseUrl(configuredBaseUrl)}/${sanitizePathPart(relativePath)}`;
};

const ensureUploadsDir = () => {
    if (!fs.existsSync(UPLOADS_DIR)) {
        fs.mkdirSync(UPLOADS_DIR, { recursive: true });
    }
};

const getStorageSettings = async () => {
    const settings = await Settings.findOne({}, 'storage');
    return settings?.storage || { provider: LOCAL_PROVIDER };
};

const getS3Config = async () => {
    const storage = await getStorageSettings();
    const provider = storage?.provider || LOCAL_PROVIDER;

    if (provider !== S3_PROVIDER) {
        return null;
    }

    const bucketName = storage?.s3?.bucket_name?.trim();
    const region = storage?.s3?.region?.trim();
    const accessKeyId = storage?.s3?.access_key_id?.trim();
    const secretAccessKey = storage?.s3?.secret_access_key?.trim();
    const basePath = sanitizePathPart(storage?.s3?.base_path || 'uploads');

    if (!bucketName || !region || !accessKeyId || !secretAccessKey) {
        throw new Error('AWS S3 is not configured in admin settings.');
    }

    return {
        bucketName,
        region,
        basePath,
        s3: new S3({
            region,
            credentials: {
                accessKeyId,
                secretAccessKey,
            },
        }),
    };
};

const getS3FileUrl = (bucketName, region, key) => {
    return `https://${bucketName}.s3.${region}.amazonaws.com/${key}`;
};

const buildStorageKey = (basePath: string, folder: string, fileName: string) => {
    const parts = [basePath, sanitizePathPart(folder), `${generateID('', 8)}-${sanitizeFileName(fileName)}`]
        .filter(Boolean);
    return parts.join('/');
};

const saveFileLocally = async (file, folder: string, configuredBaseUrl?: string) => {
    ensureUploadsDir();
    const relativeFolder = sanitizePathPart(folder);
    const safeFileName = `${generateID('', 8)}-${sanitizeFileName(file?.name || 'file')}`;
    const relativePath = sanitizePathPart(path.posix.join('uploads', relativeFolder, safeFileName));
    const absolutePath = path.join(process.cwd(), relativePath);

    fs.mkdirSync(path.dirname(absolutePath), { recursive: true });
    await fs.promises.writeFile(absolutePath, file.data);

    return getLocalFileUrl(relativePath, configuredBaseUrl);
};

const removeLocalFile = async (fileUrl: string) => {
    const uploadsPrefix = `${getBaseUrl()}/uploads/`;
    const normalizedUrl = fileUrl.replace(/\\/g, '/');
    let relativePath = '';

    if (normalizedUrl.includes('/uploads/')) {
        const uploadIndex = normalizedUrl.indexOf('/uploads/');
        relativePath = normalizedUrl.slice(uploadIndex + 1);
    } else if (normalizedUrl.startsWith('uploads/')) {
        relativePath = normalizedUrl;
    } else if (normalizedUrl.startsWith(uploadsPrefix)) {
        relativePath = normalizedUrl.replace(uploadsPrefix, 'uploads/');
    }

    if (!relativePath) {
        return;
    }

    const absolutePath = path.join(process.cwd(), relativePath);
    if (fs.existsSync(absolutePath)) {
        await fs.promises.unlink(absolutePath);
    }
};

const uploadSingleFile = async (file, folder: string) => {
    const storage = await getStorageSettings();
    const provider = storage?.provider || LOCAL_PROVIDER;

    if (provider === S3_PROVIDER) {
        const s3Config = await getS3Config();
        const key = buildStorageKey(s3Config.basePath, folder, file.name);
        await s3Config.s3.send(new PutObjectCommand({
            ACL: 'public-read',
            Bucket: s3Config.bucketName,
            Key: key,
            Body: file.data,
            ContentType: file.mimetype,
        }));
        return getS3FileUrl(s3Config.bucketName, s3Config.region, key);
    }

    return saveFileLocally(file, folder, storage?.local?.base_url);
};

export const s3UploadFiles = async (files, folder) => {
    if (files.length === 0) return Promise.resolve([]);
    return Promise.all(files.map((file) => uploadSingleFile(file, folder)));
}

export const s3DeleteFiles = async (files) => {
    if (files.length === 0) return Promise.resolve();

    const s3Config = await getS3Config().catch(() => null);

    return Promise.all(files.filter(Boolean).map(async (file) => {
        if (!file) {
            return;
        }

        if (s3Config) {
            const s3Prefix = getS3FileUrl(s3Config.bucketName, s3Config.region, '');
            if (file.startsWith(s3Prefix)) {
                const key = file.replace(s3Prefix, '');
                return s3Config.s3.send(new DeleteObjectCommand({
                    Bucket: s3Config.bucketName,
                    Key: key,
                }));
            }
        }

        return removeLocalFile(file);
    }));
}

export const s3UploadFile = async (file, folder) => {
    return uploadSingleFile(file, folder);
}
