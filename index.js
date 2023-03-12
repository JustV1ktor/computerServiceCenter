const http = require('http')
const fs = require('fs')

const routes = new Map()

function sendHTML(HTMLPath, res) {
    res.setHeader('Content-Type', 'text/html')
    fs.createReadStream(HTMLPath).pipe(res)
}

routes.set('/',(req, res) => sendHTML('./index.html',res))
routes.set('/priceList',(req, res) => sendHTML('./priceList.html',res))
routes.set('/register',(req, res) => sendHTML('./register.html',res))

const server = http.createServer((req, res) => {
    const handler = routes.get(req.url)
    if(!handler) {
        return sendHTML('./404.html', res)
    }
    handler(req, res)
})

server.listen(3000, 'localhost', () => {
    console.log('listening for requests on port 3000')
    console.log("server is online!")
})