const moment = require('moment')
const fs = require('fs')
var readline = require('readline');

let DB = {}

function handleAccount(id, load_amount, date, customerId) {
	// if not there, create and add
	if(!DB[customerId]) {
		// console.log('id', id)
		// check for 5000
		if(!verifyUnder5000(parseFloat(remove$(load_amount)))) return false
		// console.log('TOP')
		DB[customerId] = createAccount(id, remove$(load_amount), date, customerId)
		return true
	} else { // just add funds
		// console.log('BOTTOM')
		// if 3 transactions break
		// console.log('above', DB[customerId])

		if(!verifyTranxDay(DB[customerId], date, customerId)) return false
		console.log('one')
		// console.log('CHECK', verifyAmountPerDay(DB[customerId], date, load_amount))
		if(!verifyAmountPerDay(DB[customerId], date, load_amount)) return false
		console.log('two')
		if(!verifyAmountWeek(DB[customerId], date, load_amount)) return false
		console.log('three')
		// console.log('below')
		// console.log(verifyAmountPerDay(DB[customerId], date))
		getTranxDay(DB[customerId])
		// console.log('below', DB[customerId])
		DB[customerId][date] = addFunds(id, remove$(load_amount), customerId, date)
		// console.log('after load', DB[customerId])
		return true
	}
	return false
}
// https://stackoverflow.com/a/44330556/5972531
function isSameWeek(currentDate, otherTranxDate) {
	var input1 = moment(currentDate, moment.ISO_8601)
	var input2 = moment(otherTranxDate, moment.ISO_8601)
	// console.log(input1, input2)
	return input1.isoWeek() === input2.isoWeek() ? true : false

}
// console.log(isSameWeek("2000-01-01T00:00:00Z", "1999-12-31T09:00:00Z"))

function getWeeklySum(custObj, currentDate) {
	// console.log("CURRENT", custObj)
	let vals = []
	Object.keys(custObj).forEach(date => {
		// console.log('check week date', date)
		// console.log(custObj[arr])
		if(isSameWeek(date, currentDate)) {
			// console.log('what', custObj[date])
			// console.log(custObj[date].loadAmount)
			let amount = custObj[date].loadAmount
			vals.push(amount)
		} else {
			// console.log('not same')
		}
	})
	if(!vals.length) return 0
	let sum = vals.reduce((acc, cur) => {
		return parseFloat(acc) + parseFloat(cur)
	})
	// console.log(sum)
	// console.log(load_amount)
	return parseFloat(sum)
}

function verifyAmountWeek(custObj, date, load_amount) {
	let weeklySum = getWeeklySum(custObj, date, load_amount)
	// console.log('WEEKSUM', weeklySum + parseFloat(remove$(load_amount)))
	if(weeklySum + parseFloat(remove$(load_amount)) > 20000) {
		console.log("Weekly limit of 20000 has been reached")
		return false
	} else {
		return true
	}


}
// takes date and returns a easy to read string
function makeDateObj(dateStr) {
	// console.log("DS", dateStr)
	const date = new Date(dateStr)
	// const y = date.getFullYear()
	// const m = date.getMonth() + 1
	// const d = date.getDate()
	const y = date.getUTCFullYear()
	const m = date.getUTCMonth() + 1
	const d = date.getUTCDate()
	let tranxKey = `${y}-${m}-${d}`
	// console.log('tra', tranxKey)
	return tranxKey
}
// takes a customer obj returns all tranx per day
function getTranxDay(custObj, id) {
	let tranxDay = {}
	// once object is made go through and count transactions
	Object.keys(custObj).forEach(dateKey => {
		let tranxKey = makeDateObj(dateKey)
		// console.log('traxKEY', tranxKey)
		// console.log('dateKey', dateKey)
		// if date not there, add
		if(!tranxDay[tranxKey]) {
			tranxDay[tranxKey] = 1
			// console.log('above')
			// console.log('tran', tranxDay)
		} else {
			// if dates match increment
			tranxDay[tranxKey]++
		}
	})
	// console.log('done', tranxDay)
	return tranxDay
}
// count all tranactions matching curent date and add up
function getDailySum(custObj, date) {

	let currentDate = makeDateObj(date)
	// console.log(currentDate)
	let tranxPerDay = getTranxDay(custObj)
	// console.log('trans', tranxPerDay)
	for(var tranxDate of Object.keys(tranxPerDay)) {
		// console.log('date', tranxDate)
		if(currentDate === tranxDate) {
			// console.log("currentDate", currentDate)
			// console.log("tranxDate", tranxDate)
			// console.log('CUS', custObj)
			const amounts = Object.values(custObj).map(val => {
				return val.loadAmount
			})
			// console.log('ammounts', amounts)
			const sum = amounts.reduce((acc, cur) => {
				return parseFloat(acc) + parseFloat(cur)
			})
			// console.log('SUM',sum)
			return sum
		}
	}
	// if no days match
	return 0
}
// takes customer obj and date str
function verifyAmountPerDay(custObj, date, load_amount) {
	// console.log('CC', custObj, date, load_amount)
	// console.log(date)
	let dailySum = getDailySum(custObj, date)
	console.log('SUM', dailySum)
	console.log(custObj)
	if(parseFloat(dailySum) + parseFloat(remove$(load_amount)) > 5000) {
		console.log("Maximum depoist of 5000 reached. Cannot add.")
		return false
	} else {
		// console.log("amount per day verified")
		return true
	}
}
// takes in customerObj from DB and date of current tranx
// checks for 3 transactions per day
function verifyTranxDay(custObj, date, id) {
	let currentDate = makeDateObj(date)
	let tranxPerDay = getTranxDay(custObj)
	// https://stackoverflow.com/questions/52528760/javascript-function-returns-true-when-it-should-return-false
	for(var tranxDate of Object.keys(tranxPerDay)) {
		// check current date against all customer transactions
		// console.log('currentDate', currentDate)
		// console.log('tranxDate', tranxDate)
		if(currentDate === tranxDate) {
			// console.log('amount', tranxPerDay[tranxDate])
			if(parseInt(tranxPerDay[tranxDate]) >= 3) {
				console.log("Maximun 3 transactions per day reached")
				return false
			}
		}
	}
	// console.log('tranx per day verfied')
	return true
}

function createAccount(id, load_amount, date, customerId) {
	// console.log(id)
	let obj = {
		[date]: addFunds(id, load_amount, customerId, date)
	}
	// create and add funds
	return {
		[date]: addFunds(id, load_amount, customerId, date)
	}
}
// logs needed
function verifyUnder5000(amount) {
	// console.log(amount)
	if(amount > 5000) {
		return false
	}
	return true
}


function addFunds(tranxId, load_amount, customer_id, date) {
	// console.log("add", id, load_amount, customer_id)
	if(verifyUnder5000) {
		// console.log('FUNDS ADDED:', load_amount)
		// add funds only
		return {
			id: customer_id,
			tranxId: tranxId,
			loadAmount: load_amount,
			readAbleDate: makeDateObj(date)
		}
	} else if(!verifyUnder5000) {
		console.error("$5000 max reached for the day")
		return
	}
}

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
// /https://stackoverflow.com/a/49713276/5972531

function convertToJson(file) {

	return new Promise((resolve, reject) => {

		const stream = fs.createReadStream(file);
		// Handle stream error (IE: file not found)
		stream.on('error', reject);

		const reader = readline.createInterface({
			input: stream
		});

		const array = [];

		reader.on('line', line => {
			array.push(JSON.parse(line));
		});

		reader.on('close', () => resolve(array));
	});
}

let data = []
let answers = []
convertToJson('input.txt')
	.then(res => {
		res.forEach(obj => data.push(obj))
	})
	.catch(err => console.error(err));
convertToJson('output.txt')
	.then(res => {
		res.forEach(obj => answers.push(obj))
	})
	.catch(err => console.error(err));



setTimeout(function() {
	let countRight = 0
	let countWrong = 0
	data.forEach((obj, i) => {
		// console.log()
		let res = handleAccount(obj.id, obj.load_amount, obj.time, obj.customer_id)
		console.log(i, obj.customer_id, res)
		console.log(i, res === answers[i].accepted)
		// if(answers[i] && res === answers[i].accepted) {
		// 	countRight++
		// } else {
		// 	countWrong++
		// }
	})
	// console.log(countRight, countWrong)
	// console.log(DB)
}, 100)
// handleAccount("15889", "$4500.47", "1999-12-31T09:00:00Z", "528")
// handleAccount("15866", "700.47", "2000-01-01T02:00:00Z", "528")
//
// handleAccount("15883", "$447.", "2001-02-01T00:00:00Z", "528")
// handleAccount("15866", "$447.", "2001-02-01T04:00:00Z", "528")
// handleAccount("1585", "$447.", "2001-02-01T06:00:00Z", "528")
// handleAccount("15845", "$500.", "2001-03-01T00:00:00Z", "529")
// handleAccount("15864", "$400.47", "2000-01-01T02:00:00Z", "529")
// handleAccount("15876", "$400.47", "2000-01-01T01:00:00Z", "529")
// customerId: {
//     date: [
//         {
//             id: id,
//             load_amount:load_amount,
//             time: time
//         }
//     ]
//     }
// }
// }
// addFunds("15887","$3318.47","2000-01-01T00:00:00Z",  "528" )
// {"id":"15887","customer_id":"528","load_amount":"$3318.47","time":"2000-01-01T00:00:00Z"}

// extractDate(time){
//     let year = new Date().getFullYear()
//     let month = new Date().getMonth()
//     let day = new Date().getDay()
//     return `${year}-${month}-${day}`
// }
module.exports = {
	handleAccount: handleAccount,
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