const { promisify } = require('util');
const jwt = require('jsonwebtoken');


exports.jwtDecode = async (token) => {
    const decodedResult = promisify(jwt.verify)(token, process.env.JWT_SECRET)
    return decodedResult
}