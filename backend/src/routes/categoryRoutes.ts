import { Router } from "express";
import { addCategory, getCategories } from "../controllers/categoryController";

const router = Router();

router.post("/add", addCategory);
router.get("/list", getCategories);

export default router;
