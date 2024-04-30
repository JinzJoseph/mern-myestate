import express from "express";
import {test, updateUser} from "../conroller/userController.js"
import { verifyToken } from "../middleware/verifyUser.js";


const router = express.Router();

router.get("/test",test)
router.post("/update/:id",verifyToken,updateUser)


export default router