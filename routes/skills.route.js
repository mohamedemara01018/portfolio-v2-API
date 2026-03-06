import express from 'express';
import { createNewSkill, deleteSkill, getAllSkills, getSkillById, updateSkill } from '../controllers/skills.controller.js';
import upload from '../middleware/upload.middleware.js';

const router = express.Router();

router.get('/', getAllSkills)
router.get('/:id', getSkillById)
router.post('/', upload.single('icon'), createNewSkill);
router.put('/:id', upload.single('icon'), updateSkill);
router.delete('/:id', deleteSkill);


export default router