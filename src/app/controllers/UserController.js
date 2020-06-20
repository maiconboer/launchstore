const User = require('../models/User')


module.exports = {
    registerForm(req, res) {
        return res.render('user/register')
    },

    async post(req, res) {

        // check if has all fields
        const keys = Object.keys(req.body)
        for (const key of keys) {
            if(req.body[key] == '') {
                return res.send('Please, fill all fields!')
            }
        }

        // check if user exists [email, cpf_cnpj]
        const { email, cpf_cnpj } = req.body
        const user = await User.findeOne({ 
            where: {email},
            or: { cpf_cnpj }  
        })

        // password match - equals ?
    }
}