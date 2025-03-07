import { dbService } from '../../services/db.service.js'
import { logger } from '../../services/logger.service.js'

import { ObjectId } from 'mongodb'

export const userService = {
	query,
	getById,
	getByEmail,
	remove,
	update,
	add,
}

async function query(filterBy = {}) {
	const criteria = _buildCriteria(filterBy)
	try {
		const collection = await dbService.getCollection('user')
		var users = await collection.find(criteria).sort({ nickname: -1 }).toArray()
		users = users.map(user => {
			delete user.password
			user.isHappy = true
			user.createdAt = user._id.getTimestamp()
			return user
		})
		return users
	} catch (err) {
		logger.error('cannot find users', err)
		throw err
	}
}

async function getById(userId) {
	try {
		const collection = await dbService.getCollection('user')
		const user = await collection.findOne({ _id: ObjectId.createFromHexString(userId) })
		// const user = await collection.findOne(userId)
		if (user.fullname === 'admin') user.isAdmin = true
		delete user.password
		return user
	} catch (err) {
		logger.error(`while finding user ${userId}`, err)
		throw err
	}
}
async function getByEmail(email) {
	try {
		const collection = await dbService.getCollection('user')
		const user = await collection.findOne({ email })
		return user
	} catch (err) {
		logger.error(`while finding user ${email}`, err)
		throw err
	}
}

async function remove(userId) {
	try {
		const collection = await dbService.getCollection('user')
		await collection.deleteOne({ _id: ObjectId.createFromHexString(userId) })
	} catch (err) {
		logger.error(`cannot remove user ${userId}`, err)
		throw err
	}
}

async function update(user) {
	try {
		// peek only updatable fields!
		const userToSave = {
			_id: ObjectId.createFromHexString(user._id),
			email: user.email,
			fullname: user.fullname,
			cart: user.cart,
			isAdmin: user.isAdmin
		}
		const collection = await dbService.getCollection('user')
		await collection.updateOne({ _id: userToSave._id }, { $set: userToSave })
		return userToSave
	} catch (err) {
		logger.error(`cannot update user ${user._id}`, err)
		throw err
	}
}

async function add(user) {
	try {
		// Validate that there are no such user:
		const existUser = await getByEmail(user.email)
		if (existUser) throw new Error('Email taken')

		// peek only updatable fields!
		const userToAdd = {
			email: user.email,
			password: user.password,
			fullname: user.fullname,
			cart: user.cart
		}
		const collection = await dbService.getCollection('user')
		await collection.insertOne(userToAdd)
		return userToAdd
	} catch (err) {
		logger.error('cannot insert user', err)
		throw err
	}
}

function _buildCriteria(filterBy) {
	const criteria = {}
	if (filterBy.txt) {
		const txtCriteria = { $regex: filterBy.txt, $options: 'i' }
		criteria.$or = [
			{
				email: txtCriteria,
			},
			{
				fullname: txtCriteria,
			},
		]
	}
	if (filterBy.minBalance) {
		criteria.balance = { $gte: filterBy.minBalance }
	}
	return criteria
}
