import React, { Fragment, useState, useEffect, PureComponent } from 'react'
import { connection as reduxConnection } from 'react-redux'
import { useRouter } from 'next/router'
import CssBaseline from '@mui/material/CssBaseline'

import { styled } from '@mui/material/styles'
import { makeStyles, withStyles } from '@mui/styles';
import Grid from '@mui/material/Grid'
import Paper from '@mui/material/Paper'
import Box from '@mui/material/Box'

import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import CardMedia from '@mui/material/CardMedia'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import ActionButton from '../../components/ItemDetails/Button'
import FooterDescription from '../../components/ItemDetails/FooterDescription'
import AcceptOfferModal from '../../components/ItemDetails/AcceptOfferModal'
import MakeOfferModal from '../../components/ItemDetails/MakeOfferModal'
import { CircularProgress, Backdrop, getListItemSecondaryActionClassesUtilityClass } from '@mui/material'

import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';

import Sidebar from '../../components/Sidebar'
import Header from '../../components/Header'
import styles from "../../styles/ItemDetails.module.scss"
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import Link from 'next/link'
// const Item = styled(Paper)(({ theme }) => ({
//     backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
//     ...theme.typography.body2,
//     padding: theme.spacing(1),
//     textAlign: 'center',
//     color: theme.palette.text.secondary,
// }))
import { handleSidebarOpen, handleSidebarClose } from "store/actions/init"
import {
    WalletMultiButton,
} from "@solana/wallet-adapter-react-ui"
import { connect, useSelector, useDispatch } from "react-redux"
import { useConnection, useAnchorWallet, useWallet } from "@solana/wallet-adapter-react";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useResize } from '../../utils/Helper'
import commonService from "../../config/services/common.service";
import { MARKETPLACES_API, serverUrl } from "../../config";
import { getMetadataKey } from "../../config/helpers/methods"
import { signAndSendTransaction } from 'config/helpers/sol/connection';
import { Connection, PublicKey, Transaction, Keypair } from "@solana/web3.js";
import { Metadata } from "@metaplex-foundation/mpl-token-metadata";
import ProcessingModal from '@components/ProcessingModal';

import getCollectionSymbol from "../../config/utils/getCollectionSymbol";

import { bs58 } from "@project-serum/anchor/dist/cjs/utils/bytes";
import NodeWallet from "@project-serum/anchor/dist/cjs/nodewallet";
import { toast } from 'react-toastify'
import moment from 'moment';

import { devnet } from 'constants/cluster'

// const connection = new Connection('https://metaplex.devnet.rpcpool.com');
const delay = (ms: any) => new Promise(res => setTimeout(res, ms));
const nftProperyList: any[] = [
    { name: "BACKGROUND", value: "Purple", trait: 10 },
    { name: "FACTION", value: "The Bellicose", trait: 25 },
    { name: "BODY", value: "Grunt", trait: 10 },
    { name: "RIGHT SHOULDER", value: "Balde", trait: 6 },
    { name: "HEADER", value: "Skull", trait: 2 },
    { name: "LEFT SHOULDER", value: "Grenade Lanuncer", trait: 5 }
]

interface TabPanelProps {

    children?: React.ReactNode;
    index: number;
    value: number;
    type: number
}

function TabPanel(props: TabPanelProps) {
    const { children, value, index, type, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                type === 1 ? <Box sx={{ p: 2 }}>
                    {children}
                </Box> : <Box sx={{ pt: 2, pb: 2 }}>
                    {children}
                </Box>

            )}
        </div>
    );
}

function a11yProps(index: number) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

const TabAttributesLabel = () => {
    return <Box className="ds-flex align-center">
        <img src="/assets/images/diamond_icon.png" alt="" />
        <Typography sx={{ ml: 1, textTransform: "none" }}>Attributes</Typography>
    </Box>
}

const TabDetailsLabel = () => {
    return <Box className="ds-flex align-center">
        <img src="/assets/images/paper1_icon.png" alt="" />
        <Typography sx={{ ml: 1, textTransform: "none" }}>Details</Typography>
    </Box>
}



const activitiesList: any[] = [
    { name: 'Decimus #1506', img: "./assets/images/nft1_sm.png", txnId: '4UiB5 ... twL', type: 'Listing', time: '12 hours ago', amount: 4.40, buyer: '', seller: '5ydsE ... urj' },
    { name: 'Decimus #1506', img: "./assets/images/nft1_sm.png", txnId: '4UiB5 ... twL', type: 'Place Bid', time: '13 hours ago', amount: 3.51, buyer: '6jajE ... eLr', seller: '' },
    { name: 'Decimus #1506', img: "./assets/images/nft1_sm.png", txnId: '4UiB5 ... twL', type: 'Cancel Bid', time: '13 hours ago', amount: 3.51, buyer: '6jajE ... eLr', seller: '' },
    { name: 'Decimus #1506', img: "./assets/images/nft1_sm.png", txnId: '4UiB5 ... twL', type: 'Sale', time: '23 hours ago', amount: 5.8, buyer: '6jajE ... eLr', seller: '3URWQ ... SF9' },
    { name: 'Decimus #1506', img: "./assets/images/nft1_sm.png", txnId: '4UiB5 ... twL', type: 'Listing', time: '23 hours ago', amount: 5.8, buyer: '', seller: '3URWQ ... SF9' }
]

const data = [
    {},
    {
        name: 'Apr 17',
        price: 1,
    },
    {
        name: 'Apr 23',
        price: 7,
    },
    {
        name: 'Apr 28',
        price: 3,
    },
    {
        name: 'May 01',
        price: 6,
    },
    {
        name: 'May 07',
        price: 2,
    },
    {}
];
const useStyles = makeStyles((theme) => ({
    root: {

    },
    item_details_card: {
        backgroundColor: "transparent",
        boxShadow: "none"
    },
    item_card_content: {
        marginTop: `16px`,
        padding: 0,
        paddingBottom: '0 !important'
    },
    wallet_cardActions: {
        marginTop: "10px",
        padding: 0
    },
    item_details_center_width: {
        width: '100%'
    },
    item_details_center_content: {
        borderBottom: '8px',
        borderColor: 'divider'
    },
    item_tab_detail_content_upper: {
        padding: "15px",
        border: "1px solid #0b354d",
        borderRadius: "5px"
    },
    item_tab_detail_content_lower: {
        marginTop: '16px',
        padding: "15px",
        border: "1px solid #0b354d",
        borderRadius: "5px"
    },
    content_lower_individual_section: {
        marginBottom: '16px'
    }
}));


const ItemDetails = ({ sidebarOpen, walletInfo }) => {
    const anchorWallet: any = useAnchorWallet();
    const { connection } = useConnection()
    const router: any = useRouter()
    const address: any = router.query.address
    const dispatch = useDispatch();

    //const loading = useSelector(dropsLoadingSelector);
    const [loading, setLoading] = useState<boolean>(false);
    const [txProcessing, setTxProcessing] = useState<boolean>(false);
    const wallet = useWallet();

    const [showAlert, setShowAlert] = React.useState(false);
    const [alertTypeValue, setAlertTypeValue] = React.useState<any>("");
    const [alertMessageValue, setAlertMessageValue] = React.useState("");
    const [refresh, setRefresh] = React.useState<boolean>(true);

    const [metaInfo, setMetaInfo] = useState<any>({})
    const [metadata, setMetadata] = useState<any>({})
    const [listItem, setListItem] = useState<any>({})
    const [offerItem, setOfferItem] = useState<any>({})
    const [offerList, setOfferList] = useState<any>([])

    const [isListed, setIsListed] = useState<boolean>(false);
    const [isOffered, setIsOffered] = useState<boolean>(false);
    const [isAcceptOffer, setIsAcceptOffer] = useState<boolean>(false);
    const [owner, setOwner] = useState<any>('')
    const [tokenAddress, setTokenAddress] = useState<any>('')
    const [listPrice, setListPrice] = useState<any>(0);
    const [offerPrice, setOfferPrice] = useState<any>(0);
    const [nftActivities, setNftActivities] = useState<any>([])
    const [highestOffer, setHighestOffrer] = useState<any>({})
    const [moreNfts, setMoreNfts] = useState<any>([])
    const [colName, setColName] = useState<string>('')
    const [priceData, setPriceData] = useState<any>([])
    const [marketFee, setMarketFee] = useState<string>('')

    const classes = useStyles();

    const [open, setOpen] = useState<boolean>(false)
    const [value, setValue] = React.useState(0);
    const [value1, setValue1] = React.useState(0);
    const { isMobile } = useResize();

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    const handleChange1 = (event: React.SyntheticEvent, newValue: number) => {
        setValue1(newValue);
    };

    const [acceptOfferModalOpen, setAcceptOfferModalOpen] = useState<boolean>(false)

    const hanldeAcceptOfferModalOpen = () => {
        setAcceptOfferModalOpen(true)
    }

    const handleAcceptOfferModalClose = () => {
        setAcceptOfferModalOpen(false)
    }

    const [makeOfferModalOpen, setMakeOfferModalOpen] = useState<boolean>(false)

    const hanldeMakeOfferModalOpen = () => {
        setMakeOfferModalOpen(true)
    }

    const handleMakeOfferModalClose = () => {
        setMakeOfferModalOpen(false)
    }

    const getMetadata = async (mint: PublicKey) => {
        const devnetConnection = new Connection(devnet);
        let tokenmetaPubkey = await Metadata.getPDA(mint);

        const tokenmeta = await Metadata.load(devnetConnection, tokenmetaPubkey);
        return tokenmeta
        console.log(tokenmeta);

    }

    const makeList = async () => {
        if (!wallet.publicKey) {
            toast.error("Please connect to your wallet.", { theme: 'dark' })
            return;
        }
        if (address && listPrice > 0 && wallet.publicKey) {
            let result: any;
            setTxProcessing(true);
            result = await commonService({
                method: "post",
                route: `${MARKETPLACES_API.GET_MAKELSIT_TX}`,
                data: {
                    mintAddress: address,
                    price: listPrice
                }
            });
            // const resObj = JSON.parse(new TextDecoder().decode(new Uint8Array(result.tx.data)))

            if (result?.tx?.data) {
                console.log('result.tx.data', result.tx.data)
                const transaction: Transaction = Transaction.from(result.tx.data);
                console.log('transaction', transaction)
                try {
                    const res = await signAndSendTransaction(connection, anchorWallet, transaction);
                    // if (res?.txid && res?.slot) {
                    if (res?.txid) {
                        const listResult = await commonService({
                            method: "post",
                            route: `${MARKETPLACES_API.GET_MAKELSIT_TX_CONF}`,
                            data: {
                                mintAddress: address,
                                price: listPrice,
                                walletAddress: wallet.publicKey.toString(),
                                signature: res.txid
                            }
                        });
                        toast.success("Your NFT is sucessfully listed.", { theme: 'dark' })
                        await delay(2000);
                        router.push(`/item-details/${address}`, `/item-details/${address}`, { shallow: true })
                        // setRefresh(!refresh)
                    }
                    else {
                        toast.error("Listing is failed, Please try again.", { theme: 'dark' })
                    }
                }
                catch (err) {
                    console.log(`ERROR TXID`, err);
                    toast.error("Transaction was failed. Please try again.", { theme: 'dark' })
                }
            }
            else {
                toast.error("Listing is failed, Please try again.", { theme: 'dark' })
            }
            setTxProcessing(false);
        }
        else {
            toast.error("Please input your listing price.", { theme: 'dark' })
        }
    }

    const changePrice = async () => {
        if (!anchorWallet) {
            toast.error("Please connect to your wallet.", { theme: 'dark' })
            return;
        }

        if (address && listPrice > 0 && anchorWallet) {
            if (listPrice === listItem?.price) {
                toast.error("Please change your current price.", { theme: 'dark' })
                return
            }

            let result: any;
            setLoading(true);
            setTxProcessing(true);
            result = await commonService({
                method: "post",
                route: `${MARKETPLACES_API.GET_UPDATE_NFT_TX}`,
                data: {
                    mintAddress: address,
                    walletAddress: wallet.publicKey?.toString(),
                    price: listPrice
                }
            });
            // const resObj = JSON.parse(new TextDecoder().decode(new Uint8Array(result.tx.data)))
            if (result?.tx?.data) {
                const transaction: Transaction = Transaction.from(result.tx.data);
                try {
                    const res = await signAndSendTransaction(connection, anchorWallet, transaction);
                    // if (res?.txid && res?.slot) {
                    if (res?.txid) {
                        const updateResult = await commonService({
                            method: "post",
                            route: `${MARKETPLACES_API.GET_UPDATE_NFT_TX_CONF}`,
                            data: {
                                mintAddress: address,
                                price: listPrice,
                                signature: res.txid
                            }
                        });
                        toast.success("Your NFT price is changed successfully", { theme: 'dark' })
                        await delay(2000);
                        // setRefresh(!refresh);
                    }
                    else {
                        toast.error("Changing is failed, Please try again.", { theme: 'dark' })
                    }
                }
                catch (err) {
                    toast.error("Transaction was failed. Please try again.", { theme: 'dark' })
                }
            }
            else {
                toast.error("Changing is failed, Please try again.", { theme: 'dark' })
            }
            setLoading(false);
            setTxProcessing(false);
        }
        else {
            toast.error("Please input your changing price.", { theme: 'dark' })
        }
    }

    const cancelList = async () => {
        if (!anchorWallet) {
            toast.error("Please connect to your wallet.", { theme: 'dark' })
            return;
        }

        if (address && anchorWallet) {
            setTxProcessing(true);
            let result: any;
            setLoading(true);
            result = await commonService({
                method: "post",
                route: `${MARKETPLACES_API.GET_UNLIST_NFT_TX}`,
                data: {
                    walletAddress: wallet.publicKey?.toString(),
                    mintAddress: address
                }
            });
            // const resObj = JSON.parse(new TextDecoder().decode(new Uint8Array(result.tx.data)))
            if (result?.tx?.data) {
                console.log('result?.tx?.data', result?.tx?.data)
                const transaction: Transaction = Transaction.from(result.tx.data);
                try {
                    const res = await signAndSendTransaction(connection, anchorWallet, transaction);
                    // if (res?.txid && res?.slot) {
                    if (res?.txid) {
                        const cancelResult = await commonService({
                            method: "post",
                            route: `${MARKETPLACES_API.GET_UNLIST_NFT_TX_CONF}`,
                            data: {
                                mintAddress: address,
                                signature: res.txid
                            }
                        });
                        toast.success("Your Nft is canceled.", { theme: 'dark' })
                        await delay(2000);
                        router.push(`/item-details/${address}`, `/item-details/${address}`, { shallow: true })
                        // setRefresh(!refresh);
                    }
                    else {
                        toast.error("Canceling is failed, Please try again.", { theme: 'dark' })
                    }
                }
                catch (err) {
                    console.log(`eeeeee`, err);
                    toast.error("Transaction is failed, Please try again.", { theme: 'dark' })
                }
            }
            else {
                toast.error("Canceling is failed, Please try again.", { theme: 'dark' })
            }
            setLoading(false);
            setTxProcessing(false);
        }
        else {
            toast.error("Canceling is failed, Please try again.", { theme: 'dark' })
        }
    }

    const buyNft = async (seller: String) => {
        if (!anchorWallet) {
            toast.error("Please connect to your wallet.", { theme: 'dark' })
            return;
        }
        if (walletInfo.balance <= listPrice) {
            toast.error("Insufficient funds!", { theme: 'dark' })
            return;
        }
        if (address && anchorWallet) {
            let result: any;
            setLoading(true);
            setTxProcessing(true)
            result = await commonService({
                method: "post",
                route: `${MARKETPLACES_API.GET_BUY_TX}`,
                data: {
                    buyerAddress: wallet.publicKey?.toString(),
                    seller: seller,
                    mintAddress: address,
                }
            });
            try {
                const transaction: Transaction = Transaction.from(result.tx.data);
                try {
                    const res = await signAndSendTransaction(connection, anchorWallet, transaction);
                    // if (res?.txid && res?.slot) {
                    if (res?.txid) {
                        const buyResult = await commonService({
                            method: "post",
                            route: `${MARKETPLACES_API.GET_BUY_TX_CONF}`,
                            data: {
                                buyerAddress: wallet.publicKey?.toString(),
                                mintAddress: address,
                                signature: res.txid
                            }
                        });
                        toast.success("You bought one NFT successfully.", { theme: 'dark' })
                        await delay(2000);
                        router.push(`/me`, `/me`, { shallow: true })
                        // setRefresh(!refresh);
                    }
                    else {
                        toast.error("Transaction was fail ed. Please try again.", { theme: 'dark' })
                    }
                }
                catch (err) {
                    console.log(`eeeeee`, err);
                    toast.error("Transaction was failed. Please try again.", { theme: 'dark' })
                }

            }
            catch (err) {
                console.log(`eeeeee`, err);
                toast.error("Transaction was failed. Please try again.", { theme: 'dark' })
            }
            finally {
                setLoading(false);
            }
            setTxProcessing(false)
        }
    }

    const makeOffer = async (offerPrice) => {
        if (!anchorWallet) {
            toast.error("Please connect to your wallet.", { theme: 'dark' })
            return;
        }
        if (walletInfo.balance <= offerPrice) {
            toast.error("Insufficient funds!", { theme: 'dark' })
            return;
        }
        if (address && anchorWallet) {
            let result: any;
            setLoading(true);
            setTxProcessing(true)
            result = await commonService({
                method: "post",
                route: `${MARKETPLACES_API.GET_MAKEBID_TX}`,
                data: {
                    bidderAddress: wallet.publicKey?.toString(),
                    mintAddress: address,
                    offerPrice: offerPrice
                }
            });
            try {
                const transaction: Transaction = Transaction.from(result.tx.data);
                try {
                    const res = await signAndSendTransaction(connection, anchorWallet, transaction);
                    console.log('tx', res.txid)
                    // if (res?.txid && res?.slot) {
                    if (res?.txid) {
                        const bidResult = await commonService({
                            method: "post",
                            route: `${MARKETPLACES_API.GET_MAKEBID_TX_CONF}`,
                            data: {
                                bidderAddress: wallet.publicKey?.toString(),
                                mintAddress: address,
                                offerPrice: offerPrice,
                                signature: res.txid
                            }
                        });
                        toast.success("Offering NFT is done successfully.", { theme: 'dark' })
                        await delay(2000);
                        router.push('/me?tab=offers-made&filter=tradeable', '/me?tab=offers-made&filter=tradeable', { shallow: true })
                        // setRefresh(!refresh);
                    }
                    else {
                        toast.error("Transaction was failed. Please try again.", { theme: 'dark' })
                    }
                }
                catch (err) {
                    console.log(`eeeeee`, err);
                    toast.error("Transaction was failed. Please try again.", { theme: 'dark' })
                }

            }
            catch (err) {
                console.log(`eeeeee`, err);
                toast.error("Transaction was failed. Please try again.", { theme: 'dark' })
            }
            finally {
                setLoading(false);
            }
            setTxProcessing(false)
        }
    }

    const acceptOffer = async (offerPrice) => {
        if (!anchorWallet) {
            toast.error("Please connect to your wallet.", { theme: 'dark' })
            return;
        }
        if (address && anchorWallet) {
            let result: any;
            setLoading(true);
            setTxProcessing(true)
            result = await commonService({
                method: "post",
                route: `${MARKETPLACES_API.GET_ACCEPT_TX}`,
                data: {
                    bidderAddress: highestOffer?.walletAddress,
                    mintAddress: address,
                }
            });
            try {
                const transaction: Transaction = Transaction.from(result.tx.data);
                try {
                    const res = await signAndSendTransaction(connection, anchorWallet, transaction);
                    console.log('tx', res.txid)
                    // if (res?.txid && res?.slot) {
                    if (res?.txid) {
                        const bidResult = await commonService({
                            method: "post",
                            route: `${MARKETPLACES_API.GET_ACCEPT_TX_CONFT}`,
                            data: {
                                bidderAddress: highestOffer?.walletAddress,
                                mintAddress: address,
                                signature: res.txid
                            }
                        });
                        toast.success("Accepting NFT is done successfully.", { theme: 'dark' })
                        await delay(2000);
                        router.push('/me?tab=offers-made&filter=tradeable', '/me?tab=offers-made&filter=tradeable', { shallow: true })
                        // setRefresh(!refresh);
                    }
                    else {
                        toast.error("Transaction was failed. Please try again.", { theme: 'dark' })
                    }
                }
                catch (err) {
                    console.log(`eeeeee`, err);
                    toast.error("Transaction was failed. Please try again.", { theme: 'dark' })
                }

            }
            catch (err) {
                console.log(`eeeeee`, err);
                toast.error("Transaction was failed. Please try again.", { theme: 'dark' })
            }
            finally {
                setLoading(false);
            }
            setTxProcessing(false)
        }
    }


    const MakeListComponent = () => {
        return <Fragment>
            <input type="number" className="input-field1" onChange={(event) => {
                const price = parseFloat(event.target.value);
                if (price != NaN) {
                    setListPrice(price);
                }
            }} value={listPrice} />
            <CardActions sx={{ padding: 0 }}>
                <ActionButton text="List Now" bgColor="#1B6A97" onClick={async () => {
                    await makeList();
                }}></ActionButton>
            </CardActions>
            <FooterDescription label1="List Now"></FooterDescription>
        </Fragment>
    }

    const ConnectWalletComponent = () => {
        return <WalletMultiButton className={styles.wallet_adapter_button}>Connect Wallet</WalletMultiButton>
    }

    useEffect(() => {
        (async () => {
            setLoading(true);
            const _metaInfo: any = await getMetadata(address)
            console.log('metaInfo===========', _metaInfo)
            setMetaInfo(_metaInfo)
            const tokenUri = _metaInfo.data.data.uri
            const metadt: any = await fetch(tokenUri)
                .then(res => res.json())
                .catch(() => null)

            // const holders: any = await fetch(`https://api-devnet.solscan.io/token/holders?token=${address}&offset=0&size=20`)
            //     .then(res => res.json())
            //     .catch(() => null)
            // const holdersInfo: any = holders?.data?.result
            // setTokenAddress(holdersInfo[0].address)
            // setOwner(holdersInfo[0].owner)
            // console.log('owner', holdersInfo[0].owner)

            console.log('metadata-----', metadt)
            // console.log('holders------', holders)

            const connection = new Connection(devnet);
            const largestAccounts = await connection.getTokenLargestAccounts(new PublicKey(address));
            const largestAccountInfo: any = await connection.getParsedAccountInfo(largestAccounts.value[0].address
            );
            const owner: any = largestAccountInfo?.value?.data?.parsed?.info?.owner
            console.log('owener', owner);

            let response = await connection.getTokenAccountsByOwner(
                new PublicKey(owner), // owner here
                {
                    mint: new PublicKey(address)
                }
            );

            let tokenAccount = response.value[0].pubkey.toString()
            console.log('tokenAccount', tokenAccount)
            setTokenAddress(tokenAccount)
            setOwner(owner)

            setMetadata({ ...metadt })

            let listItemResult: any = await commonService({
                method: "get",
                route: `${MARKETPLACES_API.GET_LIST_ITEM}${address}`,
            });
            console.log(`listItemResult`, listItemResult);

            if (listItemResult?.data) {
                setListItem(listItemResult.data)
            }
            else if (listItemResult?.status && listItemResult?.status !== 0) {
                setListItem(listItemResult)
            }

            // setListItem(listItemResult?.status !== 0 ? listItemResult : listItemResult.data);
            setListPrice(listItemResult?.status === 1 ? listItemResult.price : 0)

            if (wallet?.publicKey) {
                let offerItemResult: any = await commonService({
                    method: "post",
                    route: `${MARKETPLACES_API.GET_OFFER_NFT_WALLET}`,
                    data: {
                        mintAddress: address,
                        walletAddress: wallet.publicKey.toString()
                    }
                });
                setOfferItem(offerItemResult.mintAddress ? offerItemResult : offerItemResult.data);
            }

            let _offerList: any = await commonService({
                method: "post",
                route: `${MARKETPLACES_API.GET_OFFER_ITEM}`,
                data: {
                    mintAddress: address,
                    limit: 100,
                    currentPage: 1
                }
            });
            setOfferList(_offerList.rows);

            let _highestOffer: any = await commonService({
                method: "post",
                route: `${MARKETPLACES_API.GET_TOP_BID}`,
                data: {
                    mintAddress: address,
                }
            });
            setHighestOffrer(_highestOffer);

            let _nftActivities: any = await commonService({
                method: "post",
                route: `${MARKETPLACES_API.GET_ACTIVITY_NFT}`,
                data: {
                    mintAddress: address,
                    limit: 100,
                    currentPage: 1
                }
            });
            setNftActivities(_nftActivities.rows);

            const symbol: string = getCollectionSymbol(metadt?.name)
            setColName(symbol)

            let _moreNfts: any = await commonService({
                method: "post",
                route: `${MARKETPLACES_API.GET_MORE_NFTS}`,
                data: {
                    mintAddress: address,
                    symbol: symbol
                }
            });
            setMoreNfts([..._moreNfts]);

            let _priceHistory: any = await commonService({
                method: "post",
                route: `${MARKETPLACES_API.GET_PRICE_HISTORY}`,
                data: {
                    mintAddress: address,
                }
            });

            console.log('priceHistory', _priceHistory)

            let _priceData: any = []
            _priceData.push({})
            _priceHistory.map((item: any, index: number) => {
                const createdAt = new Date(item.created_at);
                const month = new Intl.DateTimeFormat('en', { month: 'short' }).format(createdAt)
                const day = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(createdAt);
                _priceData.push({ name: `${month} ${day}`, price: item.price })
            })
            _priceData.push({})

            setPriceData([..._priceData])


            let feeInfo: any = await commonService({
                method: "get",
                route: `${MARKETPLACES_API.GET_SETTING}MARKETPLACE_FEE`,
            });
            setMarketFee(feeInfo.value)

            setLoading(false);
        })()
    }, [wallet, address, refresh])

    console.log('offerItem==================', offerItem)
    return (
        <Box className={styles.item_details_container}>
            <Sidebar activeKey={1} />
            {/* <CssBaseline /> */}
            <div className={styles.item_details_section}>
                <Header sidebarOpen={sidebarOpen} />
                <div className={styles.container} >
                    {
                        loading ?
                            <Backdrop
                                sx={{ color: "Grey", zIndex: (theme) => theme.zIndex.drawer + 1 }}
                                open={true}
                            >
                                <CircularProgress color="inherit" />
                                &nbsp; Loading...
                            </Backdrop> : <Box className={styles.item_details_wrapper}>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} md={3}>
                                        <Box className={styles.item_details_left}>
                                            <Card className={classes.item_details_card}>

                                                <CardMedia
                                                    component="img"
                                                    alt="green iguana"
                                                    // height="140"
                                                    image={Object.keys(metadata).length > 0 && metadata.image}
                                                />
                                                <CardContent className={classes.item_card_content}>
                                                    <Box className="ds-flex justify-between align-center">
                                                        <Typography variant="h6" component="div" color="#fff" sx={{ fontSize: "24px" }}>
                                                            {Object.keys(metadata).length > 0 && metadata.name}
                                                        </Typography>
                                                        <Link href={`/collection/${colName}`}>
                                                            <img src="/assets/images/link_icon1.png" alt="" style={{ cursor: "pointer" }} />
                                                        </Link>
                                                    </Box>
                                                    <Box className="ds-flex align-center" sx={{ marginBottom: "10px", color: "#7FF9E6" }}>
                                                        <CheckCircleOutlineIcon sx={{ fontSize: "16px" }} />
                                                        <Typography component="div" sx={{ fontSize: "16px" }}>
                                                            {Object.keys(metadata).length > 0 && metadata.collection?.name}
                                                        </Typography>
                                                    </Box>
                                                    {
                                                        Object.keys(listItem).length > 0 ? <Fragment>
                                                            {
                                                                listItem?.status === 1 ? <Fragment>
                                                                    <Grid spacing={2} container>
                                                                        <Grid item xs={12} md={6}>
                                                                            <Typography component="div" color="#aaa" sx={{ fontSize: "16px" }}>
                                                                                Current Price
                                                                            </Typography>
                                                                            {
                                                                                wallet.publicKey?.toString() === listItem.walletAddress ? <input className="input-field1" type="number" placeholder="List Price (SOL)" onChange={(event) => {
                                                                                    const price = parseFloat(event.target.value);
                                                                                    if (price != NaN) {
                                                                                        setListPrice(price);
                                                                                    }
                                                                                }} value={listPrice} /> : <Typography component="div" color="#fff" sx={{ pt: 1, fontSize: "24px" }}>
                                                                                    {listPrice} ◎
                                                                                </Typography>

                                                                            }
                                                                        </Grid>
                                                                        <Grid item xs={12} md={6}>
                                                                            <Typography component="div" color="#aaa" sx={{ fontSize: "16px" }}>
                                                                                Highest Offer
                                                                            </Typography>
                                                                            <Typography component="div" color="#fff" sx={{ pt: 1, fontSize: "24px" }}>
                                                                                {highestOffer?.offerPrice ? highestOffer?.offerPrice : 0} ◎
                                                                            </Typography>
                                                                        </Grid>

                                                                    </Grid>
                                                                    {
                                                                        wallet.publicKey ? <Fragment>
                                                                            {
                                                                                wallet.publicKey?.toString() === listItem.walletAddress ? <Fragment>
                                                                                    <CardActions sx={{ marginTop: "10px", padding: 0 }}>
                                                                                        <Grid spacing={2} container>
                                                                                            <Grid item xs={12} md={6}>
                                                                                                <ActionButton text="Change Price" bgColor="#1B6A97" onClick={async () => {
                                                                                                    await changePrice()
                                                                                                }}></ActionButton>
                                                                                            </Grid>
                                                                                            <Grid item xs={12} md={6}>
                                                                                                {
                                                                                                    highestOffer?.offerPrice ? <ActionButton text="Accept Offer" bgColor="#1B6A97" onClick={hanldeAcceptOfferModalOpen}></ActionButton> : <ActionButton opacity={0.3} text="Accept Offer" bgColor="#1B6A97" onClick={() => { }}></ActionButton>
                                                                                                }

                                                                                            </Grid>
                                                                                        </Grid>
                                                                                    </CardActions>
                                                                                    <Box sx={{ mt: 2 }}>
                                                                                        <ActionButton text="Cancel Listing" bgColor="#0C4258" onClick={async () => {
                                                                                            await cancelList();
                                                                                        }}></ActionButton>
                                                                                    </Box>
                                                                                    <FooterDescription label1="Cancel Listing"></FooterDescription>
                                                                                </Fragment> : <Fragment>
                                                                                    <Grid spacing={2} container>
                                                                                        <Grid item xs={12} md={6}>
                                                                                            <ActionButton text="Buy Now" bgColor="#1B6A97" onClick={async () => {
                                                                                                await buyNft(listItem?.walletAddress);
                                                                                            }}></ActionButton>
                                                                                        </Grid>
                                                                                        <Grid item xs={12} md={6}>
                                                                                            {
                                                                                                offerItem?.status === 1 ? <div style={{ pointerEvents: 'none', opacity: '0.5' }}>
                                                                                                    <ActionButton onClick={hanldeMakeOfferModalOpen} text="Make an Offer" borderColor="#1B6A97"></ActionButton>
                                                                                                </div> : <ActionButton onClick={hanldeMakeOfferModalOpen} text="Make an Offer" borderColor="#1B6A97"></ActionButton>
                                                                                            }
                                                                                        </Grid>
                                                                                    </Grid>
                                                                                    <FooterDescription label1="Buy Now" label2="Make an Offer"></FooterDescription>
                                                                                </Fragment>
                                                                            }
                                                                        </Fragment> : <Fragment>
                                                                            <ConnectWalletComponent />
                                                                        </Fragment>
                                                                    }
                                                                </Fragment> : <Fragment>
                                                                    {
                                                                        wallet.publicKey ? <Fragment>
                                                                            {
                                                                                wallet.publicKey?.toString() === listItem.walletAddress ? <MakeListComponent /> : <Typography component="div" color="#aaa" sx={{ mt: 2, fontSize: "14px" }}>
                                                                                    Not Listed
                                                                                </Typography>
                                                                            }
                                                                        </Fragment> : <Fragment>
                                                                            <ConnectWalletComponent />
                                                                        </Fragment>
                                                                    }
                                                                </Fragment>

                                                            }
                                                        </Fragment> : <Fragment>
                                                            {
                                                                wallet.publicKey?.toString() === owner ? <Fragment>
                                                                    <MakeListComponent />
                                                                </Fragment> : <Fragment>
                                                                    <Typography component="div" color="#aaa" sx={{ mt: 2, fontSize: "14px" }}>
                                                                        Not Listed
                                                                    </Typography>
                                                                </Fragment>
                                                            }
                                                        </Fragment>
                                                    }
                                                </CardContent>
                                            </Card>
                                        </Box>
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <Box className={styles.item_details_center}>
                                            <Box className={classes.item_details_center_width}>
                                                <Box className={classes.item_details_center_content}>
                                                    <Tabs value={value} onChange={handleChange} aria-label="basic tabs example"
                                                        sx={{
                                                            background: "#102841",
                                                            '& .MuiTab-root': {
                                                                color: "#aaa",
                                                                fontSize: "12px"
                                                            },
                                                            '& .Mui-selected': {
                                                                background: "#0d2031",
                                                                borderTopLeftRadius: "5px", borderTopRightRadius: "5px"
                                                            },
                                                            '& .Mui-selected p': {
                                                                color: "#fff"
                                                            },
                                                            '& .MuiTabs-indicator': { display: "none" }
                                                        }}
                                                    >
                                                        <Tab label={<TabAttributesLabel />} {...a11yProps(0)} />
                                                        <Tab label={<TabDetailsLabel />} {...a11yProps(1)} />
                                                    </Tabs>
                                                </Box>
                                                <TabPanel value={value} index={0} type={1}>
                                                    <Box className={styles.nft_property_list} >
                                                        <Grid container spacing={2}>
                                                            {
                                                                Object.keys(metadata).length > 0 && metadata.attributes.map((item, index) => (
                                                                    <Grid key={index} item xs={12} md={4}>
                                                                        {/* <Box className={styles.nft_property_item + ' ' + (index === 4 ? styles.active : '')}> */}
                                                                        <Box className={styles.nft_property_item + ' ' + (index === 4 ? '' : '')}>
                                                                            <Typography color="#aaa" sx={{ fontSize: "13px" }}>{item.trait_type}</Typography>
                                                                            <Typography color="#fff" sx={{ fontSize: "14px" }}>{item.value}</Typography>
                                                                            <Typography color="#7FF9E6" sx={{ fontSize: "13px" }}>{5}% have this trait</Typography>
                                                                        </Box>
                                                                    </Grid>
                                                                ))
                                                            }
                                                        </Grid>
                                                    </Box>
                                                </TabPanel>
                                                <TabPanel value={value} index={1} type={1}>
                                                    <Box className={classes.item_tab_detail_content_upper} sx={{ padding: "15px", border: "1px solid #0b354d", borderRadius: "5px" }}>
                                                        <Typography color="#fff" sx={{ fontSize: "14px", marginBottom: "20px" }}>About {Object.keys(metadata).length > 0 && metadata.collection?.name}</Typography>
                                                        <Typography color="#aaa" sx={{ fontSize: "13px" }}>{Object.keys(metadata).length > 0 && metadata.description}</Typography>
                                                    </Box>
                                                    <Box className={classes.item_tab_detail_content_lower}>
                                                        <Grid container className={classes.content_lower_individual_section}>
                                                            <Grid item xs={12} md={6}>
                                                                <Typography color="#fff">Mint Address</Typography>
                                                            </Grid>
                                                            <Grid item xs={12} md={6}>
                                                                <Box>
                                                                    <Typography color="#aaa">{address?.substr(0, 6)}...{address?.substr(address?.length - 3, 3)}</Typography>
                                                                </Box>
                                                                <Box className="ds-flex align-center">
                                                                    <Link href={`https://solscan.io/token/${address}?cluster=devnet`}>
                                                                        <Box className="ds-flex align-center" sx={{ cursor: "pointer" }}>
                                                                            <Typography color="#7FF9E6" sx={{ '&:hover': { textDecoration: "underline" }, fontSize: "10px" }}>VIEW ON SOLSCAN</Typography>&nbsp;
                                                                            <img src="/assets/images/link_icon2.png" alt="" />
                                                                        </Box>
                                                                    </Link>
                                                                    <Link href="https://explorer.solana.com/">
                                                                        <Box className="ds-flex align-center" sx={{ cursor: "pointer" }}>
                                                                            <Typography color="#00D2FF" sx={{ ml: 2, '&:hover': { textDecoration: "underline" }, fontSize: "10px" }}>VIEW ON EXPLORER</Typography>&nbsp;
                                                                            <img src="/assets/images/link_icon3.png" alt="" />
                                                                        </Box>
                                                                    </Link>
                                                                </Box>
                                                            </Grid>
                                                        </Grid>
                                                        <Grid container className={classes.content_lower_individual_section}>
                                                            <Grid item xs={12} md={6}>
                                                                <Typography color="#fff">Token Address</Typography>
                                                            </Grid>
                                                            <Grid item xs={12} md={6}>
                                                                <Box>
                                                                    <Typography color="#aaa">{tokenAddress?.substr(0, 6)}...{tokenAddress?.substr(tokenAddress?.length - 3, 3)}</Typography>
                                                                </Box>
                                                                <Box className="ds-flex align-center">
                                                                    <Link href={`https://solscan.io/token/${tokenAddress}?cluster=devnet`}>
                                                                        <Box className="ds-flex align-center" sx={{ cursor: "pointer" }}>
                                                                            <Typography color="#7FF9E6" sx={{ '&:hover': { textDecoration: "underline" }, fontSize: "10px" }}>VIEW ON SOLSCAN</Typography>&nbsp;
                                                                            <img src="/assets/images/link_icon2.png" alt="" />
                                                                        </Box>
                                                                    </Link>
                                                                    <Link href="https://explorer.solana.com/">
                                                                        <Box className="ds-flex align-center" sx={{ cursor: "pointer" }}>
                                                                            <Typography color="#00D2FF" sx={{ ml: 2, '&:hover': { textDecoration: "underline" }, fontSize: "10px" }}>VIEW ON EXPLORER</Typography>&nbsp;
                                                                            <img src="/assets/images/link_icon3.png" alt="" />
                                                                        </Box>
                                                                    </Link>
                                                                </Box>
                                                            </Grid>
                                                        </Grid>
                                                        <Grid container className={classes.content_lower_individual_section}>
                                                            <Grid item xs={12} md={6}>
                                                                <Typography color="#fff">Owner</Typography>
                                                            </Grid>
                                                            <Grid item xs={12} md={6}>
                                                                <Box>
                                                                    <Typography color="#aaa">{owner?.substr(0, 6)}...{owner?.substr(owner?.length - 3, 3)}</Typography>
                                                                </Box>
                                                                <Box className="ds-flex align-center">
                                                                    <Link href={`https://solscan.io/account/${owner}?cluster=devne`}>
                                                                        <Box className="ds-flex align-center" sx={{ cursor: "pointer" }}>
                                                                            <Typography color="#7FF9E6" sx={{ '&:hover': { textDecoration: "underline" }, fontSize: "10px" }}>VIEW ON SOLSCAN</Typography>&nbsp;
                                                                            <img src="/assets/images/link_icon2.png" alt="" />
                                                                        </Box>
                                                                    </Link>
                                                                    <Link href="https://explorer.solana.com/">
                                                                        <Box className="ds-flex align-center" sx={{ cursor: "pointer" }}>
                                                                            <Typography color="#00D2FF" sx={{ ml: 2, '&:hover': { textDecoration: "underline" }, fontSize: "10px" }}>VIEW ON EXPLORER</Typography>&nbsp;
                                                                            <img src="/assets/images/link_icon3.png" alt="" />
                                                                        </Box>
                                                                    </Link>
                                                                </Box>
                                                            </Grid>
                                                        </Grid>
                                                        {/* <Grid container className={classes.content_lower_individual_section}>
                                                            <Grid item xs={12} md={6}>
                                                                <Typography color="#fff">Artist Royalties</Typography>
                                                            </Grid>
                                                            <Grid item xs={12} md={6}>
                                                                <Box className="ds-flex align-center">
                                                                    <Typography color="#aaa">5%</Typography>
                                                                </Box>
                                                            </Grid>
                                                        </Grid> */}
                                                        <Grid container className={classes.content_lower_individual_section}>
                                                            <Grid item xs={12} md={6}>
                                                                <Typography color="#fff">Transaction Fee</Typography>
                                                            </Grid>
                                                            <Grid item xs={12} md={6}>
                                                                <Box className="ds-flex align-center">
                                                                    <Typography color="#aaa">{marketFee}%</Typography>
                                                                </Box>
                                                            </Grid>
                                                        </Grid>
                                                        <Grid container className={classes.content_lower_individual_section}>
                                                            <Grid item xs={12} md={6}>
                                                                <Typography color="#fff">Listing/Bidding/Cancel</Typography>
                                                            </Grid>
                                                            <Grid item xs={12} md={6}>
                                                                <Box className="ds-flex align-center">
                                                                    <Typography color="#aaa">Free</Typography>
                                                                </Box>
                                                            </Grid>
                                                        </Grid>
                                                        <Grid container sx={{ mb: 2 }}>
                                                            <Grid item xs={12} md={6}>
                                                                <Typography color="#fff">MoonRank</Typography>
                                                            </Grid>
                                                            <Grid item xs={12} md={6}>
                                                                <Box className="ds-flex align-center">
                                                                    <Typography color="#aaa">3</Typography>
                                                                </Box>

                                                            </Grid>
                                                        </Grid>
                                                    </Box>
                                                </TabPanel>
                                            </Box>
                                        </Box>
                                    </Grid>
                                    <Grid item xs={12} md={3}>
                                        <Box className={styles.item_details_right}>
                                            <Box className="ds-flex align-center" sx={{ height: '45px', bgcolor: "#102841" }}>
                                                <img src="/assets/images/history_icon.png" alt="" />
                                                <Typography color="#fff" sx={{ ml: 1, fontSize: "16px" }}>Price History</Typography>
                                            </Box>
                                            <Box sx={{ width: "100%", height: !isMobile ? "200px" : "60%", borderRadius: "5px" }}>
                                                <Typography sx={{ p: 2, fontSize: "15px" }} color="#fff" >Price in Sol</Typography>
                                                <ResponsiveContainer width="100%" height="100%">
                                                    <LineChart
                                                        data={priceData}
                                                        margin={{
                                                            top: 5,
                                                            right: 30,
                                                            left: -25,
                                                            bottom: 5,
                                                        }}
                                                    >
                                                        <CartesianGrid vertical={false} strokeWidth={0.1} fill="#0B354C" />
                                                        <XAxis tick={{ fill: '#aaa', fontSize: "12px" }} tickLine={{ stroke: '#aaa' }} axisLine={{ stroke: "#fff" }} dataKey="name" />
                                                        <YAxis tick={{ fill: '#aaa', fontSize: "12px" }} tickLine={{ stroke: '#aaa' }} axisLine={{ stroke: "#fff" }} />
                                                        <Tooltip />
                                                        {/* <Legend /> */}
                                                        <Line type="monotone" dataKey="price" fill="#00D2FF" strokeWidth={1} stroke="#1B6A97" dot={{ r: 3 }} activeDot={{ r: 4 }} />
                                                    </LineChart>
                                                </ResponsiveContainer>
                                                <Typography color="#aaa" sx={{ pl: 2, pr: 2, fontSize: "11px" }}>Price History shows the <span style={{ color: "#fff" }}>last 5 sales</span> of the item in SOL.</Typography>
                                            </Box>
                                        </Box>
                                    </Grid>
                                </Grid>
                                <Box sx={{ pb: isMobile ? 12 : 8 }}>
                                    <Box sx={{ mt: 5, borderBottom: 1, borderColor: '#0C4258' }}>
                                        <Tabs value={value1} onChange={handleChange1} aria-label="basic tabs example" centered
                                            sx={{
                                                background: "#102841",
                                                overflow: "visible",
                                                '& .MuiTabs-scroller': {
                                                    overflow: "initial !important"
                                                },
                                                '& .MuiTab-root': {
                                                    marginBottom: "-17px",
                                                    flexDirection: "row",
                                                    color: "#aaa",
                                                    fontSize: "14px",
                                                    textTransform: "none",
                                                    minWidth: '100px',
                                                    minHeight: '53px'
                                                },
                                                '& .MuiTab-root img': {
                                                    mr: 1, mb: 0
                                                },
                                                '& .Mui-selected p': {
                                                    color: "#fff"
                                                },
                                                '& .MuiTabs-indicator': {
                                                    '&:after': {
                                                        position: "absolute",
                                                        left: "40%",
                                                        bottom: "-20px",
                                                        content: '""',
                                                        display: "block",
                                                        borderLeft: "12px solid transparent",
                                                        borderRight: "12px solid transparent",
                                                        borderBottom: "12px solid transparent",
                                                        borderTop: "9px solid #00d2ff",
                                                    },
                                                    height: "3px", backgroundColor: '#00D2FF'
                                                },
                                            }}
                                        >
                                            <Tab sx={{ padding: isMobile ? `12px 5px` : '12px 16px' }} label={<Typography>Offers</Typography>} icon={<img src="/assets/images/offers_tab_icon.png" alt="" />} {...a11yProps(0)} />
                                            <Tab sx={{ padding: isMobile ? `12px 5px` : '12px 16px' }} label={<Typography>Activities</Typography>} {...a11yProps(1)} icon={<img src="/assets/images/activities_tab_icon.png" alt="" />} />
                                            <Tab sx={{ padding: isMobile ? `12px 5px` : '12px 16px' }} label={<Typography>See More</Typography>} {...a11yProps(2)} icon={<img src="/assets/images/seemore_tab_icon.png" alt="" />} />
                                        </Tabs>
                                    </Box>
                                    <TabPanel value={value1} index={0} type={2}>
                                        <div className={styles.table_container} style={{ marginBottom: "50px" }}>
                                            <table>
                                                <thead>
                                                    <tr>
                                                        <th>PRICE</th>
                                                        <th>FROM</th>
                                                        <th>TIME</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {
                                                        offerList.map((item, index) => (
                                                            <tr>
                                                                <td>{item.offerPrice} SOL</td>
                                                                <td>{item.walletAddress}</td>
                                                                <td>{moment(item.created_at).fromNow()}</td>
                                                            </tr>
                                                        ))
                                                    }
                                                </tbody>
                                            </table>
                                        </div>
                                    </TabPanel>
                                    <TabPanel value={value1} index={1} type={2}>
                                        <div className={styles.table_container} style={{ marginBottom: "50px" }}>
                                            <table>
                                                <thead>
                                                    <tr>
                                                        <th>NAME</th>
                                                        <th>TXN ID</th>
                                                        <th>TYPE</th>
                                                        <th>TIME</th>
                                                        <th>AMOUNT</th>
                                                        <th>BUYER</th>
                                                        <th>SELLER</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {
                                                        nftActivities.map((item, index) => (
                                                            <tr key={index}>
                                                                <td>
                                                                    <img src={item.image} alt="" />
                                                                    {item.name}
                                                                </td>
                                                                <td>
                                                                    <Box style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
                                                                        <span>{item.signature?.substr(0, 6)} ... {item.signature?.substr(item.signature?.length - 3, 3)}</span>
                                                                        <Link href="/"><img src="/assets/images/link_icon.png" alt="" style={{ cursor: "pointer" }} /></Link>
                                                                    </Box>
                                                                </td>
                                                                <td>
                                                                    {item.type === 1 &&
                                                                        <span style={{ color: "#fff" }}>Listing</span>
                                                                    }
                                                                    {item.type === 2 &&
                                                                        <span style={{ color: "#555" }}>Cancel Listing</span>
                                                                    }
                                                                    {item.type === 3 &&
                                                                        <span style={{ color: "#fff" }}>Update Listing</span>
                                                                    }
                                                                    {item.type === 5 &&
                                                                        <span style={{ color: "#00D2FF" }}>Place Bid</span>
                                                                    }
                                                                    {item.type === 6 &&
                                                                        <span style={{ color: "#00D2FF" }}>Update Bid</span>
                                                                    }
                                                                    {item.type === 7 &&
                                                                        <span style={{ color: "#555" }}>Cancel Bid</span>
                                                                    }
                                                                    {item.type === 4 &&
                                                                        <span style={{
                                                                            color: "#7FF9E6"
                                                                        }}>Sale</span>
                                                                    }
                                                                </td>
                                                                <td>{moment(item.created_at).fromNow()}</td>
                                                                <td>{item.price} ◎ </td>
                                                                <td>{item.from?.substr(0, 6)} ... {item.from?.substr(item.from?.length - 3, 3)}</td>
                                                                <td>{item.to?.substr(0, 6)} ... {item.to?.substr(item.to?.length - 3, 3)}</td>
                                                            </tr>
                                                        ))
                                                    }
                                                </tbody>
                                            </table>
                                        </div>
                                    </TabPanel>
                                    <TabPanel value={value1} index={2} type={2}>
                                        <Box className="ds-flex" sx={{
                                            p: 1, background: '#0B354D', borderRadius: "5px", width: isMobile ? `calc(100vw - 100px)` : `100%`, marginBottom: `50px`
                                        }}>
                                            <Grid className="ds-flex" container spacing={1} sx={{
                                                flexWrap: "nowrap !important",
                                                overflow: 'auto',
                                                '&::-webkit-scrollbar': {
                                                    height: '8px',
                                                    scrollMargin: "301em .5em 1em 1em;px",

                                                },
                                                '&::-webkit-scrollbar-track': {
                                                    background: '#071421',
                                                    borderRadius: '8px'
                                                },
                                                '&::-webkit-scrollbar-thumb ': {
                                                    background: '#1B6A97',
                                                    borderRadius: '50px',
                                                    cursor: 'pointer',
                                                },
                                                '&::-webkit-scrollbar-thumb:hover': {
                                                    background: '#1B6A97',
                                                    cursor: "pointer"
                                                },
                                            }}>
                                                {
                                                    moreNfts.length > 0 && moreNfts.map((item, index) => (
                                                        <Grid key={index} item xs={12} md={2} sx={{ mb: 1, flexShrink: 0 }}>
                                                            <Card sx={{
                                                                p: 1, bgcolor: "#13202D", borderRadius: "5px", boxShadow: "none"
                                                            }}>

                                                                <CardMedia
                                                                    component="img"
                                                                    alt="green iguana"
                                                                    // height="140"
                                                                    image={item.image}
                                                                    onClick={() => router.push(`/item-details/${item.mintAddress}`, `/item-details/${item.mintAddress}`, { shallow: true })}
                                                                    sx={{ cursor: "pointer" }}
                                                                />
                                                                <CardContent sx={{ mt: 2, paddingBottom: "0 !important", padding: 0 }}>
                                                                    <Typography component="div" color="#fff" sx={{ fontSize: "15px" }}>
                                                                        {item.name}
                                                                    </Typography>
                                                                    <Box className="ds-flex align-center" sx={{ marginBottom: "10px", color: "#7FF9E6" }}>
                                                                        <CheckCircleOutlineIcon sx={{ fontSize: "15px" }} />&nbsp;
                                                                        <Typography component="div" sx={{ fontSize: "13px" }}>
                                                                            {colName}
                                                                        </Typography>
                                                                    </Box>
                                                                    <Typography component="div" color="#fff" sx={{ fontSize: "15px" }}>
                                                                        {item.price} ◎
                                                                    </Typography>
                                                                </CardContent>
                                                            </Card>
                                                        </Grid>
                                                    ))
                                                }
                                            </Grid>
                                        </Box>
                                    </TabPanel>
                                </Box>
                            </Box>
                    }
                </div>
                <AcceptOfferModal
                    item={listItem!}
                    collectionName={Object.keys(metadata).length > 0 ? metadata.collection?.name : ''}
                    highestOfferPrice={highestOffer?.offerPrice}
                    open={acceptOfferModalOpen} handleOpen={hanldeAcceptOfferModalOpen} handleClose={handleAcceptOfferModalClose}
                    acceptOffer={acceptOffer} />
                <MakeOfferModal
                    item={listItem!}
                    collectionName={Object.keys(metadata).length > 0 ? metadata.collection?.name : ''}
                    open={makeOfferModalOpen}
                    handleOpen={hanldeMakeOfferModalOpen}
                    handleClose={handleMakeOfferModalClose}
                    makeOffer={() => makeOffer(offerPrice)}
                    offerPrice={offerPrice}
                    setOfferPrice={setOfferPrice}
                />
                <ProcessingModal loading={txProcessing} />
            </div>
        </Box >
    )
}

ItemDetails.getInitialProps = async ({ store }) => {

};

const mapStateToProps = state => {

    return {
        people: state.people?.people || [],
        selectedPerson: state.people.selectedPerson,
        sidebarOpen: state.init.sidebarOpen,
        walletInfo: state.init.walletInfo
    };
};

const mapDispatchToProps = { handleSidebarOpen, handleSidebarClose };

export default connect(mapStateToProps, mapDispatchToProps)(ItemDetails);