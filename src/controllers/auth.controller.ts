import type { Request, Response } from 'express';
import db from '../index.js';
import { usersTable } from '../db/schema.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { eq } from 'drizzle-orm';

export const getCurrentUser = async (req: Request, res: Response) => {
    if (!(req.cookies.token && req.userId))
        return res.send({ ok: false, message: 'User must be logged in.' });
    try {
        const [currentUser] = await db
            .select()
            .from(usersTable)
            .where(eq(usersTable.id, req.userId))
            .limit(1);
        if (currentUser)
            return res.send({ ok: true, user: currentUser.username });
        res.send({ ok: false, message: 'User does not exist.' });
    } catch (e) {
        console.log('Error getting current user.', e);
        return res.send({ ok: false, message: 'Internal server error.' });
    }
};

export const register = async (req: Request, res: Response) => {
    if (req.cookies.token) {
        res.clearCookie('token');
    }
    if (!(req.body.username && req.body.password))
        return res.send({
            ok: false,
            message: 'Username and password is required to register.',
        });
    const { username, password } = req.body;
    try {
        const passwordHash = bcrypt.hashSync(password, 10);
        const [insertedUser] = await db
            .insert(usersTable)
            .values({ username, passwordHash })
            .returning();
        if (!insertedUser)
            return res.send({
                ok: false,
                message: 'Unable to add user. Username might be taken.',
            });
        const token = jwt.sign(
            {
                data: insertedUser.id,
            },
            process.env.JWT_SECRET!,
            { expiresIn: '30d' }
        );
        res.cookie('token', token);
        return res.send({ ok: true, message: 'User created' });
    } catch (e) {
        res.send({ ok: false, message: 'Internal server error.' });
        console.log('Error registering user: ', e);
    }
};

export const login = async (req: Request, res: Response) => {
    if (req.cookies.token) {
        res.clearCookie('token');
    }
    if (!(req.body.username && req.body.password))
        return res.send({
            ok: false,
            message: 'Username and password is required to login.',
        });
    const { username, password } = req.body;
    try {
        const [user] = await db
            .select()
            .from(usersTable)
            .where(eq(usersTable.username, username))
            .limit(1);
        if (!user)
            return res.send({
                ok: false,
                message: 'Username or password is incorrect.',
            });

        const result = await bcrypt.compare(password, user.passwordHash);
        if (!result)
            res.send({
                ok: false,
                message: 'Username or password is incorrect.',
            });

        const token = jwt.sign(
            {
                data: user.id,
            },
            process.env.JWT_SECRET!,
            { expiresIn: '30d' }
        );
        res.cookie('token', token);
        return res.send({ ok: true, message: 'Logged in.' });
    } catch (e) {
        res.send({ ok: false, message: 'Internal server error.' });
        console.log('Error while trying to login user. ', e);
    }
};

export const logout = (req: Request, res: Response) => {
    res.clearCookie('token');
    return res.send({ ok: true, message: 'Logged out.' });
};
