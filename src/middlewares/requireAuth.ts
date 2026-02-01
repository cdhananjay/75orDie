import type { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

function requireAuth(req: Request, res: Response, next: NextFunction) {
    if (!req.cookies.token)
        return res.send({ ok: false, message: 'User must be logged in.' });
    try {
        const decoded = jwt.verify(req.cookies.token, process.env.JWT_SECRET!);
        if (typeof decoded === 'string' || typeof decoded.data !== 'string') {
            res.clearCookie('token');
            return res.send({
                ok: false,
                message: 'Session expired, log in again.',
            });
        }
        req.userId = decoded.data;
        next();
    } catch (e) {
        console.log('Error in verifying auth', e);
        res.send({ ok: false, message: 'Internal server error.' });
    }
}
export default requireAuth;
