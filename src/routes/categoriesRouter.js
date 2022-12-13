import { Router } from "express";
import{ getCategories, postCategories } from "../controllers/categoriesControllers.js"
import { categoriesValidation } from "../middlewares/categoriesValidation.js";

const router = Router();

router.get("/categories", getCategories);
router.post("/categories", categoriesValidation, postCategories);

export default router;

