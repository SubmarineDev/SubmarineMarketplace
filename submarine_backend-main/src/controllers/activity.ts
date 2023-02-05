import { Request, Response } from 'express'
import ActivityService from '../services/activity'
import CollectionService from '../services/collection'

import { BAD_REQUEST, BACKEND_ERROR } from '../config'
import { ACTIVITY_TYPE } from '../constants'

import moment from 'moment'

import Sequelize from "sequelize"
const Op = Sequelize.Op

// User Panel
const getMyActivities = async (req: Request, res: Response) => {
    try {
        const { walletAddress, limit, currentPage } = req.body
        if (walletAddress === undefined || limit === undefined || currentPage === undefined) {
            return res.status(400).json(BAD_REQUEST)
        }

        const condition = {
            where: {
                [Op.or]: [
                    { from: walletAddress },
                    { to: walletAddress }
                ]
            },
            order: [['created_at', 'DESC']],
            limit,
            offset: (currentPage - 1) * limit
        }
        const result = await ActivityService.findAndCountAll(condition)
        return res.status(200).json({ success: true, data: result, message: 'Success' })
    } catch (err) {
        return res.status(500).json(BACKEND_ERROR)
    }
}

const getNftActivities = async (req: Request, res: Response) => {
    try {
        const { mintAddress, limit, currentPage } = req.body
        if (mintAddress === undefined || limit === undefined || currentPage === undefined) {
            return res.status(400).json(BAD_REQUEST)
        }
        const condition = {
            where: {
                mintAddress
            },
            order: [['created_at', 'DESC']],
            limit,
            offset: (currentPage - 1) * limit
        }
        const result = await ActivityService.findAndCountAll(condition)
        return res.status(200).json({ success: true, data: result, message: 'Success' })
    } catch (err) {
        return res.status(500).json(BACKEND_ERROR)
    }
}

const getCollectionActivities = async (req: Request, res: Response) => {
    try {
        const { symbol, limit, currentPage } = req.body
        if (symbol === undefined || limit === undefined || currentPage === undefined) {
            return res.status(400).json(BAD_REQUEST)
        }

        const collection = await CollectionService.findOne({ where: { symbol } })
        const condition = {
            where: {
                collectionId: collection.id
            },
            order: [['created_at', 'DESC']],
            limit,
            offset: (currentPage - 1) * limit
        }
        const result = await ActivityService.findAndCountAll(condition)
        return res.status(200).json({ success: true, data: result, message: 'Success' })
    } catch (err) {
        return res.status(500).json(BACKEND_ERROR)
    }
}

// Admin Panel
const getData = async (req: Request, res: Response) => {
    try {
        const { params } = req.body

        if (params === undefined) {
            return res.status(400).json(BAD_REQUEST)
        }

        const condition = {
            where: {
                [Op.or]: [
                    {
                        mintAddress: {
                            [Op.like]: `%${params.searchValue}%`
                        }
                    },
                    {
                        name: {
                            [Op.like]: `%${params.searchValue}%`
                        }
                    }
                ]
            },
            order: [[params.column, params.direction]],
            limit: params.rowsPerPage,
            offset: (params.currentPage - 1) * params.rowsPerPage
        }
        const result = await ActivityService.findAndCountAll(condition)

        return res.json({ success: true, message: 'Success', data: result })
    } catch (e) {
        console.log('error: ', e)
        return res.status(500).json(BACKEND_ERROR)
    }
}

const addEvent = async (req: Request, res: Response) => {
    try {
        const { data } = req.body

        if (data === undefined) {
            return res.status(400).json(BAD_REQUEST)
        }

        delete data.id

        const result = await ActivityService.create(data)

        return res.json({ success: true, message: 'Success', data: result })
    } catch (e) {
        console.log('error: ', e)
        return res.status(500).json(BACKEND_ERROR)
    }
}

const updateEvent = async (req: Request, res: Response) => {
    try {
        const { data } = req.body

        if (data === undefined) {
            return res.status(400).json(BAD_REQUEST)
        }

        const result = await ActivityService.update(data, { where: { id: data.id } })

        return res.json({ success: true, message: 'Success', data: result })
    } catch (e) {
        return res.status(500).json(BACKEND_ERROR)
    }
}

const deleteEvent = async (req: Request, res: Response) => {
    try {
        const { id } = req.body

        if (id === undefined) {
            return res.status(400).json(BAD_REQUEST)
        }

        const result = await ActivityService.destroy({ where: { id } })

        return res.json({ success: true, message: 'Success', data: result })
    } catch (e) {
        console.log(e)
        return res.status(500).json(BACKEND_ERROR)
    }
}

const getWeekPurchaseInfoByWallet = async (collectionId, walletAddress) => {
    try {
        const buyInfo = await ActivityService.findOne({
            where: {
                collectionId: collectionId,
                from: walletAddress,
                created_at: {
                    [Op.gte]: moment().subtract(Number(7), 'days').toDate()
                },
                type: {
                    [Op.or]: [ACTIVITY_TYPE.BUY, ACTIVITY_TYPE.ACCEPT_BID] // Buy, Accept
                },
                status: 1
            },
            attributes: [
                [Sequelize.fn('count', Sequelize.col('price')), 'count'],
                [Sequelize.fn('sum', Sequelize.col('price')), 'volumn']
            ],
            raw: true
        })

        const sellInfo = await ActivityService.findOne({
            where: {
                collectionId: collectionId,
                to: walletAddress,
                created_at: {
                    [Op.gte]: moment().subtract(Number(7), 'days').toDate()
                },
                type: {
                    [Op.or]: [ACTIVITY_TYPE.BUY, ACTIVITY_TYPE.ACCEPT_BID] // Buy, Accept
                },
                status: 1
            },
            attributes: [
                [Sequelize.fn('count', Sequelize.col('price')), 'count'],
                [Sequelize.fn('sum', Sequelize.col('price')), 'volumn']
            ],
            raw: true
        })

        return { buyInfo, sellInfo }
    } catch (error) {
        console.log('error', error)
    }
}

export default {
    // User Panel
    getMyActivities,
    getNftActivities,
    getCollectionActivities,
    // Admin Panel
    getData,
    addEvent,
    updateEvent,
    deleteEvent,
    getWeekPurchaseInfoByWallet
}