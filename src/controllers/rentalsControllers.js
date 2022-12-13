import { connection } from "../database/database.js";
import {customerSchema} from "../models/schemaCustomers.js"

export async function getRentals(req,res){
    try {
        const rentals = await connection.query('SELECT * FROM rentals');
        res.send(rentals.rows);
      }
      
      catch (err) {
        res.send(err);
      }
}

export async function getCustomerById(req,res){
    
}

export async function postRentals(req,res){
    
}