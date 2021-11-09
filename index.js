#!/usr/bin/env node

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
		//console.log({count, arr, sum}) }
		result.push(arr)
	}
	return result
}

/* =============================================================================== */

/**
 * MAIN APPLICATION FUNCTIONS
 */

/**
 * return sum of array
 */
const total = arr => arr.reduce((acc,curr) => { return acc + parseInt(curr) || 0 }, 0)

/**
 * returns array of positions where the running total
 * is negative, empty array if always non-negative
 */
const dropsBelowZero = arr => {
	if (!(arr instanceof Array)) return
	let result = []
	arr.reduce((acc,curr,i,self) => {
		acc += parseInt(curr) || 0
		if (acc < 0) {
			//console.log(`below zero at i=${i}`)
			result.push(i)
		}
		//console.log(`running total: ${acc}`)
		return acc
	}, 0)
	return result
}

const outputResult = (arr, moves, finalArr, positions) => {
	console.log(`No. of moves: ${moves}`)
	finalArr = finalArr || false
	if (finalArr) {
		console.log('Original balances: [', arr.join(', '), ']')
		console.log('New order of balances with payments deferred to end: [', finalArr.join(', '), ']')
	}
	if (positions) console.log('Payments deferred: [', positions.join(', '), ']')
	if (!finalArr) console.log('Balances: ', arr.join(', '))
	console.log('Yearly total: ', total(arr))
	console.log('='.repeat(60))
}

/* Generate some test arrays each with 12 payments whose sum is non-negative */
let numArrays = 12
let testSet = generateSetOfTestArrays(numArrays)
console.log(`*** Test data: ${numArrays} arrays of monthly payments:`, { testData: testSet })
console.log('-'.repeat(60))

//dropsBelowZero('blah') // test non array param

let i = 0
for (let arr of testSet) {
	i++
	console.log('\n' + `Test #${i}:`)
	let numMoves = 0
	let positions = [] /* payments deferred */
	let maxMoves = arr.length

	/* get an array of position where running total is negative */
	let result = dropsBelowZero(arr)

	/* if result length is zero, no re-shuffle required */
	if (Object.keys(result).length === 0) {
		//console.log({arr, numMoves})
		outputResult(arr, numMoves)
		continue
	}

	/* move negative payments to end of year until running total always non-negative */
	/* by mutating array */

	let loop = true
	let _arr = [...arr] /* keep copy of original array */
	while (loop) {
		let pos = result.shift()
		positions.push(arr[pos])
		//console.log(76, ':', arr.join(', '), {pos})
		arr.push(...arr.splice(pos, 1))
		//console.log(82, ':', arr.join(', '))
		numMoves += 1
		result = dropsBelowZero(arr)
		if (Object.keys(result).length === 0) {
	                //console.log({arr, numMoves})
			outputResult(_arr, numMoves, arr, positions)
        	        loop = false
		}
		/* prevent infinite loop in case of buggy logic */
		loop = (numMoves > maxMoves) ? false : loop
        }
	
}


/*

arr = [
     140, -40, -130, -190,
       0,  50,  170, -120,
    -130, -10,  170,  170
  ]


*/
