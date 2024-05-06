import express from "express";
import {deleteUser, test, updateUser,userList,getUser} from "../conroller/userController.js"
import { verifyToken } from "../middleware/verifyUser.js";


const router = express.Router();

router.get("/test",test)
router.post("/update/:id",verifyToken,updateUser)
router.delete('/delete/:id',verifyToken,deleteUser)
router.get('/userlist/:id',verifyToken,userList)
router.get('/:id',verifyToken,getUser)

export default router