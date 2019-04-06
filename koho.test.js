const assert = require('assert')
const mocha = require('mocha')
const customer = require('./koho')

describe("Koho tests", function() {
	describe("addFunds()", function() {
		it('returns an object', function() {
			// let cusmtomer =
			let res = customer.addFunds("1", "500", "200", "2000-01-01T00:00:00Z")
			assert.deepEqual(res, { id: "200", tranxId: '1', loadAmount: '500', readAbleDate: "1999-12-31" })
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
			assert.deepEqual(res, { '2001-03-01T00:00:00Z': { id: "528", tranxId: '15888', loadAmount: '$3318 .47', readAbleDate: "2001-2-28" } })
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
			console.log('res', res)
			assert.deepEqual(res, "1999-12-30")
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
			assert.deepEqual(res, { '1999-12-31': 2, '2001-2-1': 1, '2001-1-31': 2 })
		})
		describe("verifyTranxDay()", function() {
			it("return false when more than 3 per day", function() {
				customer.handleAccount("15888", "$400 .47", "2000-01-01T00:00:00Z", "500")
				customer.handleAccount("15889", "$3318 .47", "1999-12-31T09:00:00Z", "500")
				customer.handleAccount("15876", "$400 .47", "2000-01-01T01:00:00Z", "500")
				let res = customer.handleAccount("15864", "$400 .47", "2000-01-01T02:00:00Z", "500")
				assert(!res)

			})
		})
		describe("getDailySum()", function() {
			it("returns sum of all daily transactions", function() {
				let custObj = {
					'2000-01-01T00:00:00Z': { id: '528', tranxId: '15888', loadAmount: '500.50' },
					'1999-12-31T09:00:00Z': { id: '528', tranxId: '15889', loadAmount: '5' },
					'2001-02-01T00:00:00Z': { id: '528', tranxId: '15883', loadAmount: '0.432' }
				}
				let res = customer.getDailySum(custObj, "1999-12-31T09:00:00Z")
				assert(res === 505.932)
			})
		})
		describe("verifyAmountPerDay()", function() {
			it("returns true if total is under 5000", function() {
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
				console.log('RES', res)
				assert(!res)
			})
			it("should not include new amount in DB", function() {
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
				assert(false)
			})
		})
	})
})