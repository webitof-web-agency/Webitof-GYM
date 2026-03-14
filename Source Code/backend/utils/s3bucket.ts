import {DeleteObjectCommand, PutObjectCommand, S3} from "@aws-sdk/client-s3";
import * as process from "process";
import {generateID} from "./helpers";

const getS3Config = () => {
    const bucketName = process.env.AWS_BUCKET_NAME?.trim();
    const region = process.env.AWS_REGION?.trim();

    if (!bucketName || !region) {
        throw new Error('AWS S3 is not configured. Set AWS_BUCKET_NAME and AWS_REGION in backend .env.');
    }

    return {
        bucketName,
        region,
        s3: new S3({ region }),
    };
};

const getS3FileUrl = (bucketName, region, key) => {
    return `https://${bucketName}.s3.${region}.amazonaws.com/${key}`;
};

export const s3UploadFiles = async (files, folder) => {
    if (files.length === 0) return Promise.resolve([])
    const { bucketName, region, s3 } = getS3Config();
    const params = files.map((file) => {
        return {
            ACL: 'public-read',
            Bucket: bucketName,
            Key: `${process.env.WEBSITE_NAME}-storage/${folder}/${generateID('', 8)}-${file.name}`.replaceAll(' ', '-'),
            Body: file.data
        }
    });

    return await Promise.all(params.map(async (param) => {
        await s3.send(new PutObjectCommand(param))
        return getS3FileUrl(bucketName, region, param.Key)
    }));
}


export const s3DeleteFiles = async (files) => {
    if (files.length === 0) return Promise.resolve()
    const { bucketName, region, s3 } = getS3Config();
    const params = files.map((file) => {
        return {
            Bucket: bucketName,
            Key: file.replace(`${getS3FileUrl(bucketName, region, '')}`, ''),
        }
    });
    return await Promise.all(params.map(async (param) => await s3.send(new DeleteObjectCommand(param))));
}

export const s3UploadFile = async (file, folder) => {
    const { bucketName, region, s3 } = getS3Config();
    const randNumber = generateID('', 8)
    const params = {
        ACL: 'public-read',
        Bucket: bucketName,
        Key: `${process.env.WEBSITE_NAME}-storage/${folder}/${randNumber}-${file.name}`.replaceAll(' ', '-'),
        Body: file.data
    }
    // @ts-ignore
    await s3.send(new PutObjectCommand(params))
    return getS3FileUrl(bucketName, region, params.Key)
}
