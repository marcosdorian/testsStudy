class Tax {
    static get taxesBasedOnAge() {
        return [
            // the taxes change based on the range of ages
            { from: 18, to: 25, then: 1.1 },
            { from: 26, to: 30, then: 1.5 },
            { from: 31, to: 100, then: 1.3 },
        ]
    }
}

module.exports = Tax