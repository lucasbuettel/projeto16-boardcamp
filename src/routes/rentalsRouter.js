import { Router } from "express";

import{ getRentals, postRentals } from "../controllers/rentalsControllers.js"

const router = Router();

router.get("/rentals", getRentals);

router.post("/rentals", postRentals);

export default router;