import joi from "joi";

export const postGameSchema = joi.object({
    name: joi.string().required().min(1).max(100),
    image: joi.string().required(),
    stockTotal: joi.number().required().min(1),
    categoryId: joi.number().required().min(1),
    pricePerDay: joi.number().required().min(1)
}) 