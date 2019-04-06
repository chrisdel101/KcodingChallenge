let DB = {}

function handleAccount(id, load_amount, date, customerId) {
	// if not there, create and add
	if(!DB[customerId]) {
		// check for 5000
		if(!verifyUnder5000(load_amount)) return false
		// console.log('TOP')
		DB[customerId] = createAccount(id, remove$(load_amount), date, customerId)
		return true
	} else { // just add funds
		console.log('BOTTOM')
		// if 3 transactions break
		// console.log('above', DB[customerId])
		if(!verifyTranxDay(DB[customerId], date, customerId)) return false
		// console.log('CHECK', verifyAmountPerDay(DB[customerId], date))
		if(!verifyAmountPerDay(DB[customerId], date, load_amount)) return false

		// console.log(verifyAmountPerDay(DB[customerId], date))
		getTranxDay(DB[customerId])
		console.log('below', DB[customerId])
		DB[customerId][date] = addFunds(id, remove$(load_amount), customerId, date)
		console.log('after load', DB[customerId])
		return true
	}
	return false
}

// takes date and returns a easy to read string
function makeDateObj(dateStr) {
	// console.log("DS", dateStr)
	const date = new Date(dateStr)
	const y = date.getFullYear()
	const m = date.getMonth() + 1
	const d = date.getDate()
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
	// console.log(load_amount)
	// console.log(date)
	let dailySum = getDailySum(custObj, date)
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
				console.error("Maximun 3 transactions per day reached")
				return false
			}
		}
	}
	// console.log('tranx per day verfied')
	return true
}

function createAccount(id, load_amount, date, customerId) {
	// create and add funds
	return {
		[date]: addFunds(id, load_amount, customerId, date)
	}
}
// logs needed
function verifyUnder5000(amount) {
	if(amount > 5000) {
		return false
	}
	return true
}

function verifyAmountWeek() {

}


function addFunds(id, load_amount, customer_id, date) {
	// console.log("add", id, load_amount, customer_id)
	if(verifyUnder5000) {
		console.log('FUNDS ADDED:', load_amount)
		// add funds only
		return {
			id: customer_id,
			tranxId: id,
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


handleAccount("15888", "$400.47", "2000-01-01T00:00:00Z", "528")
handleAccount("15889", "$4500.47", "1999-12-31T09:00:00Z", "528")
handleAccount("15866", "700.47", "2000-01-01T02:00:00Z", "528")

handleAccount("15883", "$447.", "2001-02-01T00:00:00Z", "528")
handleAccount("15866", "$447.", "2001-02-01T04:00:00Z", "528")
handleAccount("1585", "$447.", "2001-02-01T06:00:00Z", "528")
handleAccount("15845", "$500.", "2001-03-01T00:00:00Z", "529")
handleAccount("15864", "$400.47", "2000-01-01T02:00:00Z", "529")
handleAccount("15876", "$400.47", "2000-01-01T01:00:00Z", "529")
console.log('DB', DB)
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
	verifyAmountPerDay: verifyAmountPerDay

}