import { Router } from 'express'

const router = Router()

import ctrl from '../controllers/collection'

// User Panel
router.get('/popular', ctrl.getPopularCollections) // with isPopular = true
router.get('/:search', ctrl.getAllCollections) // with status = 1
router.get('/', ctrl.getCollections) // with status = 1
router.get('/all', ctrl.getAllCollections) // with status = 1
router.get('/symbol/:symbol', ctrl.getCollectionOneBySymbol) // with status = 1, symbol
router.post('/symbol', ctrl.getCollectionBySymbol) // with status = 1, symbol
router.post('/analytics', ctrl.getAnalytics)
router.post('/floor-price', ctrl.getFloorPrice)

// Admin Panel
router.post('/', ctrl.getData)
router.post('/add-event', ctrl.addEvent)
router.post('/update-event', ctrl.updateEvent)
router.post('/delete-event', ctrl.deleteEvent)
router.post('/approve-event', ctrl.approveEvent)
router.post('/reject-event', ctrl.rejectEvent)

export default router