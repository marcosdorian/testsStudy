const { describe, it, before, beforeEach, afterEach } = require('mocha')
const CarService = require('./../../src/service/carService')
const { join } = require('path')

/* for BDD we don't use assert
const assert = require('assert') */

// for BDD, we use chai (npm i -D chai)
const { expect } = require('chai')
const sinon = require('sinon')

const carsDatabase = join(__dirname, './../../database', "cars.json")

const mocks = {
    validCar: require('./../mocks/valid-car.json'),
    validCarCategory: require('./../mocks/valid-carCategory.json'),
    validCustomer: require('./../mocks/valid-customer.json')
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
})