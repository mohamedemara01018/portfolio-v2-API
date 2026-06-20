import { Schema, model } from "mongoose";

const blogSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Blog title is required"],
      trim: true,
    },

    content: {
      type: String,
      required: true,
    },

    excerpt: {
      type: String,
    },

    tags: [
      {
        type: String,
        trim: true,
      },
    ],

    published: {
      type: Boolean,
      default: false,
    },

    views: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true } // createdAt + updatedAt
);



// 🔥 Indexes for performance
blogSchema.index({ slug: 1 });
blogSchema.index({ published: 1 });
blogSchema.index({ tags: 1 });

export const blogModel = model("Blog", blogSchema);
