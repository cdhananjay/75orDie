import type { Request, Response } from 'express';
import db from '../index.js';
import { subjectsTable } from '../db/schema.js';
import { and, eq } from 'drizzle-orm';

export const getSubjects = async (req: Request, res: Response) => {
    if (!req.userId)
        return res.send({ ok: false, message: 'User must be logged in.' });
    try {
        const subjects = await db
            .select()
            .from(subjectsTable)
            .where(eq(subjectsTable.userId, req.userId));
        res.send({ ok: true, subjects });
    } catch (error) {
        res.send({ ok: false, message: 'Internal server error' });
        console.log('Error fetching subjects', error);
    }
};

export const createSubject = async (req: Request, res: Response) => {
    if (!req.userId)
        return res.send({ ok: false, message: 'User must be logged in.' });
    if (!req.body.subjectName)
        return res.send({ ok: false, message: 'Subject name not provided.' });
    try {
        const [preExistingSubject] = await db
            .select()
            .from(subjectsTable)
            .where(
                and(
                    eq(subjectsTable.userId, req.userId),
                    eq(subjectsTable.name, req.body.subjectName)
                )
            )
            .limit(1);
        if (preExistingSubject)
            return res.send({
                ok: false,
                message: 'Subject with that name already exists.',
            });
        await db
            .insert(subjectsTable)
            .values({ name: req.body.subjectName, userId: req.userId });
        res.send({ ok: true, message: 'Subject created' });
    } catch (error) {
        res.send({ ok: false, message: 'Internal server error.' });
        console.log('Error creating subject. ', error);
    }
};

export const updateSubject = async (req: Request, res: Response) => {
    if (!req.subjectId)
        return res.send({ ok: false, message: 'Subject Id not provided.' });
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
        return res.send({ ok: true, message: 'Subject updated.' });
    } catch (error) {
        res.send({ ok: false, message: 'Internal server error.' });
        console.log('Error updating the subject.', error);
    }
};

export const deleteSubject = async (req: Request, res: Response) => {
    if (!req.subjectId)
        return res.send({ ok: false, message: 'Subject Id not provided.' });
    try {
        await db
            .delete(subjectsTable)
            .where(eq(subjectsTable.id, req.subjectId));
        return res.send({ ok: true, message: 'Subject Deleted.' });
    } catch (error) {
        res.send({ ok: false, message: 'Internal server error.' });
        console.log('Error deleting the subject.', error);
    }
};
