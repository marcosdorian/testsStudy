// I installed mocha to the tests (npm i -D mocha)
// I installed supertest (npm i -D supertest)
// I installed Istanbul (npm i -D nyc): 
  // test:cov (take a look at package.json) will show you parts of the project not tested
  // if you create a file called nycrc.json you see all the missing parts of the test (even in html if you want)
const { describe, it, before, after } = require('mocha')
const supertest = require('supertest')
const assert = require('assert')

describe('API Suite test', () => {
    // to avoid trying to start the app before closing it (avoid error server in use)
    let app
    before((done) => {
        app = require('./api')
        app.once('listening', done)
    })

    after(done => app.close(done))

    // starting the test itself
    describe('/contact:get', () => {
        it('should request the contact route and return HTTP Status 200', async () => {
            const response = await supertest(app)
                .get('/contact')
                .expect(200)

            assert.strictEqual(response.text, 'Contact our page')
        })
    })

    describe('/login:post', () => {
        it('should request login and return HTTP Status 200', async () => {
            const response = await supertest(app)
                .post('/login')
                .send({username: "marcosdorian", password: "teste"})
                .expect(200)

            assert.strictEqual(response.text, "Login succeeded")
        })
    })

    // test to show error for login
    describe('/login:post', () => {
        it('should request login and return HTTP Status 401', async () => {
            const response = await supertest(app)
                .post('/login')
                .send({username: "marcosdorian", password: "test"})
                .expect(401)

            assert.strictEqual(response.text, "Login failed")
        })
    })

    describe('/hi:get', () => {
        it('should request an existing page and return HTTP Status 404', async () => {
            const response = await supertest(app)
                .get('/hi')
                .expect(404)

            assert.strictEqual(response.text, "not found")
        })
    })
})