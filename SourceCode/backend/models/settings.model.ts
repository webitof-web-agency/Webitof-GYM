import {model, Schema} from "mongoose";

const schema = new Schema({
    title: String,
    description: String,
    logo: String,
    email: String,
    phone: String,
    address: String,
    facebook: String,
    twitter: String,
    instagram: String,
    linkedin: String,
    youtube: String,
    ai_key: String,
    footer_text: String,
    storage: {
        provider: {
            type: String,
            enum: ['local', 's3'],
            default: 'local',
        },
        local: {
            base_url: String,
        },
        s3: {
            access_key_id: String,
            secret_access_key: String,
            region: String,
            bucket_name: String,
            base_path: String,
        },
    },
})

const Settings = model('settings', schema);
export default Settings;
