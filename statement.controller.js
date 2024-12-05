const chalk = require('chalk')
const Statement = require('./models/Statement')

async function addStatement(statementData) {
	await Statement.create(statementData)

	console.log(chalk.bgGreen('Statement was added!'))
}

async function getStatements(filer = {}, sort = {}, page, limit) {
	const totalItems = await Statement.countDocuments(filer)
	const totalPages = Math.ceil(totalItems / limit)

	const offset = (page - 1) * limit
	const statements = await Statement.find(filer)
		.sort(sort)
		.skip(offset)
		.limit(limit)
		.exec()

	return { totalItems, page, totalPages, statements }
}

async function removeStatement(id) {
	const result = await Statement.deleteOne({ _id: id })

	if (result.matchedCount === 0) {
		throw new Error('No statement to delete')
	}

	console.log(chalk.red(`Statement with id="${id}" has been removed.`))
}

async function updateStatement(statementData) {
	const result = await Statement.updateOne(
		{ _id: statementData.id },
		{ title: statementData.title }
	)

	if (result.matchedCount === 0) {
		throw new Error('No statement to edit')
	}

	console.log(
		chalk.bgGreen(`Statement with id="${statementData.id}" has been updated!`)
	)
}

module.exports = {
	addStatement,
	getStatements,
	removeStatement,
	updateStatement,
}
