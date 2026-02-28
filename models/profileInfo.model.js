import { Schema, model } from "mongoose";

const profileInfoSchema = new Schema(
    {
        fullName: {
            type: String,
            required: [true, "Full name is required"],
            trim: true,
            minlength: 2,
            maxlength: 100,
        },

        title: {
            type: String,
            required: [true, "Professional title is required"],
            trim: true,
            maxlength: 100,
        },

        bio: {
            type: String,
            required: [true, "Bio is required"],
            maxlength: 1000,
        },

        about: {
            type: String,
            required: [true, "about is required"],
            maxlength: 1000,
        },

        email: {
            type: String,
            required: true,
            trim: true,
            lowercase: true,
        },

        phone: {
            type: String,
            trim: true,
        },

        location: {
            type: String,
            trim: true,
        },

        avatar: {
            type: String, // image url
            required: true,
        },

        resume: {
            type: String, // pdf url
        },
        github: { type: String },
        linkedin: { type: String },
        leetcode: { type: String },
        codeforces: { type: String },

    },
    { timestamps: true }
);


export const profileInfoModel = model("ProfileInfo", profileInfoSchema);
