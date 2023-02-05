import { Request, Response } from 'express'
import { HTTP_STATUS_CODE } from "../constants/httpStatusCode"
import CollectionService from '../services/collection'
import NftService from '../services/nft'
import NftController from '../controllers/nft'
import HashlistService from '../services/hashlist'
import ActivityService from '../services/activity'
import AcitivityCtrl from '../controllers/activity'
import { getFormattedResponse } from "../utils"
import MyPromise from 'bluebird'

import { BAD_REQUEST, BACKEND_ERROR } from '../config'

import fs from 'fs'
import { UploadedFile } from 'express-fileupload'

import moment from 'moment'

import Sequelize from "sequelize"
const Op = Sequelize.Op

import { CLUSTER_API } from '../config'

import { getMintAddress } from "../helpers/web3/candyMachine"

import { SolanaClient } from '../helpers/solana'
const solanaClient = new SolanaClient({ rpcEndpoint: CLUSTER_API })

import { getParsedAccountByMint } from '@nfteyez/sol-rayz'

import { Connection } from "@solana/web3.js"
const connection = new Connection(CLUSTER_API, 'confirmed')

// User Panel
const getPopularCollections = async (req: Request, res: Response) => {
    try {
        const { day } = req.query

        let activities = await ActivityService.findAll({
            attributes: [
                'collectionId',
                [Sequelize.fn('count', Sequelize.col('collectionId')), 'activityCount']
            ],
            where: {
                created_at: {
                    [Op.gte]: moment().subtract(Number(day), 'days').toDate()
                }
            },
            group: ['collectionId']
        })

        activities = activities.sort((a, b) => (a.owns > b.owns) ? -1 : ((b.owns > a.owns) ? 1 : 0))

        const collections: any = []
        for (let i = 0; i < (activities.length < 10 ? activities.length : 10); i++) {
            const temp = await CollectionService.findOne({ where: { id: activities[i].collectionId } })
            collections.push(temp)
        }

        return res.status(200).json({ success: true, data: collections, message: 'Success' })
    } catch (err) {
        return res.status(500).json(BACKEND_ERROR)
    }
}

const getCollections = async (req: Request, res: Response) => {
    try {
        const result = await CollectionService.findAll({ where: { status: 1 } })
        console.log('result', result)
        return res.status(200).json({ success: true, data: result, message: 'Success' })

    } catch (error) {
        console.log(error)
    }
}

const getAllCollections = async (req: Request, res: Response) => {
    try {
        let { search } = req.params


        console.log('search', search)

        if (search === undefined) {
            search = ''
        }

        const condition = {
            where: {
                [Op.or]: [
                    {
                        name: {
                            [Op.like]: `%${search}%`
                        }
                    },
                    {
                        symbol: {
                            [Op.like]: `%${search}%`
                        }
                    },
                ],
                status: 1,
            }
        }
        const result = await CollectionService.findAndCountAll(condition)
        return res.status(HTTP_STATUS_CODE.OK).json(getFormattedResponse(result, req.method))
        // return res.status(200).json({ success: true, data: result, message: 'Success' })
    } catch (err) {
        return res.status(500).json(BACKEND_ERROR)
    }
}

const getCollectionOneBySymbol = async (req: Request, res: Response) => {
    try {
        const { symbol } = req.params

        if (symbol === undefined) {
            return res.status(400).json(BAD_REQUEST)
        }

        const condition = {
            where: {
                symbol: symbol,
                status: 1,
            }
        }

        const collection = await CollectionService.findOne(condition)

        if (collection === null) {
            return res.status(500).json({ success: true, data: null, message: 'Collection is not exist!' })
        }

        const condition2 = { where: { collectionId: collection.id } }

        const { hashlist } = await HashlistService.findOne(condition2)

        const hashlistWithOwner = await Promise.all(
            hashlist.map(async (mintAddress: any, index: any) => getParsedAccountByMint({ mintAddress, connection }))
        )

        let holders = []

        hashlistWithOwner.map((temp: any, index: any) => {
            const owner = temp.account.data.parsed.info.owner
            const fIndex = holders.findIndex(holder => holder.wallet === owner)
            if (fIndex >= 0) {
                holders[fIndex].owns += 1
            } else {
                const newHolder = { wallet: owner, owns: 1 }
                holders.push(newHolder)
            }
        })

        const listedNFTs = await NftService.findAll({ where: { collectionId: collection.id, status: 1 } })

        let attributes = []

        listedNFTs.map((nft: any) => {
            if (nft.attributes !== undefined) {
                nft.attributes.map((attr: any) => {
                    const indexNum = attributes.findIndex((newAttr: any) => newAttr.trait_type === attr.trait_type)
                    if (indexNum >= 0) {
                        const indexValue = attributes[indexNum].value.findIndex((newVal: any) => newVal.text === attr.value)
                        if (indexValue >= 0) {
                            attributes[indexNum].value[indexValue].count++
                        } else {
                            attributes[indexNum].value.push(
                                {
                                    text: attr.value,
                                    count: 1
                                }
                            )
                        }
                    } else {
                        attributes.push({
                            trait_type: attr.trait_type,
                            value: [
                                {
                                    text: attr.value,
                                    count: 1
                                }
                            ]
                        })
                    }
                })
            }
        })

        const nftCondition = {
            where: {
                collectionId: collection.id,
                status: 1
            },
            attributes: [
                [Sequelize.fn('min', Sequelize.col('price')), 'minPrice'],
                [Sequelize.fn('max', Sequelize.col('price')), 'maxPrice'],
                [Sequelize.fn('count', Sequelize.col('price')), 'count'],
                [Sequelize.fn('sum', Sequelize.col('price')), 'totalVolume']
            ],
            raw: true
        }
        const nftStatistic = await NftService.findAll(nftCondition)

        const activityCondition = {
            where: {
                created_at: {
                    [Op.gte]: moment().subtract(1, 'days').toDate()
                },
                collectionId: collection.id,
                type: {
                    [Op.or]: [4, 8] // Buy, Accept
                },
                status: 1
            },
            attributes: [
                [Sequelize.fn('count', Sequelize.col('price')), 'count'],
                [Sequelize.fn('sum', Sequelize.col('price')), 'totalVolume']
            ],
            raw: true
        }
        const activityStatistic = await ActivityService.findAll(activityCondition)

        const result = {
            ...collection.dataValues,
            attributes,
            minPrice: nftStatistic[0].minPrice,
            maxPrice: nftStatistic[0].maxPrice,
            floorPrice: nftStatistic[0].minPrice,
            totalVolume: nftStatistic[0].totalVolume,
            avgSalePrice: activityStatistic[0].count === '0' ? 0 : (activityStatistic[0].totalVolume / Number(activityStatistic[0].count)).toFixed(2),
            listedCount: Number(nftStatistic[0].count),
            uniqueHolders: holders.length
        }

        // return res.status(HTTP_STATUS_CODE.OK).json(getFormattedResponse(result, req.method))
        return res.status(200).json({ success: true, data: result, message: 'Success' })
    } catch (err) {
        return res.status(500).json(BACKEND_ERROR)
    }
}

// Pagnation 
const getCollectionBySymbol = async (req: Request, res: Response) => {
    try {
        const { symbol, price, sort, attributes, offset, limit, search } = req.body

        const condition1 = {
            where: {
                symbol: symbol,
                status: 1
            }
        }

        let collection = await CollectionService.findOne(condition1)

        let nfts: any

        if (collection !== null) {

            let orderBy: string, sortType: string

            switch (sort) {
                case 'recent': {
                    orderBy = 'updated_at'
                    sortType = 'DESC'
                }
                    break
                case 'price_low_to_high': {
                    orderBy = 'price'
                    sortType = 'ASC'
                }
                    break
                case 'price_high_to_low': {
                    orderBy = 'price'
                    sortType = 'DESC'
                }
                    break
            }

            let filters = {
                [Op.and]: []
            }
            attributes.map((attr: any, index: any) => {
                let filter = {
                    [Op.or]: []
                }
                attr.value.map((val: any, index: any) => {
                    filter[Op.or].push(
                        {
                            attributes: {
                                [Op.contains]: [{
                                    "trait_type": attr.trait_type,
                                    "value": val
                                }]
                            }
                        }
                    )
                })
                filters[Op.and].push(filter)
            })

            const condition2 = {
                where: {
                    collectionId: collection.id,
                    status: 1,
                    price: {
                        [Op.gte]: price.min,
                        [Op.lte]: price.max
                    },
                    name: {
                        [Op.like]: `%${search}%`
                    },
                    ...filters
                },
                order: [[orderBy, sortType]],
                limit: limit,
                offset: offset
            }

            nfts = await NftService.findAndCountAll(condition2)

        }

        return res.status(200).json({ success: true, data: { collection, nfts }, message: 'Success' })

    } catch (err) {
        return res.status(500).json(BACKEND_ERROR)
    }
}

const getAnalytics = async (req: Request, res: Response) => {
    try {
        const { symbol } = req.body

        if (symbol === undefined) {
            return res.status(400).json(BAD_REQUEST)
        }

        const condition1 = { where: { symbol: symbol, status: 1 } }

        const collection = await CollectionService.findOne(condition1)

        if (collection === null) {
            return res.status(500).json({ success: true, data: null, message: 'Collection is not exist!' })
        }

        const condition2 = { where: { collectionId: collection.id } }

        const { hashlist } = await HashlistService.findOne(condition2)

        const hashlistWithOwner = await Promise.all(
            hashlist.map(async (mintAddress: any) => getParsedAccountByMint({ mintAddress, connection }))
        )

        let holders = []

        hashlistWithOwner.map((temp: any) => {
            const owner = temp.account.data.parsed.info.owner
            const fIndex = holders.findIndex(holder => holder.wallet === owner)
            if (fIndex >= 0) {
                holders[fIndex].owns += 1
            } else {
                const newHolder = { wallet: owner, owns: 1 }
                holders.push(newHolder)
            }
        })

        holders = holders.sort((a, b) => (a.owns > b.owns) ? -1 : ((b.owns > a.owns) ? 1 : 0))

        let tokenHolders = [
            0, // 1
            0, // 2-5
            0, // 6-24
            0, // 25-50
            0, // 51 ~
        ]

        const holderRanking = []

        await MyPromise.each(holders, async holder => {
            if (holder.owns > 50) {
                tokenHolders[4]++
            } else if (holder.owns > 24) {
                tokenHolders[3]++
            } else if (holder.owns > 5) {
                tokenHolders[2]++
            } else if (holder.owns > 1) {
                tokenHolders[1]++
            } else if (holder.owns > 0) {
                tokenHolders[0]++
            }
            const netCondition = {
                where: {
                    from: holder.wallet,
                }
            }

            const purchaseData: any = await AcitivityCtrl.getWeekPurchaseInfoByWallet(collection.id, holder.wallet)
            console.log(purchaseData)
            let netPurchase: string = ''
            let netVolumn: number = 0

            if (purchaseData.buyInfo.count !== '0') {
                netPurchase += '+' + purchaseData.buyInfo.count.toString() + ' '
                netVolumn += purchaseData.buyInfo.volumn
            }

            if (purchaseData.sellInfo.count !== '0') {
                netPurchase += '-' + purchaseData.sellInfo.count.toString()
                netVolumn += purchaseData.sellInfo.volumn
            }

            holderRanking.push(
                {
                    ...holder,
                    netPurchase,
                    netVolumn,
                    supply: Math.ceil(Number((holder.owns / collection.totalSupply * 1000))) / 10
                }
            )
        }, { concurrency: 1 })

        const statistics = {
            totalSupply: collection.totalSupply,
            holders: holders.length,
            avgOwned: Math.ceil(Number((holders.length / collection.totalSupply * 1000))) / 10,
            uniqueHolders: Math.ceil(Number((holders.length / collection.totalSupply * 100)))
        }

        return res.status(200).json({ success: true, data: { holderRanking, tokenHolders, statistics }, message: 'Success' })

    } catch (err) {
        console.log(err)
        return res.status(500).json(BACKEND_ERROR)
    }
}

const getFloorPrice = async (req: Request, res: Response) => {
    try {
        const { symbol } = req.body
        console.log('symbol', symbol)
        const colRecord: any = await CollectionService.findOne({ where: { symbol: symbol } })

        let floorPrice = 0
        if (colRecord)
            floorPrice = await NftController.getFloorPrice(colRecord.id)
        return res.json({ success: true, message: 'Success', data: { floorPrice } })

    } catch (error) {

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
                        name: {
                            [Op.like]: `%${params.searchValue}%`
                        }
                    },
                    {
                        symbol: {
                            [Op.like]: `%${params.searchValue}%`
                        }
                    }
                ]
            },
            order: [[params.column, params.direction]],
            limit: params.rowsPerPage,
            offset: (params.currentPage - 1) * params.rowsPerPage
        }
        const result = await CollectionService.findAndCountAll(condition)

        return res.json({ success: true, message: 'Success', data: result })
    } catch (e) {
        console.log('error: ', e)
        return res.status(500).json(BACKEND_ERROR)
    }
}

const addEvent = async (req: Request, res: Response) => {
    try {
        let { data } = req.body

        if (data === undefined) {
            return res.status(400).json(BAD_REQUEST)
        }
        data = JSON.parse(data)
        if (req.files !== null) {
            const dir = `${__dirname}/../build`
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir)
            }
            if (!fs.existsSync(`${dir}/uploads`)) {
                fs.mkdirSync(`${dir}/uploads`)
            }

            const baseImage = req.files.baseImage as UploadedFile
            if (baseImage !== undefined) {
                const index = baseImage['name'].lastIndexOf('.')
                const format = baseImage['name'].substring(index, baseImage['name'].length)
                const name = new Date().getTime().toString() + format

                await baseImage.mv(`${dir}/uploads/${name}`)
                data['baseImage'] = '/uploads/' + name
            }
        }
        data['status'] = 0

        delete data.id

        let hashlist = []

        for (let i = 0; i < data['creators'].length; i++) {
            const temp = await getMintAddress(data['creators'][i])
            hashlist = [...hashlist, ...temp]
        }

        data['totalSupply'] = hashlist.length

        // let attributes = []

        // const collectibles = await solanaClient.getAllCollectiblesFromHashList(hashlist, [])

        // collectibles.nfts.map((nft: any) => {
        //     if (nft.attributes !== undefined) {
        //         nft.attributes.map((attr: any) => {
        //             const filterArr = attributes.filter((newAttr: any) => newAttr.trait_type === attr.trait_type)
        //             if (filterArr.length > 0) {
        //                 const indexNum = attributes.indexOf(filterArr[0])
        //                 if (attributes[indexNum].value.indexOf(attr.value) === -1) {
        //                     attributes[indexNum] = {
        //                         ...attributes[indexNum],
        //                         value: [
        //                             ...attributes[indexNum].value,
        //                             attr.value
        //                         ]
        //                     }
        //                 }
        //             } else {
        //                 attributes.push({
        //                     trait_type: attr.trait_type,
        //                     value: [
        //                         attr.value
        //                     ]
        //                 })
        //             }
        //         })
        //     }
        // })

        // data['attributes'] = attributes

        const collectible = await solanaClient.getCollectible(hashlist[0])

        const nftNameArray = collectible.data.name.split(" ")
        const nftName = nftNameArray.slice(0, nftNameArray.length - 1).join('_').toLowerCase()

        data['nftName'] = nftName

        const result = await CollectionService.create(data)

        await HashlistService.create({
            collectionId: result.id,
            nftName,
            hashlist
        })

        return res.json({ success: true, message: 'Success', data: result })
    } catch (e) {
        console.log('error: ', e)
        return res.status(500).json(BACKEND_ERROR)
    }
}

const updateEvent = async (req: Request, res: Response) => {
    try {
        let { data } = req.body

        if (data === undefined) {
            return res.status(400).json(BAD_REQUEST)
        }

        data = JSON.parse(data)

        if (req.files !== null) {
            const dir = `${__dirname}/../build`
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir)
            }
            if (!fs.existsSync(`${dir}/uploads`)) {
                fs.mkdirSync(`${dir}/uploads`)
            }

            const baseImage = req.files.baseImage as UploadedFile
            if (baseImage !== undefined) {
                const index = baseImage['name'].lastIndexOf('.')
                const format = baseImage['name'].substring(index, baseImage['name'].length)
                const name = new Date().getTime().toString() + format

                await baseImage.mv(`${dir}/uploads/${name}`)
                data['baseImage'] = '/uploads/' + name
            }
        }

        let hashlist = []

        for (let i = 0; i < data['creators'].length; i++) {
            const temp = await getMintAddress(data['creators'][i])
            hashlist = [...hashlist, ...temp]
        }

        data['totalSupply'] = hashlist.length

        // const collectibles = await solanaClient.getAllCollectiblesFromHashList(hashlist, [])

        // let attributes = []

        // collectibles.nfts.map((nft: any, index: any) => {
        //     if (nft.attributes !== undefined) {
        //         nft.attributes.map((attr: any, index: any) => {
        //             const filterArr = attributes.filter((newAttr: any, index: any) => newAttr.trait_type === attr.trait_type)
        //             if (filterArr.length > 0) {
        //                 const indexNum = attributes.indexOf(filterArr[0])
        //                 if (attributes[indexNum].value.indexOf(attr.value) === -1) {
        //                     attributes[indexNum] = {
        //                         ...attributes[indexNum],
        //                         value: [
        //                             ...attributes[indexNum].value,
        //                             attr.value
        //                         ]
        //                     }
        //                 }
        //             } else {
        //                 attributes.push({
        //                     trait_type: attr.trait_type,
        //                     value: [
        //                         attr.value
        //                     ]
        //                 })
        //             }
        //         })
        //     }
        // })

        // data['attributes'] = attributes

        const collectible = await solanaClient.getCollectible(hashlist[0])

        const nftNameArray = collectible.data.name.split(" ")
        const nftName = nftNameArray.slice(0, nftNameArray.length - 1).join('_').toLowerCase()

        data['nftName'] = nftName

        await HashlistService.update({
            collectionId: data.id,
            nftName: nftName,
            hashlist: hashlist
        }, { where: { collectionId: data.id } })

        const result = await CollectionService.update(data, { where: { id: data.id } })

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

        const result = await CollectionService.destroy({ where: { id } })

        return res.json({ success: true, message: 'Success', data: result })
    } catch (e) {
        console.log(e)
        return res.status(500).json(BACKEND_ERROR)
    }
}

const approveEvent = async (req: Request, res: Response) => {
    try {
        const { id } = req.body

        if (id === undefined) {
            return res.status(400).json(BAD_REQUEST)
        }

        const result = await CollectionService.update({ status: 1 }, { where: { id } })

        return res.json({ success: true, message: 'Success', data: result })
    } catch (e) {
        console.log(e)
        return res.status(500).json(BACKEND_ERROR)
    }
}

const rejectEvent = async (req: Request, res: Response) => {
    try {
        const { id } = req.body

        if (id === undefined) {
            return res.status(400).json(BAD_REQUEST)
        }

        const result = await CollectionService.update({ status: 2 }, { where: { id } })

        return res.json({ success: true, message: 'Success', data: result })
    } catch (e) {
        console.log(e)
        return res.status(500).json(BACKEND_ERROR)
    }
}

export default {
    // User Panel
    getPopularCollections,
    getCollections,
    getAllCollections,
    getCollectionOneBySymbol,
    getCollectionBySymbol,
    getAnalytics,
    getFloorPrice,
    // Admin Panel
    getData,
    addEvent,
    updateEvent,
    deleteEvent,
    approveEvent,
    rejectEvent
}