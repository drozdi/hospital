const express = require('express')
const chalk = require('chalk')
const path = require('path')
const mongoose = require('mongoose')
const cookieParser = require('cookie-parser')
const {
	addStatement,
	getStatements,
	removeStatement,
	updateStatement,
} = require('./statement.controller')
const { loginUser, addUser } = require('./users.controller')
const auth = require('./middlewares/auth')

const port = 3000
const app = express()

app.set('view engine', 'ejs')
app.set('views', 'pages')

app.use(express.static(path.resolve(__dirname, 'public')))
app.use(express.json())
app.use(cookieParser())
app.use(
	express.urlencoded({
		extended: true,
	})
)

app.get('/login', async (req, res) => {
	res.render('login', {
		title: 'Express App',
		error: undefined,
	})
})

app.post('/login', async (req, res) => {
	try {
		const token = await loginUser(req.body.email, req.body.password)
		res.cookie('token', token, { httpOnly: true })

		res.redirect('/')
	} catch (e) {
		res.render('login', {
			title: 'Express App',
			error: e.message,
		})
	}
})

app.get('/logout', (req, res) => {
	res.cookie('token', '', { httpOnly: true })

	res.redirect('/')
})

app.use(auth)

app.get('/', async (req, res) => {
	res.render('index', {
		title: 'Запись к врачу',
		isLogin: !!req.user?.email,
		created: false,
		error: false,
	})
})

app.post('/', async (req, res) => {
	try {
		await addStatement(req.body)
		res.render('index', {
			title: 'Запись к врачу',
			isLogin: !!req.user?.email,
			created: true,
			error: false,
		})
	} catch (e) {
		console.error('Creation error', e)
		res.render('index', {
			title: 'Запись к врачу',
			isLogin: !!req.user?.email,
			created: false,
			error: e.message``,
		})
	}
})

mongoose
	.connect(
		'mongodb+srv://root:123qweASD@cluster0.1eoq6.mongodb.net/hospital?retryWrites=true&w=majority&appName=Cluster0'
	)
	.then(() => {
		app.listen(port, () => {
			console.log(chalk.green(`Server has been started on port ${port}...`))
		})
	})
