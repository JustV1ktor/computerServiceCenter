const express = require('express')
const app = express()
// const modelUsers = require('./users')
// const modelCarts = require('./carts')
// const modelHistory = require('./history')
const {MongoClient, ObjectId} = require('mongodb')

const url = 'mongodb://127.0.0.1:27017'
const client = new MongoClient(url)

let loginSuccess = false
let db
let users
let carts
let history
let currentUser //token

async function dataBaseConnection() {
    await client.connect()
    db = client.db('computer-service')
    users = db.collection('users')
    carts = db.collection('carts')
    history = db.collection('history')
    console.log('DB connection successful')
}

dataBaseConnection()

app.use(express.urlencoded({extended:false}))

app.use(express.static('./'))

app.post('/register.html',async (req, res) => {
    if((/(?=.*[A-z][/\d/][`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~])/.test(req.body.password) && req.body.password.length === 8)){
        try {
            await users.insertOne({name: req.body.login, password: req.body.password})
            res.redirect('/login.html')
        } catch (err) {
            console.log('something went wrong')
        }
    } else {
        console.log('Your password needs to contain at least one lower, upper case letter, one number, one special letter and length of 8 letters!')
        res.redirect('/register.html')
    }
})

app.post('/login.html', async (req, res) => {
    try {
        if (users.findOne({name: req.body.login, password: req.body.password})) {
            res.redirect('./')
            loginSuccess = true
            currentUser = await users.findOne({name: req.body.login})
            console.log('login successful')
        }
    } catch (err) {
        console.log(err)
        loginSuccess = false
        res.redirect('/login.html')
        console.log('something went wrong')
    }
})

app.post('/priceList.html', async (req, res) => {

})

app.post('/AddServiceToCart', async (req, res) => {
    if (await carts.findOne({userID: currentUser['_id'], service: req.body.service})) {
        console.log(currentUser['_id'] + ": " + req.body.service)
        console.log('you cannot add same service twice!')
        res.redirect('./priceList.html')
    } else {
        console.log(currentUser['_id'] + ": " + req.body.service)
        await carts.insertOne({userID: currentUser['_id'], service: req.body.service})
        console.log('you added a service to cart')
        res.redirect('./priceList.html')
    }
})

app.post('/DeleteService', async (req, res) => {
    if (await carts.findOne({userID: currentUser['_id'], service: req.body.service})) {
        await carts.deleteOne({userID: currentUser['_id'], service: req.body.service})
        console.log('you deleted a service from cart')
        res.redirect('./priceList.html')
    } else {
        console.log('there is no service to delete!')
        res.redirect('./priceList.html')
    }
})


// ------------------ rewrite to mongoose ----------------------------
app.post('/ConfirmServices', async (req, res) => {
    let currentDate = Date.now()
    console.log(client.db('computer-service').collection('carts').find())
    //let services = await modelCarts.find({userID: currentUser['_id']})//for some reason the Collection<Document>.find() function doesn`t work without client.db.collection, then it would call only Int8Array.find()
    console.log(carts, await carts.find({userID: currentUser['_id']}))
    //await carts.deleteMany({userID: currentUser['_id']})
    // for(let service of services) {
    //     await history.insertOne({
    //         userID: service['user_id'],
    //         service: service['service'],
    //         date: currentDate
    //     })
    // }
    //res.redirect('./history.html')
})

app.listen(3000, 'localhost', () => {
    console.log('listening for requests on port 3000')
    console.log('server is online!')
})