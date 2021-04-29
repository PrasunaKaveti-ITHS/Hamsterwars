const express = require('express');
const router = express.Router();

const getDatabase = require('../database.js');
const db = getDatabase();

//GET 5 winners from hamsters
router.get('/', async (req, res) => {

	try {
		let hamstersRef = await db.collection('hamsters').orderBy('wins','desc').limit(5).get();
		
		const winners = [];
		hamstersRef.forEach((doc) => {
			data = doc.data();
			if(data.wins > 0){
				winners.push(data);
			}
		});
		
		res.send(winners);
	}
	
	catch(error) {
		console.log('An error occured! Please try again 🙁' + error.message);
		res.status(500).send(error.message);
	}
});

module.exports = router;