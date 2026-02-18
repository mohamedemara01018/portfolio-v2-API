import { experienceModel } from "../models/experiance.model.js";
import asyncWrapper from "../utils/asyncWrapper.js";
import statusValues from "../utils/statusValues.js";




const getAllExperiance = asyncWrapper(
    async (req, res, next) => {
        const experiances = await experienceModel.find({});
        res.status(200).json({ status: statusValues.SUCCESS, data: { experiances } })
    }
)

const getExperianceById = asyncWrapper(
    async (req, res, next) => {
        const id = req.params.id;
        const experiance = await experienceModel.findById(id);
        res.status(200).json({ status: statusValues.SUCCESS, data: { experiance } })
    }
)

const createNewExperiance = asyncWrapper(
    async (req, res, next) => {
        const data = req.body;
        if (!data) {
            return res.status(404).json({ status: statusValues.FAIL, message: 'you must provide data' })
        }
        const newExperiance = await experienceModel.create(data);
        res.status(201).json({ status: statusValues.SUCCESS, message: 'experiance added successfully', data: { newExperiance } })
    }
)

const updateExperiance = asyncWrapper(
    async (req, res, next) => {
        const { id } = req.params;
        const updatedData = req.body;

        if (!updatedData) {
            return res.status(404).json({ status: statusValues.FAIL, message: 'you must provide data' })
        }

        const updatedExperaince = await experienceModel.findByIdAndUpdate(
            id,
            updatedData,
            { new: true, runValidators: true }
        )
        if (!updatedExperaince) {
            return res.status(404)
                .json({ status: statusValues.FAIL, message: 'experiance not found' })
        }
        res.status(201).json({ status: statusValues.SUCCESS, message: 'experiance updated successfully' })
    }
)

const deleteExperiance = asyncWrapper(
    async (req, res, next) => {
        const { id } = req.params;
        const deletedExperiance = await experienceModel.findByIdAndDelete(id);

        if (!deletedExperiance) {
            return res.status(404)
                .json({ status: statusValues.FAIL, message: 'blog not found' })
        }

        res.status(200).json({ status: statusValues.SUCCESS, message: 'experiance deleted successfully' })
    }
)



export {
    getAllExperiance,
    getExperianceById,
    createNewExperiance,
    updateExperiance,
    deleteExperiance
}