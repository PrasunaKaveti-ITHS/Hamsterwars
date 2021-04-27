const getDatabase = require('../database.js')
const db = getDatabase()

const express = require('express')
const router = express.Router()
// ** REST API **

// GET /hamsters
router.get('/', async (req, res) => {
	// console.log('/hamsters REST API');
	// res.send('/hamsters REST API')

	const hamstersRef = db.collection('hamsters')
	const snapshot = await hamstersRef.get()

	if( snapshot.empty ) {
		res.send([])
		return
	}

	let items = []
	snapshot.forEach(doc => {
		const data = doc.data()
		data.id = doc.id  // id behövs för POST+PUT+DELETE
		items.push( data )
	})
	res.send(items)
})

// GET /hamsters/:id
router.get('/:id', async (req, res) => {
	const id = req.params.id
	const docRef = await db.collection('hamsters').doc(id).get()

	if( !docRef.exists ) {
		res.status(404).send('Hamster does not exist')
		return
	}

	const data = docRef.data()
	res.send(data)
})

// POST /hamsters
router.post('/', async (req, res) => {
	// OBS! Måste installera express.json för att detta ska fungera
	const object = req.body

	if( !isHamstersObject(object) ) {
		res.sendStatus(400)
		return
	}

	const docRef = await db.collection('hamsters').add(object)
	res.send(docRef.id)
})

// PUT /hamsters/:id
router.put('/:id', async (req, res) => {
	// OBS! Måste installera express.json för att detta ska fungera
	const object = req.body
	const id = req.params.id

	if( !object || !id ) {
		res.sendStatus(400)
		return
	}

	// Vi kan kontrollera om det finns ett doc som matchar id i databasen. Den här koden godkänner id som inte matchar, och lägger till ett nytt doc i databasen.

	const docRef = db.collection('hamsters').doc(id)
	await docRef.set(object, { merge: true })
	res.sendStatus(200)
})

function isHamstersObject(maybeObject) {
	// Pratigt, men kanske mera lättläst. Kan göras mer kompakt
	if( !maybeObject )
		return false
	else if( !maybeObject.name || !maybeObject.price )
		return false

	return true
}

// DELETE /hamsters/:id
router.delete('/:id', async (req, res) => {
	const id = req.params.id

	if( !id ) {
		res.sendStatus(400)
		return
	}

	await db.collection('hamsters').doc(id).delete()
	res.sendStatus(200)
})


module.exports = router