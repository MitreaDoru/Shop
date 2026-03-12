import express from "express";
import { getUser } from "../controllers/getUser";

const router = express.Router();

router.get("/user", getUser);

export default router;
