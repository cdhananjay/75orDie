import type { Request, Response } from 'express';
import db from '../index.js';
import { subjectsTable } from '../db/schema.js';
import { eq } from 'drizzle-orm';

export const getSubjects = async (req: Request, res: Response) => {
    if (!req.userId)
        return res.send({ ok: false, message: 'user must be logged in' });
    try {
        const subjects = await db
            .select()
            .from(subjectsTable)
            .where(eq(subjectsTable.userId, req.userId));
        res.send({ ok: true, subjects });
    } catch (error) {
        res.send({ ok: false, message: 'error fetching subjects' });
        console.log('error fetching subjects', error);
    }
};

export const createSubject = async (req: Request, res: Response) => {
    if (!req.userId)
        return res.send({ ok: false, message: 'user must be logged in' });
    if (!req.body.subjectName)
        return res.send({ ok: false, message: 'subject name not provided' });
    try {
        const [preExistingSubject] = await db
            .select()
            .from(subjectsTable)
            .where(eq(subjectsTable.userId, req.userId))
            .limit(1);
        if (preExistingSubject)
            return res.send({
                ok: false,
                message: 'subject with same name already exists',
            });
        await db
            .insert(subjectsTable)
            .values({ name: req.body.name, userId: req.userId });
        res.send({ ok: true, message: 'created subject' });
    } catch (error) {
        res.send({ ok: false, message: 'Error creating subject.' });
        console.log('error creating subject', error);
    }
};

export const updateSubject = async (req: Request, res: Response) => {
    if (!req.subjectId)
        return res.send({ ok: false, message: 'subject id not provided' });
    try {
        if (req.body.newName) {
            await db
                .update(subjectsTable)
                .set({ name: req.body.newName })
                .where(eq(subjectsTable.id, req.subjectId));
        }
        if (req.body.newClassesAttended) {
            await db
                .update(subjectsTable)
                .set({ classesAttended: req.body.newClassesAttended })
                .where(eq(subjectsTable.id, req.subjectId));
        }
        if (req.body.newTotalClasses) {
            await db
                .update(subjectsTable)
                .set({ totalClasses: req.body.newTotalClasses })
                .where(eq(subjectsTable.id, req.subjectId));
        }
        if (req.body.newOccurrence) {
            await db
                .update(subjectsTable)
                .set({ occurrence: req.body.newOccurrence })
                .where(eq(subjectsTable.id, req.subjectId));
        }
        return res.send({ ok: true, message: 'subject updated' });
    } catch (error) {
        res.send({ ok: false, message: 'error updating the subject' });
        console.log('error updating the subject', error);
    }
};

export const deleteSubject = async (req: Request, res: Response) => {
    if (!req.subjectId)
        return res.send({ ok: false, message: 'subject id not provided' });
    try {
        await db
            .delete(subjectsTable)
            .where(eq(subjectsTable.id, req.subjectId));
        return res.send({ ok: true, message: 'subject deleted' });
    } catch (error) {
        res.send({ ok: false, message: 'error deleting subject' });
        console.log('error deleting subject', error);
    }
};
