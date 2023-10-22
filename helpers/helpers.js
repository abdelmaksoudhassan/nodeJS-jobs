const {genSalt,hash} = require('bcryptjs')

const hashPassword = async (text,salts) => {
    const salt  = await genSalt(salts)
    const hashed = await hash(text,salt)
    return hashed
}
const mapError = (e) => {
    const arr = []
    e.errors.forEach(err => {
        arr.push({field: err.path, message: err.message})
    });
    return arr
}

module.exports = {
    hashPassword,
    mapError
}