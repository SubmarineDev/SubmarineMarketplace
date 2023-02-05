import { Request, Response } from 'express'
import NftService from '../services/nft'
import ActivityService from '../services/activity'
import HashlistService from '../services/hashlist'
import SettingService from '../services/setting'
import CollectionService from '../services/collection'

import { BAD_REQUEST, BACKEND_ERROR, CLUSTER_API, PROGRAM_ID } from '../config'
import { ACTIVITY_TYPE } from "../constants"

import Sequelize from "sequelize"
const Op = Sequelize.Op

import {
    resolveToWalletAddress,
    getParsedAccountByMint,
} from "@nfteyez/sol-rayz"

import {
    makeListTx,
    makeUpdateListTx,
    makeCancelListTx,
    makeBuyTx,
} from "../helpers/contract"

import { PublicKey, Connection } from "@solana/web3.js"

import { SolanaClient } from '../helpers/solana'
const solanaClient = new SolanaClient({ rpcEndpoint: CLUSTER_API })

const connection = new Connection(CLUSTER_API, 'confirmed')
// User Panel

const getMoreNFTsBySymbol = async (req: Request, res: Response) => {
    try {
        const { symbol, mintAddress } = req.body

        if (symbol === undefined || mintAddress === undefined) {
            return res.status(400).json(BAD_REQUEST)
        }

        const condition1 = {
            where: {
                symbol: symbol,
                status: 1
            }
        }

        let collection = await CollectionService.findOne(condition1)

        let nfts: any

        if (collection !== null) {

            const condition2 = {
                where: {
                    collectionId: collection.id,
                    mintAddress: {
                        [Op.ne]: mintAddress
                    },
                    status: 1
                },
                order: Sequelize.literal('random()'),
                limit: 10,
            }

            nfts = await NftService.findAll(condition2)
        }

        return res.status(200).json({ success: true, data: nfts, message: 'Success' })
    } catch (err) {
        return res.status(500).json(BACKEND_ERROR)
    }
}

const getPriceHistory = async (req: Request, res: Response) => {
    try {
        const { mintAddress } = req.body

        if (mintAddress === undefined) {
            return res.status(400).json(BAD_REQUEST)
        }

        const condition = {
            where: {
                mintAddress,
                type: {
                    [Op.or]: [ACTIVITY_TYPE.BUY, ACTIVITY_TYPE.ACCEPT_BID] // Buy, Accept
                },
            },
            order: [['created_at', 'DESC']],
            limit: 5
        }

        let history = await ActivityService.findAll(condition)

        return res.status(200).json({ success: true, data: history, message: 'Success' })
    } catch (err) {
        return res.status(500).json(BACKEND_ERROR)
    }
}

const getNftByWalletAddress = async (req: Request, res: Response) => {
    try {
        const { walletAddress, status } = req.params
        console.log('walletAddress', walletAddress)
        if (walletAddress === undefined) {
            return res.status(400).json(BAD_REQUEST)
        }

        const condition = {
            where: {
                walletAddress,
                status: status
            }
        }
        const result = await NftService.findAll(condition)
        return res.json({ success: true, message: 'Success', data: result })
    } catch (err) {
        return res.status(500).json(BACKEND_ERROR)
    }
}

const getFloorPrice = async collectionId => {
    try {
        const condition = {
            where: {
                collectionId: collectionId,
                status: 1
            },
            attributes: [
                [Sequelize.fn('min', Sequelize.col('price')), 'minPrice'],
            ],
            raw: true
        }

        const result: any = await NftService.findOne(condition)
        return result?.minPrice || 0
    } catch (error) {
        return error
    }
}

const getNftByMintAddress = async (req: Request, res: Response) => {
    try {
        const { mintAddress } = req.params
        if (mintAddress === undefined) {
            return res.status(400).json(BAD_REQUEST)
        }

        const condition = {
            where: {
                mintAddress
            }
        }

        const result = await NftService.findOne(condition)
        return res.json({ success: true, message: 'Success', data: result })
    } catch (err) {
        return res.status(500).json(BACKEND_ERROR)
    }
}

const buyNft = async (req: Request, res: Response) => {
    try {
        let { buyerAddress, mintAddress, signature } = req.body

        buyerAddress = await resolveToWalletAddress({ text: buyerAddress, connection })
        mintAddress = await resolveToWalletAddress({ text: mintAddress, connection })

        const parsedTxn = await connection.getParsedTransaction(signature)
        if (!parsedTxn.meta) {
            return res.status(400).json({ success: false, message: 'Transaction Error', data: null })
        }
        if (parsedTxn.meta.err !== null) {
            return res.status(400).json({ success: false, message: 'Transaction Error', data: null })
        }
        let i = 0

        if (parsedTxn.transaction.message.instructions.length > 1) {
            i = 2
        }

        // const programId = parsedTxn.transaction.message.instructions[i].programId.toString()
        // if (programId !== PROGRAM_ID) {
        //     return res.status(400).json({ success: false, message: 'Transaction Error', data: null })
        // }
        let j = 0

        if (parsedTxn.transaction.message.instructions.length > 1) {
            j = 7
        }

        // if (parsedTxn.meta.logMessages[j] !== 'Program log: Instruction: Buy') {
        //     return res.status(400).json({ success: false, message: 'Transaction Error', data: null })
        // }

        const oldActivity = await ActivityService.findOne({
            where: { signature }
        })
        if (oldActivity !== null) {
            return res.status(400).json({ success: false, message: 'Transaction Error', data: null })
        }

        const accountInfo = await solanaClient.getCollectible(mintAddress)
        const nftNameArray = accountInfo.name.split(" ")
        const nftName = nftNameArray.slice(0, nftNameArray.length - 1).join('_').toLowerCase()

        // validate nft
        const hash = await HashlistService.findOne({
            where: {
                nftName: nftName
            }
        })

        if (hash === null) {
            return res.status(400).json({ success: false, message: 'Collection Validate Error', data: null })
        }

        const validAddress = hash.hashlist.indexOf(mintAddress)

        if (validAddress === -1) {
            return res.status(400).json({ success: false, message: 'Collection Validate Error', data: null })
        }

        const nftResult = await NftService.findOne({
            where: {
                mintAddress: mintAddress,
                status: 1
            }
        })

        if (nftResult === null) {
            return res.status(400).json({ success: false, message: 'NFT is not listed', data: null })
        }

        const activity = {
            collectionId: nftResult.collectionId,
            mintAddress,
            name: accountInfo.name,
            image: accountInfo.image,
            type: ACTIVITY_TYPE.BUY,
            price: nftResult.price,
            from: buyerAddress,
            to: nftResult.walletAddress,
            signature,
            status: 1,
        }
        await ActivityService.create(activity)

        const nftInfo = await getParsedAccountByMint({ mintAddress: mintAddress, connection })

        const data = {
            walletAddress: buyerAddress,
            tokenAccount: nftInfo.pubkey,
            status: 3,
        }
        const result = await NftService.update(data, { where: { mintAddress: mintAddress }, returning: true, plain: true })
        return res.json({ success: true, data: result[1].dataValues, message: 'Success' })
    } catch (err) {
        res.send(err)
    }
}

const listNft = async (req: Request, res: Response) => {
    try {
        let { mintAddress, price, walletAddress, signature } = req.body

        mintAddress = await resolveToWalletAddress({ text: mintAddress, connection })
        // const signature = 'HCRM2YY6ejbdri6qJkjpeD84NuRFnzQusEeRaM3LUt2tAhXY3athgmwULRCXrKEmEDgdovusPdZp7yBXrtf66mQ'
        const parsedTxn = await connection.getParsedTransaction(signature)
        if (!parsedTxn.meta) {
            return res.status(400).json({ success: false, message: 'Transaction Error', data: null })
        }
        if (parsedTxn.meta.err !== null) {
            return res.status(400).json({ success: false, message: 'Transaction Error', data: null })
        }
        let i = 0

        if (parsedTxn.transaction.message.instructions.length > 1) {
            i = 2
        }

        // const programId = parsedTxn.transaction.message.instructions[i].programId.toString()
        // if (programId !== PROGRAM_ID) {
        //     return res.status(400).json({ success: false, message: 'Transaction Error', data: null })
        // }

        let j = 0

        if (parsedTxn.transaction.message.instructions.length > 1) {
            j = 7
        }

        // if (parsedTxn.meta.logMessages[j] !== 'Program log: Instruction: List') {
        //     return res.status(400).json({ success: false, message: 'Transaction Error', data: null })
        // }

        const oldActivity = await ActivityService.findOne({
            where: { signature }
        })
        if (oldActivity !== null) {
            return res.status(400).json({ success: false, message: 'Transaction Error', data: null })
        }

        const accountInfo = await solanaClient.getCollectible(mintAddress)
        const nftNameArray = accountInfo.name.split(" ")
        const nftName = nftNameArray.slice(0, nftNameArray.length - 1).join('_').toLowerCase()

        // validate nft
        const hash = await HashlistService.findOne({
            where: {
                nftName: nftName
            }
        })

        if (hash === null) {
            return res.status(400).json({ success: false, message: 'Collection Validate Error', data: null })
        }

        const validAddress = hash.hashlist.indexOf(mintAddress)

        if (validAddress === -1) {
            return res.status(400).json({ success: false, message: 'Collection Validate Error', data: null })
        }

        const nftResult = await NftService.findOne({
            where: {
                mintAddress: mintAddress
            }
        })



        const nftInfo = await getParsedAccountByMint({ mintAddress: mintAddress, connection })
        const owner = nftInfo.account.data.parsed.info.owner

        if (nftResult === null) {

            const data = {
                mintAddress,
                walletAddress,
                tokenAccount: nftInfo.pubkey,
                collectionId: hash.collectionId,
                name: accountInfo.name,
                price,
                image: accountInfo.image,
                attributes: accountInfo.attributes,
                sellerFeeBasisPoints: accountInfo.sellerFeeBasisPoints,
                status: 1,
            }

            const result = await NftService.create(data)

            const activity = {
                collectionId: hash.collectionId,
                mintAddress,
                image: accountInfo.image,
                name: accountInfo.name,
                type: ACTIVITY_TYPE.LIST,
                price,
                from: '',
                to: owner,
                signature,
                status: 1,
            }

            await ActivityService.create(activity)

            return res.json({ success: true, data: result[1].dataValues, message: 'Success' })
        } else {

            if (nftResult.status === 1) {
                return res.status(400).json({ success: false, message: 'NFT is already listed', data: null })
            }

            const activity = {
                collectionId: nftResult.collectionId,
                mintAddress,
                image: accountInfo.image,
                name: accountInfo.name,
                type: ACTIVITY_TYPE.LIST,
                price: price,
                from: '',
                to: nftResult.walletAddress,
                signature,
                status: 1,
            }

            await ActivityService.create(activity)

            const data = {
                price,
                walletAddress,
                tokenAccount: nftInfo.pubkey,
                status: 1,
            }

            const result = await NftService.update(data, { where: { mintAddress: mintAddress }, returning: true, plain: true })

            return res.json({ success: true, data: result[1].dataValues, message: 'Success' })
        }

    } catch (err) {
        res.send(err)
    }
}

const updateNft = async (req: Request, res: Response) => {
    try {
        let { mintAddress, price, signature } = req.body

        mintAddress = await resolveToWalletAddress({ text: mintAddress, connection })

        const parsedTxn = await connection.getParsedTransaction(signature)
        if (!parsedTxn.meta) {
            return res.status(400).json({ success: false, message: 'Transaction Error', data: null })
        }
        if (parsedTxn.meta.err !== null) {
            return res.status(400).json({ success: false, message: 'Transaction Error', data: null })
        }
        const programId = parsedTxn.transaction.message.instructions[0].programId.toString()
        if (programId !== PROGRAM_ID) {
            return res.status(400).json({ success: false, message: 'Transaction Error', data: null })
        }
        if (parsedTxn.meta.logMessages[1] !== 'Program log: Instruction: UpdateList') {
            return res.status(400).json({ success: false, message: 'Transaction Error', data: null })
        }
        const oldActivity = await ActivityService.findOne({
            where: { signature }
        })
        if (oldActivity !== null) {
            return res.status(400).json({ success: false, message: 'Transaction Error', data: null })
        }

        const accountInfo = await solanaClient.getCollectible(mintAddress)
        const nftNameArray = accountInfo.name.split(" ")
        const nftName = nftNameArray.slice(0, nftNameArray.length - 1).join('_').toLowerCase()

        // validate nft
        const hash = await HashlistService.findOne({
            where: {
                nftName: nftName
            }
        })

        if (hash === null) {
            return res.status(400).json({ success: false, message: 'Collection Validate Error', data: null })
        }

        const validAddress = hash.hashlist.indexOf(mintAddress)

        if (validAddress === -1) {
            return res.status(400).json({ success: false, message: 'Collection Validate Error', data: null })
        }

        const nftResult = await NftService.findOne({
            where: {
                mintAddress: mintAddress,
                status: 1
            }
        })
        if (nftResult === null) {
            return res.status(400).json({ success: false, message: 'NFT is not listed', data: null })
        }

        const activity = {
            collectionId: nftResult.collectionId,
            mintAddress,
            name: accountInfo.name,
            image: accountInfo.image,
            type: ACTIVITY_TYPE.UPDATE_LIST,
            price: price,
            from: '',
            to: nftResult.walletAddress,
            signature,
            status: 1,
        }
        await ActivityService.create(activity)

        const data = {
            price: price,
        }

        const result = await NftService.update(data, { where: { mintAddress: mintAddress }, returning: true, plain: true })
        return res.json({ success: true, data: result[1].dataValues, message: 'Success' })

    } catch (err) {
        res.send(err)
    }
}

const unlistNft = async (req: Request, res: Response) => {
    try {
        let { mintAddress, signature } = req.body

        const parsedTxn = await connection.getParsedTransaction(signature)
        if (!parsedTxn.meta) {
            return res.status(400).json({ success: false, message: 'Transaction Error', data: null })
        }
        if (parsedTxn.meta.err !== null) {
            return res.status(400).json({ success: false, message: 'Transaction Error', data: null })
        }
        const programId = parsedTxn.transaction.message.instructions[0].programId.toString()
        if (programId !== PROGRAM_ID) {
            return res.status(400).json({ success: false, message: 'Transaction Error', data: null })
        }
        if (parsedTxn.meta.logMessages[1] !== 'Program log: Instruction: CancelList') {
            return res.status(400).json({ success: false, message: 'Transaction Error', data: null })
        }
        const oldActivity = await ActivityService.findOne({
            where: { signature }
        })
        if (oldActivity !== null) {
            return res.status(400).json({ success: false, message: 'Transaction Error', data: null })
        }

        mintAddress = await resolveToWalletAddress({ text: mintAddress, connection })

        const accountInfo = await solanaClient.getCollectible(mintAddress)
        const nftNameArray = accountInfo.name.split(" ")
        const nftName = nftNameArray.slice(0, nftNameArray.length - 1).join('_').toLowerCase()

        // validate nft
        const hash = await HashlistService.findOne({
            where: {
                nftName: nftName
            }
        })

        if (hash === null) {
            return res.status(400).json({ success: false, message: 'Collection Validate Error', data: null })
        }

        const validAddress = hash.hashlist.indexOf(mintAddress)

        if (validAddress === -1) {
            return res.status(400).json({ success: false, message: 'Collection Validate Error', data: null })
        }

        const nftResult = await NftService.findOne({
            where: {
                mintAddress: mintAddress,
                status: 1
            }
        })
        if (nftResult === null) {
            return res.status(400).json({ success: false, message: 'NFT is not listed', data: null })
        }

        const activity = {
            collectionId: nftResult.collectionId,
            mintAddress,
            name: accountInfo.name,
            image: accountInfo.image,
            type: ACTIVITY_TYPE.UNLIST,
            price: nftResult.price,
            from: '',
            to: nftResult.walletAddress,
            signature,
            status: 1,
        }

        await ActivityService.create(activity)

        const data = {
            status: 2,
        }

        const result = await NftService.update(data, { where: { mintAddress: mintAddress }, returning: true, plain: true })
        return res.json({ success: true, data: result[1].dataValues, message: 'Success' })

    } catch (err) {
        res.send(err)
    }
}

const buyNftTransaction = async (req: Request, res: Response) => {
    try {
        let { buyerAddress, seller, mintAddress } = req.body

        buyerAddress = await resolveToWalletAddress({ text: buyerAddress, connection })
        mintAddress = await resolveToWalletAddress({ text: mintAddress, connection })

        const accountInfo = await solanaClient.getCollectible(mintAddress)
        const nftNameArray = accountInfo.name.split(" ")
        const nftName = nftNameArray.slice(0, nftNameArray.length - 1).join('_').toLowerCase()

        // validate nft
        const hash = await HashlistService.findOne({
            where: {
                nftName: nftName
            }
        })

        if (hash === null) {
            return res.status(400).json({ success: false, message: 'Collection Validate Error', data: null })
        }

        const validAddress = hash.hashlist.indexOf(mintAddress)

        if (validAddress === -1) {
            return res.status(400).json({ success: false, message: 'Collection Validate Error', data: null })
        }

        const nftResult = await NftService.findOne({
            where: {
                mintAddress: mintAddress,
                status: 1
            }
        })

        if (nftResult === null) {
            return res.status(400).json({ success: false, message: 'NFT is not listed', data: null })
        }

        const nftInfo = await getParsedAccountByMint({ mintAddress: mintAddress, connection })
        const owner = nftInfo.account.data.parsed.info.owner

        if (nftResult.tokenAccount !== nftInfo.pubkey.toString()) {
            // Cancel list logic
            return res.status(400).json({ success: false, message: 'NFT is not listed', data: null })
        }

        const settingRecord = await SettingService.findOne({
            where: {
                key: 'MARKETPLACE_FEE'
            }
        })

        let marketFee = 5
        if (settingRecord.dataValues !== null)
            marketFee = settingRecord.dataValues.value


        console.log('marketFee', marketFee)

        const tx = await makeBuyTx({
            buyer: new PublicKey(buyerAddress),
            seller: new PublicKey(seller),
            mint: new PublicKey(mintAddress),
            tokenFrom: new PublicKey(nftResult.tokenAccount),
            marketFee
        })

        const seqTx = tx.serialize({ requireAllSignatures: false, verifySignatures: false })
        return res.json({ success: true, data: { tx: seqTx }, message: 'Success' })
    } catch (err) {
        res.send(err)
    }
}

const listNftTransaction = async (req: Request, res: Response) => {
    try {
        let { mintAddress, price } = req.body

        mintAddress = await resolveToWalletAddress({ text: mintAddress, connection })

        const accountInfo = await solanaClient.getCollectible(mintAddress)
        const nftNameArray = accountInfo.name.split(" ")
        const nftName = nftNameArray.slice(0, nftNameArray.length - 1).join('_').toLowerCase()

        // validate nft
        const hash = await HashlistService.findOne({
            where: {
                nftName: nftName
            }
        })

        if (hash === null) {
            return res.status(400).json({ success: false, message: 'Collection Validate Error', data: null })
        }

        const validAddress = hash.hashlist.indexOf(mintAddress)

        if (validAddress === -1) {
            return res.status(400).json({ success: false, message: 'Collection Validate Error', data: null })
        }

        const nftInfo = await getParsedAccountByMint({ mintAddress: mintAddress, connection })

        const nftResult = await NftService.findOne({
            where: {
                mintAddress: mintAddress
            }
        })
        let tx: any
        const owner = nftInfo.account.data.parsed.info.owner

        if (nftResult === null) {

            tx = await makeListTx(price, {
                user: new PublicKey(owner),
                mint: new PublicKey(mintAddress),
                tokenAccount: new PublicKey(nftInfo.pubkey)
            })

        } else {

            if (nftResult.status === 1) {
                return res.status(400).json({ success: false, message: 'NFT is already listed', data: null })
            }

            tx = await makeListTx(price, {
                user: new PublicKey(owner),
                mint: new PublicKey(mintAddress),
                tokenAccount: new PublicKey(nftInfo.pubkey)
            })
        }

        const seqTx = tx.serialize({ requireAllSignatures: false, verifySignatures: false })
        // let tx1: any = anchor.web3.Transaction.populate(anchor.web3.Message.from(seqTx));
        console.log('seqTx', tx)
        return res.json({ success: true, data: { tx: seqTx }, message: 'Success' })
    } catch (err) {
        res.send(err)
    }
}

const updateNftTransaction = async (req: Request, res: Response) => {
    try {
        let { mintAddress, walletAddress, price } = req.body

        mintAddress = await resolveToWalletAddress({ text: mintAddress, connection })

        const accountInfo = await solanaClient.getCollectible(mintAddress)
        const nftNameArray = accountInfo.name.split(" ")
        const nftName = nftNameArray.slice(0, nftNameArray.length - 1).join('_').toLowerCase()

        // validate nft
        const hash = await HashlistService.findOne({
            where: {
                nftName: nftName
            }
        })

        if (hash === null) {
            return res.status(400).json({ success: false, message: 'Collection Validate Error', data: null })
        }

        const validAddress = hash.hashlist.indexOf(mintAddress)

        if (validAddress === -1) {
            return res.status(400).json({ success: false, message: 'Collection Validate Error', data: null })
        }

        const nftResult = await NftService.findOne({
            where: {
                mintAddress: mintAddress,
                status: 1
            }
        })
        if (nftResult === null) {
            return res.status(400).json({ success: false, message: 'NFT is not listed', data: null })
        }

        const nftInfo = await getParsedAccountByMint({ mintAddress: mintAddress, connection })

        const owner = nftInfo.account.data.parsed.info.owner
        const tx = await makeUpdateListTx(price, {
            user: new PublicKey(walletAddress),
            mint: new PublicKey(mintAddress),
            tokenAccount: new PublicKey(nftInfo.pubkey)
        })

        const seqTx = tx.serialize({ requireAllSignatures: false, verifySignatures: false })
        return res.json({ success: true, data: { tx: seqTx }, message: 'Success' })

    } catch (err) {
        res.send(err)
    }
}

const unlistNftTransaction = async (req: Request, res: Response) => {
    try {
        let { walletAddress, mintAddress } = req.body

        mintAddress = await resolveToWalletAddress({ text: mintAddress, connection })

        const accountInfo = await solanaClient.getCollectible(mintAddress)
        const nftNameArray = accountInfo.name.split(" ")
        const nftName = nftNameArray.slice(0, nftNameArray.length - 1).join('_').toLowerCase()

        // validate nft
        const hash = await HashlistService.findOne({
            where: {
                nftName: nftName
            }
        })

        if (hash === null) {
            return res.status(400).json({ success: false, message: 'Collection Validate Error', data: null })
        }

        const validAddress = hash.hashlist.indexOf(mintAddress)

        if (validAddress === -1) {
            return res.status(400).json({ success: false, message: 'Collection Validate Error', data: null })
        }

        const nftResult = await NftService.findOne({
            where: {
                mintAddress: mintAddress,
                status: 1
            }
        })
        if (nftResult === null) {
            return res.status(400).json({ success: false, message: 'NFT is not listed', data: null })
        }

        const nftInfo = await getParsedAccountByMint({ mintAddress: mintAddress, connection })

        const owner = nftInfo.account.data.parsed.info.owner
        console.log('owner', owner.toString())
        console.log('tokenAccount', new PublicKey(nftInfo.pubkey).toString())

        const tx = await makeCancelListTx({
            user: new PublicKey(walletAddress),
            mint: new PublicKey(mintAddress),
            tokenAccount: new PublicKey(nftInfo.pubkey)
        })

        const seqTx = tx.serialize({ requireAllSignatures: false, verifySignatures: false })
        return res.json({ success: true, data: { tx: seqTx }, message: 'Success' })

    } catch (err) {
        res.send(err)
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
                        key: {
                            [Op.like]: `%${params.searchValue}%`
                        }
                    },
                    {
                        value: {
                            [Op.like]: `%${params.searchValue}%`
                        }
                    }
                ]
            },
            order: [[params.column, params.direction]],
            limit: params.rowsPerPage,
            offset: (params.currentPage - 1) * params.rowsPerPage
        }
        const result = await NftService.findAndCountAll(condition)

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

        const result = await NftService.create(data)

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

        const result = await NftService.update(data, { where: { id: data.id } })

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

        const result = await NftService.destroy({ where: { id } })

        return res.json({ success: true, message: 'Success', data: result })
    } catch (e) {
        console.log(e)
        return res.status(500).json(BACKEND_ERROR)
    }
}

export default {
    // User Panel
    getMoreNFTsBySymbol,
    getPriceHistory,
    getNftByWalletAddress,
    getNftByMintAddress,
    getFloorPrice,
    buyNft,
    listNft,
    unlistNft,
    updateNft,
    buyNftTransaction,
    listNftTransaction,
    unlistNftTransaction,
    updateNftTransaction,
    // Admin Panel
    getData,
    addEvent,
    updateEvent,
    deleteEvent,
}