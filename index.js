const express = require('express')
const app = express()
const jwt = require('jsonwebtoken')
const bodyParser = require('body-parser')
const cors = require('cors')
const { REGULAR_EXPRESSIONS } = require('./constant/regularExpression')
const { MAIN_TOKEN } = require('./constant/mainToken')

const mongoose = require('mongoose')
const users = require('./models/users')
const carts = require('./models/carts')
const history = require('./models/history')
const services = require('./models/services')
const categories = require('./models/categories')
const roles = require('./models/roles')

async function dataBaseConnection() {
    await mongoose.connect('mongodb://127.0.0.1/computer-service')
    console.log('DB connection successful')
}

dataBaseConnection()

app.use(cors())
app.use(bodyParser.json())
app.use(express.urlencoded({extended:false}))
app.use(express.static('./dist'))

async function authenticateToken(req, res, next) {

    const {
        body: {authorization}
    } = req;

    let token
    const allUsers = await users.find()

    for (const user of allUsers) {
        if (authorization === user.token) {
            token = user.token
        }
    }

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
            body: {password, phone, login}
        } = req;

        const userRole = await roles.findOne({name: "користувач"})

        if (password.length > 7 && REGULAR_EXPRESSIONS.PASSWORD.test(password)) {
            await users.create({name: login, roleID: userRole._id, phone: phone, password: password, token: ''})
            return res.end()
        } else {
            res.sendStatus(403)
        }
    } catch (err) {
        console.log(err)
        res.sendStatus(500)
    }
})

app.post('/login', async (req, res) => {
    try {
        const {
            body: {password, login}
        } = req;

        let value

        if (await users.findOne({name: login, password: password})) {
            let accessToken = jwt.sign({name: login}, MAIN_TOKEN.TOKEN)
            await users.findOneAndUpdate({name: login}, {token: accessToken})

            let currentUser = await users.findOne({name: login})

            const allRoles = await roles.find()
            for (const role of allRoles) {
                if(currentUser['roleID'].equals(role['_id'])) {
                    if(role['name'] === 'супер адміністратор' || role['name'] === 'адміністратор') {
                        value = 'true'
                    } else {
                        value = 'false'
                    }
                }
            }

            return res.end(JSON.stringify({accessToken: accessToken, value: value}))
        }

        res.sendStatus(400)

    } catch (err) {
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

    try {
        const currentUser = await users.findOne({name: user})
        let services = await carts.find({userID: currentUser['_id']})

        await carts.deleteMany({userID: currentUser['_id']})

        for(const service of services) {
            serviceIDs.push(service['serviceID'])
        }

        await history.create({
            date: Date.now(),
            userID: currentUser['_id'],
            serviceIDs: serviceIDs,
            totalSum: body.totalSum,
            status: "очікування"
        })

        res.end()
    } catch (err) {
        res.sendStatus(500)
    }
})

app.post('/updateLogin', authenticateToken, async (req, res) => {
    const {
        user,
        body: {
            newLogin,
        }
    } = req;

    const accessToken = jwt.sign({name: newLogin}, MAIN_TOKEN.TOKEN)
    await users.findOneAndUpdate({name: user}, {name: newLogin, token: accessToken})
    res.end(JSON.stringify(accessToken))
})

app.post('/updatePhone', authenticateToken, async (req, res) => {
    const {
        user,
        body: {
            phone,
        }
    } = req;

    try {
        await users.findOneAndUpdate({name: user}, {phone: phone})
        res.end()
    } catch (err) {
        console.log(err)
        res.sendStatus(500)
    }
})

app.post('/updatePassword', authenticateToken, async (req, res) => {
    const {
        user,
        body: {
            newPassword
        }
    } = req;

    try {
        await users.findOneAndUpdate({name: user}, {password: newPassword})
        res.end()
    } catch (err) {
        res.sendStatus(500)
    }
})

app.post('/fetchUsers', authenticateToken, async (req, res) => {

    const {
        body: {
            page,
        }
    } = req;

    let count
    let pageCount

    count = Math.ceil(await users.countDocuments().exec() / 10)

    if (page <= 0) {
        pageCount = 0
    } else if (page >= count) {
        pageCount = count
    } else {
        pageCount = page
    }

    let data = await users.find().skip(pageCount * 10).limit(10)
    res.end(JSON.stringify({data: data, pageCount: count}))
})

app.post('/fetchAllUsers', authenticateToken, async (req, res) => {
    res.end(JSON.stringify(await users.find()))
})

app.post('/checkName', async (req, res) => {
    const {
        body: {
            login
        }
    } = req;

    if(await users.findOne({name: login}) === null) {
        res.end(JSON.stringify(true))
    } else {
        res.end(JSON.stringify(false))
    }
})

app.post('/checkPhone', async (req, res) => {
    const {
        body: {
            phone
        }
    } = req;

    if(await users.findOne({phone: phone}) === null) {
        res.end(JSON.stringify(true))
    } else {
        res.end(JSON.stringify(false))
    }
})

app.post('/currentUser', authenticateToken, async (req, res) => {

    const {
        user
    } = req;

    const currentUser = await users.findOne({name: user})

    res.end(JSON.stringify(currentUser))
})

app.post('/destroy', authenticateToken, async (req, res) => {

    const {
        user
    } = req;

    await users.findOneAndUpdate({name: user}, {token: ''})
    res.end()
})

app.post('/fetchData', async (req, res) => {

    const {
        body: {
            page,
            fetchCategoryID
        }
    } = req;

    let data = []
    let count = 0
    let filter
    let pageCount

    if (Number(fetchCategoryID) === 0) {
        filter = {}
    } else {
        filter = {categoryID: fetchCategoryID}
    }

    try {

        count = Math.ceil(await services.countDocuments(filter).exec() / 10)

        if (page <= 0) {
            pageCount = 0
        } else if (page >= count) {
            pageCount = count
        } else {
            pageCount = page
        }

        const servicesData = await services.find(filter).skip(pageCount * 10).limit(10)
        const categoriesData = await categories.find()

        for (const service of servicesData) {
            for (const category of categoriesData) {
                if (service["categoryID"].equals(category["_id"])) {
                    data.push({
                        _id: service['_id'],
                        name: service['name'],
                        description: service['description'],
                        price: service['price'],
                        category: category['name'],
                        categoryID: service['categoryID']
                    })
                }
            }
        }
        res.end(JSON.stringify({data: data, pageCount: count}))
    } catch (err) {
        console.log(err)
    }
})

app.get('/fetchAllData', async (req, res) => {
    const servicesData = await services.find()
    const categoriesData = await categories.find()

    const data = []

    for (const service of servicesData) {
        for (const category of categoriesData) {
            if (service['categoryID'].equals(category['_id'])) {
                data.push({
                    _id: service['_id'],
                    name: service['name'],
                    description: service['description'],
                    price: service['price'],
                    category: category['name'],
                    categoryID: service['categoryID']
                })
            }
        }
    }

    res.end(JSON.stringify(data))
})

app.get('/fetchCategories', async (req, res) => {
    res.end(JSON.stringify(await categories.find()))
})

app.post('/updateService', authenticateToken,async (req, res) => {

    const {
        body: {
            serviceID,
            type,
            value
        }
    } = req;

    const data = {}

    switch (type) {
        case 'name': data.name = value
            break
        case 'description': data.description = value
            break
        case 'price': data.price = value
            break
        case 'categoryID': data.categoryID = value
            break
    }

    await services.findOneAndUpdate({_id: serviceID}, data)
    res.end()
})

app.post('/updateStatus', authenticateToken,async (req, res) => {

    const {
        body: {
            historyID,
            value
        }
    } = req;

    await history.findOneAndUpdate({_id: historyID}, {status: value})
    res.end()
})

app.post('/createService', authenticateToken, async (req, res) => {

    const {
        body: {
            name,
            description,
            price,
            categoryID
        }
    } = req;


    await services.create({name: name, categoryID: categoryID, description: description, price: price})
    res.end()
})

app.post('/updateCategory', authenticateToken,async (req, res) => {

    const {
        body: {
            categoryID,
            name
        }
    } = req;

    await categories.findOneAndUpdate({_id: categoryID}, {name: name})
    res.end()
})

app.post('/createCategory', authenticateToken,async (req, res) => {

    const {
        body: {
            name
        }
    } = req;

    await categories.create({name: name})
    res.end()
})

app.post('/updateRole', authenticateToken, async (req, res) => {

    const {
        body: {
            userID,
            roleID
        }
    } = req;

    try {
        await users.findOneAndUpdate({_id: userID}, {roleID: roleID})
        res.end()
    } catch (err) {
        res.sendStatus(500)
    }
})

app.post('/fetchCarts', authenticateToken, async (req, res) => {

    const {
        user
    } = req;

    const currentUser = await users.findOne({name: user})
    res.end(JSON.stringify(await carts.find({userID: currentUser['_id']})))
})

app.post('/fetchRoles', authenticateToken, async (req, res) => {
    res.end(JSON.stringify(await roles.find()))
})

app.post('/fetchHistory', authenticateToken, async (req, res) => {

    const {
        body: {
            page,
            fetchStatus
        }
    } = req;

    let filter
    let pageCount
    let data = []
    let fetchedData = []
    let servicesToFetch = []
    let fetchedServices = []

    const AllCategories = await categories.find()
    const servicesData = await services.find()
    const usersData = await users.find()

    if (Number(fetchStatus) === 0) {
        filter = {}
    } else {
        filter = {status: fetchStatus}
    }

    let count = Math.ceil(await history.countDocuments(filter).exec() / 10)

    if (page <= 0) {
        pageCount = 0
    } else if (page >= count) {
        pageCount = count
    } else {
        pageCount = page
    }

    const historiesData = await history.find(filter).skip(pageCount * 10).limit(10)

    for (const history of historiesData) {
        for (const serviceID of history['serviceIDs']) {
            for (const serviceData of servicesData) {
                if (serviceData["_id"].equals(serviceID)) {
                    servicesToFetch.push({
                        name: serviceData['name'],
                        categoryID: serviceData['categoryID'],
                        description: serviceData['description'],
                    })
                    break
                }
            }
        }
        for (const service of servicesToFetch) {
            for (const category of AllCategories) {
                if (service['categoryID'].equals(category['_id'])) {
                    fetchedServices.push({
                        name: service['name'],
                        category: category['name'],
                        description: service['description'],
                    })
                    break
                }
            }
        }

        data.push({
            _id: history['_id'],
            date: history['date'],
            userID: history['userID'],
            status: history['status'],
            totalSum: history['totalSum'],
            services: fetchedServices
        })
        fetchedServices = []
        servicesToFetch = []
    }

    for (const history of data) {
        for (const user of usersData) {
            if (history['userID'].equals(user['_id'])) {
                fetchedData.push({
                    _id: history['_id'],
                    date: history['date'],
                    userName: user['name'],
                    userPhone: user['phone'],
                    status: history['status'],
                    totalSum: history['totalSum'],
                    services: history['services']
                })
            }
        }
    }

    res.end(JSON.stringify({fetchedData, pageCount: count}))
})

app.post('/getUserRole', authenticateToken, async (req, res) => {
    const {
        user
    } = req;

    const currentUser = await users.findOne({name: user})
    const allRoles = await roles.find()
    for (const role of allRoles) {
        if(currentUser['roleID'].equals(role['_id'])) {
            if(role['name'] === 'супер адміністратор' || role['name'] === 'адміністратор') {
                res.end(JSON.stringify(true))
            } else {
                res.end(JSON.stringify(false))
            }
        }
    }
})

app.post('/fetchCurrentUserHistory', authenticateToken, async (req, res) => {
    const {
        user,
        body: {
            page
        }
    } = req;

    let pageCount

    let data = []
    let servicesToFetch = []
    const servicesData = await services.find()
    const currentUser = await users.findOne({name: user})

    const count = Math.ceil(await history.countDocuments({userID: currentUser['_id']}).exec() / 10)

    if(page <= 0) {
        pageCount = 0
    }else if(page >= count) {
        pageCount = count
    } else {
        pageCount = page
    }

    const historyData = await history.find({userID: currentUser['_id']}).skip(pageCount * 10).limit(10)

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
            status: transaction['status'],
            totalSum: transaction['totalSum'],
            services: servicesToFetch
        })
        servicesToFetch = []
    }
    res.end(JSON.stringify({data: data, pageCount: count}))
})

app.listen(3000, 'localhost', () => {
    console.log('listening for requests on port 3000')
    console.log('server is online!')
})