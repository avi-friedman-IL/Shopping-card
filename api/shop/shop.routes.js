import express from 'express'
import { requireAuth, requireAdmin } from '../../middlewares/requireAuth.middleware.js'
import { log } from '../../middlewares/logger.middleware.js'
import { getShops, getShopById, addShop, updateShop, removeShop, addShopMsg, removeShopMsg } from './shop.controller.js'

export const shopRoutes = express.Router()

// middleware that is specific to this router
// router.use(requireAuth)

shopRoutes.get('/', log, getShops)
shopRoutes.get('/:id', getShopById)
shopRoutes.post('/', requireAdmin, addShop)
shopRoutes.put('/:id', updateShop)
shopRoutes.delete('/:id', requireAdmin, removeShop)
// router.delete('/:id', requireAuth, requireAdmin, removeShop)

shopRoutes.post('/:id/msg', requireAuth, addShopMsg)
shopRoutes.delete('/:id/msg/:msgId', requireAuth, removeShopMsg)