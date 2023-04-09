const express = require('express')
const app = express()
const jwt = require('jsonwebtoken')
const bodyParser = require('body-parser')
const cors = require('cors')
const { REGULAR_EXPRESSIONS } = require('./constant/regularExpression')

const mongoose = require('mongoose')
const users = require('./users')
const carts = require('./carts')
const history = require('./history')

const mainAccessToken = '485cd0ab287337f3bb4a9589776b437a8c6f118ac8368dea5d51ac436f4adc2ebb19015fc635a7dbc4c9abfb68aae95b429bf66c307976ed2b6bc72a2b10c95c'
const mainRefreshToken = 'd4e4b28ec542aa835038fa7dac2d33e1a798e97b630e76f78338779130f6a5953bb5aaff236da93a7b242fd04808c3d78bf8f3488de23d743bad8cdbcbd4f732'

if (typeof localStorage === "undefined" || localStorage === null) {
    const LocalStorage = require('node-localstorage').LocalStorage;
    localStorage = new LocalStorage('./scratch');
}

async function dataBaseConnection() {
    await mongoose.connect('mongodb://127.0.0.1/computer-service')
    console.log('DB connection successful')
}

dataBaseConnection()

app.use(cors())
app.use(bodyParser.json())
app.use(express.urlencoded({extended:false}))
app.use(express.static('./dist'))

function authenticateToken(req, res, next) {
    const token = localStorage.getItem('Authorization')
    token === null? res.sendStatus(401) :
    jwt.verify(token, mainAccessToken, (err, user) => {
        if (err) {
            res.sendStatus(403)
        } else {
            req.user = user.name
            next()
        }
    })
}

app.post('/register', async (req, res) => {
    try {
        const {
            body: {password, login}
        } = req;

        if (password.length += 8 && REGULAR_EXPRESSIONS.PASSWORD.test(password)) {
            await users.create({name: login, password: password})
            return res.redirect('./login')
        }

        console.log('Your password needs to contain at least one lower, upper case letter, one number, one special letter and length of at least 8 letters!')
        return res.redirect('./register')

    } catch (err) {
        console.log('something went wrong')
        console.log(err)
    }
})

app.post('/login', async (req, res) => {
    try {
        const {
            body: {password, login}
        } = req;

        if (await users.findOne({name: login, password: password})) {
            const accessToken = jwt.sign({name: login}, mainAccessToken)
            localStorage.setItem('Authorization', accessToken.toString())
            res.end()
            console.log('login successful')
        } else {
            console.log('bad login or bad password!')
        }
    } catch (err) {
        console.log('something went wrong')
        console.log(err)
    }
})

// app.post('/priceList.html', async (req, res) => {
//
// })

app.post('/AddServiceToCart', authenticateToken, async (req, res) => {

    const {
        user,
        body: {service}
    } = req;

    const currentUser = await users.findOne({name: user})

    for (const element of service) {
        if (await carts.findOne({userID: currentUser['_id'], service: element})) {
            console.log('you cannot add same service twice!')
        } else {
            await carts.create({userID: currentUser['_id'], service: element})
            console.log('you added a service to cart')
        }
    }
    res.end()
})

app.post('/DeleteService', authenticateToken, async (req, res) => {

    const {
        user,
        body: {service}
    } = req;

    const currentUser = await users.findOne({name: user})

    for (const element of service) {
        if (await carts.findOne({userID: currentUser['_id'], service: element})) {
            await carts.deleteOne({userID: currentUser['_id'], service: element})
            console.log('you deleted a service from cart')
        } else {
            console.log('there is no service to delete!')
        }
    }
    res.end()
})

app.post('/ConfirmServices', authenticateToken, async (req, res) => {

    const {
        user
    } = req;

    const currentUser = await users.findOne({name: user})
    const currentDate = Date.now()
    let services = await carts.find({userID: currentUser['_id']})
    await carts.deleteMany({userID: currentUser['_id']})
    for(const service of services) {
        try {
            await history.create({
                userID: service['userID'],
                service: service['service'],
                date: currentDate
            })
        } catch (err) {
            console.log(err)
        }
    }
    res.end()
})

app.listen(3000, 'localhost', () => {
    console.log('listening for requests on port 3000')
    console.log('server is online!')
})