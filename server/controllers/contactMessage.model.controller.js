
import { contactModel } from "../models/contactMessage.model.js";
import asyncWrapper from "../utils/asyncWrapper.js";
import statusValues from "../utils/statusValues.js";



const getAllContacts = asyncWrapper(
    async (req, res, next) => {
        const contacts = await contactModel.find({});
        res.status(200).json({ status: statusValues.SUCCESS, data: { contacts } })
    }
)


const getContactById = asyncWrapper(
    async (req, res, next) => {
        const id = req.params.id;
        const contact = await contactModel.findById(id);
        res.status(200).json({ status: statusValues.SUCCESS, data: { contact } })
    }
)



const createNewContact = asyncWrapper(
    async (req, res, next) => {
        const data = req.body;
        if (!data) {
            return res.status(404).json({ status: statusValues.FAIL, message: 'you must provide data' })
        }
        const newContact = await contactModel.create(data);
        res.status(201).json({ status: statusValues.SUCCESS, message: 'contact added successfully', data: { newContact } })
    }
)

const updateContact = asyncWrapper(
    async (req, res, next) => {
        const { id } = req.params;
        const updatedData = req.body;

        if (!updatedData) {
            return res.status(404).json({ status: statusValues.FAIL, message: 'you must provide data' })
        }

        const updatedContact = await contactModel.findByIdAndUpdate(
            id,
            updatedData,
            { new: true, runValidators: true }
        )
        if (!updatedContact) {
            return res.status(404)
                .json({ status: statusValues.FAIL, message: 'contact not found' })
        }
        res.status(201).json({ status: statusValues.SUCCESS, message: 'contact updated successfully' })
    }
)

const deleteContact = asyncWrapper(
    async (req, res, next) => {
        const { id } = req.params;
        const deletedContact = await contactModel.findByIdAndDelete(id);

        if (!deletedContact) {
            return res.status(404)
                .json({ status: statusValues.FAIL, message: 'contact not found' })
        }

        res.status(200).json({ status: statusValues.SUCCESS, message: 'contact deleted successfully' })
    }
)




export {
    getAllContacts,
    getContactById,
    createNewContact,
    updateContact,
    deleteContact,
}