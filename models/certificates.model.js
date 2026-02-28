import { Schema, model } from 'mongoose';


const certificatesSchema = new Schema({
    coverImage: {
        type: String,
        required: true,
    },

    title: {
        type: String,
        required: true
    },

    organization: {
        type: String,
        required: true
    },

    date: {
        type: Date,
        required: true
    },

    description: {
        type: String,
        required: true
    },

    credentialId: {
        type: String,
        required: true
    }

})

export const certificateModel = model('certificates', certificatesSchema);