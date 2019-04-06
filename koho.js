let DB = {}
function handleAccount (id, load_amount, date, customerId){
        // if not there, create and add
        if(!DB[customerId]){
            DB[customerId] = createAccount(id, remove$(load_amount), date, customerId)
            return true
        } else { // just add funds
            // if 3 transactions break
            if(!verifyAmountDay(DB[customerId], date)) return false
            // console.log(verifyAmountDay(DB[customerId], date))
            countTranxDay(DB[customerId])
            DB[customerId][date] = addFunds(id, remove$(load_amount), date, customerId)
            return true
        }
        return false
}
// takes date and returns a easy to read string
function makeDateObj(dateStr){
    const date = new Date(dateStr)
    const y = date.getFullYear()
    const m = date.getMonth() + 1
    const d = date.getDate()
    let tranxKey = `${y}-${m}-${d}`
    return tranxKey
}
// takes a customer obj returns all tranx per day
function countTranxDay(custObj){
    let tranxDay = {}
    // once object is made go through and count transactions
    Object.keys(custObj).forEach(dateKey => {
        let tranxKey = makeDateObj(dateKey)
        // console.log('traxKEY', tranxKey)
        // console.log('dateKey', dateKey)
            if(!tranxDay[tranxKey]){
                tranxDay[tranxKey] = 1
                // console.log('above')
                // console.log('tran', tranxDay)
            } else {
                tranxDay[tranxKey]++
            }
    })
    // console.log('done', tranxDay)
    return tranxDay
}
// takes in customerObj from DB and date of current tranx
function verifyAmountDay(custID, date){
    // console.log(custID)
    let newDate = makeDateObj(date)
    let tranxPerDay = countTranxDay(custID)
    console.log('trans', tranxPerDay)
// https://stackoverflow.com/questions/52528760/javascript-function-returns-true-when-it-should-return-false
    for(var tranxDate of Object.keys(tranxPerDay)){
        // check current date against all customer transactions
        // console.log('currentDate', newDate)
        // console.log('tranxDate', tranxDate)
        if(newDate === tranxDate){
            // console.log('amount', tranxPerDay[tranxDate])
            if(parseInt(tranxPerDay[tranxDate]) >= 3){
                console.error("Maximun 3 transactions per day reached")
                return false
            }
        }
    }
    return true
}
function createAccount(id, load_amount, date, customerId){
    // create and add funds
    return {
        [date]: addFunds(id, load_amount, date, customerId)
    }
}
function verifyUnder5000(amount){
    if(amount > 5000){
        return false
    }
    return true
}
function verifyAmountWeek(){

}
function verifyTranxDay(custId){

}

function addFunds (id, load_amount){
    if(verifyUnder5000){
        // add funds only
        return  {
            tranxId: id,
            loadAmount: load_amount
        }
    } else if(!verifyUnder5000){
        console.error("$5000 max reached for the day")
        return
    }
}
function remove$(str){
    if(str.startsWith("$")){
        str = str.split("")
        str.shift()
        str = str.join("")
        return str
    } else {
        return str
    }
}


// console.log(createAccount("15888","$3318 .47","2000-01-01T00:00:00Z",  "528"))
// handleAccount("15888","$400 .47","2000-01-01T00:00:00Z",  "528" )
// handleAccount("15889","$3318 .47","1999-12-31T09:00:00Z",  "528" )
// handleAccount("15883","$447","2001-02-01T00:00:00Z",  "528" )
// handleAccount("15866","$447","2001-02-01T04:00:00Z",  "528" )
// handleAccount("1585","$447","2001-02-01T06:00:00Z",  "528" )
// handleAccount("15845","$500","2001-03-01T00:00:00Z",  "528" )
// handleAccount("15876","$400 .47","2000-01-01T01:00:00Z",  "528" )
// handleAccount("15864","$400 .47","2000-01-01T02:00:00Z",  "528" )
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
    verifyAmountDay: verifyAmountDay,
    verifyAmountWeek: verifyAmountWeek,
    verifyTranxDay:verifyTranxDay,
    countTranxDay: countTranxDay,
    createAccount: createAccount,
    remove$:remove$,
    makeDateObj: makeDateObj

}
