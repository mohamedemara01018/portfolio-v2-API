import asyncWrapper from "../middleware/asyncWrapper.js"
import { certificateModel } from "../models/certificates.model.js"
import { FolderPathOfCloudinary } from "../utils/constants.js";
import { deleteFromCloudinary } from "../utils/deleteFromCloudinary.js";
import replaceToCloudinary from "../utils/replaceToCloudinary.js";
import statusValues from "../utils/statusValues.js";
import uploadToCloudinary from "../utils/uploadToCloudinary.js";


const getAllCertificates = asyncWrapper(
    async (req, res, next) => {
        const certificates = await certificateModel.find();
        res.status(200).json({ status: statusValues.SUCCESS, data: { certificates } })
    }
)


const getCertificateById = asyncWrapper(
    async (req, res, next) => {
        const id = req.params.id;
        const certificate = await certificateModel.findById(id);
        res.status(200).json({ status: statusValues.SUCCESS, data: { certificate } })
    }
)


const createNewCertificate = asyncWrapper(
    async (req, res, next) => {
        const data = req.body;
        if (!data) {
            return res.status(404).json({ status: statusValues.FAIL, message: 'you must provide data' })
        }

        // upload image to cloudinary
        const fileName = `image-${Date.now()}`
        const result = await uploadToCloudinary(req.file.buffer, FolderPathOfCloudinary, fileName);

        const newCertificate = await certificateModel.create({ ...data, coverImage: result.secure_url });
        res.status(201).json({ status: statusValues.SUCCESS, message: 'certificate added successfully', data: { newCertificate } })
    }
)


const updateCertificate = asyncWrapper(
    async (req, res, next) => {

        const { id } = req.params;
        const updatedData = req.body;

        if (!updatedData) {
            return res.status(404).json({ status: statusValues.FAIL, message: 'you must provide data' })
        }

        const existedCertificate = await certificateModel.findById(id);

        if (!existedCertificate) {
            return res.status(404).json({ status: statusValues.FAIL, message: 'blog not found' })
        }

        let coverImageUrl = certificateModel.coverImage;
        if (req.file && req.file.buffer) {
            const result = await replaceToCloudinary(req.file.buffer, coverImageUrl);
            coverImageUrl = result.secure_url;
        }

        const updatedCertificate = await certificateModel.findByIdAndUpdate(
            id,
            { ...updatedData, coverImage: coverImageUrl },
            { new: true, runValidators: true }
        )

        if (!updatedCertificate) {
            return res.status(404)
                .json({ status: statusValues.FAIL, message: 'Certificate not found' })
        }

        res.status(201).json({ status: statusValues.SUCCESS, message: 'Certificate updated successfully' })
    }
)


const deleteCertificate = asyncWrapper(
    async (req, res, next) => {
        const { id } = req.params;

        const existedCertificate = await certificateModel.findById(id);

        if (!existedCertificate) {
            return res.status(404).json({ status: statusValues.FAIL, message: 'blog not found' })
        }

        console.log(existedCertificate);

        await deleteFromCloudinary(existedCertificate.coverImage);

        const deletedCertificate = await certificateModel.findByIdAndDelete(id);

        if (!deletedCertificate) {
            return res.status(404)
                .json({ status: statusValues.FAIL, message: 'Certificate not found' })
        }

        res.status(200).json({ status: statusValues.SUCCESS, message: 'Certificate deleted successfully' })
    }
)


export {
    getAllCertificates,
    getCertificateById,
    createNewCertificate,
    updateCertificate,
    deleteCertificate
}