import { shopService } from './shop.service.js'
import { logger } from '../../services/logger.service.js'

export async function getShops(req, res) {
    try {
        const filterBy = {
            txt: req.query.txt || '',
            sortBy: req.query.sortBy || '',
            sortDir: +req.query.sortDir || 1,
        }
        console.log('filterBy:', filterBy)
        const shops = await shopService.query(filterBy)
        res.json(shops)
    } catch (err) {
        logger.error('Failed to get shops', err)
        res.status(500).send({ err: 'Failed to get shops' })
    }
}

export async function getShopById(req, res) {
    try {
        const shopId = req.params.id
        const shop = await shopService.getById(shopId)
        res.json(shop)
    } catch (err) {
        logger.error('Failed to get shop', err)
        res.status(500).send({ err: 'Failed to get shop' })
    }
}

export async function addShop(req, res) {
    const { loggedinUser } = req

    try {
        const shop = req.body
        shop.owner = loggedinUser
        const addedShop = await shopService.add(shop)
        res.json(addedShop)
    } catch (err) {
        logger.error('Failed to add shop', err)
        res.status(500).send({ err: 'Failed to add shop' })
    }
}

export async function updateShop(req, res) {
    try {
        const shop = req.body
        const updatedShop = await shopService.update(shop)
        res.json(updatedShop)
    } catch (err) {
        logger.error('Failed to update shop', err)
        res.status(500).send({ err: 'Failed to update shop' })
    }
}

export async function removeShop(req, res) {
    try {
        const shopId = req.params.id
        const deletedCount = await shopService.remove(shopId)
        res.send(`${deletedCount} shops removed`)
    } catch (err) {
        logger.error('Failed to remove shop', err)
        res.status(500).send({ err: 'Failed to remove shop' })
    }
}

export async function addShopMsg(req, res) {
    const { loggedinUser } = req
    try {
        const shopId = req.params.id
        const msg = {
            txt: req.body.txt,
            by: loggedinUser,
            createdAt: Date.now(),
        }
        const savedMsg = await shopService.addShopMsg(shopId, msg)
        res.json(savedMsg)
    } catch (err) {
        logger.error('Failed to update shop', err)
        res.status(500).send({ err: 'Failed to update shop' })
    }
}

export async function removeShopMsg(req, res) {
    try {
        const { shopId, msgId } = req.params

        const removedId = await shopService.removeShopMsg(shopId, msgId)
        res.send(removedId)
    } catch (err) {
        logger.error('Failed to remove shop msg', err)
        res.status(500).send({ err: 'Failed to remove shop msg' })
    }
}