const jwt = require('jsonwebtoken')
const { JWT_SECRET } = require('../constants')

/*function auth(req, res, next) {
    const token = req.cookies.token;

    try {
        const verifyResult = jwt.verify(token, JWT_SECRET)

        req.user = {
            email: verifyResult.email
        }

        next();
    } catch (e) {
        res.redirect('/');
    }
}*/

function auth(req, res, next) {
	const token = req.cookies?.token || ''

	try {
		const verifyResult = token ? jwt.verify(token, JWT_SECRET) : null
		if (verifyResult) {
			req.user = {
				email: verifyResult.email,
			}
		}
		next()
	} catch (e) {
		res.cookie('token', '', { httpOnly: true })
	}
}

module.exports = auth
