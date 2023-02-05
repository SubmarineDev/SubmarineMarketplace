import React, { useState, useEffect, useCallback } from 'react'
import { useDispatch } from 'react-redux'
import globalStyles from '../../styles/Home.module.scss'
import styles from './Header.module.scss'
// import Button from '../Button'
import SearchIcon from '@mui/icons-material/Search';
import PersonIcon from '@mui/icons-material/Person';
import {
    WalletMultiButton,
} from "@solana/wallet-adapter-react-ui"
import { useConnection, useAnchorWallet } from "@solana/wallet-adapter-react";

import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import * as bs58 from "bs58";

import { useResizeDetector } from 'react-resize-detector';

import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import 'tippy.js/themes/material.css';
import 'tippy.js/animations/scale-subtle.css';

import { styled } from '@mui/material/styles';
import { useResize } from '../../utils/Helper';

import { useRouter } from 'next/router'
import Link from 'next/link'
import { toast } from 'react-toastify'

import commonService from "../../config/services/common.service";
import { MARKETPLACES_API, serverUrl } from "../../config";
import { devnet } from 'constants/cluster'

import { setWalletInfo } from 'store/actions/init'

const TippyStyle = styled('div')(() => ({
    '.tippy-content': {
        padding: 0
    },

    '.tippy-box': {
        backgroundColor: 'rgba(7, 20, 33, 0.9)',
        marginTop: '-8px',
        borderRadius: '10px',
        border: '1px solid #206683',
        height: '100%',
        maxHeight: 'calc((40vh - 72px) - 0px)',
        overflowY: 'auto',

        '&::-webkit-scrollbar': {
            width: '10px'
        },
        '&::-webkit-scrollbar-track': {
            margin: '5px',
            background: '#071421',
            borderRadius: '10px'
        },
        '&::-webkit-scrollbar-thumb ': {
            background: '#0B354D',
            borderRadius: '50px',
            cursor: 'pointer'
        },
        '&::-webkit-scrollbar-thumb:hover': {
            background: '#0B354D'
        },
        ul: {
            margin: 0,
            padding: 0,
            li: {
                '&: not(: last - child)': {
                    borderBottom: '1px solid rgb(21, 27, 34)'
                }
            }
        }
    }
}));


const Header = ({ sidebarOpen }) => {
    const { connection } = useConnection();
    const dispatch = useDispatch()
    const router = useRouter()
    const wallet = useAnchorWallet();
    const [searchKey, setSearchKey] = React.useState('')
    const [visible, setVisible] = useState(false)
    const { isMobile } = useResize()

    const [maxWidth, setMaxWidth] = useState(0)

    const [searchResult, setSearchResult] = useState<any>([])

    const onResize = useCallback(() => {
        // on resize logic
        setMaxWidth(ref.current.offsetWidth)
    }, []);

    const { ref } = useResizeDetector({
        handleHeight: false,
        refreshMode: 'debounce',
        refreshRate: 1000,
        onResize
    });

    const updateSearch = async (key) => {
        setVisible(true)
        if (key === '')
            setVisible(false)
        else {
            let _searchResult: any = await commonService({
                method: "get",
                route: `${MARKETPLACES_API.GET_COLLECTIONS}/${key}`,
            });
            console.log(`_searchResult`, _searchResult.rows);
            setSearchResult([..._searchResult.rows])
        }
        setSearchKey(key)
    }

    const cancelSearch = () => {
        setVisible(false)
        setSearchKey('')
    }

    let width = sidebarOpen === true ? 199 : 90

    useEffect(() => {
        (async () => {
            if (wallet) {
                const walletBalance = await connection.getBalance(wallet.publicKey);
                console.log('walletBalance', walletBalance)
                dispatch(setWalletInfo({ address: wallet.publicKey.toBase58(), balance: parseFloat((walletBalance / LAMPORTS_PER_SOL).toFixed()) }))
            }
        })()
    }, [wallet])

    console.log('wallet', wallet)
    return (
        <React.Fragment>
            <div className={styles.header} style={{ width: isMobile ? '100%' : `calc(100% - ${width}px)` }}>
                <div className={globalStyles.container_fluid}>
                    <div className={styles.header_content}>
                        <div className={styles.all_search_bar} ref={ref}>
                            <TippyStyle>
                                <Tippy
                                    arrow={false}
                                    appendTo="parent"
                                    visible={visible}
                                    zIndex={100000}
                                    interactive={true}
                                    maxWidth={maxWidth}
                                    onClickOutside={cancelSearch}
                                    content={
                                        <ul className={styles.search__result_wrap} style={{ "maxWidth": "100%", "width": (maxWidth - 60) }}>
                                            <li>
                                                <div className={styles.search__result_group_title}>
                                                    <span>Collections</span>
                                                </div>
                                            </li>
                                            {
                                                searchResult.map((item: any, index: number) => (
                                                    <li key={index}>
                                                        <a href={"/collection/" + item.symbol} className={styles.search__result_item_link}>
                                                            <div className={styles.search__result_item_image}>
                                                                <img alt="" src={serverUrl + item.baseImage} className="" />
                                                            </div>
                                                            <div className={styles.search__result_item_title}>{item.name}</div>
                                                        </a>
                                                    </li>
                                                ))
                                            }
                                        </ul>
                                    }>
                                    <input type='text' className="all_search" placeholder="Search..." style={{ background: visible ? '#071421' : 'rgba(7, 20, 33, 0.5)', border: visible ? '1px solid #1B6A97' : 'none' }} onChange={e => updateSearch(e.target.value)} value={searchKey} />
                                </Tippy >
                            </TippyStyle>
                            <SearchIcon sx={{ position: "absolute", top: '8px', right: '11px', zIndex: 10000, fontSize: "25px", color: visible ? '#fff' : '#0D677A' }} />
                        </div>
                        {/* <div className={styles.header_action}>
                        <button className={styles.header_action_btn}></button>
                    </div> */}

                        <div className={styles.header_right_content}>
                            <div className={styles.account_icon}>
                                {wallet ? <PersonIcon sx={{ color: "#00D2FF" }} onClick={() => router.push(`/me`, `/me`, { shallow: true })} /> : <PersonIcon onClick={() => toast.error("Please connect your wallet.", { theme: 'dark' })} sx={{ color: "#fff" }} />}
                            </div>
                            {/* <Button text="CONNECT" className="btn_connect" /> */}
                            {wallet ? <WalletMultiButton className={styles.wallet_adapter_button} /> : <WalletMultiButton className={styles.wallet_adapter_button}>Connect Wallet</WalletMultiButton>}
                        </div>
                    </div>
                </div>
            </div>
        </React.Fragment >
    )
}

export default Header