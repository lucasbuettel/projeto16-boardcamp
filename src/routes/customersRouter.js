import { Router } from "express";

import { getCustomer, postCustomer, getCustomerById, putCustomer } from "../controllers/customersControllers.js"

const router = Router();

router.get("/customers", getCustomer);

router.get("/customers/:id", getCustomerById)

router.post("/customers", postCustomer);

router.put("/customers/:id", putCustomer);

export default router;