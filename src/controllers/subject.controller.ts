import type {Request, Response} from 'express'

export const createSubject = (req : Request, res : Response) => {
    res.send({ok: true, message: "createSubject"});
}

export const addSubjectToTimetable = (req : Request, res : Response) => {
    res.send({ok: true, message: "addSubjectToTimetable"});
}

export const markAttendance = (req : Request, res : Response) => {
    res.send({ok: true, message: "markAttendance"});
}

export const viewAttendance = (req : Request, res : Response) => {
    res.send({ok: true, message: "viewAttendance"});
}

export const updateAttendance = (req : Request, res : Response) => {
    res.send({ok: true, message: "updateAttendance"});
}

export const deleteSubject = (req : Request, res : Response) => {
    res.send({ok: true, message: "deleteSubject"});
}

export const removeSubjectFromTimetable = (req : Request, res : Response) => {
    res.send({ok: true, message: "removeSubjectFromTimetable"});
}