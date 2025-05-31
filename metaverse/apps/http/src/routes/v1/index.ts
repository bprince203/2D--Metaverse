import { Router } from 'express';
import { userRouter } from './user';
import { spaceRouter } from './space';
import { adminRouter } from './admin';
import { SigninSchema, SignupSchema } from '../../types';
import {hash, compare} from "../../scrypt"
import client from '@repo/db/client'
import jwt from "jsonwebtoken"
import { JWT_PASSWORD } from '../../config';

export const router = Router();

router.post('/signup', async (req, res) => {
  const parsedData = SignupSchema.safeParse(req.body)
  if (!parsedData.success) {
    res.status(400).json({ message: "Validation failded" })
    return
  }
  const hashedPassword = await hash(parsedData.data.password)
  try {
    const user = await client.user.create({
      data: {
        username: parsedData.data.username,
        password: hashedPassword,
        avatarId: parsedData.data.type === "admin" ? "admin" : "user",
        role: parsedData.data.type === "admin" ? "Admin" : "User",
      }
    })
    res.json({
      userId: user.id
    })

  }
  catch (e) {
    res.status(400).json({ message: "User already exists" })

  }
  res.json({
    message: "Signup"
  })
})
router.post('/signin', async (req, res) => {
  const parsedData = SigninSchema.safeParse(req.body)
  if (!parsedData.success) {
    res.status(400).json({ message: "Validation failed" })
    return
  }
  try {
    const user = await client.user.findUnique({
      username: parsedData.data.username
    })
    if (!user) {
      res.status(403).json({ message: "User not found" })
      return
    }
    const isValid = await compare(parsedData.data.password, user.password)
    if (!isValid) {
      res.status(403).json({ message: "Invalid password" })
      return
    }
    const token = jwt.sign({
      userId: user.id,
      role: user.role
    },JWT_PASSWORD);
    res.json({
      token
    })
  }
  catch(e){
    res.send(400).json({message:"Internal Server Error"})
  }
  res.json({
    message: "Signin"
  })
})
router.get('/elements', (req, res) => {
  res.send("I am here to win the match")
  res.json({
    message: "This is elements"
  })

})
router.get('/avatars', (req, res) => {
  res.send("This is Avatars")
  res.json({
    message: "This is Avatars"
  })
})
router.use('/user', userRouter);
router.use('/space', spaceRouter)
router.use('/admin', adminRouter)

