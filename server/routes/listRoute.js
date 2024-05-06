import express from 'express'
import { createListing ,deleteListing,getList,updateList,getListing} from '../conroller/listingController.js';
import { verifyToken } from '../middleware/verifyUser.js';


const router=express.Router()

router.post("/create",createListing)
router.delete('/delete/:id', verifyToken, deleteListing);
router.get('/get/:id',verifyToken,getList)
router.post('/updatelist/:id',verifyToken,updateList)
router.get('/get',getListing)
export default router;