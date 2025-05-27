import { Router } from 'express';

export const router = Router();

router.post('/signup', (req, res) => {
  console.log("I am working at Signup")
  res.send("I am here to rule")
  res.json({
    message: "Signup"
  })
})
router.post('/signin', (req, res) => {
  console.log("I am working at sign in")
  res.send("You are not allowed here")
  res.json({
    message: "Signin"
  })
})
router.get('/elements', (req, res) => {
  res.json({
    message: "This is elements"
  })

})
router.use('/user', userRouter)
router.use('/space', spaceRouter)
router.use('admin',adminRouter)

