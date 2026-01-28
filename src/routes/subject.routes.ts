import express from 'express';
const subjectRouter = express.Router();

import {
    getSubjects,
    createSubject,
    updateSubject,
    deleteSubject,
} from '../controllers/subject.controller.js';
import requireAuth from '../middlewares/requireAuth.js';
import requireSubjectName from '../middlewares/requireSubjectName.js';

subjectRouter.get('/', requireAuth, getSubjects);
subjectRouter.post('/', requireAuth, createSubject);
subjectRouter.patch('/', requireAuth, requireSubjectName, updateSubject);
subjectRouter.delete('/', requireAuth, requireSubjectName, deleteSubject);

export default subjectRouter;
