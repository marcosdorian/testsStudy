const http = require('http')
const { once } = require ('events')

const DEFAULT_USER = {
    username: 'marcosdorian',
    password: 'teste'
}

const routes = {
    '/contact:get': (request, response) => {
        response.write('Contact our page')

        return response.end()
    },
    
    // to get login info: curl -X POST --data '{"username":"marcosdorian", "password": "teste"}' localhost:3000/login
    '/login:post': async (request, response) => {
        const user = JSON.parse(await once(request, "data"))
        // if the user writes the username with uppercase, it ignores
        const toLower = (text) => text.toLowerCase()
        // console.log('data', data)
        if(
            toLower(user.username) !== toLower(DEFAULT_USER.username) ||
            user.password !== DEFAULT_USER.password
        ) {
            response.writeHead(401)
            response.end("Login failed")

            return
        }

        return response.end('Login succeeded')
    },
    // if a person tries to get an unknown route
    default(request, response) {
        response.writeHead(404)

        return response.end('not found')
    }
}

function handler(request, response) {
    // creating the routes
    // connect the app
    // open a new terminal and try 'curl localhost:3000' to receive the route GET
    // try 'curl -X POST localhost:3000' to receive the route POST and so on
    const { url, method } = request
    // console.log({ url, method })
    const routeKey = `${url.toLowerCase()}:${method.toLowerCase()}`
    // console.log({ routeKey })
    const chosen = routes[routeKey] || routes.default
    // return response.end()
    return chosen(request, response)
}

const app = http.createServer(handler)
.listen(3000, () => console.log('running at 3000'))

module.exports = app