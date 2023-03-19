const express = require('express')
const app = express()
const user = require('./user')
const {MongoClient} = require('mongodb')

const url = 'mongodb://127.0.0.1:27017'
const client = new MongoClient(url)

let db
let collection

async function dataBaseConnection() {
    await client.connect()
    db = client.db('computer-service')
    collection = db.collection('users')
    console.log('DB connection successful')
}

dataBaseConnection()

app.use(express.urlencoded({extended:false}))

app.listen(3000, 'localhost', () => {
    console.log('listening for requests on port 3000')
    console.log('server is online!')
})

app.use(express.static('./'))

app.post('/register.html',async (req, res) => {
    try {
        await collection.insertOne({name: req.body.login, password: req.body.password})
        res.redirect('/login.html')
    } catch (err) {
        console.log('something went wrong')
    }
})

app.post('/login.html', (req, res) => {
    try {
        if(user.findOne({name: req.body.login.toString(), password: req.body.password.toString()})){
            res.redirect('./')
            console.log('login successful')
        }
    } catch (err) {
        console.log(err)
        res.redirect('/login.html')
        console.log('something went wrong')
    }
})