const express = require('express')
const router = express.Router()

const getDatabase = require('../database.js');
const db = getDatabase();

//GET 5 losers from hamsters
router.get("/", async(req, res) => {
    try {
        const hamstersRef = await db.collection("hamsters").orderBy("defeats", "desc").limit(5).get();
        const losers = [];
        hamstersRef.forEach((doc) => {
            losers.push(doc.data());
        });
        res.send(losers)
    } catch (error) {


        console.log('An error occured! Please try again 🙁' + error.message);
        res.status(500).send(error.message);
    }
});