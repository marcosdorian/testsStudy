const { readFile } = require('fs/promises')

class BaseRepository {
    constructor({ file }) {
        this.file = file
    }

    async find(itemId) {
        const content = JSON.parse(await readFile(this.file))

        // if nobody mentions the id, the whole file comes out
        // if somebody mentions the id, only the car related to that id will show
        if (!itemId) return content

        return content.find(({ id }) => id === itemId)
    }
}

module.exports = BaseRepository