const express = require('express')
const app = express()
const jwt = require('jsonwebtoken')
const cookieParser = require('cookie-parser')
const { REGULAR_EXPRESSIONS } = require('./constant/regularExpression')

// const { createApp } = require('vue')
// const App = require('./App.vue')
// const router = require('./router')
// const appVue = createApp(App)
// appVue.use(router)
// appVue.mount('#app')

const mongoose = require('mongoose')
const users = require('./users')
const carts = require('./carts')
const history = require('./history')

const mainAccessToken = '485cd0ab287337f3bb4a9589776b437a8c6f118ac8368dea5d51ac436f4adc2ebb19015fc635a7dbc4c9abfb68aae95b429bf66c307976ed2b6bc72a2b10c95c'
const mainRefreshToken = 'd4e4b28ec542aa835038fa7dac2d33e1a798e97b630e76f78338779130f6a5953bb5aaff236da93a7b242fd04808c3d78bf8f3488de23d743bad8cdbcbd4f732'

async function dataBaseConnection() {
    await mongoose.connect('mongodb://127.0.0.1/computer-service')
    console.log('DB connection successful')
}

dataBaseConnection()

app.use(express.urlencoded({extended:false}))
app.use(cookieParser())
app.use(express.static('./dist'))

function authenticateToken(req, res, next) {
    req.cookies['Authorization'] === null? res.sendStatus(401) :
    jwt.verify(req.cookies['Authorization'], mainAccessToken, (err, user) => {
        if (err) {
            res.sendStatus(403)
        } else {
            req.user = user.name
            next()
        }
    })
}

app.post('/register.html', async (req, res) => {
    try {
        const {
            body: {password, login}
        } = req;

        if ((REGULAR_EXPRESSIONS.PASSWORD.test(password) && password.length === 8)) {
            await users.create({name: login, password: password})
            return res.redirect('/login.html')
        }

        console.log('Your password needs to contain at least one lower, upper case letter, one number, one special letter and length of 8 letters!')
        return res.redirect('/register.html')

    } catch (err) {
        console.log('something went wrong')
    }
})

app.post('/login.html', async (req, res) => {
    try {
        if (users.findOne({name: req.body.login, password: req.body.password})) {
            const accessToken = jwt.sign({name: req.body.login}, mainAccessToken)
            res.cookie('Authorization',accessToken)
            res.redirect('./')
            console.log('login successful')
        }
    } catch (err) {
        res.redirect('/login.html')
        console.log('something went wrong')
    }
})

// app.post('/priceList.html', async (req, res) => {
//
// })

app.post('/AddServiceToCart', authenticateToken, async (req, res) => {
    const currentUser = await users.findOne({name: req.user})
    if (await carts.findOne({userID: currentUser['_id'], service: req.body.service})) {
        console.log('you cannot add same service twice!')
        res.redirect('./priceList.html')
    } else {
        await carts.create({userID: cUser['_id'], service: req.body.service})
        console.log('you added a service to cart')
        res.redirect('./priceList.html')
    }
})

app.post('/DeleteService', authenticateToken, async (req, res) => {
    const currentUser = await users.findOne({name: req.user})
    if (await carts.findOne({userID: currentUser['_id'], service: req.body.service})) {
        await carts.deleteOne({userID: currentUser['_id'], service: req.body.service})
        console.log('you deleted a service from cart')
        res.redirect('./priceList.html')
    } else {
        console.log('there is no service to delete!')
        res.redirect('./priceList.html')
    }
})

app.post('/ConfirmServices', authenticateToken, async (req, res) => {
    const currentUser = await users.findOne({name: req.user})
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
    res.redirect('./index.html')
})

app.listen(3000, 'localhost', () => {
    console.log('listening for requests on port 3000')
    console.log('server is online!')
})