import { connection } from "../database/database.js";
import dayjs from "dayjs";

export async function getRentals(req, res) {

    
    try {
        const rentals = await connection.query(`SELECT rentals.*,
        JSON_BUILD_OBJECT
            ('id', customers.id, 'name', customers.name)
        AS customer, 
        JSON_BUILD_OBJECT
            ('id',games.id,'name',games.name,'categoryId',games."categoryId",'categoryName',categories.name)
        AS game
        FROM rentals 
        JOIN games
        ON rentals."gameId" = games.id JOIN categories ON games."categoryId" = categories.id 
        JOIN customers
        ON rentals."customerId" = customers.id;`);
    
        res.send(rentals.rows);
    }

    catch (err) {
        res.send(err);
    }
}

export async function postRentals(req, res) {
    const { customerId, gameId, daysRented } = req.body;

    const today = Date.now();
    const rentDate = new Date(today);

    const returnDate = null;

    const idCustomer = await connection.query(`SELECT * FROM customers WHERE id = $1`, [customerId])
    console.log(idCustomer.rows[0])
    if (!idCustomer.rows[0]) {
        res.sendStatus(409);
        return
    }


    const idGame = await connection.query(`SELECT * FROM games WHERE id = $1`, [gameId]);
    if (!idGame.rows[0]) {
        res.sendStatus(400);
        return
    }

    const price = await connection.query(`SELECT "pricePerDay" FROM games WHERE id = $1`, [gameId]);
    const pricePerDay = (price.rows[0].pricePerDay);



    const originalPrice = pricePerDay * daysRented;
    if (daysRented < 0) {
        res.sendStatus(400);
        return;
    }

    const delayFee = null;
    console.log(idGame.rows[0].stockTotal)
    if(idGame.rows[0].stockTotal > 0){
        const gameInStocked = await connection.query('UPDATE games SET "stockTotal" = $1 WHERE id = $2', [(idGame.rows[0].stockTotal)-1, gameId]);
    }
    if(idGame.rows[0].stockTotal === 0){
        res.sendStatus(400);
        return;
    }


    try {
        await connection.query(`
        INSERT INTO rentals 
            ("customerId", "gameId", "rentDate", "daysRented", "returnDate", "originalPrice", "delayFee") 
            VALUES ($1, $2, $3, $4, $5, $6, $7)`,

            [customerId, gameId, rentDate, daysRented, returnDate, originalPrice, delayFee])


        res.sendStatus(201);
    }
    catch (err) {
        console.log(err);
        res.send(err);

    }



}

export async function finishRentals(req,res){

    const {id} = req.params;

    
    
    const rentExists = await connection.query(`SELECT * FROM rentals WHERE id = $1`, [id]);
    if(!rentExists.rows[0]){
        res.sendStatus(404);
        return;
    }

    const pricePerDay = await connection.query(`SELECT * FROM games WHERE id = $1`, [rentExists.rows[0].gameId]);
    

    if(rentExists.rows[0].returnDate ==! null){
        res.sendStatus(400);
        return;
    }

    const gameExists = await connection.query(`SELECT * FROM games WHERE id = $1`, [rentExists.rows[0].gameId]);
    const stockGame = gameExists.rows[0].stockTotal;
    console.log(stockGame);

    const gameInStocked = await connection.query('UPDATE games SET "stockTotal" = $1 WHERE id = $2', [(stockGame+1), rentExists.rows[0].gameId]);

    const today = Date.now();
    const currentDay = new Date(today);

    const diffInThousnds = new Date(today) - new Date(rentExists.rows[0].rentDate);
    const diffInDays = diffInThousnds/(1000*60*60*24);

    

    let delayFee = 0;

    if(diffInDays > rentExists.rows[0].daysRented){
        const dayslate = diffInDays - (rentExists.rows[0].daysRented);
        delayFee = dayslate * pricePerDay.rows[0].pricePerDay;      

    }

    

    try{
        await connection.query(`UPDATE rentals SET "returnDate"=$1, "delayFee"=$2 WHERE id = $3`, [currentDay, delayFee, id])
        res.sendStatus(200);
    }
    catch (err){

    }
}

export async function deleteRentals(req, res){

    const {id} = req.params
    const cheekId = await connection.query(`SELECT * FROM rentals WHERE id = $1`, [id]);

    if(!cheekId.rows[0]){
        res.sendStatus(404);
        return
    }

    if (cheekId.rows[0].returnDate === null) {
        res.sendStatus(400);
        return;
    }

    try{
        const deleteRental = await connection.query("DELETE FROM rentals WHERE id = $1", [id]);
        res.send(200);
    }
    catch (err){
        res.send(err);
    }



}
