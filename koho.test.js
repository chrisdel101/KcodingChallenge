const assert = require('assert')
const mocha = require('mocha')
const customer = require('./koho')
const fs = require('fs')
const readline = require('readline')


describe("Koho run full program test", function() {
	it("should return 999 pass and 0 fail", function(done) {
		// /https://stackoverflow.com/a/49713276/5972531
		let input = []
		let output = []
		convertToJson('input.txt')
			.then(res => {
				res.forEach(obj => input.push(obj))
			})
			.catch(err => console.error(err));
		convertToJson('output.txt')
			.then(res => {
				res.forEach(obj => output.push(obj))
			})
			.catch(err => console.error(err))
		setTimeout(function() {
			let res = runTestData(input, output)
			assert(res.correct === 999)
			assert(res.incorrect === 0)
			done()
		}, 100)
	})
})

describe("Koho unit tests", function() {
	describe("addFunds()", function() {
		it('returns an object', function() {
			let res = customer.addFunds("1", "500", "200", "2000-01-01T00:00:00Z")
			assert.deepEqual(res, {
				id: '200',
				tranxId: '1',
				loadAmount: '500',
				readAbleDate: '2000-1-1'
			})
		})
	})
	describe("verifyUnder5000()", function() {
		it("returns true if amount is under 5000", function() {
			let res = customer.verifyUnder5000(4000)
			assert(res)
		})
		it('returns false if amount is over 5000', function() {
			let res = customer.verifyUnder5000(5001)
			assert(!res)
		})
	})
	describe("createAccount()", function() {
		it("returns a customer acccount obj", function() {
			let res = customer.createAccount("15888", "$3318 .47", "2001-03-01T00:00:00Z", "528", )
			assert.deepEqual(res, { '2001-03-01T00:00:00Z': { id: "528", tranxId: '15888', loadAmount: '$3318 .47', readAbleDate: "2001-3-1" } })
		})
	})
	describe("remove$()", function() {
		it("returns string with dollar sign", function() {
			let res = customer.remove$("$1000")
			assert(res === "1000")
		})
	})
	describe("makeDateObj()", function() {
		it("returns date parts obj from date string", function() {
			let res = customer.makeDateObj("1999-12-31T03:00:00Z")
			assert.deepEqual(res, "1999-12-31")
		})
	})
	describe("getTranxDay()", function() {
		it("returns object of transactions per day", function() {
			let date1 = "2000-01-01T00:00:00Z"
			let sameDate1 = "1999-12-31T09:00:00Z"
			let date2 = "2001-02-01T06:00:00Z"
			let date3 = "2001-02-01T04:00:00Z"
			let sameDate3 = "2001-02-01T00:00:00Z"
			let custObj = {
				[date1]: { tranxId: '15888', loadAmount: '400 .47' },
				[sameDate1]: { tranxId: '15889', loadAmount: '3318 .47' },
				[date2]: { tranxId: '15883', loadAmount: '447' },
				[date3]: { tranxId: '15866', loadAmount: '447' },
				[sameDate3]: { tranxId: '1585', loadAmount: '447' }
			}
			let res = customer.getTranxDay(custObj)
			assert.deepEqual(res, { "1999-12-31": 1, '2000-1-1': 1, '2001-2-1': 3 })
		})
		describe("verifyTranxDay()", function() {
			it("return false when more than 3 per day", function() {
				// customer.mainTranasction("15888", "$400 .47", "2000-01-01T00:00:00Z", "500")
				// customer.mainTranasction("15889", "$3318 .47", "2000-01-01T01:00:00Z", "500")
				// customer.mainTranasction("15876", "$400 .47", "2000-01-01T01:00:00Z", "500")
				customer.mainTranasction("15876", "$400 .47", "2000-01-01T01:00:00Z", "500")
				let res = customer.mainTranasction("15864", "$400 .47", "2000-01-01T00:00:00Z", "500")
				assert(!res)

			})
		})
		describe("getDailySum()", function() {
			//need to find 3 tranx in same day
			it.skip("returns sum of all daily transactions", function() {
				let custObj = {
					'2000-01-01T00:00:00Z': { id: '528', tranxId: '15888', loadAmount: '500.50' },
					'1999-12-31T09:00:00Z': { id: '528', tranxId: '15889', loadAmount: '5' },
					'2001-02-01T00:00:00Z': { id: '528', tranxId: '15883', loadAmount: '0.432' }
				}
				let res = customer.getDailySum(custObj, "1999-12-31T09:00:00Z")
				assert(res)
			})
		})
		describe("verifyAmountPerDay()", function() {
			// need to find false ex
			it.skip("returns true if total is under 5000", function() {
				let custObj = {
					'2000-01-01T00:00:00Z': {
						id: '528',
						tranxId: '15888',
						loadAmount: '400.47',
						readAbleDate: '1999-12-31'
					},
					'1999-12-31T09:00:00Z': {
						id: '528',
						tranxId: '15889',
						loadAmount: '4500.47',
						readAbleDate: '1999-12-31'
					}
				}
				let res = customer.verifyAmountPerDay(custObj, "2000-01-01T00:00:00Z", customer.remove$("$700"))
				assert(!res)
			})
			it("returns true if total is under 5000", function() {
				let custObj = {
					'2000-01-01T05:06:50Z': {
						id: '409',
						tranxId: '3211',
						loadAmount: '314.45',
						readAbleDate: '2000-1-1'
					},
					'2000-01-04T22:05:44Z': {
						id: '409',
						tranxId: '25293',
						loadAmount: '216.06',
						readAbleDate: '2000-1-4'
					},
					'2000-01-06T18:04:30Z': {
						id: '409',
						tranxId: '31420',
						loadAmount: '1820.44',
						readAbleDate: '2000-1-6'
					},
					'2000-01-07T16:34:34Z': {
						id: '409',
						tranxId: '16401',
						loadAmount: '2781.40',
						readAbleDate: '2000-1-7'
					},
					'2000-01-09T20:44:16Z': {
						id: '409',
						tranxId: '25099',
						loadAmount: '3605.73',
						readAbleDate: '2000-1-9'
					},
					'2000-01-14T08:07:46Z': {
						id: '409',
						tranxId: '11521',
						loadAmount: '3750.73',
						readAbleDate: '2000-1-14'
					},
					'2000-01-15T01:31:00Z': {
						id: '409',
						tranxId: '9011',
						loadAmount: '2495.33',
						readAbleDate: '2000-1-15'
					},
					'2000-01-20T07:19:06Z': {
						id: '409',
						tranxId: '26529',
						loadAmount: '4023.36',
						readAbleDate: '2000-1-20'
					},
					'2000-01-24T16:39:52Z': {
						id: '409',
						tranxId: '5538',
						loadAmount: '1400.95',
						readAbleDate: '2000-1-24'
					},
					'2000-01-27T14:12:48Z': {
						id: '409',
						tranxId: '6345',
						loadAmount: '2433.49',
						readAbleDate: '2000-1-27'
					},
					'2000-01-29T09:10:12Z': {
						id: '409',
						tranxId: '10118',
						loadAmount: '168.01',
						readAbleDate: '2000-1-29'
					},
					'2000-01-29T10:11:34Z': {
						id: '409',
						tranxId: '10989',
						loadAmount: '4783.20',
						readAbleDate: '2000-1-29'
					},
					'2000-01-30T12:47:06Z': {
						id: '409',
						tranxId: '22379',
						loadAmount: '698.61',
						readAbleDate: '2000-1-30'
					}
				}
				let res = customer.verifyAmountPerDay(custObj, "2000-01-30T16:52:34Z", customer.remove$("$189.32"))
				assert(res)
			})
			describe("isSameWeek()", function() {
				it("returns true when in the same week", function() {
					let res = customer.isSameWeek("2019-04-06T22:24:18.401Z", "2019-04-05T00:18:40Z")
					assert(res)
				})
				it("returns something", function() {
					let res = customer.isSameWeek("2000-01-01T00:00:00Z", "2000-01-01T11:15:02Z")
					assert(res)
				})
			})
			describe("getWeeklySum()", function() {
				it("returns sum of same week days", function() {
					let custObj = {
						'2000-01-01T00:00:00Z': {
							id: '528',
							tranxId: '15888',
							loadAmount: '400.47',
							readAbleDate: '1999-12-31'
						},
						'1999-12-31T09:00:00Z': {
							id: '528',
							tranxId: '15889',
							loadAmount: '4500.47',
							readAbleDate: '1999-12-31'
						},
						'1999-12-30T00:00:00Z': {
							id: '528',
							tranxId: '15883',
							loadAmount: '447.',
							readAbleDate: '2001-1-31'
						}
					}
					let res = customer.getWeeklySum(custObj, "2000-01-03T00:00:00Z", "$3000")
					assert(res === 5347.9400000000005)
				})
			})
			describe("verifyAmountWeek()", function() {
				it("returns true is under 20000", function() {
					let custObj = {
						'2000-01-01T00:00:00Z': {
							id: '528',
							tranxId: '15888',
							loadAmount: '700',
							readAbleDate: '1999-12-31'
						},
						'1999-12-31T09:00:00Z': {
							id: '528',
							tranxId: '15889',
							loadAmount: '4500.47',
							readAbleDate: '1999-12-31'
						},
						'1999-12-30T00:00:00Z': {
							id: '528',
							tranxId: '15883',
							loadAmount: '15000',
							readAbleDate: '2001-1-31'
						}
					}
					let res = customer.verifyAmountWeek(custObj, "2000-01-03T00:00:00Z", "$3000")
					assert(!res)
				})
			})

		})
	})
})


function convertToJson(file) {
	return new Promise((resolve, reject) => {
		const stream = fs.createReadStream(file)
		// Handle stream error (IE: file not
		const reader = readline.createInterface({
			input: stream
		})
		const array = []
		reader.on('line', line => {
			array.push(JSON.parse(line));
		});
		reader.on('close', () => resolve(array));
	})
}

function runTestData(input, output) {
	let countRight = 0
	let countWrong = 0
	input.forEach((obj, i) => {
		let res = customer.mainTranasction(obj.id, obj.load_amount, obj.time, obj.customer_id)
		// console.log(res)
		if(output[i] && res.accepted === output[i].accepted) {
			countRight++
		} else {
			countWrong++
		}
	})
	console.log(countRight, countWrong)
	return {
		correct: countRight,
		incorrect: countWrong
	}
}