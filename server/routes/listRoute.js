import express from 'express'
import { createListing ,deleteListing,getList,updateList} from '../conroller/listingController.js';
import { verifyToken } from '../middleware/verifyUser.js';


const router=express.Router()

router.post("/create",createListing)
router.delete('/delete/:id', verifyToken, deleteListing);
router.get('/get/:id',verifyToken,getList)
router.post('/updatelist/:id',verifyToken,updateList)
export default router;