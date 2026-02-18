import express from 'express';
import { createNewBlog, deleteBlog, getAllBlogs, getBlogById, updateBlog } from '../controllers/blogs.controller.js';

const router = express.Router();


router.route('/')
    .get(getAllBlogs)
    .post(createNewBlog)


router.route('/:id')
    .get(getBlogById)
    .put(updateBlog)
    .delete(deleteBlog)


export default router;