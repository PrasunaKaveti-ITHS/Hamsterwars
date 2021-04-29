const express = require('express');
const router = express.Router();

const getDatabase = require('../database.js');
const db = getDatabase();

// ** REST API ** 

// GET all hamsters
router.get('/', async (req, res) => {
	let allTheHamsters = [];

	try {
		const docRef = db.collection('hamsters');
		const snapShot = await docRef.get();

		if (snapShot.empty) {
			res.status(404).send('OOPS hamsters not found 🙁');
			return;
		};
		snapShot.forEach(doc => {
			const data = doc.data();
			data.id = doc.id;
			allTheHamsters.push(data);
		})
		res.send(allTheHamsters);
	}

	catch (error) {
		console.log('An error occured . Please try again 🙁' + error.message);
		res.status(500).send(error.message);
	}
});

// GET random hamster
router.get('/random', async (req, res) => {
	let randomHamster = [];

	try {
		const docRef = db.collection('hamsters');
		snapShot = await docRef.get();

		if (snapShot.empty) {
			res.status(404).send('OOPS hamster not found! 🙁');
			return;
		};

		snapShot.forEach(doc => {
			const data = doc.data();
			data.id = doc.id;
			randomHamster.push(data);
		});

		let aRandomIndex = Math.floor(Math.random() * randomHamster.length);
		res.send(randomHamster[aRandomIndex]);
	}

	catch (error) {
		console.log('An error occured. Please try again 🙁' + error.message);
		res.status(500).send(error.message);
	}
});

//GET hamster by id
router.get('/:id', async (req, res) => {
	const id = req.params.id;

	try {
		const docRef = await db.collection('hamsters').doc(id).get();

		if (!docRef.exists) {
			res.status(404).send('OOPS hamster does not found! 🙁');
			return;
		}

		const data = docRef.data();
		res.send(data);
	}

	catch (error) {
		console.log('An error occured. Please try again 🙁' + error.message);
		res.status(500).send(error.message);
	}
});

// POST hamster        
router.post('/', async (req, res) => {
	const object = req.body;

	try {
		if (!isHamsterObject(object)) {
			res.sendStatus(400);
			return;
		}

		const docRef = await db.collection('hamsters').add(object);
		const hamsterRef = await db.collection('hamsters').doc(docRef.id).get();
		const hamsterData = hamsterRef.data();
		res.send({
			id: docRef.id,
			name: hamsterData.name,
			age: hamsterData.age,
			favFood: hamsterData.favFood,
			loves: hamsterData.loves,
			imgName: hamsterData.imgName,
			wins: hamsterData.wins,
			defeats: hamsterData.defeats,
			games: hamsterData.games
		});
	}

	catch (error) {
		console.log('An error occured. Please try again 🙁' + error.message);
		res.status(500).send(error.message);
	}
});

// PUT hamster by id      
router.put('/:id', async (req, res) => {
	const object = req.body;
	const id = req.params.id;

	try {
		const docRef = db.collection('hamsters');
		const snapShot = await docRef.doc(id).get();

		if
			(!snapShot.exists) {
			res.status(404).send('OOPS id does not exist! 🙁 ' + id);
			return;
		} else if (!validateHamsterObject(object) || !Object.keys(object).length) {
			res.sendStatus(400);
			return;
		}
		//The Object.keys() method returns an array of a given object's own enumerable
		// property names, iterated in the same order that a normal loop would.
		await docRef.doc(id).set(object, { merge: true });
		//set with merge will update fields in the document or create it if it doesn't exists
		res.sendStatus(200);
	}

	catch (error) {
		console.log('An error occured. Please try again 🙁' + error.message);
		res.status(500).send(error.message);
	}
});

// DELETE hamster by id   
router.delete('/:id', async (req, res) => {
	const id = req.params.id;

	try {
		const docRef = await db.collection('hamsters').doc(id).get();

		if (!docRef.exists) {
			res.status(404).send('OOPS id does not exist! 🙁 ' + id);
			return;
		}

		await db.collection('hamsters').doc(id).delete();
		res.sendStatus(200);
	}

	catch (error) {
		console.log('An error occured. Please try again 🙁' + error.message);
		res.status(500).send(error.message);
	}
});

// function to check hamster object in POST hamster
function isHamsterObject(maybeObject) {

	if (!maybeObject.name || !maybeObject.age || !maybeObject.favFood || !maybeObject.loves || !maybeObject.imgName || typeof maybeObject.wins != "number" || typeof maybeObject.defeats != "number" || typeof maybeObject.games != "number") {
		return false;
	}
	return true;
};

//validate for PUT/hamsters. Check key and type
function validateHamsterObject(hamsterObj) {
	const digit = /^[0-9]+$/;
	for (property in hamsterObj) {
		if (property === 'name' && digit.test(hamsterObj.name)) {
			return false;
		} else if (property === 'age' && !digit.test(hamsterObj.age)) {
			return false;
		} else if (property === 'favFood' && digit.test(hamsterObj.favFood)) {
			return false;
		} else if (property === 'loves' && digit.test(hamsterObj.loves)) {
			return false;
		} else if (property === 'imgName' && digit.test(hamsterObj.imgName)) {
			return false;
		} else if (property === 'wins' && !digit.test(hamsterObj.wins)) {
			return false;
		} else if (property === 'defeats' && !digit.test(hamsterObj.defeats)) {
			return false;
		} else if (property === 'games' && !digit.test(hamsterObj.games)) {
			return false;
		}
		return true;
	}
};

module.exports = router;