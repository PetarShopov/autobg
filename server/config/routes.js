const auth = require('./auth')
const mongoose = require('mongoose')
const Car = mongoose.model('Car')
const User = mongoose.model('User')
const errorHandler = require('../utilities/error-handler')
const passport = require('passport')

module.exports = (app) => {
	app.get('/', (req, res) => {
		User
			.find({})
			.then(users => {
				Car
					.find({})
					.then(cars => {
						res.status(200).json({
							cars: cars.length,
							users: users.length
						})
					})
					.catch(err => {
						let message = errorHandler.handleMongooseError(err)
						return res.status(200).json({
							success: false,
							message: message
						})
					})
			})
			.catch(err => {
				let message = errorHandler.handleMongooseError(err)
				return res.status(200).json({
					success: false,
					message: message
				})
			})
	})

	app.post('/cars/add', (req, res) => {
		let carReq = req.body;

		Car.create({
			make: carReq.make || 'No Make',
			model: carReq.model || 'No Model',
			year: carReq.year || 'No Year',
			engine: carReq.engine || 'No Engine',
			price: carReq.price || 'No Price',
			image: carReq.image || 'No Image',
			createdOn: +Date.now(),
			createdBy: carReq.createdBy || 'No Created By',
			likes: carReq.likes || [],
			reviews: carReq.reviews || [],
			timestamp: +Date.now()
		})
			.then(car => {
				res.status(200).json({
					success: true,
					message: 'Car added successfully.',
					car
				})
			})
			.catch(err => {
				let message = errorHandler.handleMongooseError(err)
				return res.status(200).json({
					success: false,
					message: message
				})
			})
	})

	app.get('/cars/all', (req, res) => {
		const page = parseInt(req.query.page) || 1
		const searchText = req.query.search || ''
		const pageSize = 6

		let startIndex = (page - 1) * pageSize
		let endIndex = startIndex + pageSize

		Car.find({})
			.then(cars => {
				if (searchText) {
					cars = cars.filter(function(item) {
						return item.make.includes(searchText)
					})
				}
				cars = cars.slice(startIndex, endIndex)
				res.status(200).json({ cars })
			})
			.catch(err => {
				let message = errorHandler.handleMongooseError(err)
				return res.status(200).json({
					success: false,
					message: message
				})
			})
	})

	app.get('/cars/:id', (req, res) => {
		const id = req.params.id

		Car.findById(id)
			.then(car => {
				res.status(200).json(car)
			})
			.catch(err => {
				let message = errorHandler.handleMongooseError(err)
				return res.status(200).json({
					success: false,
					message: message
				})
			})
	})

	app.post('/cars/like', (req, res) => {
		const id = req.body.id
		const user = req.body.user

		Car.findById(id)
			.then(car => {
				if (!(car.likes.indexOf(user) >= 0)) {
					car.likes.push(user)
					car.save(function (err) {
						if (err) {
							let message = errorHandler.handleMongooseError(err)
							return res.status(200).json({
								success: false,
								message: message
							})
						}
						res.status(200).json({
							success: true,
							message: "Car was liked!",
							car
						})
					})
				} else {
					res.status(200).json({
						success: true,
						message: "Car was already liked by this user!"
					})
				}
			})
			.catch(err => {
				let message = errorHandler.handleMongooseError(err)
				return res.status(200).json({
					success: false,
					message: message
				})
			})
	})

	app.post('/cars/review', (req, res) => {
		const id = req.body.id
		const user = req.body.user
		let rating = req.body.review.rating
		const comment = req.body.review.comment
		if (rating) {
			rating = parseInt(rating)
		}
		if (!rating || rating < 1 || rating > 5) {
			return res.status(200).json({
				success: false,
				message: 'Rating must be between 1 and 5.'
			})
		}
		var review = {
			rating,
			comment,
			user,
			createdOn: new Date()
		}

		Car.findById(id)
			.then(car => {
				car.reviews.push(JSON.stringify(review))

				car.save(function (err) {
					if (err) {
						let message = errorHandler.handleMongooseError(err)
						return res.status(200).json({
							success: false,
							message: message
						})
					}
					res.status(200).json({
						success: true,
						message: "Review was added!",
						car,
						review
					})
				})
			})
			.catch(err => {
				let message = errorHandler.handleMongooseError(err)
				return res.status(200).json({
					success: false,
					message: message
				})
			})
	})

	app.get('/cars/review/:id', (req, res) => {
		const id = req.params.id

		Car.findById(id)
			.then(car => {
				let reviews = car.reviews
					.sort((a, b) => b.createdOn - a.createdOn)
					.slice(0)

				res.status(200).json(reviews)
			})
			.catch(err => {
				let message = errorHandler.handleMongooseError(err)
				return res.status(200).json({
					success: false,
					message: message
				})
			})
	})

	app.post('/cars/edit', (req, res) => {
		let recipeReq = req.body;

		Recipe.update(
			{ _id: recipeReq._id },
			{
				make: carReq.make || 'No Make',
				model: carReq.model || 'No Model',
				year: carReq.year || 'No Year',
				engine: carReq.engine || 'No Engine',
				price: carReq.price || 'No Price',
				image: carReq.image || 'No Image',
				createdOn: +Date.now(),
				createdBy: carReq.createdBy || 'No Created By',
				likes: carReq.likes || ['No Likes'],
				reviews: carReq.reviews || ['No Reviews'],
				timestamp: +Date.now()
			}
		).then(recipe => {
			res.status(200).json(recipe)
		})
			.catch(err => {
				let message = errorHandler.handleMongooseError(err)
				return res.status(200).json({
					success: false,
					message: message
				})
			})
	})

	app.post('/cars/delete/:id', (req, res) => {
		const id = req.params.id

		Car.findByIdAndRemove(id)
			.then(output => {
				res.status(200).json({
					success: true,
					message: 'Car was deleted successfully.',
					result: output
				})
			})
			.catch(err => {
				let message = errorHandler.handleMongooseError(err)
				return res.status(200).json({
					success: false,
					message: message
				})
			})
	})

	app.post('/users/register', (req, res) => {
		return passport.authenticate('local-signup', (err) => {
			if (err) {
				return res.status(200).json({
					success: false,
					message: err
				})
			}

			return res.status(200).json({
				success: true,
				message: 'You have successfully signed up! Now you should be able to log in.'
			})
		})(req, res)
	})

	app.post('/users/login', (req, res) => {
		return passport.authenticate('local-login', (err, token, userData) => {
			if (err) {
				if (err.name === 'IncorrectCredentialsError') {
					return res.status(200).json({
						success: false,
						message: err.message
					})
				}

				return res.status(200).json({
					success: false,
					message: err.message
				})
			}

			return res.json({
				success: true,
				message: 'You have successfully logged in!',
				token,
				user: userData
			})
		})(req, res)
	})

	app.get('/mine/:id', (req, res) => {
		const user = req.params.id

		Car.find({ createdBy: user })
			.then(cars => {
				res.status(200).json({ cars })
			})
			.catch(err => {
				let message = errorHandler.handleMongooseError(err)
				return res.status(200).json({
					success: false,
					message: message
				})
			})
	})

	app.all('*', (req, res) => {
		res.status(404)
		res.send('404 Not Found!')
		res.end()
	})
}
