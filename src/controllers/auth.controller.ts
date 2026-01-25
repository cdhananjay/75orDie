import type {Request, Response} from 'express'

export const register = (req : Request, res : Response) => {
    res.send({ok: true, message: "register"});
}

export const login = (req : Request, res : Response) => {
    res.send({ok: true, message: "login"});
}

export const logout = (req : Request, res : Response) => {
    res.send({ok: true, message: "register"});

}