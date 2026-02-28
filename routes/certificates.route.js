import express from 'express'
import { createNewCertificate, deleteCertificate, getAllCertificates, getCertificateById, updateCertificate } from '../controllers/certificates.controller.js';
import upload from '../middleware/upload.middleware.js';

const router = express.Router();


router.get('/', getAllCertificates)
router.get('/:id', getCertificateById)
router.post('/', upload.single('coverImage'), createNewCertificate);
router.put('/:id', upload.single('coverImage'), updateCertificate);
router.delete('/:id', deleteCertificate);



export default router