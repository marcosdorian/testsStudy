class Fibonacci {
    * execute(input, current=0, next=1) {
        if(input === 0) {
            return
        }
        
        yield current

        // restart the function but it does not return any value
        yield * this.execute(input -1, next, current + next  )
    }
}

module.exports = Fibonacci
