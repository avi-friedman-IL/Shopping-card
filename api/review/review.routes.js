import express from 'express'
import { addReview, getReviewById, getReviews, removeReview, updateReview } from './review.controller.js'

export const reviewRoutes = express.Router()

reviewRoutes.get('/', getReviews)
reviewRoutes.get('/:id', getReviewById)
reviewRoutes.post('/', addReview)
reviewRoutes.put('/:id', updateReview)
reviewRoutes.delete('/:id', removeReview)
