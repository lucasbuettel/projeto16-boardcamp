import { connection } from "../database/database.js";

export async function categoriesValidation(req, res, next){
    const {name} = req.body;
    
    if(!name){
        res.sendStatus(400);
        return;
    }

    const categoryExists = await connection.query("SELECT * FROM categories WHERE name = $1", [name]);
    if(categoryExists.rows[0]){
        return res.sendStatus(409);
    }

    req.name = name;

    next();
}