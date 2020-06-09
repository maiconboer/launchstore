const { formatPrice, date } = require('../../lib/utils')

const Product = require('../models/Product')
const File = require('../models/File')


module.exports = {
    async index(req, res) {
        let results = await Product.all()
        const products = results.rows

        if(!products) return res.send('Products not found!')
        
        async function getImage(productId) {
            let results = await Product.files(product.id)
            const files = results.rows.map(file => 
                `${req.protocol}://${req.headers.host}${file.path.replace('public', '')}`)
    
            return files[0]
        }

        const productsPromise = products.map(product => {
            product.img = await getImage(product)
            product.old_price = formatPrice(product.old_price)
            product.price = formatPrice(product.price)
        })
    }
}  