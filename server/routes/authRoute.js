import express from 'express'
import { signup } from '../conroller/authController.js'

const router=express.Router()
router.post("/signup",signup)

export default router;