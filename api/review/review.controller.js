import { logger } from "../../services/logger.service.js"
import { reviewService } from "./review.service.js"

export async function getReviews(req, res) {
    const filterBy = req.query
    try {
        const reviews = await reviewService.query(filterBy)
        res.json(reviews)
    } catch (err) {
        logger.error('Failed to get reviews', err)
        res.status(500).send({ err: 'Failed to get reviews' })
    }
}

export async function getReviewById(req, res) {
    try {
        const reviewId = req.params.id
        const review = await reviewService.getById(reviewId)
        res.json(review)
    } catch (err) {
        logger.error('Failed to get review', err)
        res.status(500).send({ err: 'Failed to get review' })
    }
}

export async function addReview(req, res) {
    try {
        const review = req.body
        const addedReview = await reviewService.add(review)
        res.json(addedReview)
    } catch (err) {
        logger.error('Failed to add review', err)
        res.status(500).send({ err: 'Failed to add review' })
    }
}

export async function updateReview(req, res) {
    try {
        const review = req.body
        const updatedReview = await reviewService.update(review)
        res.json(updatedReview)
    } catch (err) {
        logger.error('Failed to update review', err)
        res.status(500).send({ err: 'Failed to update review' })
    }
}

export async function removeReview(req, res) {
    try {
        const reviewId = req.params.id
        const deletedCount = await reviewService.remove(reviewId)
        res.send(`${deletedCount} reviews removed`)
    } catch (err) {
        logger.error('Failed to remove review', err)
        res.status(500).send({ err: 'Failed to remove review' })
    }
}

