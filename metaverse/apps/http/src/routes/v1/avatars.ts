 import { Router } from "express";
 export const avatarRouter = Router();
 avatarRouter.post('/avatar', (req,res)=>{
    res.send("this is avatar")
 })
