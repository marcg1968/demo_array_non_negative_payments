# About

This is a Javascript solution to the following problem, using ``array`` manipulation.

# Problem description

A company has a list of expected revenues and payments for the upcoming year in chronological order. The problem is that at some moments in time the sum of previous payments can be larger than the total previous revenue, which would put the company in debt. To avoid this problem the company takes a very simple approach: it re-schedules some expenses to the end of the year.

You are given an array of integers, where positive numbers represent revenues and negative numbers represent expenses, all in chronological order. In one move you can relocate any expense (negative number) to the end of the array.

What is the minimum number of such relocations to make sure that the company never falls into debt - i.e. there is no consecutive sequence of elements starting from the beginning of the array, that sums up to a negative number?

You can assume that the sum of all elements is non-negative.

# What this demo does

This script generates a dataset consisting of a number of arrays, each representing 
the twelve (12) monthly end balances for a single year, in which if the running 
total dips below zero, a negative monthly balance (outgoing payment) can be deferred 
to the end of the year.

# Running the demo

Clone the repository.

On the command line issue the following:

```bash
npm start
```

OR

```bash
npm start | more
```

