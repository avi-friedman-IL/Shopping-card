import { dbService } from "../../services/db.service.js"
import { logger } from "../../services/logger.service.js"

export const reviewService = {
   query,
   getById,
   remove,
   add,
   update,
}

async function query(filterBy = { txt: '' }) {
   console.log('filterBy:', filterBy)
   try {
      const criteria = {
         productId: filterBy.productId,
      }

      const sortBy = filterBy.sortBy === 'name' ? 'name' : 'price'
      const sortObj = { [sortBy]: filterBy.sortDir }

      const collection = await dbService.getCollection('review')
      var reviews = await collection.find(criteria).sort(sortObj).toArray()
      return reviews
   } catch (err) {
      logger.error('cannot find reviews', err)
      throw err
   }
}

async function getById(reviewId) {
   try {
      const collection = await dbService.getCollection('review')
      const review = await collection.findOne({
         _id: ObjectId.createFromHexString(reviewId),
      })
      review.createdAt = review._id.getTimestamp()
      return review
   } catch (err) {
      logger.error(`while finding review ${reviewId}`, err)
      throw err
   }
}

async function remove(reviewId) {
   try {
      const collection = await dbService.getCollection('review')
      const { deletedCount } = await collection.deleteOne({
         _id: ObjectId.createFromHexString(reviewId),
      })
      return deletedCount
   } catch (err) {
      logger.error(`cannot remove review ${reviewId}`, err)
      throw err
   }
}

async function add(review) {
   try {
      const collection = await dbService.getCollection('review')
      await collection.insertOne(review)
      return review
   } catch (err) {
      logger.error('cannot insert review', err)
      throw err
   }
}

async function update(review) {
   try {
      const collection = await dbService.getCollection('review')
      await collection.updateOne(
         { _id: ObjectId.createFromHexString(review._id) },
         { $set: review }
      )
      return review
   } catch (err) {
      logger.error(`cannot update review ${review._id}`, err)
      throw err
   }
}
