import React, { useState, useEffect } from 'react'
import { connect as reduxConnect } from 'react-redux'
import { useRouter } from 'next/router'
import styles from './AuctionItem.module.scss'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import Button from '@mui/material/Button'
import Link from "next/link"

import { signAndSendTransaction } from 'config/helpers/sol/connection';
import { Connection, PublicKey, Transaction, Keypair } from "@solana/web3.js";
import { useConnection, useAnchorWallet, useWallet } from "@solana/wallet-adapter-react";
import { toast } from 'react-toastify'

import commonService from "../../config/services/common.service";
import { MARKETPLACES_API, serverUrl, ITEMS_PER_PAGE } from "../../config";
import ProcessingModal from '@components/ProcessingModal';

const delay = (ms: any) => new Promise(res => setTimeout(res, ms));

const AuctionItem = ({ index, imgUrl, nftName, symbol, price, mintAddress, seller, walletInfo }) => {
    const router = useRouter()
    const { connection } = useConnection()
    const anchorWallet: any = useAnchorWallet();
    const [loading, setLoading] = useState<boolean>(false)

    const [txProcessing, setTxProcessing] = useState<boolean>(false)
    const wallet = useWallet();

    const buyNft = async (seller: string, mintAddress: string) => {
        console.log('====================walletInfo', walletInfo)
        if (!anchorWallet) {
            toast.error("Please connect to your wallet.", { theme: 'dark' })
            return;
        }
        if (walletInfo.balance <= price) {
            toast.error("Insufficient funds!", { theme: 'dark' })
            return;
        }
        if (mintAddress && anchorWallet) {
            let result: any;
            setLoading(true);
            setTxProcessing(true)
            result = await commonService({
                method: "post",
                route: `${MARKETPLACES_API.GET_BUY_TX}`,
                data: {
                    buyerAddress: wallet.publicKey?.toString(),
                    seller: seller,
                    mintAddress: mintAddress,
                }
            });
            try {
                const transaction: Transaction = Transaction.from(result.tx.data);
                try {
                    const res = await signAndSendTransaction(connection, anchorWallet, transaction);
                    // if (res?.txid && res?.slot) {
                    // console.log('txid', res.txid)
                    // return
                    if (res?.txid) {
                        console.log('transaction', res.txid)
                        const buyResult = await commonService({
                            method: "post",
                            route: `${MARKETPLACES_API.GET_BUY_TX_CONF}`,
                            data: {
                                buyerAddress: wallet.publicKey?.toString(),
                                mintAddress: mintAddress,
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


    return (

        <div className={styles.auction_item_wrapper}>
            <Link href={`/item-details/${mintAddress}`}>
                <img className="img_responsive" src={imgUrl} />
            </Link>
            <div className={styles.item_info}>
                <div className={styles.nft_name}>{nftName}</div>
                <div className={styles.user_name}>
                    <CheckCircleOutlineIcon sx={{ fontSize: "14px" }} />
                    <span>{symbol}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "10px" }}>
                    <p>{price} ◎</p>
                    {
                        wallet ? (wallet.publicKey?.toString() !== seller ? <Button sx={{ padding: "2px 5px 0 5px", background: "#1B6A97", minWidth: "30px", color: "#fff" }} onClick={() => buyNft(seller, mintAddress)}>Buy</Button> : '') : <Button sx={{ padding: "2px 5px 0 5px", background: "#1B6A97", minWidth: "30px", color: "#fff" }} onClick={() => buyNft(seller, mintAddress)}>Buy</Button>
                    }

                </div>
            </div>
            <ProcessingModal loading={txProcessing} />
        </div>

    )
}

const mapStateToProps = state => {
    return {
        walletInfo: state.init.walletInfo
    };
};

export default reduxConnect(mapStateToProps)(AuctionItem);