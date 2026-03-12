import express from "express";
import { getData, createProduct } from "../controllers/product";
import { verifyAdmin } from "../middleware/authMiddleware";
const router = express.Router();

router.post("/product", verifyAdmin, createProduct);
router.get("/data", getData);
// router.delete("/product/:id", verifyAdmin, deleteProduct);

export default router;
