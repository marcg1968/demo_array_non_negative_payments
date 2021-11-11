#!/usr/bin/env node

const numArraysToGenerate = 10

/**
 * TESTING - GENERATION OF DATA
 */

/**
 * Generate an array of 12 integers
 * which are multiples of 10 between -200 and 200
 */

const generateTestArray = () => [...Array(12).keys()]
	.map(i => (Math.floor(Math.random() * -40) + 20) * 10)

/**
 * Generate set of N arrays each containing of 12 integers,
 * each of which are multiples of 10 between -200 and 200
 * and whose sum is always positive or zero
 */
const generateSetOfTestArrays = n => {
	n = n || false
	if (!n) return
	let count = 0, result = []
	while (count < n) {
		let arr = generateTestArray()
		let sum = total(arr)
		if (sum < 0) continue
		count++
		result.push(arr)
	}
	return result
}

/* =============================================================================== */

/**
 * MAIN APPLICATION FUNCTIONS
 */

/**
 * Show information about this script/app
 */
const about = () => {
	console.log('*'.repeat(60))
	console.log(`
This is a simple demonstration of generating a number of arrays, each representing 
the twelve (12) monthly end balances for a single year, in which if the running 
total dips below zero, a negative monthly balance (outgoing payment) can be deferred 
to the end of the year.
`)
	console.log('*'.repeat(60))
}

/**
 * return sum of array
 */
const total = arr => arr.reduce((acc,curr) => { return acc + parseInt(curr) || 0 }, 0)

/**
 * returns array of positions where the running total is negative, empty array if always non-negative
 */
const dropsBelowZero = arr => {
	if (!(arr instanceof Array)) return
	let result = []
	arr.reduce((acc,curr,i,self) => {
		acc += parseInt(curr) || 0
		if (acc < 0) result.push(i)
		return acc
	}, 0)
	return result
}

/**
 * Formatted output of results
 * @param i Test number
 * @param arr array of monthly balances
 * @param moves no. of deferred payments
 * @param finalArr new re-arranged array
 * @param paymentsDeferred list of which payments need to be deferred
 */
const outputResult = (i, arr, moves, finalArr, paymentsDeferred) => {
	finalArr = finalArr || false
	// console.log('\n' + '='.repeat(60))
	console.log(`Test #${i}:`)
	if (finalArr) {
		console.log('Original balances: [', arr.join(', '), ']')
		console.log('New order of balances with payments deferred to end: [', finalArr.join(', '), ']')
	}
	if (paymentsDeferred) console.log('Payments deferred: [', paymentsDeferred.join(', '), ']')
	if (!finalArr) console.log('Balances: ', arr.join(', '))
	console.log('Yearly total: ', total(arr))
	if (moves)      console.log(`No. of deferments: ${moves}`)
    if (moves===0)  console.log('No deferments required.')
	console.log('='.repeat(60))
}

/* Generate some test arrays each with 12 payments whose sum is non-negative */
let testSet = generateSetOfTestArrays(numArraysToGenerate)
console.log(`*** Test data: ${numArraysToGenerate} arrays of monthly payments:`, { testData: testSet })
console.log('-'.repeat(60))


/* Output what we are about */
about()

/* iterate over test set data */
// let i = 0
// for (let arr of testSet) {
// 	i++
for (let i=0; i<testSet.length;i++) {
    let arr = [...testSet[i]],
	    numMoves = 0,
	    paymentsDeferred = [], /* payments deferred */
	    maxMoves = arr.length,
        result

	/* get an array of positions where running total is negative */
	result = dropsBelowZero(arr)

	/* if result length is zero, no re-shuffle required */
	if (Object.keys(result).length === 0) {
		outputResult(i+1, arr, numMoves)
		continue
	}

	/* move negative balances (payments) to end of year */
	/* until running total always non-negative */
	/* note: this mutates the array */

	let _arr = [...arr] /* keep copy of original array */
	let loop = true
	while (loop) {
        result = dropsBelowZero(arr)
		let pos = result.shift()
		paymentsDeferred.push(arr[pos]) /* keep track of which payments are deferred */
		arr.push(...arr.splice(pos, 1)) /* move to end of array */
		numMoves += 1

		/* no more re-shuffling required so exit loop */
		if (Object.keys(result).length === 0) {
			outputResult(i+1, _arr, numMoves, arr, paymentsDeferred)
            loop = false
		}

		/* prevent infinite loop in case of buggy logic */
		loop = (numMoves > maxMoves) ? false : loop
    }

}

/*
[ -140, 80, -30, 70, 120, 60, -130, 50, 140, -20, 170, 0 ]

 */
