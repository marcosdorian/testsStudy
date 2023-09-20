// Fibonacci: o próximo número da sequência é sempre a soma dos dois anteriores
// Se o input for 3
// 0,1,1 (sempre começa com 0,1 - o terceiro número foi 0+1)
// Se o input for 5
// 0,1,1,2,3

const { createSandbox } = require('sinon');
const Fibonacci = require('./fibonacci');
const sinon = createSandbox();
const assert = require('assert');

;(async () => {
    {
        // Testing the sequences
        const fibonacci = new Fibonacci();

        // start the process of testing (spy)
        const spy = sinon.spy(
            fibonacci,
            fibonacci.execute.name
        )
        // What is happening in this for:
        // number of sequence: 5
        // [0] input=5, current=0, next=1, result=0
        // [1] input=4, current=1, next=1, result=1
        // [2] input=3, current=1, next=2, result=1
        // [3] input=2, current=2, next=3, result=2
        // [4] input=1, current=3, next=5, result=3
        // [5] input=0, current=5, next=8 => stop process!!!

        for(const sequencia of fibonacci.execute(5)) {}
        // checking if all the 6 steps described above will be followed
        const expectedCallCount = 6
        // if you want to check the whole process:
        assert.strictEqual(spy.callCount, expectedCallCount)
        // console.log(spy, spy.getCalls())

        // if you want to check each part of the process and test it:
        const { args } = spy.getCall(2) // getting the position 2 of the args
        const expectedParams = [3,1,2]
        assert.deepStrictEqual(args, expectedParams)
    }

    {
        // Testing the values
        const fibonacci = new Fibonacci();
        
        // start the process of testing (spy)
        const spy = sinon.spy(
            fibonacci,
            fibonacci.execute.name
        )

        const results = [...fibonacci.execute(5)]
        const expectedResults = [0,1,1,2,3]
       
        assert.deepStrictEqual(results, expectedResults)
    }
})();