import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import ActionButton from '../Button'
import Grid from '@mui/material/Grid'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import FormHelperText from '@mui/material/FormHelperText';
import { useResize } from '../../../utils/Helper';
import { toast } from 'react-toastify'
import { CircularProgress } from '@mui/material';
import styles from './../MakeOfferModal/index.module.scss'
import FadeLoader from "react-spinners/FadeLoader";

import { useConnection, useAnchorWallet } from "@solana/wallet-adapter-react";
import {
    LAMPORTS_PER_SOL
} from '@solana/web3.js';

const style = {
    position: 'relative',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 490,
    // bgcolor: 'background.paper',
    bgcolor: '#0B354C',
    border: '2px solid #000',
    borderRadius: "10px",
    color: "#fff",
    boxShadow: 24,
    p: 3,
};


const walletList: any[] = [
    { 'name': 'Main Wallet', 'value': 12.0 },
    { 'name': 'Bidding Wallet', 'value': 10.0 }
]

interface WalletInfo {
    address: string,
    balance: any
}

const MakeOfferModal = ({ item, collectionName, open, handleOpen, handleClose, makeOffer, offerPrice, setOfferPrice }) => {
    const wallet = useAnchorWallet();
    const { connection } = useConnection();
    const [walletInfo, setWalletInfo] = React.useState<WalletInfo>({ address: ``, balance: 0 });

    // wallet option value
    const [currentWallet, setCurrentWallet] = useState<number>(-1)
    // set wallet/price state
    const [showWalletHelper, setShowWalletHelper] = useState<boolean>(false)
    const [showPriceHelper, setShowPriceHelper] = useState<boolean>(false)
    const [showMaximumPriceHelper, setShowMaximumPriceHelper] = useState<boolean>(true)
    const [showNotEnoughFund, setShowNotEnoughFund] = useState<boolean>(false)
    const [showNotEnoughBiddingWallet, setShowNotEnoughBiddingWallet] = useState<boolean>(false)

    const { isMobile } = useResize();
    const [loading, setLoading] = useState<boolean>(false)

    const handleWalletChange = (_newWallet) => {
        setCurrentWallet(_newWallet)
        console.log("newWallet", _newWallet)
        if (_newWallet !== -1) setShowWalletHelper(false)
    }
    const handleEditOfferPrice = (value) => {
        // if (value !== '') {
        //     setShowPriceHelper(false)
        //     return
        // }
        setOfferPrice(value)
        if (parseFloat(value) >= parseFloat(item.price) / 2 && parseFloat(value) <= parseFloat(item.price)) {
            setShowMaximumPriceHelper(false)
        } else {
            setShowMaximumPriceHelper(true)
            return
        }

        // console.log("e value is", parseInt(walletList[1].value) - offerPrice)
        // if (walletList[0].value < e.target.value) { setShowNotEnoughFund(true) } else { setShowNotEnoughFund(false) }
        // if (walletList[1].value < 2.20) { setShowNotEnoughBiddingWallet(true) } else { setShowNotEnoughBiddingWallet(false) }

    }

    const preMakeOffer = async () => {
        setLoading(true)
        await setTimeout(() => { console.log("this is the first message") }, 5000);
        {
            (showWalletHelper === false && showPriceHelper === false && showMaximumPriceHelper === false && showNotEnoughFund === false && showNotEnoughBiddingWallet === false) ?
                makeOffer(offerPrice)
                :
                toast.error("Your Offer was Failed", { theme: 'dark' })
        }

        // setLoading(false)
    }

    const MyFormHelperText = () => {
        const walletHelperText = "Please select a wallet to continue."
        const priceHelperText = "Price cannot be Empty"
        const maximumPriceHelperText = `Minimum offer must be at least ${(item?.price / 2).toFixed(2)} SOL (50% of current price)`
        return (
            <>
                {(showWalletHelper === true) ?
                    <FormHelperText sx={{ whitespace: "nowrap", color: "#FF6A6A" }}>{walletHelperText}</FormHelperText>
                    :
                    <></>
                }
                {(showPriceHelper === true) ?
                    <FormHelperText sx={{ whitespace: "nowrap", color: "#FF6A6A" }}>{priceHelperText}</FormHelperText>
                    :
                    <></>
                }
                {(showMaximumPriceHelper === true) ?
                    <FormHelperText sx={{ whitespace: "nowrap", color: "#FF6A6A" }}>{maximumPriceHelperText}</FormHelperText>
                    :
                    <></>
                }

            </>
        )
    }

    const MyFormHelperBottomText = () => {
        const notEnoughFundText = `Not enough funds. You need at least ${(item?.price / 2).toFixed(2)
            } SOL (50 %) in your Main wallet to make an offer.`
        const notEnoughBiddingWalletText = "Not enough funds. You need at least 2.20 SOL (50%) in your Bidding wallet to make an offer. You can fund your bidding wallet by making a transfer from your main wallet."
        return (
            <>
                {(showNotEnoughFund === true) ?
                    <React.Fragment>
                        <hr />
                        <FormHelperText sx={{ whitespace: "nowrap", color: "#FF6A6A", fontSize: "14px" }}>{notEnoughFundText}</FormHelperText>
                    </React.Fragment>
                    :
                    <></>
                }
                {(showNotEnoughBiddingWallet === true) ?
                    <FormHelperText sx={{ whitespace: "nowrap", color: "#FF6A6A" }}>{notEnoughBiddingWalletText}</FormHelperText>
                    :
                    <></>
                }
            </>
        )
    }

    useEffect(() => {
        (async () => {
            if (wallet) {
                const walletBalance = await connection.getBalance(wallet.publicKey);
                console.log('walletBalance', walletBalance)
                setWalletInfo({ ...walletInfo, address: wallet.publicKey.toBase58(), balance: (walletBalance / LAMPORTS_PER_SOL).toFixed(4) });
                if (walletBalance === 0)
                    setShowNotEnoughFund(true)
            }
        })()
    }, [wallet])

    return (
        <div>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style} style={{ width: isMobile ? '90%' : '490px' }}>
                    <Box sx={{ position: "absolute", top: 28, right: 28, cursor: "pointer" }} onClick={handleClose}>
                        <img src="/assets/images/close.png" alt="" />
                    </Box>
                    <Typography id="modal-modal-title" sx={{ mb: 2, fontSize: "24px", fontWeight: "bold" }} >
                        Make an Offer
                    </Typography>
                    <Grid container spacing={2}>
                        <Grid item xs={4} md={4}>
                            <img className="img_responsive" src={item.image} alt="" />
                        </Grid>
                        <Grid item xs={8} md={8}>
                            <Box className="ds-flex justify-between" sx={{ flexDirection: "column", height: "100%", color: "#7FF9E6" }}>
                                <Box>
                                    <Typography component="div" color="#fff" sx={{ fontSize: "15px" }}>
                                        {item.name}
                                    </Typography>
                                    <Box className="ds-flex align-center">
                                        <CheckCircleOutlineIcon sx={{ fontSize: "15px" }} />&nbsp;
                                        <Typography component="div" sx={{ fontSize: "13px" }}>
                                            {collectionName}
                                        </Typography>
                                    </Box>
                                </Box>
                                <Box>
                                    <Typography component="div" color="#aaa" sx={{ fontSize: "14px" }}>
                                        Current Price ~ Minimum Offer 50%
                                    </Typography>
                                    <Typography component="div" color="#fff" sx={{ fontSize: "24px" }}>
                                        {item.price} ~ {item.price / 2} ◎
                                    </Typography>
                                </Box>
                            </Box>
                        </Grid>
                    </Grid>
                    {/* <Typography color="#aaa" sx={{ mt: 2, fontSize: "14px" }}>When you make an offer, funds are kept in your bidding wallet to allow you to make multiple offers using the same funds. </Typography> */}
                    <Typography color="#aaa" sx={{ mt: 2, fontSize: "14px" }}>When you make an offer, funds are kept in your main wallet to allow you to make an offer. </Typography>
                    <Box component="form">
                        <Grid container spacing={1}>
                            {/* <Grid item sm={12} md={7}>
                                <select className="input-field1" onChange={(e) => handleWalletChange(e.target.value)} value={currentWallet}>
                                    <option value="-1">Select wallet</option>
                                    {
                                        walletList.map((walletName, index) => (
                                            <option key={index} value={index}>{`${ walletName.name } (${ walletName.value } ◎)`}</option>
                                        ))
                                    }
                                </select>
                              
                            </Grid> */}
                            <Grid item sm={12} md={12}>
                                <input style={{ marginBottom: 0 }} type="text" className="input-field1" placeholder="Offer in Sol" min="0" onChange={(e) => handleEditOfferPrice(e.target.value)} value={offerPrice} />
                            </Grid>
                            <Box sx={{ ml: 1, mb: 1 }}>
                                <MyFormHelperText />
                            </Box>
                        </Grid>
                        {/* <Box className="ds-flex justify-between" sx={{ mt: 2, mb: 1 }}>
                            <Typography component="div" color="#fff" sx={{ fontSize: "14px" }}>
                                Main Wallet Balance
                            </Typography>
                            <Typography component="div" color="#fff" sx={{ fontSize: "14px" }}>
                                {walletList[0].value} ◎
                            </Typography>
                        </Box>
                        <Box className="ds-flex justify-between" sx={{ mb: 2 }}>
                            <Typography component="div" color="#fff" sx={{ fontSize: "14px" }}>
                                Bidding Wallet Balance
                            </Typography>
                            <Typography component="div" color="#fff" sx={{ fontSize: "14px" }}>
                                {walletList[1].value} ◎
                            </Typography>
                        </Box> */}
                        {(showWalletHelper === false && showPriceHelper === false && showMaximumPriceHelper === false) ?
                            <>
                                {/* <Box className="ds-flex justify-between" sx={{ mt: 2, mb: 1 }}>
                                    <Typography component="div" color="#fff" sx={{ fontSize: "14px" }}>
                                        {`Main Wallet Balance: - ${ offerPrice }◎`}
                                    </Typography>
                                    <Typography component="div" color="#FF6A6A" sx={{ fontSize: "14px" }}>
                                        {walletList[0].value - parseFloat(`${ offerPrice } `)} ◎
                                    </Typography>
                                </Box>
                                <Box className="ds-flex justify-between" sx={{ mb: 2 }}>
                                    <Typography component="div" color="#fff" sx={{ fontSize: "14px" }}>
                                        {`Bidding Wallet Balance: + ${ `${offerPrice}` }◎`}
                                    </Typography>
                                    <Typography component="div" color="#7FF9E6" sx={{ fontSize: "14px" }}>
                                        {walletList[1].value + parseFloat(`${ offerPrice } `)} ◎
                                    </Typography>
                                </Box> */}
                            </>
                            :
                            <></>
                        }
                        {/* {(showNotEnoughFund === true || showNotEnoughBiddingWallet === true) ?
                            <>
                            </>
                            :
                            <>
                                {(showWalletHelper === true || showPriceHelper === true || showMaximumPriceHelper === true) ?
                                    <div style={{ pointerEvents: 'none', opacity: '0.5' }}>
                                        <ActionButton text="Make Offer" bgColor="#1B6A97" onClick={makeOffer}></ActionButton>
                                    </div>
                                    :
                                    <ActionButton text="Make Offer" bgColor="#1B6A97" onClick={makeOffer}></ActionButton>
                                }
                                <Typography color="#aaa" sx={{ mt: 1, fontSize: "14px", textAlign: "center" }}>By clicking <span style={{ color: "#fff" }}>Make Offer</span>, you agree to the <span style={{ color: "#00D2FF" }}>Terms of Service</span></Typography>
                            </>
                        } */}
                        {showMaximumPriceHelper || showNotEnoughFund ? <div style={{ pointerEvents: 'none', opacity: '0.5' }}>
                            <ActionButton text="Make Offer" bgColor="#1B6A97" onClick={preMakeOffer}></ActionButton>
                        </div> : <React.Fragment> <ActionButton text="Make Offer" bgColor="#1B6A97" onClick={preMakeOffer}></ActionButton> </React.Fragment>}
                        <Typography color="#aaa" sx={{ mt: 1, fontSize: "14px", textAlign: "center" }}>By clicking <span style={{ color: "#fff" }}>Make Offer</span>, you agree to the <span style={{ color: "#00D2FF" }}>Terms of Service</span></Typography>
                        <MyFormHelperBottomText />
                    </Box>
                </Box>
            </Modal>
        </div >
    )
}

export default MakeOfferModal