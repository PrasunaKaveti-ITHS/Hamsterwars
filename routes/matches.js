const getDatabase = require('../database.js')
const db = getDatabase()

const express = require('express')
const router = express.Router()
// ** REST API **

// GET /matches
router.get('/', async (req, res) => {

	const matchesRef = db.collection('matches')
	const snapshot = await matchesRef.get()

	if (snapshot.empty) {
		res.send([])
		return
	}

	let items = []
	snapshot.forEach(doc => {
		const data = doc.data()
		data.id = doc.id  // id behövs för POST+PUT+DELETE
		items.push(data)
	})
	res.send(items)
})
// GET /matches/:id
router.get('/:id', async (req, res) => {
	const id = req.params.id
	const docRef = await db.collection('matches').doc(id).get()

	if (!docRef.exists) {
		res.status(404).send('Matches does not exist')
		return
	}

	const data = docRef.data()
	res.send(data)
})


// POST /matches
router.post('/', async (req, res) => {
	// OBS! Måste installera express.json för att detta ska fungera
	const object = req.body

	if (!isMatchesObject(object)) {
		res.sendStatus(400)
		return
	}

	const docRef = await db.collection('matches').
add(object)
	res.send(docRef.id)
})

function isMatchesObject(maybeObject) {
	// Pratigt, men kanske mera lättläst. Kan göras mer kompakt
	if (!maybeObject)
		return false
	else if (!maybeObject.winnerId || !maybeObject.loserId)
		return false

	return true
}

// DELETE /matches/:id
router.delete('/:id', async (req, res) => {
	const id = req.params.id

	if (!id) {
		res.sendStatus(400)
		return
	}

	await db.collection('matches').doc(id).delete()
	res.sendStatus(200)
})


module.exports = router