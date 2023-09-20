const faker = require('faker')
const Car = require('../src/entities/car')
const CarCategory = require('../src/entities/carCategory')
const Customer = require('../src/entities/customer')

const { join } = require('path')
const seederBaseFolder = join(__dirname, "../", "database")

const { writeFile } = require('fs/promises')

const ITEMS_AMOUNT = 2

const carCategory = new CarCategory({
    id: faker.datatype.uuid(),
    name: faker.vehicle.type(),
    carIds: [],
    price: faker.finance.amount(20, 100) // the interval of the prices
})

const cars = []
customers = []

for (let index = 0; index <= ITEMS_AMOUNT; index++) {
    const car = new Car({
        id: faker.datatype.uuid(),
        name: faker.vehicle.model(),
        available: true,
        gasAvailable: true,
        releaseYear: faker.date.past().getFullYear()
    })
    carCategory.carIds.push(car.id)
    cars.push(car)

    const customer = new Customer({
        id: faker.datatype.uuid(),
        name: faker.name.findName(),
        age: faker.datatype.number({ min: 18, max: 50 })
    })
    customers.push(customer)

}

const write = (filename, data) => writeFile(join(seederBaseFolder, filename), JSON.stringify(data))

    ; (async () => {
        await write('cars.json', cars)
        await write('customers.json', customers)
        await write('carCategory.json', [carCategory])

        console.log('cars', cars)
        console.log('customers', customers)
        console.log('carCategory', carCategory)
    })()