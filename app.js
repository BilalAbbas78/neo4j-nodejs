var neo4j = require('neo4j-driver');
var express = require('express');
var app = express();
const cors = require('cors');

app.use(cors())
var driver = neo4j.driver(
    'neo4j+s://8940e301.databases.neo4j.io',
    neo4j.auth.basic('neo4j', 'password')
)

app.listen(3000, function(){
    console.log("running");
})

var session = driver.session();

// // Run a Cypher statement, reading the result in a streaming manner as records arrive:
// session
//     .run('match (n) return count(*)')
//     .subscribe({
//         onKeys: keys => {
//             console.log(keys)
//         },
//         // onNext: record => {
//         //     console.log(record.get('name'))
//         // },
//         onCompleted: () => {
//             session.close() // returns a Promise
//         },
//         onError: error => {
//             console.log(error)
//         }
//     })





// // the Promise way, where the complete result is collected before we act on it:
// session
//     .run('MATCH (n) RETURN count(*)', {
//         nameParam: 'James'
//     })
//     .then(result => {
//         result.records.forEach(record => {
//             // console.log(record.get('count(*)').low)
//             countNodes = record.get('count(*)').low
//         })
//     })
//     .catch(error => {
//         console.log(error)
//     })
//     .then(() => session.close())



// It is possible to execute write transactions that will benefit from automatic retries
// on both single instance ('bolt' URI scheme) and Causal Cluster ('neo4j' URI scheme)
var writeTxResultPromise = session.writeTransaction(async txc => {
    // used transaction will be committed automatically, no need for explicit commit/rollback

    var result = await txc.run(
        "MATCH (n) RETURN count(*)"
    )
    // at this point it is possible to either return the result or process it and return the
    // result of processing it is also possible to run more statements in the same transaction
    return result.records.map(record => record.get('count(*)').low)
})

var countNodes = 0

var abc;
var res

// returned Promise can be later consumed like this:
app.get('/abc', (req, res) => {
    a().then((val) => {
        res.json({data: val});
    })
})
async function a(){
    res = await writeTxResultPromise
        .then(namesArray => {
            return namesArray[0];
            // countNodes = namesArray[0]
            // document.getElementById("Text1").value = countNodes;
        })
        .catch(error => {
            console.log(error)
        })
        .finally(() => session.close());
    return res;
}




a().then(function(result){
    abc = result;
});
console.log(abc)

// app.get("/count", function(req,res){
//     session
//         .run('MATCH (n) RETURN count(*)', {
//             nameParam: 'James'
//         })
//         .then(result => {
//             result.records.forEach(record => {
//                 res.send(record.get('count(*)').low)
//             })
//         })
//         .catch(error => {
//             console.log(error)
//         })
//         .then(() => session.close())
//
//
//
// })



