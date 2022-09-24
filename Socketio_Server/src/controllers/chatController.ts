import { Request, RequestHandler, Response } from "express"



export const getChat:RequestHandler = (req, res)=>{
    return res.render('index');

} 
