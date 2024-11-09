import { ObjectId } from 'mongodb'

import { dbService } from '../../services/db.service.js'
import { logger } from '../../services/logger.service.js'
import { utilService } from '../../services/util.service.js'

export const shopService = {
   remove,
   query,
   getById,
   add,
   update,
   addShopMsg,
   removeShopMsg,
}

async function query(filterBy = { txt: '' }) {
   try {
      const criteria = {
         name: { $regex: filterBy.txt, $options: 'i' },
      }

      const sortBy = filterBy.sortBy === 'name' ? 'name' : 'price'
      const sortObj = { [sortBy]: filterBy.sortDir }

      const collection = await dbService.getCollection('shop')
      var shops = await collection.find(criteria).sort(sortObj).toArray()
      return shops
   } catch (err) {
      logger.error('cannot find shops', err)
      throw err
   }
}

async function getById(shopId) {
   try {
      const collection = await dbService.getCollection('shop')
      const shop = await collection.findOne({
         _id: ObjectId.createFromHexString(shopId),
      })
      shop.createdAt = shop._id.getTimestamp()
      return shop
   } catch (err) {
      logger.error(`while finding shop ${shopId}`, err)
      throw err
   }
}

async function remove(shopId) {
   try {
      const collection = await dbService.getCollection('shop')
      const { deletedCount } = await collection.deleteOne({
         _id: ObjectId.createFromHexString(shopId),
      })
      return deletedCount
   } catch (err) {
      logger.error(`cannot remove shop ${shopId}`, err)
      throw err
   }
}

async function add(shop) {
   try {
      const collection = await dbService.getCollection('shop')
      await collection.insertOne(shop)
      return shop
   } catch (err) {
      logger.error('cannot insert shop', err)
      throw err
   }
}

async function update(shop) {
   try {
      const shopToSave = {
         _id: ObjectId.createFromHexString(shop._id),
         name: shop.name,
         price: shop.price,
         reviews: shop.reviews,
      }
      const collection = await dbService.getCollection('shop')
      await collection.updateOne(
         { _id: ObjectId.createFromHexString(shop._id) },
         { $set: shopToSave }
      )
      return shop
   } catch (err) {
      logger.error(`cannot update shop ${shop._id}`, err)
      throw err
   }
}

async function addShopMsg(shopId, msg) {
   try {
      msg.id = utilService.makeId()

      const collection = await dbService.getCollection('shop')
      await collection.updateOne(
         { _id: ObjectId.createFromHexString(shopId) },
         { $push: { msgs: msg } }
      )
      return msg
   } catch (err) {
      logger.error(`cannot add shop msg ${shopId}`, err)
      throw err
   }
}

async function removeShopMsg(shopId, msgId) {
   try {
      const collection = await dbService.getCollection('shop')
      await collection.updateOne(
         { _id: ObjectId.createFromHexString(shopId) },
         { $pull: { msgs: { id: msgId } } }
      )
      return msgId
   } catch (err) {
      logger.error(`cannot add shop msg ${shopId}`, err)
      throw err
   }
}
