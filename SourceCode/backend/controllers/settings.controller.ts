import { s3DeleteFiles, s3UploadFile } from "../utils/s3bucket";
import Settings from "../models/settings.model";
import Currency from "../models/currency.model";

const normalizeStoragePayload = (body, previousStorage: any = {}) => {
    const provider = body?.storage_provider || previousStorage?.provider || 'local';
    const existingS3 = previousStorage?.s3 || {};
    const existingLocal = previousStorage?.local || {};

    const normalizedStorage: any = {
        provider,
        local: {
            base_url: body?.local_base_url ?? existingLocal?.base_url ?? '',
        },
        s3: {
            access_key_id: body?.s3_access_key_id ?? existingS3?.access_key_id ?? '',
            secret_access_key: body?.s3_secret_access_key ?? existingS3?.secret_access_key ?? '',
            region: body?.s3_region ?? existingS3?.region ?? '',
            bucket_name: body?.s3_bucket_name ?? existingS3?.bucket_name ?? '',
            base_path: body?.s3_base_path ?? existingS3?.base_path ?? '',
        }
    };

    if (provider === 's3') {
        const missingField = ['access_key_id', 'secret_access_key', 'region', 'bucket_name']
            .find((key) => !normalizedStorage.s3[key]?.trim?.());
        if (missingField) {
            throw new Error('S3 credentials are required when AWS S3 upload is enabled.');
        }
    }

    return normalizedStorage;
};

// get site settings
export const getSiteSettings = async (req, res) => {
    try {
        const currency = await Currency.findOne({ default: true }, 'symbol');
        const data = await Settings.findOne({}, 'title description logo dark_logo footer_text email phone address facebook twitter instagram linkedin youtube ai_key font_family')

        const responseData = {
            ...(data ? data.toObject() : {}),
            currency: currency ? currency.symbol : null
        };

        return res.status(200).send({
            error: false,
            msg: 'Site settings fetched successfully',
            data: responseData
        })
    } catch (e) {
        return res.status(500).send({
            error: true,
            msg: e.message || 'Internal server error'
        })
    }
}

// get setting
export const getSettings = async (req, res) => {
    try {
        const data = await Settings.findOne({});
        const currency = await Currency.findOne({ default: true }, 'symbol');
        const responseData = {
            ...(data ? data.toObject() : {}),
            currency: currency ? currency.symbol : null
        };

        return res.status(200).send({
            error: false,
            msg: 'Settings fetched successfully',
            data: responseData
        });
    } catch (e) {
        return res.status(500).send({
            error: true,
            msg: e.message || 'Internal server error'
        });
    }
};

// update settings
export const postSettings = async (req, res) => {
    try {
        const { body, files } = req
        const { _id, ...updateBody } = body
        const settingData = _id ? await Settings.findById(_id) : await Settings.findOne({})
        updateBody["storage"] = normalizeStoragePayload(body, settingData?.storage || {});

        delete updateBody.storage_provider;
        delete updateBody.local_base_url;
        delete updateBody.s3_access_key_id;
        delete updateBody.s3_secret_access_key;
        delete updateBody.s3_region;
        delete updateBody.s3_bucket_name;
        delete updateBody.s3_base_path;

        if (!!files?.logo) {
            if (!!settingData?.logo) {
                await s3DeleteFiles([settingData?.logo])
            }
            updateBody["logo"] = await s3UploadFile(files.logo, `settings/logo`)
        }

        await Settings.updateOne(_id ? { _id } : {}, updateBody, {
            upsert: true
        })
        return res.status(200).send({
            error: false,
            msg: 'Settings updated successfully',
        })
    } catch (e) {
        return res.status(500).send({
            error: true,
            msg: e.message || 'Internal server error'
        })
    }
}
