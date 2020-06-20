const db = require('../../config/db')

// all() - returns promise by default
module.exports = {
    findOne(filters) {
        let query = 'SELECT * FROM users'
    
        Object.keys(filters).map(key => {
            query = `${query}
            ${key}`
        })

        
    }
}