const display = document.querySelector('#displayData')
const fetchHamsterButton = document.querySelector('#fetchHamsterData')
const fetchMatchesButton = document.querySelector('#fetchMatchesData')

fetchHamsterButton.addEventListener('click', async event => {
	// console.log('Hello world');

	// XMLHttpRequest - gamla sättet, undvik
	// fetch - nya sättet, lite krånglig; behöver ingen import
	// axios - busenkelt
	// jquery.ajax - använd axios i stället
	try {
		const response = await fetch('/hamsters')
		const json = await response.json()

		let text = JSON.stringify(json)
		display.innerHTML = text

	} catch {
		console.log('Something went wrong');
		// Note: Don't use a vague error message like this
	}
})

fetchMatchesButton.addEventListener('click', async event => {

	try {
		const response = await fetch('/matches')
		const json = await response.json()

		let text = JSON.stringify(json)
		display.innerHTML = text

	} catch {
		console.log('Something went wrong');
		// Note: Don't use a vague error message like this
	}
})