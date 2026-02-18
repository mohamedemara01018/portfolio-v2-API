import express from 'express';
import { createNewExperiance, deleteExperiance, getAllExperiance, getExperianceById, updateExperiance } from '../controllers/experiance.controller.js';

const router = express.Router();


router.route('/')
    .get(getAllExperiance)
    .post(createNewExperiance)


router.route('/:id')
    .get(getExperianceById)
    .put(updateExperiance)
    .delete(deleteExperiance)


export default router;