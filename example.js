const db = require("./db")

const example = module.exports = {

    persons: [{
        "_id": db.ObjectId("618be4ba6b0df02e94319c15"),
        "firstName": "Mariusz",
        "lastName": "Jarocki",
        "year": 1969
    }, {
        "_id": db.ObjectId("618beab56b0df02e94319c18"),
        "firstName": "Jim",
        "lastName": "Beam",
        "year": 1684
    }, {
        "_id": db.ObjectId("618bed4bdad4eb43c178c7b4"),
        "firstName": "Jack",
        "lastName": "Daniels",
        "year": 1886
    }, {
        "_id": db.ObjectId("618bf16ee555e5a3ecddb0f9"),
        "firstName": "Aleksander",
        "lastName": "Wielki",
        "year": -320
    }],
 
    initializePersons: function() {
        db.persons.count(function(err, n) {
            if(n == 0) {
                console.log('No persons, example data will be used')
                example.persons.forEach(function(person) {
                    db.persons.insertOne(person, function(err, result) {})    
                    console.log('db.persons.insertOne(' + JSON.stringify(person) + ')')
                })
            }
        })
    }
}