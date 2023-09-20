const { describe, it, before, beforeEach, afterEach } = require('mocha')
const CarService = require('../../src/service/carService')
const { join } = require('path')
const Transaction = require('./../../src/entities/transaction')

/* for BDD we don't use assert
const assert = require('assert') */

// for BDD, we use chai (npm i -D chai)
const { expect } = require('chai')
const sinon = require('sinon')

const carsDatabase = join(__dirname, './../../database', "cars.json")

const mocks = {
    validCar: require('../mocks/valid-car.json'),
    validCarCategory: require('../mocks/valid-carCategory.json'),
    validCustomer: require('../mocks/valid-customer.json')
}

describe('CarService Suite Tests', () => {
    let carService = {}
    let sandbox = {}
    before(() => {
        carService = new CarService({
            cars: carsDatabase
        })
    })

    // it creates a new instance of sinon before each
    beforeEach(() => {
        sandbox = sinon.createSandbox()
    })

    // it will reset the sandbox after each
    afterEach(() => {
        sandbox.restore()
    })

    // first, we should randomly choose a car
    it('should retrieve a random position from an array', () => {
        const data = [0, 1, 2, 3, 4]
        const result = carService.getRandomPositionFromArray(data)

        // it must be lte(less than equal) the numbers of items
        // and gte(greater than equal) the number 0
        expect(result).to.be.lte(data.length).and.be.gte(0)
    })

    it('should choose the first id from carIds in carCategory', () => {
        const carCategory = mocks.validCarCategory
        const carIdIndex = 0

        sandbox.stub(
            carService,
            carService.getRandomPositionFromArray.name
        ).returns(carIdIndex)

        const result = carService.chooseRandomCar(carCategory)
        const expected = carCategory.carIds[carIdIndex]

        // this first expect is to make sure it will be called only once
        expect(carService.getRandomPositionFromArray.calledOnce).to.be.ok
        expect(result).to.be.equal(expected)
    })

    it('given a carCategory it should return an available car', async () => {
        // if you don't indicate the id, it will show you all the cars
        // in results, I indicate the id, so it comes only this car
        // const result = await carService.test("608fad56-2971-4cb5-b207-b8a061061793")
        // console.log('result', result)

        const car = mocks.validCar
        // Object.create creates an instance that cannot change.
        const carCategory = Object.create(mocks.validCarCategory)
        carCategory.carIds = [car.id]

        // create a sandbox so the test does not depend on the database and Internet
        sandbox.stub(
            carService.carRepository,
            carService.carRepository.find.name,
        ).resolves(car)

        // use spy to make sure the function was called like we want it to be
        sandbox.spy(
            carService,
            carService.chooseRandomCar.name,
        )

        const result = await carService.getAvailableCar(carCategory)
        const expected = car

        expect(carService.chooseRandomCar.calledOnce).to.be.ok
        expect(carService.carRepository.find.calledWithExactly(car.id)).to.be.ok
        expect(result).to.be.deep.equal(expected)

    })

    it('given a carCategory, customer and numberOfDays it should calculate the final amount in real', async () => {
        const customer = Object.create(mocks.validCustomer)
        // the age is given in the document
        customer.age = 50

        const carCategory = Object.create(mocks.validCarCategory)
        // the price is given in the document
        carCategory.price = 37.6

        // the number of days is given in the document
        const numberOfDays = 5

        // not to depend on external data - if somebody changes it, the test will calculate correctly
        sandbox.stub(
            carService,
            "taxesBasedOnAge"
        ).get(() => [{ from: 40, to: 50, then: 1.3 }])

        // in the doc it is asked to give the results in R$
        const expected = carService.currencyFormat.format(244.40)
        const result = carService.calculateFinalPrice(
            customer,
            carCategory,
            numberOfDays
        )

        expect(result).to.be.deep.equal(expected)

    })

    it('given a customer and a car category it should return a transaction receipt', async () => {
        const car = mocks.validCar
        // I will give the price and the id, so I have to create an object in order to keep(...)
        // (...) these pieces of info from the other tests
        const carCategory = {
            ...mocks.validCarCategory,
            price: 37.6,
            carIds: [car.id]
        }

        // for this next case, I use Object.create because I just change one object
        const customer = Object.create(mocks.validCustomer)
        customer.age = 20

        const numberOfDays = 5
        // the due date is given in the doc
        const dueDate = "10 de novembro de 2020"

        // do this in order to get the time given in the doc
        const now = new Date(2020, 10, 5)
        sandbox.useFakeTimers(now.getTime())

        // using stub to simulate the date for the test so we do not depend on the database
        sandbox.stub(
            carService.carRepository,
            carService.carRepository.find.name,
        ).resolves(car)

        // calculation: 
        // age: 20, tax: 1.1, categoryPrice: 37.6
        // 37.6 * 1.1 = 41.36 => 41.36 * 5 (number of days) = 206.8
        const expectedAmount = carService.currencyFormat.format(206.8)
        const result = await carService.rent(
            customer, carCategory, numberOfDays
        )
        const expected = new Transaction({
            customer,
            car,
            dueDate,
            amount: expectedAmount,
        })

        expect(result).to.be.deep.equal(expected)

        /* const today = new Date()
        const options = {
            year: "numeric",
            month: "long",
            day: "numeric"
        }

        console.log('today', today.toLocaleDateString("pt-br", options)) */
    })
})

/* OBS: go to file ".nycrc.json" and check that we excluded the repository for the test,
because it does not need to be tested. Once you do it, the test:cov will not consider it as
a missing part */