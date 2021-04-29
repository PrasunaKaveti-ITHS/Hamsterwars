const express = require('express');
const router = express.Router();

const getDatabase = require('../database.js');
const db = getDatabase();

// ** REST API **

// GET all matches
router.get('/', async (req, res) => {
	let allTheMatches = [];
try {
	const docRef = db.collection('matches');
	const snapshot = await docRef.get();

	if (snapshot.empty) {
		res.status(404).send('OOPS matches not found 🙁');
		return;
	};

	snapshot.forEach(doc => {
		const data = doc.data();
		data.id = doc.id;  // id behövs för POST+PUT+DELETE
		allTheMatches.push(data);
	});
	res.send(allTheMatches);
}
catch(error) {
	console.log('An error occured.Please try again 🙁' + error.message);
	res.status(500).send(error.message);
}
});

// GET /matches by id
router.get('/:id', async (req, res) => {
	const id = req.params.id;
	try {
	const docRef = await db.collection('matches').doc(id).get();

	if (!docRef.exists) {
		res.status(404).send('Match does not exist! 🙁');
		return;
	}
	const data = docRef.data();
	res.send(data);
}
catch(error){
	console.log('An error occured! Please try again 🙁' + error.message);
		res.status(500).send(error.message);
}
});

// POST /matches
router.post('/', async (req, res) => {
	const object = req.body;
	try {
	
		winnerHamsterRef = await db.collection('hamsters').doc(object.winnerId).get();
		loserHamsterRef = await db.collection('hamsters').doc(object.loserId).get();

		if(!winnerHamsterRef.exists || !loserHamsterRef.exists){
			console.log('Winner hamster id or loser hamster id does not exist');
			res.sendStatus(400);
			return;
		}

		// incrementing wins and games in hamster object
		const winnerHamsterData = winnerHamsterRef.data();
		winnerHamsterData.wins += 1;
		winnerHamsterData.games += 1;

		//incrementing defeats and games in hamster object
		const loserHamsterData = loserHamsterRef.data();
		loserHamsterData.defeats += 1;
		loserHamsterData.games += 1;

		await db.collection('hamsters').doc(object.winnerId).set(winnerHamsterData, { merge: true });
		await db.collection('hamsters').doc(object.loserId).set(loserHamsterData, { merge: true });
		
		const docRef = await db.collection('matches').add(object);

		const matchRef = await db.collection('matches').doc(docRef.id).get();
		const matchData = matchRef.data();

		res.send({ id: docRef.id,
					  winnerId: matchData.winnerId,
					  loserId: matchData.loserId 
					});
					res.sendStatus(winnerId);
					res.sendStatus(loserId);
	}
	catch(error) {
		console.log('An error occured! Please try again 🙁' + error.message);
		res.status(500).send(error.message);
	}
});

// DELETE matches by id
router.delete('/:id', async (req, res) => {
	const id = req.params.id;

	try {
		const docRef = await db.collection('matches').doc(id).get();
	
		if(!docRef.exists) {
			res.status(404).send('OOPS id does not exist! 🙁' + id);
			return;
		}

		const matchData = docRef.data();
		const winnerHamsterId = matchData.winnerId;
		const loserHamsterId = matchData.loserId;
		winnerHamsterRef = await db.collection('hamsters').doc(winnerHamsterId).get();
		loserHamsterRef = await db.collection('hamsters').doc(loserHamsterId).get();

		const winnerHamsterData = winnerHamsterRef.data();
		winnerHamsterData.wins -= 1;
		winnerHamsterData.games -= 1;

		const loserHamsterData = loserHamsterRef.data();
		loserHamsterData.defeats -= 1;
		loserHamsterData.games -= 1;

		await db.collection('hamsters').doc(winnerHamsterId).set(winnerHamsterData, { merge: true });
		await db.collection('hamsters').doc(loserHamsterId).set(loserHamsterData, { merge: true });
		
		await db.collection('matches').doc(id).delete();
		res.sendStatus(200);
	}
	
	catch(error) {
		console.log('An error occured! Please try again 🙁' + error.message);
		res.status(500).send(error.message);
	}
});

module.exports = router;