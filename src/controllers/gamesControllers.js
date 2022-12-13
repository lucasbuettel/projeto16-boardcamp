import { connection } from "../database/database.js";
import { postGameSchema } from "../models/schemaPostGames.js";

export async function getGames(req,res) {
  try {
    const games = await connection.query(`
    SELECT 
      games.*, categories.name AS categoryName 
    FROM 
      games 
    JOIN 
      categories 
    ON games."categoryId"=categories.id`);
    res.send(games.rows);
  }
  
  catch (err) {
    res.send(err);
  }
}

export async function postGames(req,res) {

  const { name, image, stockTotal, categoryId, pricePerDay } = req.body;

  const { error } = postGameSchema.validate(req.body, { abortEarly: false });

  if (error) {
      const errors = error.details.map((detail) => detail.message);
      return res.status(422).send(errors);
  }
    
  const nameGame = await connection.query(`
    SELECT * FROM games WHERE name = ($1);`, [name]);

  if (nameGame.rows[0]){
    
    res.sendStatus(409);
    return;
  }


  try {
  await connection.query(`
    INSERT INTO games 
      (name, image, "stockTotal", "categoryId", "pricePerDay") 
    VALUES ($1,$2,$3,$4,$5);`, 
      [name, image, stockTotal, categoryId, pricePerDay]
    )
    res.sendStatus(201);
    return;

  }
  catch (err) {
    console.log(err)
  }
}