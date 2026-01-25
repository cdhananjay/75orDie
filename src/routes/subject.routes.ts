import express from "express";
const subjectRouter = express.Router()

import {createSubject, addSubjectToTimetable, markAttendance,
    viewAttendance, updateAttendance, deleteSubject,
    removeSubjectFromTimetable} from "../controllers/subject.controller.js";

subjectRouter.post('/create', createSubject);
subjectRouter.post('/add', addSubjectToTimetable);
subjectRouter.post('/mark', markAttendance);
subjectRouter.get('/view', viewAttendance);
subjectRouter.get('/update', updateAttendance);
subjectRouter.get('/delete', deleteSubject);
subjectRouter.get('/delete', removeSubjectFromTimetable);

export default subjectRouter;