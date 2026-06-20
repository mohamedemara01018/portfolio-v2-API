import { profileInfoModel } from "../models/profileInfo.model.js";
import asyncWrapper from "../middleware/asyncWrapper.js";
import statusValues from "../utils/statusValues.js";
import uploadToCloudinary from "../utils/uploadToCloudinary.js";
import { FolderPathOfCloudinary } from "../utils/constants.js";
import replaceToCloudinary from "../utils/replaceToCloudinary.js";
import { deleteFromCloudinary } from "../utils/deleteFromCloudinary.js";


const getAllProfileInfo = asyncWrapper(
    async (req, res, next) => {
        const profileInfo = await profileInfoModel.find({});
        res.status(200).json({ status: statusValues.SUCCESS, data: { profileInfo } })
    }
)

const createNewProfileInfo = asyncWrapper(
    async (req, res, next) => {
        const data = req.body;
        if (!data) {
            return res.status(404).json({ status: statusValues.FAIL, message: 'you must proivde data' })
        }

        const existProfileInfo = await profileInfoModel.find({});
        console.log('existProfileInfo', existProfileInfo)
        if (existProfileInfo.length) {
            return res.status(400).json({ status: statusValues.FAIL, message: 'already there is profile info ,just you can edit on it' })
        }


        const fileName = `image-${Date.now()}`
        const result = await uploadToCloudinary(req.file.buffer, FolderPathOfCloudinary, fileName);
        console.log(result);


        const newProfileInfo = await profileInfoModel.create({ ...data, avatar: result.secure_url });
        res.status(201).json({ status: statusValues.SUCCESS, message: 'profileInfo created successfully', data: { newProfileInfo } });
    }
)

const updateProfileInfo = asyncWrapper(
    async (req, res, next) => {
        const updatedData = req.body;
        // console.log('updatedData', updatedData)
        if (!updatedData) {
            return res.status(404).json({ status: statusValues.FAIL, message: 'you must provide data' })
        }

        const existedProfileInfo = await profileInfoModel.findOne();
        if (!existedProfileInfo) {
            return res.status(404).json({
                status: statusValues.FAIL,
                message: "profile info not found",
            });
        }
        // console.log(existedProfileInfo)


        let avatarUrl = existedProfileInfo.avatar;

        if (req.file && req.file.buffer) {
            try {
                const result = await replaceToCloudinary(req.file.buffer, avatarUrl)
                avatarUrl = result.secure_url;
            } catch (error) {
                return res.status(400).json({
                    status: statusValues.ERROR,
                    message: error.message,
                });
            }
        }
        // console.log('avatarUrl', avatarUrl);



        const updatedProfileInfo = await profileInfoModel.findOneAndUpdate(
            existedProfileInfo._id,
            { ...updatedData, avatar: avatarUrl },
            { new: true, runValidators: true }
        )

        console.log('updatedProfileInfo', updatedProfileInfo)

        if (!updatedProfileInfo) {
            return res.status(404).json({ status: statusValues.FAIL, message: 'profile info not founded' })
        }

        res.status(200).json({ status: statusValues.SUCCESS, message: 'profileInfo updated successfully' })
    }
)


const deleteProfileInfo = asyncWrapper(
    async (req, res, next) => {


        const existedProfileInfo = await profileInfoModel.findOne();
        if (!existedProfileInfo) {
            return res.status(404).json({
                status: statusValues.FAIL,
                message: "profile info not found",
            });
        }

        // delete from DB
        const deletedProfileInfo = await profileInfoModel.deleteMany({})
        if (!deletedProfileInfo) {
            return res.status(404).json({ status: statusValues.FAIL, message: 'profile info not founded' })
        }
        // delete from cloudinary
        await deleteFromCloudinary(existedProfileInfo.avatar, FolderPathOfCloudinary)
        res.status(200).json({ status: statusValues.SUCCESS, message: 'profile info deleted successfully', deletedProfileInfo })
    }
)


export {
    getAllProfileInfo,
    createNewProfileInfo,
    updateProfileInfo,
    deleteProfileInfo
}