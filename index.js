const express = require('express');
const mysql = require('mysql');
const faker = require('faker');
const ejs = require('ejs');
var bodyParser = require("body-parser");


// express app
const app = express()


app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static(__dirname + "/public"));

// register view engine
app.set('view engine', 'ejs');

const con = mysql.createConnection ({
    host: 'localhost',
    post: 8080,
    user: "root",
    password: "",
    database: "join_us"
});


// connect to MySql

con.connect ( err => {
    if(err) {
        throw err;
    }
    console.log("MySQL Connected")
});


// create database

app.get('/createdatabase', (req, res) => {
    let sql = "CREATE DATABASE join_us";
    con.query(sql, (err) => {
        if (err) throw err;
        res.send("Database created");
        console.log("Database created");
    });
});



// listen for requests

app.listen('8080', () => {
     console.log('Server Started on port 8080')
});



app.get('/', (req, res) => {
    let q = "SELECT COUNT(*) as count FROM users";
    con.query(q, (err, results) => {
        if (err) throw err;
        var count = results[0].count; 
    res.render('home', {count: count});
    })
});



// defining a post route

app.post('/register', (req, res) => {
    var email = req.body.email;
    var person = {
        email: req.body.email
    }
    con.query('INSERT INTO users SET ?', person, (err, result) => {
        if (err) throw err;
        res.redirect("/");
    });
});





// create table

app.get('/createtable', (req, res) => {
    let sql = 'CREATE TABLE users (email VARCHAR(255) PRIMARY KEY, created_at TIMESTAMP DEFAULT NOW())'
    con.query(sql, err => {
        if (err) {
            throw err
        }
        res.send("Users table created")
        console.log(("Users table created"))
    });
});


// insert data

app.get('/users', (req, res) => {
    var data = [];
    for(var i = 0; i < 500; i++){
        data.push([
            faker.internet.email(),
            faker.date.past()
        ]);
    };

    let sql = 'INSERT INTO users (email, created_at) VALUES ?'

    con.query(sql, [data], err => {
        if(err) {
            throw err
        }
        res.send('Users added')
        console.log(("Users inserted"))
    })
})



// app.get("/home", function(req, res) {
//     // Find count of users in db
//     var q = "SELECT COUNT(*) AS count FROM users";
//     con.query(1, function(err, result) {
//         if (err) throw err;
//         res.render('home');
//     });
// });
