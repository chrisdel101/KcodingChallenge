const moment = require('moment')
const fs = require('fs')
const readline = require('readline')

const DB = {}


// add to DB or fail return false - takes tranxsID, loadAmount, currentDate, customerID
function mainTransaction(id, load_amount, date, customerId) {
	if(!DB[customerId]) {
		// check for 5000 dep
		if(!verifyUnder5000(parseFloat(remove$(load_amount)))) return jsonResponse(id, customerId, false)
		DB[customerId] = createAccount(id, remove$(load_amount), date, customerId)
		return jsonResponse(id, customerId, true)
	} else {
		// track new tranx for current day
		getTranxDay(DB[customerId])
		// check for 3 or more tranx
		if(!verifyTranxDay(DB[customerId], date, customerId)) return jsonResponse(id, customerId, false)
		// check for over 5000
		if(!verifyAmountPerDay(DB[customerId], date, load_amount)) return jsonResponse(id, customerId, false)
		// check for over 20000 week
		if(!verifyAmountWeek(DB[customerId], date, load_amount)) return jsonResponse(id, customerId, false)
		// add to DB
		DB[customerId][date] = addFunds(id, remove$(load_amount), customerId, date)
		return jsonResponse(id, customerId, true)
	}
	return jsonResponse(id, customerId, false)
}

function jsonResponse(tranxID, customerID, status) {
	return {
		'id': tranxID,
		'customer_id': customerID,
		'accepted': status
	}
}
// check if days are within the same week - takes dateone and datetwo
function isSameWeek(currentDate, otherTranxDate) {
	let input1 = moment(currentDate, moment.ISO_8601)
	let input2 = moment(otherTranxDate, moment.ISO_8601)
	return input1.isoWeek() === input2.isoWeek() ? true : false
	// SOURCE https://stackoverflow.com/a/44330556/5972531
}
// add all tranx for week of currentDate -takes custObj and currentDate
function getWeeklySum(custObj, currentDate) {
	let vals = []
	Object.keys(custObj).forEach(date => {
		if(isSameWeek(date, currentDate)) {
			let amount = custObj[date].loadAmount
			vals.push(amount)
		}
	})
	if(!vals.length) return 0
	let sum = vals.reduce((acc, cur) => {
		return parseFloat(acc) + parseFloat(cur)
	})
	return parseFloat(sum)
}
// verify under 20000 for the week
function verifyAmountWeek(custObj, date, load_amount) {
	let weeklySum = getWeeklySum(custObj, date, load_amount)
	if(weeklySum + parseFloat(remove$(load_amount)) > 20000) {
		console.error("Weekly limit of 20000 has been reached")
		return false
	} else {
		return true
	}
}
// takes date and returns a easy to read string
function makeDateObj(dateStr) {
	const date = new Date(dateStr)
	const y = date.getUTCFullYear()
	const m = date.getUTCMonth() + 1
	const d = date.getUTCDate()
	let tranxKey = `${y}-${m}-${d}`
	return tranxKey
}
// takes a customer obj returns all tranx per day - takes custObj and currentDate
function getTranxDay(custObj, id) {
	const tranxDay = {}
	// go through and count transactions inside each key
	Object.keys(custObj).forEach(dateKey => {
		let tranxKey = makeDateObj(dateKey)
		// if date not there, add
		if(!tranxDay[tranxKey]) {
			tranxDay[tranxKey] = 1
		} else {
			tranxDay[tranxKey]++
		}
	})
	// console.log('TR', tranxDay)
	return tranxDay
}
// count all tranactions matching curent date and sum - takes custObj and currentDate
function getDailySum(custObj, date) {
	let currentDate = makeDateObj(date)
	let tranxPerDay = getTranxDay(custObj)
	for(let tranxDate of Object.keys(tranxPerDay)) {
		if(currentDate === tranxDate) {
			const amounts = Object.values(custObj).map(val => {
				// find value that matches curent date
				if(val.readAbleDate === currentDate) {
					return val.loadAmount
				}
				// return val.loadAmount only - not full obj
			}).filter(obj => obj)
			if(!amounts.length) return 0
			const sum = amounts.reduce((acc, cur) => {
				return parseFloat(acc) + parseFloat(cur)
			})
			return sum
		}
	}
	// if no days match
	return 0
}
// verify under 5000 per day
function verifyAmountPerDay(custObj, date, load_amount) {
	let dailySum = getDailySum(custObj, date)
	if(parseFloat(dailySum) + parseFloat(remove$(load_amount)) > 5000) {
		console.error("Maximum depoist of 5000 reached. Cannot add.")
		return false
	} else {
		return true
	}
}
// verify 3 transactions or less
function verifyTranxDay(custObj, date, id) {
	let currentDate = makeDateObj(date)
	let tranxPerDay = getTranxDay(custObj)
	//SOURCE https://stackoverflow.com/questions/52528760/javascript-function-returns-true-when-it-should-return-false
	for(let tranxDate of Object.keys(tranxPerDay)) {
		// check current date against all customer transactions
		if(currentDate === tranxDate) {
			if(parseInt(tranxPerDay[tranxDate]) >= 3) {
				console.error("Maximun 3 transactions per day reached")
				return false
			}
		}
	}
	return true
}
// create and add funds
function createAccount(id, load_amount, date, customerId) {
	let obj = {
		[date]: addFunds(id, load_amount, customerId, date)
	}
	return {
		[date]: addFunds(id, load_amount, customerId, date)
	}
}
// verify sinlgele deposit not over 5000
function verifyUnder5000(amount) {
	if(amount > 5000) {
		console.error("Cannot deposit amounts over 5000.")
		return false
	}
	return true
}
//add funds to cust account
function addFunds(tranxId, load_amount, customer_id, date) {
	if(verifyUnder5000) {
		// add funds only
		return {
			id: customer_id,
			tranxId: tranxId,
			loadAmount: load_amount,
			readAbleDate: makeDateObj(date)
		}
	} else if(!verifyUnder5000) {
		return
	}
}
// remove dollar sign in string
function remove$(str) {
	if(str.startsWith("$")) {
		str = str.split("")
		str.shift()
		str = str.join("")
		return str
	} else {
		return str
	}
}
module.exports = {
	mainTransaction: mainTransaction,
	addFunds: addFunds,
	verifyUnder5000: verifyUnder5000,
	verifyAmountWeek: verifyAmountWeek,
	verifyTranxDay: verifyTranxDay,
	getTranxDay: getTranxDay,
	createAccount: createAccount,
	remove$: remove$,
	makeDateObj: makeDateObj,
	getDailySum: getDailySum,
	verifyAmountPerDay: verifyAmountPerDay,
	isSameWeek: isSameWeek,
	getWeeklySum: getWeeklySum
}