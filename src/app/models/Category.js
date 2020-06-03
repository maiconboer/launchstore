const db = require('../../config/db')

// all() já retorna uma new Promise por padrão
module.exports = {
    all() {
        return db.query(`
        SELECT * FROM categories`)
    }
}