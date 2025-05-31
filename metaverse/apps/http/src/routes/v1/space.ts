import { Router } from "express";

export const spaceRouter = Router();

spaceRouter.post('/', (req,res)=>{
    res.send("Space")
})
.delete('/:spaceId',(req,res)=>{
    res.send('kjf')
})
.get('/spaceId',(req,res)=>{
    res.send("kdjf")
})
.post('/element',(req,res)=>{
    res.send('fj;klafj')
})
.get('/all', (req,res)=>{
    res.send('kfjakf')
})
.delete('/element',(req,res)=>{
    res.send('fj;akf')
})