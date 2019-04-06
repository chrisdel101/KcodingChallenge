const assert = require('assert')
const mocha = require('mocha')
const customer = require('./koho')

describe("Koho tests", function(){
    describe("addFunds", function(){
        it('returns an object', function(){
            // let cusmtomer =
            let res = customer.addFunds("1", "500")
            assert.deepEqual(res,{ tranxId: '1', loadAmount: '500' })
        })
    })
    describe("verifyUnder5000", function(){
        it("returns true if amount is under 5000", function(){
            let res = customer.verifyUnder5000(4000)
            assert(res)
        })
        it('returns false if amount is over 5000', function(){
            let res = customer.verifyUnder5000(5001)
            assert(!res)
        })
    })
    describe("verifyAmountDay", function(){
        it("returns true if amount is under 5000 for day ", function(){
            let res = customer.verifyAmountDay(22)
            assert(res)
        })
    })
    describe("countTranxDay", function(){
        it("returns num of tranx per day ", function(){
            let res = customer.countTranxDay(22)
            assert(res)
        })
    })
    describe("createAccount", function(){
        it("returns a customer acccount obj", function(){
            let res = customer.createAccount("15888","$3318 .47","2000-01-01T00:00:00Z",  "528")
            assert.deepEqual(res,{ '2000-01-01T00:00:00Z': { tranxId: '15888', loadAmount: '$3318 .47' } })
        })
    })
    describe("remove$", function(){
        it("returns string with dollar sign", function(){
            let res = customer.remove$("$1000")
            assert(res === "1000")
        })
    })
    describe("makeDateObj", function(){
        it("returns date parts obj from date string", function(){
            let res = customer.makeDateObj("1999-12-31T03:00:00Z")
            console.log('res', res)
            assert.deepEqual(res, "1999-12-30")
        })
    })
    describe("countTranxDay", function (){
        it("returns object of transactions per day", function(){
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
            let res = customer.countTranxDay(custObj)
            assert.deepEqual(res, { '1999-12-31': 2, '2001-2-1': 1, '2001-1-31': 2 })
        })
        describe("verifyAmountDay", function(){
            it("return false when more than 3 per day", function(){
                customer.handleAccount("15888","$400 .47","2000-01-01T00:00:00Z",  "500" )
                customer.handleAccount("15889","$3318 .47","1999-12-31T09:00:00Z",  "500" )
                customer.handleAccount("15876","$400 .47","2000-01-01T01:00:00Z",  "500" )
                let res = customer.handleAccount("15864","$400 .47","2000-01-01T02:00:00Z",  "500" )
                assert(!res)

            })
        })
    })
})
