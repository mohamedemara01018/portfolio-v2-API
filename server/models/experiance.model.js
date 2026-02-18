import { Schema, model } from "mongoose";

const experienceSchema = new Schema(
    {
        company: {
            type: String,
            required: [true, "Company name is required"],
            trim: true,
            minlength: 2,
            maxlength: 100,
        },

        role: {
            type: String,
            required: [true, "Role is required"],
            trim: true,
            minlength: 2,
            maxlength: 100,
        },

        description: {
            type: String,
            required: true,
        },

        startDate: {
            type: Date,
            required: true,
        },

        endDate: {
            type: Date,
        },

        current: {
            type: Boolean,
            default: false,
        },

        technologies: [
            {
                type: String,
                trim: true,
            },
        ],
    },
    { timestamps: true }
);

// 🔥 index useful for sorting timeline
experienceSchema.index({ startDate: -1 });

export const experienceModel = model("Experience", experienceSchema);
