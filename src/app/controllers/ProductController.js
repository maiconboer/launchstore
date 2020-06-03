const { formatPrice } = require('../../lib/utils')
const Category = require('../models/Category')
const Product = require('../models/Product')
const File = require('../models/File')


module.exports = {
    async create(req, res) {
        // get categories - available on the front
        try {
            let results = await Category.all()
            let categories = results.rows
            return res.render('products/create.njk', { categories })
        }
         catch (error) {
            throw new Error(error)
        }
    },
    async post(req, res) {
        // product save logic
        const keys = Object.keys(req.body)
        for (const key of keys) {
            if(req.body[key] == '') {
                return res.send('Please, fill all fields!')
            }
        }

        // files - referring to photos
        if(req.files.length == 0) {
            return res.send('Please, send at least one image')
        }

        let results = await Product.create(req.body)
        const productId = results.rows[0].id
        
        // creating array of promises
        const filesPromise = req.files.map(file => File.create({...file, product_id: productId }))

        await Promise.all(filesPromise)
        return res.redirect(`products/${productId}`)
    },
    async edit(req, res) {
        try {

        let results = await Product.find(req.params.id)
        const product = results.rows[0]
        
        if(!product) return res.send('Product not found!')

        product.old_price = formatPrice(product.old_price)    
        product.price = formatPrice(product.price)    

        // get categories
        results = await Category.all()
        const categories = results.rows

        // get images
        results = await Product.files(product.id)
        let files = results.rows

        // creating the correct (url) for images [array of images]
        files = files.map(file => ({
            ...file,
            src: `${req.protocol}://${req.headers.host}${file.path.replace('public', '')}`
        }))

        return res.render(`products/edit.njk`, { product, categories, files })
              
        } catch (error) {
            throw new Error(error)
        }
    },
    async put(req, res) {
        const keys = Object.keys(req.body)
        for (const key of keys) {
            if(req.body[key] == '' && key != 'removed_files') {
                return res.send('Please, fill all fields!')
            }
        }

        if(req.files.length != 0) {
            const newFilesPromise = req.files.map(file => File.create({...file, product_id: req.body.id}))

            await Promise.all(newFilesPromise)
        }

        // removing photos from the database, time of editing
        if(req.body.removed_files) {
            const removedFiles = req.body.removed_files.split(',')
            const lastIndex = removedFiles.length - 1
            removedFiles.splice(lastIndex, 1)

            const removedFilesPromise = removedFiles.map(id => File.delete(id))

            await Promise.all(removedFilesPromise)
        }

        req.body.price = req.body.price.replace(/\D/g, "")

        if(req.body.old_price != req.body.price) {
            const oldProduct = await Product.find(req.body.id)
            req.body.old_price = oldProduct.rows[0].price
        }

        await Product.update(req.body)
        return res.redirect(`/products/${req.body.id}/edit`)
    }
}
