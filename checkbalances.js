// checkbalances.js

let debug
debug = false
// debug = true
const DEBUG = debug

/**
 * return sum of array
 */
export const total = arr => arr.reduce((acc,curr) => { return acc + parseInt(curr) || 0 }, 0)

/**
 * returns array of positions where the running total is negative, empty array if always non-negative
 */
const dropsBelowZero = arr => {
    if (!(arr instanceof Array)) return
    let result = []
    if (DEBUG) console.log({arr})
    arr.reduce((acc,curr,i,self) => {
        acc += parseInt(curr) || 0
        if (DEBUG && acc < 0) console.log(`below zero at i=${i}`)
        if (acc < 0) result.push(i)
        if (DEBUG) console.log(`running total: ${acc}`)
        return acc
    }, 0)
    return result
}

/**
 * Takes an array (or "stream") of monthly balances and checks that in case of running balance being negative,
 * the monthly balance (here an outgoing payments) is moved (or "deferred") to the end (of the year).
 * @param arr array of monthly balances (or payments)
 * @returns {{ numMoves: number, arr: Array, paymentsDeferred: Array }}
 * - Object with keys "numberOfMoves", and "arr" with re-ordered array of monthly balances/payments
 */
export const evaluateBalances = arr => {
    let numMoves = 0,
        paymentsDeferred = [], /* payments deferred */
        maxMoves = arr.length,
        result

    /* get an array of positions where running total is negative */
    result = dropsBelowZero(arr)

    /* if result length is zero, no re-shuffle required */
    if (Object.keys(result).length === 0) {
        // outputResult(i+1, arr, numMoves)
        return { numMoves, arr, paymentsDeferred }
    }

    /* move negative balances (payments) to end of year */
    /* until running total always non-negative */
    /* note: this mutates the array */

    let _arr = [...arr] /* keep copy of original array */
    let loop = true
    while (loop) {
        let pos = result.shift()
        paymentsDeferred.push(arr[pos]) /* keep track of which payments are deferred */
        arr.push(...arr.splice(pos, 1)) /* move to end of array */
        numMoves += 1

        /* check if problem has now been solved by deferment of payment to the end */
        result = dropsBelowZero(arr)

        /* no more re-shuffling required so exit loop */
        if (Object.keys(result).length === 0) {
            // outputResult(i+1, _arr, numMoves, arr, paymentsDeferred)
            loop = false
        }

        /* prevent infinite loop in case of buggy logic */
        loop = (numMoves > maxMoves) ? false : loop
    }
    return { numMoves, arr, paymentsDeferred }
}


