let DB = {}

function handleAccount (id, load_amount, date, customerId){
        // if not there, create and add
        if(!DB[customerId]){
            DB[customerId] = {
                [date]: addFunds(id, load_amount, date, customerId)
            }
            return true
        } else {
            DB[customerId][date] = addFunds(id, load_amount, date, customerId)
        }
        return false
    }
function addFunds (id, load_amount){
        return  {
            tranxId: id,
            loadAmount: load_amount
        }

    }


// console.log(extractDate("2000-01-01T00:00:00Z"))
// handleAccount("15888","$3318 .47","2000-01-01T00:00:00Z",  "528" )
// handleAccount("15887","447","2001-02-01T00:00:00Z",  "528" )
console.log(DB)
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
    addFunds: addFunds
}
