import {Router} from 'express'
import { UpdateElementSchema, UpdateMetadataSchema } from '../../types';
import client from "@repo/db/client"
import { userMiddleware } from '../../middleware/user';
export const userRouter =  Router();
userRouter.post("/metadata" ,userMiddleware, async (req,res)=>{
    const parsedData = UpdateMetadataSchema.safeParse(req.body)
    if(!parsedData.success){
        res.status(400).json({message:"Validation failed"})
        return
    }
    await client.user.update({
        where:{
            id:req.userId
        },
        data: {
            avatarId:parsedData.data.avatarId
        }
    })
    res.json({
        message:"Metadata Updated"
    })

})
userRouter.get("/metadata/bulk" , (req,res)=>{
    const userIdString =(req.query.ids?? "[]" as string;)

})
