import { Router } from "express";

export const adminRouter = Router();

adminRouter.post('/element',(req,res)=>{
    res.send("elements original")
})
.put('/element/:elementId', (req,res)=>{
    res.send("Elements")
})
.get('/map', (req,res)=>{
    res.send(" Map ")
})
.post('/avatar', (req,res)=>{
    res.send("Avatar")
})