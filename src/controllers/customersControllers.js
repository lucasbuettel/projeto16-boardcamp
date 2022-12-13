import { connection } from "../database/database.js";
import {customerSchema} from "../models/schemaCustomers.js"

export async function getCustomer(req,res){
    try {
        const customers = await connection.query('SELECT * FROM customers');
        res.send(customers.rows);
      }
      
      catch (err) {
        res.send(err);
      }
}

export async function getCustomerById(req,res){
    const { id } = req.params;

    const customerId = await connection.query("SELECT * FROM customers WHERE id = $1", [id]);
    if (!customerId.rows[0]) {
        res.sendStatus(404);
        return;
    }
    res.send(customerId.rows[0]);
}

export async function postCustomer(req,res){
    const { name, phone, cpf, birthday } = req.body;

  const { error } = customerSchema.validate(req.body, { abortEarly: false });

  if (error) {
      const errors = error.details.map((detail) => detail.message);
      return res.status(422).send(errors);
  }
    
  const cpfCustomer = await connection.query(`
    SELECT * FROM customers WHERE cpf = ($1);`, [cpf]);

  if (cpfCustomer.rows[0]){
    
    res.sendStatus(409);
    return;
  }


  try {
  await connection.query(`
    INSERT INTO customers 
      (name, phone, cpf, birthday) 
    VALUES ($1,$2,$3,$4);`, 
      [name, phone, cpf, birthday]
    )
    res.sendStatus(201);
    return;

  }
  catch (err) {
    console.log(err)
  }

}

export async function putCustomer(req,res){
    const {id} = req.params;
    const { name, phone, cpf, birthday } = req.body;

  const { error } = customerSchema.validate(req.body, { abortEarly: false });

  if (error) {
      const errors = error.details.map((detail) => detail.message);
      return res.status(422).send(errors);
  }
    
  const cpfCustomer = await connection.query(`
    SELECT * FROM customers WHERE cpf = ($1);`, [cpf]);

  if (cpfCustomer.rows[0]){
    
    res.sendStatus(409);
    return;
  }


  try {
  await connection.query(`UPDATE customers
  SET name = $1, phone = $2, cpf = $3, birthday = $4 WHERE id = $5`, 
      [name, phone, cpf, birthday, id])
    res.sendStatus(200);
    return;

  }
  catch (err) {
    console.log(err)
  }

    
}