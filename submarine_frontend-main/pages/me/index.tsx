import React, { Fragment, useState, useEffect } from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Sidebar from '../../components/Sidebar'
import Header from '../../components/Header'
import styles from '/styles/me.module.scss'

import { connect } from "react-redux"
import { handleSidebarOpen, handleSidebarClose } from "store/actions/init"
import { Typography, CircularProgress, Backdrop } from '@mui/material'

import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import moment from 'moment'

import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import StopCircleOutlinedIcon from '@mui/icons-material/StopCircleOutlined';
import HourglassBottomOutlinedIcon from '@mui/icons-material/HourglassBottomOutlined';

import { makeStyles } from '@mui/styles'
import { useResize } from '../../utils/Helper'

import { useConnection, useAnchorWallet } from "@solana/wallet-adapter-react";

import { signAndSendTransaction } from 'config/helpers/sol/connection';
import { Connection, PublicKey, Transaction, Keypair } from "@solana/web3.js";

import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { SolanaClient, SolanaClientProps } from '../../config/helpers/sol';

import commonService from "../../config/services/common.service";
import { MARKETPLACES_API, serverUrl } from "../../config";

import { handleImageError } from "../../config/utils/handleImageError";
import getCollectionSymbol from "../../config/utils/getCollectionSymbol";

import { useRouter } from "next/router";
import { ContactlessOutlined } from '@mui/icons-material'
import Link from 'next/link'
import {
    LAMPORTS_PER_SOL
} from '@solana/web3.js';

import ProcessingModal from '@components/ProcessingModal';

import { toast } from 'react-toastify'

const delay = (ms: any) => new Promise(res => setTimeout(res, ms));

interface WalletInfo {
    address: string,
    balance: any
}


function a11yProps(index: number) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

const useStyles = makeStyles((theme) => ({
    root: {

    },
    toggle_button_group: {
        backgroundColor: "#071421",
        overflow: 'auto'
    },
    individual_toggle_btn: {
        padding: "5px 8px",
        fontSize: "12px",
        color: "#aaa",
        textTransform: "none",
    },
}))

// let offersReceivedList: any[] = [
//     { name: 'Decimus #1506', img: "./assets/images/nft_sm.png", listed: "Yes", offeredPrice: 3.98, yourPrice: 4.40, difference: -9.55, from: "5cF6M4b1GEjzqBPJvAh5FqVmcerJabadtH4amjQUQnfu" },
//     { name: 'Decimus #1506', img: "./assets/images/nft_sm.png", listed: "No", offeredPrice: 3.98, yourPrice: -1, difference: '', from: "5cF6M4b1GEjzqBPJvAh5FqVmcerJabadtH4amjQUQnfu" }
// ]

const MyItems = ({ sidebarOpen }) => {
    const wallet = useAnchorWallet();
    const { connection } = useConnection();
    const [walletInfo, setWalletInfo] = React.useState<WalletInfo>({ address: ``, balance: 0 });
    const solanaClient = new SolanaClient({ rpcEndpoint: `https://metaplex.devnet.rpcpool.com` } as SolanaClientProps);

    const [tabIndex, setTabIndex] = React.useState(0);

    const [myItemsTab, setMyItemsTab] = React.useState('tradable');
    const [listedItemsTab, setListedItemsTab] = React.useState('tradable');

    const router = useRouter();
    const { tab, filter } = router.query;
    //const loading = useSelector(dropsLoadingSelector);
    const [loading, setLoading] = useState<boolean>(false);

    const [modalData, setModalData] = useState<any>();
    const [search, setSearch] = useState<string>(``);

    const [refresh, setRefresh] = React.useState<boolean>(true);
    const [open, setOpen] = React.useState(false);
    const [modalType, setModalType] = React.useState(0)

    const [totalFloorValue, setTotalFloorValue] = useState<any>('--')

    const [tradableNftsInwallet, setTradableNftsInwallet] = useState<any>([])
    const [myItemsCount, setMyItemsCount] = useState<number>(0)
    const [listedItemsCount, setListedItemsCount] = useState<number>(0)

    const [unverifiedNftsInWallet, setUnverifiedNftsInWallet] = useState<any>([])
    const [listedTradableNfts, setListedTradableNfts] = useState<any>([])

    const [listedUnverifiedNfts, setListedUnverifiedNfts] = useState<any>([])
    const [offersMadeList, setOffersMadeList] = useState<any>([])
    const [offersReceivedList, setOffersReceivedList] = useState<any>([])

    const [myActivities, setMyActivities] = useState<any>([])
    const [txProcessing, setTxProcessing] = useState<boolean>(false)

    const handleClickOpen = (_modalType: React.SetStateAction<number>) => {
        setModalType(_modalType);
        setOpen(true);
    };

    //==========================Mui Functions===============================//
    const handleMyItemsTabChange = (
        event: React.MouseEvent<HTMLElement>,
        newTarget: string,
    ) => {
        if (newTarget !== null) {
            setMyItemsTab(newTarget);
        }
    };

    const handleListedItemsTabChange = (
        event: React.MouseEvent<HTMLElement>,
        newTarget: string,
    ) => {
        if (newTarget !== null) {
            setListedItemsTab(newTarget);
        }
    };


    const classes = useStyles();
    const { isMobile } = useResize();


    //===================Logic Functions===================//
    const getPrice = (listedNfts: any, mintAddress) => {
        for (let i = 0; i < listedNfts.length; i++) {
            if (listedNfts[i].mintAddress == mintAddress) {
                return listedNfts[i].price;
            }
        }
        return 0;
    }

    const getListedCollectionSymbols = (listedCollections: any) => {
        let result: any = [];
        try {
            for (let i = 0; i < listedCollections.length; i++) {
                if (listedCollections[i].symbol) {
                    result.push(listedCollections[i].symbol);
                }
            }
        }
        catch (err) {
            result = [];
        }
        finally {
            return result;
        }
    }

    const getUnverifiedCollectionSymbols = (filteredCollections: any, nftsInWallet: any) => {
        console.log('nftsInWallet', nftsInWallet)
        let symbolList: any = getListedCollectionSymbols(filteredCollections)
        let result: any = []
        nftsInWallet.forEach((nft: any, index: number) => {
            const symbol: any = getCollectionSymbol(nft.name)
            if (!symbolList.includes(symbol)) {
                result.push(symbol)
            }
        })
        return result
    }

    const getNftsInWalletByFilteredCollections = async (filteredCollections: any, nftsInWallet: any, isVerified: boolean) => {
        let result: any[] = []
        let resultCount: number = 0
        let _totalFloorValue = 0
        if (isVerified) {
            await Promise.all(await filteredCollections.map(async (collection: any, index: number) => {
                let filteredNtfs: any = []

                await nftsInWallet.forEach((nft: any, index: number) => {
                    const symbol: any = getCollectionSymbol(nft.name);
                    console.log('symbol', collection.nftName)
                    if (symbol === collection.nftName)
                        filteredNtfs.push({ name: nft.name, img: nft.image, mint: nft.mint })

                });
                if (filteredNtfs.length === 0)
                    return

                const fpResult: any = await commonService({
                    method: "post",
                    route: `${MARKETPLACES_API.GET_FLOOR_PRICE}`,
                    data: {
                        symbol: collection.symbol
                    }
                });

                console.log('floorPrice', fpResult)

                const floorPrice = fpResult.floorPrice

                result.push({
                    collectionName: collection.name,
                    collectionImg: collection.baseImage,
                    floorPrice,
                    totalFloorValue: parseFloat(floorPrice) * filteredNtfs.length,
                    items: filteredNtfs
                })
                _totalFloorValue += parseFloat(floorPrice) * filteredNtfs.length
                resultCount += filteredNtfs.length
            }))
            setTotalFloorValue(_totalFloorValue)
        } else {
            let unverifiedSymbols = getUnverifiedCollectionSymbols(filteredCollections, nftsInWallet)
            nftsInWallet.forEach((nft: any, index: number) => {
                const symbol: any = getCollectionSymbol(nft.name);
                if (unverifiedSymbols.includes(symbol)) {
                    result.push({ ...nft })
                    resultCount++
                }
            });

        }
        return {
            data: result,
            count: resultCount
        }
    }

    const getListedNfts = async (collections: any, nftsInList: any) => {
        let result: any[] = []
        let resultCount: number = 0
        await Promise.all(await collections.map(async (collection: any, index: number) => {
            let filteredNtfs: any = []

            await nftsInList.forEach((nft: any, index: number) => {
                if (nft.collectionId === collection.id) {
                    filteredNtfs.push({ name: nft.name, img: nft.image, mint: nft.mintAddress })
                }

            });

            if (filteredNtfs.length === 0)
                return


            console.log('symbol=====', collection.symbol)


            const fpResult: any = await commonService({
                method: "post",
                route: `${MARKETPLACES_API.GET_FLOOR_PRICE}`,
                data: {
                    symbol: collection.symbol
                }
            });

            console.log('fllorPrice', fpResult)
            const floorPrice = fpResult.floorPrice
            result.push({
                collectionName: collection.name,
                collectionImg: collection.baseImage,
                floorPrice,
                totalFloorValue: parseFloat(floorPrice) * filteredNtfs.length,
                items: filteredNtfs
            })
            resultCount += filteredNtfs.length
        }))
        return {
            data: result,
            count: resultCount
        }
    }

    const cancelOffer = async (mintAddress) => {
        if (!wallet?.publicKey) {
            toast.error("Please connect to your wallet.", { theme: 'dark' })
            return;
        }
        setTxProcessing(true);
        let result: any = await commonService({
            method: "post",
            route: `${MARKETPLACES_API.GET_CANCELBID_TX}`,
            data: {
                bidderAddress: wallet.publicKey.toString(),
                mintAddress: mintAddress
            }
        });
        // const resObj = JSON.parse(new TextDecoder().decode(new Uint8Array(result.tx.data)))

        if (result?.tx?.data) {
            console.log('result.tx.data', result.tx.data)
            const transaction: Transaction = Transaction.from(result.tx.data);
            console.log('transaction', transaction)
            try {
                const res = await signAndSendTransaction(connection, wallet, transaction);
                // if (res?.txid && res?.slot) {
                if (res?.txid) {
                    console.log('signature', res.txid)
                    const cancelResult = await commonService({
                        method: "post",
                        route: `${MARKETPLACES_API.GET_CANCELBID_TX_CONF}`,
                        data: {
                            bidderAddress: wallet.publicKey.toString(),
                            mintAddress: mintAddress,
                            signature: res.txid
                        }
                    });
                    toast.success("Your offering is sucessfully canceled.", { theme: 'dark' })
                    await delay(2000);
                    router.push(`/me?tab=offers-made`, `/me?tab=offers-made`, { shallow: true })
                }
                else {
                    toast.error("Cancel is failed, Please try again.", { theme: 'dark' })
                }
            }
            catch (err) {
                console.log(`ERROR TXID`, err);
                toast.error("Transaction was failed. Please try again.", { theme: 'dark' })
            }
        }
        else {
            toast.error("Cancel is failed, Please try again.", { theme: 'dark' })
        }
        setTxProcessing(false);

    }


    useEffect(() => {
        (async () => {
            if (wallet) {
                setLoading(true)
                const wallets = [wallet!.publicKey!.toString()];

                const walletBalance = await connection.getBalance(wallet.publicKey);
                setWalletInfo({ ...walletInfo, address: wallet.publicKey.toBase58(), balance: (walletBalance / LAMPORTS_PER_SOL).toFixed(4) });

                const collectionsData: any = await commonService({
                    method: "get",
                    route: `${MARKETPLACES_API.GET_COLLECTIONS}`,
                });

                const collections: any = collectionsData
                console.log('collections', collections)

                let creators: any[] = []
                collections.map((item, index) => {
                    creators.push(...item.creators)
                })

                if (tab === undefined || tab === "my-items") {
                    setTabIndex(0)
                    let nftsInWallet = await solanaClient.getAllCollectiblesWithCreator(wallets, creators);
                    setMyItemsCount(nftsInWallet[wallet!.publicKey!.toString()].length)
                    console.log('nftsInWallet', nftsInWallet)
                    let _myItemsCount = 0

                    if (filter === 'unverified') {
                        const _unverifiedNftsInWallet: any = await getNftsInWalletByFilteredCollections(collections, nftsInWallet[wallet!.publicKey!.toString()], false)
                        console.log('unverifiedNftsInWallet==============', _unverifiedNftsInWallet.data)
                        setUnverifiedNftsInWallet([..._unverifiedNftsInWallet.data])
                        _myItemsCount += _unverifiedNftsInWallet.count
                    } else {
                        const _temp: any = await getNftsInWalletByFilteredCollections(collections, nftsInWallet[wallet!.publicKey!.toString()], true)
                        const _tradableNftsInWallet: any = _temp.data
                        console.log('tradableNftsInWallet==============', _tradableNftsInWallet)
                        setTradableNftsInwallet([..._tradableNftsInWallet])
                        _myItemsCount += _temp.count
                    }
                    // setMyItemsCount(_myItemsCount)

                } else if (tab === "listed-items") {
                    setTabIndex(1)

                    if (filter === 'unverified') {
                        let unverifiedNfts: any = await commonService({
                            method: "get",
                            route: `${MARKETPLACES_API.GET_NFTS_WALLET}${wallet.publicKey.toBase58()}/0`,
                        });
                        setListedUnverifiedNfts(unverifiedNfts)
                    } else {
                        let listedNfts: any = await commonService({
                            method: "get",
                            route: `${MARKETPLACES_API.GET_NFTS_WALLET}${wallet.publicKey.toBase58()}/1`,
                        });
                        console.log('listed-items==================', listedNfts)
                        const _listedTradableNfts = await getListedNfts(collections, listedNfts)
                        console.log('_listedTradableNfts', _listedTradableNfts.data)
                        setListedTradableNfts(_listedTradableNfts.data)
                        setListedItemsCount(_listedTradableNfts.count)
                    }
                } else if (tab === "offers-made") {
                    setTabIndex(2)
                    let _offersMadeList: any = await commonService({
                        method: "post",
                        route: `${MARKETPLACES_API.GET_BID_WALLET}`,
                        data: {
                            walletAddress: wallet!.publicKey!.toString(),
                            limit: 10,
                            currentPage: 1
                        }
                    });

                    console.log('offersMadeList===============', _offersMadeList)

                    setOffersMadeList(_offersMadeList.rows)

                } else if (tab === "offers-received") {
                    setTabIndex(3)

                    let _offersReceivedList: any = await commonService({
                        method: "post",
                        route: `${MARKETPLACES_API.GET_RECEIVE_BIDs}`,
                        data: {
                            walletAddress: wallet!.publicKey!.toString(),
                            limit: 10,
                            currentPage: 1
                        }
                    });

                    setOffersReceivedList(_offersReceivedList.rows)

                } else if (tab === "activities") {
                    setTabIndex(4)
                    let _myActivities: any = await commonService({
                        method: "post",
                        route: `${MARKETPLACES_API.GET_ACTIVITY_WALLET}`,
                        data: {
                            walletAddress: wallet!.publicKey!.toString(),
                            limit: 10,
                            currentPage: 1
                        }
                    });
                    setMyActivities(_myActivities.rows)
                }

                setLoading(false)
            }
        })()
        // eslint-disable-next-line
    }, [wallet, tabIndex, refresh, search, tab]);
    console.log('tab', tab)
    console.log('filter', filter)
    return (
        <Box sx={{ display: "flex" }}>
            <Sidebar />
            <div className={styles.profile_section}>
                <Header sidebarOpen={sidebarOpen} />
                {
                    loading && (
                        <Backdrop
                            sx={{ color: "Grey", zIndex: (theme) => theme.zIndex.drawer + 1 }}
                            open={true}
                        >
                            <CircularProgress color="inherit" />
                            &nbsp; Loading...
                        </Backdrop>
                    )
                }
                <div className={styles.container}>
                    <div className={`${styles.profile_header_section} ${styles.profile_header_section}`}>
                        <Box className={styles.profile_items_statistics_list}>
                            <dl>
                                <dt>TOTAL Floor Value</dt>
                                <dd style={{ textAlign: "center" }}><span>{totalFloorValue}</span></dd>
                            </dl>
                            {/* <dl>
                                <dt>LISTED ITEMS</dt>
                                <dd>5</dd>
                            </dl>
                            <dl>
                                <dt>TOTAL FLLOR VALUE</dt>
                                <dd><span>23.5 ◎</span></dd>
                            </dl>
                            <dl>
                                <dt>TOTAL SOLD VALUE</dt>
                                <dd><span>11.03 ◎</span></dd>
                            </dl>
                            <dl>
                                <dt>HIGHEST SALE VALUE</dt>
                                <dd><span>8.24 ◎</span></dd>
                            </dl> */}
                        </Box>
                        <Box className={styles.profile_wallet_list}>
                            <Box className="ds-flex align-center" sx={{ mb: 1, justifyContent: isMobile ? 'center' : 'unset' }}>
                                <img src="/assets/images/wallet_icon.png" alt="" />
                                <Typography sx={{ ml: 1 }} color="#fff">{wallet?.publicKey.toString().substr(0, 4)}...{wallet?.publicKey.toString().substr(wallet?.publicKey.toString().length - 4, 4)}</Typography>
                            </Box>
                            <Box className="ds-flex align-center justify-end" sx={{ mb: 1, justifyContent: isMobile ? 'center' : 'unset' }}>
                                <Typography color="#aaa" sx={{ fontSize: "15px" }}>Main Wallet: </Typography>
                                <Typography color="#fff" sx={{ fontSize: "15px" }}>&nbsp;{walletInfo.balance} ◎ </Typography>
                            </Box>
                            {/* <Box className="ds-flex align-center justify-end" sx={{ mb: 1, justifyContent: isMobile ? 'center' : 'unset' }}>
                                <Typography color="#aaa" sx={{ fontSize: "15px" }}>Bidding Wallet: </Typography>
                                <Typography color="#fff" sx={{ fontSize: "15px" }}>&nbsp;0 ◎ </Typography>
                            </Box> */}
                            {/* <Box className="ds-flex align-center justify-end" sx={{ mb: 1, justifyContent: isMobile ? 'center' : 'unset' }}>
                                <Button sx={{ border: "1px solid #7FF9E6", color: "#7FF9E6", fontSize: "11px" }}>DEPOSIT</Button>
                                <Button sx={{ ml: 1, border: "1px solid #00D2FF", color: "#00D2FF", fontSize: "11px" }}>WITHDRAW</Button>
                            </Box> */}
                        </Box>
                    </div>
                    <div className={styles.profile_body_section}>
                        <Box sx={{ width: '100%', background: "#0d2031" }}>
                            <Box>
                                <Tabs className={styles.user_detail_tabs} aria-label="basic tabs example" value={tabIndex}
                                    sx={{
                                        background: "#102841",
                                        '& .MuiTab-root': {
                                            color: "#aaa",
                                            fontSize: "14px",
                                            textTransform: "none"
                                        },
                                        '& .Mui-selected': {
                                            background: "#0d2031",
                                            borderTopLeftRadius: "5px", borderTopRightRadius: "5px", color: "#fff !important"
                                        },
                                        '& .Mui-selected p': {
                                            color: "#fff"
                                        },
                                        '& .MuiTabs-indicator': { display: "none" },
                                        '& .MuiTabs-scroller': { overflow: 'auto !important' }
                                    }}>
                                    <Tab label={`My Items`} onClick={() => router.push('?tab=my-items&filter=tradeable', '?tab=my-items&filter=tradeable', { shallow: true })} />
                                    <Tab label={`Listed Items`} onClick={() => router.push('?tab=listed-items&filter=tradeable', '?tab=listed-items&filter=tradeable', { shallow: true })} />
                                    <Tab label={`Offers Made `} onClick={() => router.push('?tab=offers-made&filter=tradeable', '?tab=offers-made&filter=tradeable', { shallow: true })} />
                                    <Tab label={`Offers Received`} onClick={() => router.push('?tab=offers-received&filter=tradeable', '?tab=offers-received&filter=tradeable', { shallow: true })} />
                                    <Tab label="Activities" onClick={() => router.push('?tab=activities&filter=tradeable', '?tab=activities&filter=tradeable', { shallow: true })} />
                                </Tabs>
                            </Box>
                            <Box sx={{ p: 3 }}>
                                {(tab === undefined || tab === 'my-items') && <Fragment>
                                    <ToggleButtonGroup
                                        value={filter === 'unverified' ? 'unverified' : 'tradeable'}
                                        className={classes.toggle_button_group}
                                        exclusive
                                    >
                                        <ToggleButton value="tradeable" className={classes.individual_toggle_btn} sx={{ '&.Mui-selected:hover, &.Mui-selected': { backgroundColor: "#1B6A97", color: '#fff' } }} onClick={() => router.push('?tab=my-items&filter=tradeable', '?tab=my-items&filter=tradeable', { shallow: true })}> TRADABLE</ToggleButton>
                                        <ToggleButton value="unverified" className={classes.individual_toggle_btn} sx={{ '&.Mui-selected:hover, &.Mui-selected': { backgroundColor: "#1B6A97", color: '#fff' } }} onClick={() => router.push('?tab=my-items&filter=unverified', '?tab=my-items&filter=unverified', { shallow: true })}>UNVERIFIED</ToggleButton>
                                    </ToggleButtonGroup>
                                    <Box sx={{ mt: 2, borderBottom: 1, borderColor: '#0C4258' }} />
                                    {
                                        filter === 'unverified' ? <Fragment>
                                            {
                                                unverifiedNftsInWallet.length === 0 && <Typography sx={{ textAlign: "center", lineHeight: "300px" }} color="#aaa" >No available items</Typography>
                                            }
                                            <Box className={styles.unverified_list}>
                                                {
                                                    unverifiedNftsInWallet.length > 0 && unverifiedNftsInWallet.map((item, key) => (
                                                        <Box key={key} className={styles.unverified_item}>
                                                            <Box className={styles.img_wrapper}>
                                                                <img className="img_responsive" src={item.img} alt="" />
                                                                <Typography color="#fff" sx={{ mt: 1, fontSize: "14px" }}>{item.name}</Typography>
                                                                <Typography color="#aaa" sx={{ fontSize: "12px" }}>Unverified Collection</Typography>
                                                            </Box>
                                                        </Box>
                                                    ))
                                                }

                                            </Box>

                                        </Fragment> : <Fragment>
                                            {
                                                tradableNftsInwallet.length > 0 && tradableNftsInwallet.map((trbItem: any, index) => (
                                                    <Fragment key={index}>
                                                        <Box className={styles.tradable_header}>
                                                            <Box className={styles.tradable_header_left}>
                                                                <img style={{ width: "40px", height: "40px" }} src={serverUrl + trbItem.collectionImg} alt={trbItem.collectionName} />
                                                                <p>{trbItem.collectionName} ({trbItem.items.length})</p>
                                                            </Box>
                                                            <Box className={styles.tradable_header_right}>
                                                                <span>FLOOR PRICE: {trbItem.floorPrice} ◎ </span>
                                                                <span>TOTAL FLOOR VALUE: {trbItem.totalFloorValue} ◎ </span>
                                                            </Box>
                                                        </Box>
                                                        <Box className={styles.tradable_list}>
                                                            {
                                                                trbItem.items.map((item: any, key) => (
                                                                    <Box key={key} className={styles.tradable_item}>
                                                                        <Box className={styles.img_wrapper}>
                                                                            <img className="img_responsive" src={item.img} alt="" />
                                                                            <Typography color="#fff" sx={{ mt: 1, fontSize: "14px" }}>{item.name}</Typography>
                                                                            <Box className="ds-flex align-center">
                                                                                <CheckCircleOutlineIcon sx={{ color: '#7FF9E6', fontSize: "13px" }} />&nbsp;
                                                                                <Typography color="#7FF9E6" sx={{ fontSize: "12px" }}>{trbItem.collectionName}</Typography>
                                                                            </Box>
                                                                            <Button className={styles.btn_add_listing} onClick={() => router.push(`/item-details/${item.mint}`, `/item-details/${item.mint}`, { shallow: true })}>Add Listing</Button>
                                                                        </Box>
                                                                    </Box>
                                                                ))
                                                            }
                                                        </Box>
                                                    </Fragment>
                                                ))
                                            }
                                        </Fragment>
                                    }
                                </Fragment>}
                                {tab === 'listed-items' && <Fragment>
                                    <ToggleButtonGroup
                                        value={filter === 'unverified' ? 'unverified' : 'tradeable'}
                                        className={classes.toggle_button_group}
                                        exclusive
                                    >
                                        <ToggleButton value="tradeable" className={classes.individual_toggle_btn} sx={{ '&.Mui-selected:hover, &.Mui-selected': { backgroundColor: "#1B6A97", color: '#fff' } }} onClick={() => router.push('?tab=listed-items&filter=tradeable', '?tab=listed-items&filter=tradeable', { shallow: true })}> TRADABLE</ToggleButton>
                                        <ToggleButton value="unverified" className={classes.individual_toggle_btn} sx={{ '&.Mui-selected:hover, &.Mui-selected': { backgroundColor: "#1B6A97", color: '#fff' } }} onClick={() => router.push('?tab=listed-items&filter=unverified', '?tab=listed-items&filter=unverified', { shallow: true })}>UNVERIFIED</ToggleButton>
                                    </ToggleButtonGroup>
                                    <Box sx={{ mt: 2, borderBottom: 1, borderColor: '#0C4258' }} />
                                    {
                                        filter === 'unverified' ? <Fragment>
                                            {
                                                listedUnverifiedNfts.length === 0 && <Typography sx={{ textAlign: "center", lineHeight: "300px" }} color="#aaa" >No available items</Typography>
                                            }
                                            <Box className={styles.unverified_list}>
                                                {
                                                    listedUnverifiedNfts > 0 && listedUnverifiedNfts.map((item, key) => (
                                                        <Box key={key} className={styles.unverified_item}>
                                                            <Box className={styles.img_wrapper}>
                                                                <img className="img_responsive" src={item.image} alt="" />
                                                                <Typography color="#fff" sx={{ mt: 1, fontSize: "14px" }}>{item.name}</Typography>
                                                                <Typography color="#aaa" sx={{ fontSize: "12px" }}>Unverified Collection</Typography>
                                                            </Box>
                                                        </Box>
                                                    ))
                                                }
                                            </Box>
                                            {/* <Box sx={{ width: "100%" }}>
                                            <Typography sx={{ textAlign: "center", lineHeight: "300px" }} color="#aaa" >No available items</Typography>
                                        </Box> */}
                                        </Fragment> : <Fragment>
                                            {
                                                listedTradableNfts.length === 0 && <Typography sx={{ textAlign: "center", lineHeight: "300px" }} color="#aaa" >No available items</Typography>
                                            }
                                            {
                                                listedTradableNfts.length > 0 && listedTradableNfts.map((trbItem, index) => (
                                                    <Fragment key={index}>
                                                        <Box className={styles.tradable_header}>
                                                            <Box className={styles.tradable_header_left}>
                                                                <img style={{ width: "40px", height: "40px" }} src={serverUrl + trbItem.collectionImg} alt={trbItem.collectionName} />
                                                                <p>{trbItem.collectionName} ({trbItem.items.length})</p>
                                                            </Box>
                                                            <Box className={styles.tradable_header_right}>
                                                                <span>FLOOR PRICE: {trbItem.floorPrice} ◎ </span>
                                                                <span>TOTAL FLOOR VALUE: {trbItem.totalFloorValue} ◎ </span>
                                                            </Box>
                                                        </Box>
                                                        <Box className={styles.tradable_list}>
                                                            {
                                                                trbItem.items.map((item, key) => (
                                                                    <Box key={key} className={styles.tradable_item}>
                                                                        <Box className={styles.img_wrapper}>
                                                                            <img className="img_responsive" src={item.img} alt="" />
                                                                            <Typography color="#fff" sx={{ mt: 1, fontSize: "14px" }}>{item.name}</Typography>
                                                                            <Box className="ds-flex align-center">
                                                                                <CheckCircleOutlineIcon sx={{ color: '#7FF9E6', fontSize: "13px" }} />&nbsp;
                                                                                <Typography color="#7FF9E6" sx={{ fontSize: "12px" }}>{trbItem.collectionName}</Typography>
                                                                            </Box>
                                                                            <Button className={styles.btn_add_listing} onClick={() => router.push(`/item-details/${item.mint}`, `/item-details/${item.mint}`, { shallow: true })}>Update Listing</Button>
                                                                        </Box>
                                                                    </Box>
                                                                ))
                                                            }
                                                        </Box>
                                                    </Fragment>
                                                ))
                                            }
                                        </Fragment>
                                    }
                                </Fragment>}
                                {
                                    tab === 'offers-made' && <Fragment>
                                        <div className={styles.table_container}>
                                            <table>
                                                <thead>
                                                    <tr>
                                                        <th>NAME</th>
                                                        <th>STATUS</th>
                                                        <th>YOUR OFFER</th>
                                                        <th>CURRENT PRICE</th>
                                                        <th>TIME</th>
                                                        <th>ACTION</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {
                                                        offersMadeList.length > 0 && offersMadeList.map((item, index) => (
                                                            <tr key={index}>
                                                                <td>
                                                                    <img src={item.image} alt="" />
                                                                    {item.name}
                                                                </td>
                                                                <td>
                                                                    {item.status === 0 &&
                                                                        <Box className="ds-flex align-center">
                                                                            {/* <HourglassBottomOutlinedIcon sx={{ color: "#aaa", fontSize: "18px" }} /> */}
                                                                            <span style={{ color: "#aaa" }}>Canceled</span>
                                                                        </Box>
                                                                    }
                                                                    {item.status === 1 &&
                                                                        <Box className="ds-flex align-center">
                                                                            <HourglassBottomOutlinedIcon sx={{ color: "#FF8A00", fontSize: "18px" }} />
                                                                            <span style={{ color: "#FF8A00" }}>Pending</span>
                                                                        </Box>
                                                                    }
                                                                    {item.status === 2 &&
                                                                        <Box className="ds-flex align-center">
                                                                            <CheckCircleOutlineIcon sx={{ color: "#7FF9E6", fontSize: "18px" }} />&nbsp;
                                                                            <span style={{
                                                                                color: "#7FF9E6"
                                                                            }}>Offer Accepted</span>
                                                                        </Box>
                                                                    }

                                                                    {item.status === 3 &&
                                                                        <Box className="ds-flex align-center">
                                                                            <StopCircleOutlinedIcon sx={{ color: "#aaa", fontSize: "18px" }} />&nbsp;
                                                                            <span style={{ color: "#aaa" }}>Item Sold</span>
                                                                        </Box>

                                                                    }
                                                                </td>
                                                                <td>{item.offerPrice}</td>
                                                                <td>{item.currentPrice} ◎ </td>
                                                                <td>{moment(item.updated_at).fromNow()}</td>
                                                                <td><span style={{
                                                                    color: "#7FF9E6"
                                                                }}>{(item.status === 1) ? <span onClick={() => cancelOffer(item.mintAddress)}>cancel</span> : ''}</span></td>
                                                            </tr>
                                                        ))
                                                    }
                                                </tbody>
                                            </table>
                                            {
                                                offersMadeList.length === 0 && <Typography sx={{ textAlign: "center", lineHeight: "300px" }} color="#aaa" >No available items</Typography>
                                            }
                                        </div>
                                    </Fragment>}
                                {
                                    tab === 'activities' && <div className={styles.table_container}>
                                        <table>
                                            <thead>
                                                <tr>
                                                    <th>NAME</th>
                                                    <th>TXN ID</th>
                                                    <th>TYPE</th>
                                                    <th>TIME</th>
                                                    <th>AMOUNT</th>
                                                    <th>MINT ADDRESS</th>
                                                    <th>BUYER</th>
                                                    <th>SELLER</th>
                                                </tr>
                                            </thead>
                                            <tbody >
                                                {
                                                    myActivities.map((item, index) => (
                                                        <tr key={index}>
                                                            <td>
                                                                <img src={item.image} alt="" />
                                                                {item.name}
                                                            </td>
                                                            <td>
                                                                <Box style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
                                                                    <span>{item.signature.substr(0, 6)} ... {item.signature.substr(item.signature.length - 3, 3)}</span>
                                                                </Box>
                                                            </td>
                                                            <td>
                                                                {item.type === 1 &&
                                                                    <span style={{ color: "#fff" }}>Listing'</span>
                                                                }
                                                                {item.type === 2 &&
                                                                    <span style={{ color: "#fff" }}>Update Listing'</span>
                                                                }
                                                                {item.type === 3 &&
                                                                    <span style={{ color: "#ccc" }}>Cancel Listing'</span>
                                                                }
                                                                {(item.type === 4 || item.type === 8) && wallet?.publicKey.toString() === item.to &&
                                                                    <span style={{
                                                                        color: "#7FF9E6"
                                                                    }}>Sale</span>
                                                                }
                                                                {(item.type === 4 || item.type === 8) && wallet?.publicKey.toString() === item.from &&
                                                                    <span style={{
                                                                        color: "#7FF9E6"
                                                                    }}>Buy</span>
                                                                }
                                                                {item.type === 5 &&
                                                                    <span style={{ color: "#00D2FF" }}>Place Bid </span>
                                                                }
                                                                {item.type === 6 &&
                                                                    <span style={{ color: "#555" }}>Update Bid </span>
                                                                }
                                                                {item.type === 7 &&
                                                                    <span style={{ color: "#555" }}>Cancel Bid </span>
                                                                }
                                                            </td>
                                                            <td>
                                                                {moment(item.created_at).fromNow()}
                                                            </td>
                                                            <td>{item.price} ◎ </td>
                                                            <td>{item.type !== 0 && <span>{item.mintAddress.substr(0, 6)} ... {item.mintAddress.substr(item.mintAddress.length - 3, 3)}</span>}</td>
                                                            <td>{item.from.substr(0, 6)} ... {item.from.substr(item.from.length - 3, 3)}</td>
                                                            <td>{item.type !== 1 && <span>{item.to.substr(0, 6)} ... {item.to.substr(item.to.length - 3, 3)}</span>}</td>
                                                        </tr>
                                                    ))
                                                }

                                            </tbody>
                                        </table>
                                        {
                                            myActivities.length === 0 && <Typography sx={{ textAlign: "center", lineHeight: "300px" }} color="#aaa" >No available items</Typography>
                                        }
                                    </div>
                                }
                                {tab === 'offers-received' && <div className={styles.table_container}>
                                    <table>
                                        <thead>
                                            <tr>
                                                <th>NAME</th>
                                                <th>Listed</th>
                                                <th>OFFERED PRICE</th>
                                                <th>YOUR PRICE</th>
                                                <th>DIFFERENCE (%)</th>
                                                <th>FROM</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                offersReceivedList.length > 0 && offersReceivedList.map((item, index) => (
                                                    <tr key={index}>
                                                        <td>
                                                            <img src={item.image} alt="" />
                                                            {item.name}
                                                        </td>
                                                        <td>{item.status === 1 && 'Yes'}</td>
                                                        <td>{item.offerPrice > 0 ? item.offerPrice + '◎ ' : ''} </td>
                                                        <td>{item.price > 0 ? item.price + '◎ ' : ''} </td>
                                                        <td><span style={{
                                                            color: "#FF6666"
                                                        }}>{item.offerPrice !== 0 ? '- ' + (item.offerPrice / item.price).toFixed(2) + '%' : ''}</span></td>
                                                        <td>{item.walletAddress}</td>
                                                    </tr>
                                                ))
                                            }
                                        </tbody>
                                    </table>
                                    {
                                        offersReceivedList.length === 0 && <Typography sx={{ textAlign: "center", lineHeight: "300px" }} color="#aaa" >No available items</Typography>
                                    }
                                </div>}
                            </Box>
                        </Box>
                    </div>
                </div>
                <ProcessingModal loading={txProcessing} />
            </div>
        </Box >
    )
}

MyItems.getInitialProps = async ({ store }) => {

};

const mapStateToProps = state => {

    return {
        people: state.people?.people || [],
        selectedPerson: state.people.selectedPerson,
        sidebarOpen: state.init.sidebarOpen
    };
};

const mapDispatchToProps = { handleSidebarOpen, handleSidebarClose };

export default connect(mapStateToProps, mapDispatchToProps)(MyItems);
