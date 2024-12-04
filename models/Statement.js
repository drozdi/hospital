const mongoose = require('mongoose')
const validator = require('validator')

const StatementSchema = mongoose.Schema({
	date: {
		type: Date,
		default: Date.now,
	},
	name: {
		type: String,
		required: true,
	},
	phone: {
		type: String,
		required: true,
		validate: {
			validator: validator.isMobilePhone,
			message: 'Invalid phone',
		},
	},
	description: {
		type: String,
		required: true,
	},
})

const Statement = mongoose.model('Statement', StatementSchema)

module.exports = Statement
