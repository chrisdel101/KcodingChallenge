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
})
