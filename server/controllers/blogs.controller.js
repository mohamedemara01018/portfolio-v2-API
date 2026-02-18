import { blogModel } from "../models/blog.model.js";
import asyncWrapper from "../utils/asyncWrapper.js";
import statusValues from "../utils/statusValues.js";



const getAllBlogs = asyncWrapper(
    async (req, res, next) => {
        const blogs = await blogModel.find({});
        res.status(200).json({ status: statusValues.SUCCESS, data: { blogs } })
    }
)

const getBlogById = asyncWrapper(
    async (req, res, next) => {
        const id = req.params.id;
        const blog = await blogModel.findById(id);
        res.status(200).json({ status: statusValues.SUCCESS, data: { blog } })
    }
)

const createNewBlog = asyncWrapper(
    async (req, res, next) => {
        const data = req.body;
        if (!data) {
            return res.status(404).json({ status: statusValues.FAIL, message: 'you must provide data' })
        }
        const newBlog = await blogModel.create(data);
        res.status(201).json({ status: statusValues.SUCCESS, message: 'blog added successfully', data: { newBlog } })
    }
)

const updateBlog = asyncWrapper(
    async (req, res, next) => {
        const { id } = req.params;
        const updatedData = req.body;

        if (!updatedData) {
            return res.status(404).json({ status: statusValues.FAIL, message: 'you must provide data' })
        }

        const updatedBlog = await blogModel.findByIdAndUpdate(
            id,
            updatedData,
            { new: true, runValidators: true }
        )
        if (!updatedBlog) {
            return res.status(404)
                .json({ status: statusValues.FAIL, message: 'blog not found' })
        }
        res.status(201).json({ status: statusValues.SUCCESS, message: 'blog updated successfully' })
    }
)

const deleteBlog = asyncWrapper(
    async (req, res, next) => {
        const { id } = req.params;
        const deletedBlog = await blogModel.findByIdAndDelete(id);

        if (!deletedBlog) {
            return res.status(404)
                .json({ status: statusValues.FAIL, message: 'blog not found' })
        }

        res.status(200).json({ status: statusValues.SUCCESS, message: 'blog deleted successfully' })
    }
)




export {
    getAllBlogs,
    getBlogById,
    createNewBlog,
    updateBlog,
    deleteBlog
}