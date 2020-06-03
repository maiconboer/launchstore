const db = require('../../config/db')

// all() - returns promise by default
module.exports = {
    all() {
        return db.query(`
        SELECT * FROM categories`)
    }
}