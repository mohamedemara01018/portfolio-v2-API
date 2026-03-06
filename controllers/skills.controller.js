import { skillModel } from "../models/skills.model.js";
import asyncWrapper from "../middleware/asyncWrapper.js";
import statusValues from "../utils/statusValues.js";
import replaceToCloudinary from "../utils/replaceToCloudinary.js";
import uploadToCloudinary from "../utils/uploadToCloudinary.js";
import { FolderPathOfCloudinary } from "../utils/constants.js";
import { deleteFromCloudinary } from "../utils/deleteFromCloudinary.js";


const getAllSkills = asyncWrapper(
    async (req, res, next) => {
        const skills = await skillModel.find({});
        res.status(200).json({ status: statusValues.SUCCESS, data: { skills } })
    }
)

const getSkillById = asyncWrapper(
    async (req, res, next) => {
        const { id } = req.params;
        const skill = await skillModel.findById(id);
        res.status(200).json({ status: statusValues.SUCCESS, data: { skill } })
    }
)

const createNewSkill = asyncWrapper(
    async (req, res, next) => {
        const data = req.body;

        if (!data) {
            return res.status(404).json({ status: statusValues.FAIL, message: 'you must provid your skill' })
        }

        // upload image to cloudinary
        const fileName = `image-${Date.now()}`
        const result = await uploadToCloudinary(req.file.buffer, FolderPathOfCloudinary, fileName);

        const newSkill = await skillModel.create({ ...data, icon: result.secure_url });
        res.status(201).json({ status: statusValues.SUCCESS, message: 'skill created successfully', data: { newSkill } })
    }
)
const updateSkill = asyncWrapper(async (req, res, next) => {

    const { id } = req.params;
    const updatedData = req.body;

    if (Object.keys(updatedData).length === 0   ) {
        return res.status(400).json({
            status: statusValues.FAIL,
            message: 'you must provide data to update'
        })
    }

    const existedSkill = await skillModel.findById(id);

    if (!existedSkill) {
        return res.status(404).json({
            status: statusValues.FAIL,
            message: 'skill not found'
        })
    }

    let iconUrl = existedSkill.icon;

    if (req.file && req.file.buffer) {
        const result = await replaceToCloudinary(req.file.buffer, iconUrl);
        iconUrl = result.secure_url;
    }

    const updatedSkill = await skillModel.findByIdAndUpdate(
        id,
        { ...updatedData, icon: iconUrl },
        { new: true, runValidators: true }
    );

    res.status(200).json({
        status: statusValues.SUCCESS,
        message: 'skill updated successfully',
        data: updatedSkill
    });

});

const deleteSkill = asyncWrapper(
    async (req, res, next) => {
        const { id } = req.params;

        const existedSkill = await skillModel.findById(id);

        await deleteFromCloudinary(existedSkill.icon);

        const daletedSkill = await skillModel.findByIdAndDelete(id);
        res.status(200).json({ status: statusValues.SUCCESS, message: 'skill deleted successfully' })
    }
)


export {
    getAllSkills,
    getSkillById,
    createNewSkill,
    updateSkill,
    deleteSkill,
}