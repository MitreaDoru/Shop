import express from "express";
import upload from "../config/cloudinary";
import { getData, createProduct, deleteProduct } from "../controllers/product";
import { verifyAdmin } from "../middleware/authMiddleware";

const router = express.Router();

router.get("/data", getData);

router.post("/product", verifyAdmin, upload.single("image"), createProduct);

router.delete("/product/:id", verifyAdmin, deleteProduct);

export default router;
