import express from 'express'
import { createListing } from '../conroller/listingController.js';


const router=express.Router()

router.post("/create",createListing)

export default router;