import type {Request, Response} from 'express'
import db from "../index.js";
import {usersTable} from "../db/schema.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {eq} from "drizzle-orm";

export const register = async (req : Request, res : Response) => {
    if (req.cookies.token) return res.send({ok: false, message: "user already logged in" });
    if (!(req.body.username && req.body.password)) return res.send({ok: false, message: "username and password is required to register"});
    const {username, password} = req.body;
    try {
        const passwordHash = bcrypt.hashSync(password, 10);
        const [insertedUser] = await db.insert(usersTable).values({ username, passwordHash }).returning();
        if (!insertedUser) return res.send({ok: false, message: "unable to add user"});
        const token = jwt.sign({
            data: insertedUser.id
        }, process.env.JWT_SECRET!, { expiresIn: '30d' })
        res.cookie('token', token);
        return res.send({ok: true, message: "user created"})
    } catch (e) {
        res.send({ok: false, message: "error registering user"})
        console.log("error registering user: ", e)
    }
}

export const login = async (req : Request, res : Response) => {
    if (req.cookies.token) return res.send({ok: false, message: "User already logged in, if not then please clear your cookies." });
    if (!(req.body.username && req.body.password)) return res.send({ok: false, message: "username and password is required to register"});
    const {username, password} = req.body;
    try {
        const [user] = await db
            .select()
            .from(usersTable)
            .where(eq(usersTable.username, username)).limit(1);
        if (!user) return res.send({ok:false, message: "user not found"});

        const result = await bcrypt.compare(password, user.passwordHash);
        if (!result) res.send({ok: false, message: "passwords dont match"});

        const token = jwt.sign({
            data: user.id
        }, process.env.JWT_SECRET!, { expiresIn: '30d' })
        res.cookie('token', token);
        return res.send({ok: true, message: "user logged in"})
    } catch (e) {
        res.send({ok: false, message: "error while trying to login user"})
        console.log("error while trying to login user: ", e)
    }
}

export const logout = (req : Request, res : Response) => {
    const decoded = jwt.verify(req.cookies.token, process.env.JWT_SECRET!);
    console.log(decoded)
    res.clearCookie('token');
    return res.send({ok: true, message: "cookies cleared"})
}