import { projectModel } from '../models/projects.model.js';
import asyncWrapper from '../middleware/asyncWrapper.js'
import statusValues from '../utils/statusValues.js';
import uploadToCloudinary from '../utils/uploadToCloudinary.js';
import { FolderPathOfCloudinary } from '../utils/constants.js';
import replaceToCloudinary from '../utils/replaceToCloudinary.js';
import { deleteFromCloudinary } from '../utils/deleteFromCloudinary.js';


const getAllProjects = asyncWrapper(
    async (req, res, next) => {
        const projects = await projectModel.find({});
        res.status(200).json({ status: statusValues.SUCCESS, data: { projects } })
    }
)

const getProjectById = asyncWrapper(
    async (req, res, next) => {
        const id = req.params.id;
        const project = await projectModel.findById(id);
        res.status(200).json({ status: statusValues.SUCCESS, data: { project } })
    }
)

const createNewProject = asyncWrapper(
    async (req, res, next) => {

        const data = req.body
        if (!data) {
            return res.status(400)
                .json({ status: statusValues.FAIL, message: 'you must provide data' })
        }

        const fileName = `image-${Date.now()}`
        const result = await uploadToCloudinary(req.file.buffer, FolderPathOfCloudinary, fileName);

        const newProject = await projectModel.create({ ...data, coverImage: result.secure_url });
        return res.status(201).json({
            status: statusValues.SUCCESS,
            message: 'project added successfully',
            data: { project: newProject }
        });
    }
);

const updateProject = asyncWrapper(
    async (req, res, next) => {
        const id = req.params.id;
        const updatedData = req.body;
        console.log('updatedData', updatedData)
        if (!updatedData) {
            return res.status(404).json({ status: statusValues.FAIL, message: 'you must provide data' })
        }

        const existedProject = await projectModel.findById(id);
        if (!existedProject) {
            return res.status(404)
                .json({ status: statusValues.FAIL, message: 'project not found' })
        }

        let coverImageUrl = existedProject.coverImage;
        if (req.file && req.file.buffer) {
            const result = await replaceToCloudinary(req.file.buffer, coverImageUrl);
            coverImageUrl = result.secure_url;
        }


        const updatedProject = await projectModel.findByIdAndUpdate(
            id,
            { ...updatedData, coverImage: coverImageUrl },
            { new: true, runValidators: true }
        )


        if (!updatedProject) {
            return res.status(404).json({
                status: statusValues.FAIL,
                message: 'Project not found'
            });
        }

        res.status(200).json({ status: statusValues.SUCCESS, message: 'project updated successfully' })
    }
)


const deleteProject = asyncWrapper(
    async (req, res, next) => {

        const { id } = req.params;

        const existedProject = await projectModel.findById(id);

        if (!existedProject) {
            return res.status(404)
                .json({ status: statusValues.FAIL, message: 'project not found' })
        }
        console.log(existedProject)

        await deleteFromCloudinary(existedProject.coverImage, FolderPathOfCloudinary);

        const deletedProject = await projectModel.findByIdAndDelete(id);

        if (!deletedProject) {
            return res.status(404).json({
                status: statusValues.FAIL,
                message: 'Project not found'
            });
        }
        res.status(200).json({ status: statusValues.SUCCESS, message: 'project deleted successfully' })
    }
)

export {
    getAllProjects,
    getProjectById,
    createNewProject,
    updateProject,
    deleteProject
}