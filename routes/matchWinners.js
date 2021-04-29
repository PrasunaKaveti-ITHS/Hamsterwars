const express = require('express');
const router = express.Router();

const getDatabase = require('../database.js');
const db = getDatabase();

//GET all match winners
router.get('/:id', async (req, res) => {
    const id = req.params.id;

    try {
        const docRef = db.collection('matches').where('winnerId', '==', id)
        const winnerHamster = await docRef.get();

        if (winnerHamster.empty) {
            res.status(404).send('Could not find match winners');
            return;
        }

        let winningAllMatches = [];
        winnerHamster.forEach(doc => {
            const data = doc.data();
            data.id = doc.id;
            winningAllMatches.push(data);
        });

        res.send(winningAllMatches);
    }

    catch (error) {
        console.log('An error occured! Please try again 🙁' + error.message);
        res.status(500).send(error.message);
    }
});

module.exports = router;