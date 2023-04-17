const express = require('express')
const app = express()
const jwt = require('jsonwebtoken')
const bodyParser = require('body-parser')
const cors = require('cors')
const { REGULAR_EXPRESSIONS } = require('./constant/regularExpression')
const { MAIN_TOKEN } = require('./constant/mainToken')

const mongoose = require('mongoose')
const users = require('./users')
const carts = require('./carts')
const history = require('./history')
const services = require('./services')

//TODO rewrite to mongo token
//TODO refactor code
//TODO dialog windows
if (typeof localStorage === "undefined" || localStorage === null) {
    const LocalStorage = require('node-localstorage').LocalStorage;
    localStorage = new LocalStorage('./scratch');
}
localStorage.removeItem('Authorization')

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
    jwt.verify(token, MAIN_TOKEN.TOKEN, (err, user) => {
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
            await users.create({name: login, password: password, token: null})
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
            let accessToken = jwt.sign({name: login}, MAIN_TOKEN.TOKEN)
            localStorage.setItem('Authorization', accessToken)
            // await users.findOneAndUpdate({name: login, token: accessToken})
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

app.post('/AddServiceToCart', authenticateToken, async (req, res) => {

    const {
        user,
        body: {serviceID}
    } = req;

    const currentUser = await users.findOne({name: user})
    await carts.create({userID: currentUser['_id'], serviceID: serviceID})
    res.end()
})

app.post('/DeleteService', authenticateToken, async (req, res) => {

    const {
        user,
        body: {serviceID}
    } = req;

    const currentUser = await users.findOne({name: user})
    await carts.deleteOne({userID: currentUser['_id'], serviceID: serviceID})
    res.end()
})

app.post('/ConfirmServices', authenticateToken, async (req, res) => {

    const {
        user,
        body
    } = req;

    let serviceIDs = []
    const currentUser = await users.findOne({name: user})
    let services = await carts.find({userID: currentUser['_id']})

    await carts.deleteMany({userID: currentUser['_id']})

    for(const service of services) {
        serviceIDs.push(service['serviceID'])
    }

    try {
        await history.create({
            date: body.date,
            userID: currentUser['_id'],
            serviceIDs: serviceIDs,
            totalSum: body.totalSum
        })
    } catch (err) {
        console.log(err)
    }
    res.end()
})

app.post('/updateLogin', authenticateToken, async (req, res) => {
    const {
        user,
        body: {
            newLogin,
        }
    } = req;

    await users.findOneAndUpdate({name: user}, {name: newLogin})
    const accessToken = jwt.sign({name: newLogin}, MAIN_TOKEN.TOKEN)
    localStorage.removeItem('Authorization')
    localStorage.setItem('Authorization', accessToken.toString())
    res.end()
})

app.post('/updatePassword', authenticateToken, async (req, res) => {
    const {
        user,
        body: {
            newPassword
        }
    } = req;

    await users.findOneAndUpdate({name: user}, {password: newPassword})
    res.end()
})

app.get('/currentUser', authenticateToken, async (req, res) => {

    const {
        user
    } = req;

    res.end(JSON.stringify(user))
})

app.get('/activeUser', async (req, res) => {

    if(localStorage.getItem('Authorization')) {
        res.end(JSON.stringify(true))
    } else {
        res.end(JSON.stringify(false))
    }
})

app.get('/destroy', authenticateToken, async (req, res) => {

    // const {
    //     user
    // } = req;

    //await users.findOneAndUpdate({name: user, token: ''})
    localStorage.removeItem('Authorization')
    res.end()
})

app.get('/fetchData', async (req, res) => {
    res.end(JSON.stringify(await services.find()))
})

app.get('/fetchCarts', authenticateToken, async (req, res) => {

    const {
        user
    } = req;

    const currentUser = await users.findOne({name: user})
    res.end(JSON.stringify(await carts.find({userID: currentUser['_id']})))
})

app.get('/fetchHistory', authenticateToken, async (req, res) => {
    const {
        user
    } = req;

    let data = []
    let servicesToFetch = []
    const servicesData = await services.find()
    const currentUser = await users.findOne({name: user})
    const historyData = await history.find({userID: currentUser['_id']})

    for (const transaction of historyData) {
        for (const serviceID of transaction['serviceIDs']) {
            for (const serviceData of servicesData) {
                if (serviceData["_id"].equals(serviceID)) {
                    servicesToFetch.push({
                        name: serviceData['name'],
                        description: serviceData['description'],
                    })
                    break
                }
            }
        }
        data.push({
            date: transaction['date'],
            totalSum: transaction['totalSum'],
            services: servicesToFetch
        })
        servicesToFetch = []
    }

    console.log(data)

    res.end(JSON.stringify(data))
})

app.listen(3000, 'localhost', () => {
    console.log('listening for requests on port 3000')
    console.log('server is online!')
})