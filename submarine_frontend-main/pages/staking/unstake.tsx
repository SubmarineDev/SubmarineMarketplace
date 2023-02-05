import React, { useState, useEffect, Fragment } from 'react'
import { useRouter } from 'next/router'
import Sidebar from '../../components/Sidebar'
import Header from '../../components/Header'
import { handleSidebarOpen, handleSidebarClose } from "store/actions/init"
import { connect } from "react-redux"
import { useResize } from '../../utils/Helper'

import styles from 'styles/Staking.module.scss'
import Box from '@mui/material/Box';
import TotalPart from '../../components/Staking/TotalPart'
import MainContent from '../../components/Staking/MainContent'
import NftItem from '../../components/Staking/NftItem'

import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';

import { Swiper, SwiperSlide } from "swiper/react";


function a11yProps(index: number) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}


const calendarConstant = [
    {
        day: 7,
        perFurr: 3
    },
    {
        day: 14,
        perFurr: 8
    },
    {
        day: 21,
        perFurr: 15
    },
]

const Unstake = ({ sidebarOpen }) => {
    const router = useRouter()
    const { isMobile } = useResize();
    let width = sidebarOpen === true ? 199 : 90

    const [loading, setLoading] = useState<boolean>(false)

    const unstakedFurrsols = []

    useEffect(() => {
        (async () => {
            setLoading(true);


            setLoading(false)

        })()
    }, [])

    return (
        <div className={styles.collectionPage_container}>
            <Sidebar activeKey={2} />
            <div className={styles.staking_section} style={{ width: isMobile ? 'calc(100vw - 60px)' : `calc(100% - ${width}px)` }}>
                <Header sidebarOpen={sidebarOpen} />
                <div className={styles.staking_content}>
                    <TotalPart
                        onClaimAll={() => { }}
                        totalStaked={1}
                        totalCollected={1}
                        totalNFT={1}
                        stakeCount={1}
                        unstakeCount={1}
                        walletCollectedAmount={1}
                    >
                    </TotalPart>
                    <Box className={styles.staking_main_content}>
                        <Tabs value={2} aria-label="basic tabs example"
                            sx={{
                                background: "#102841",
                                '& .MuiTab-root': {
                                    padding: "20px",
                                    color: "#aaa",
                                    fontSize: "15px"
                                },
                                '& .Mui-selected': {
                                    background: "#151515",
                                    borderTopLeftRadius: "5px", borderTopRightRadius: "5px",
                                    color: "#00FFCE !important"
                                },
                                '& .Mui-selected p': {
                                    color: "#00FFCE"
                                },
                                '& .MuiTabs-indicator': { display: "none" }
                            }}
                        >
                            <Tab label={'Daily Rewards'} onClick={() => router.push('/staking', '/staking', { shallow: true })} />
                            <Tab label="Staked Aqua Apes" onClick={() => router.push('/staking/stake', '/staking/stake', { shallow: true })} />
                            <Tab label="Unstaked Aqua Apes" onClick={() => router.push('/staking/unstake', '/staking/unstake', { shallow: true })} />
                        </Tabs>
                    </Box>

                    <MainContent>
                        <Swiper
                            spaceBetween={25}
                            // slidesPerView={5}
                            breakpoints={{
                                700: {
                                    slidesPerView: 2,
                                    spaceBetween: 25,
                                },
                                900: {
                                    slidesPerView: 3,
                                    spaceBetween: 25,
                                },
                                1100: {
                                    slidesPerView: 4,
                                    spaceBetween: 25,
                                },
                                1366: {
                                    slidesPerView: 5,
                                    spaceBetween: 25,
                                },
                                1600: {
                                    slidesPerView: 6,
                                    spaceBetween: 25,
                                },
                                1800: {
                                    slidesPerView: 7,
                                    spaceBetween: 25,
                                },
                                2000: {
                                    slidesPerView: 8,
                                    spaceBetween: 25,
                                },
                            }}
                            onSlideChange={() => console.log('slide change')}
                            onSwiper={(swiper) => console.log(swiper)}
                        >
                            <>
                                {unstakedFurrsols.map((nft: any, index: number) => {
                                    return (
                                        <SwiperSlide key={index}>
                                            <NftItem
                                                info={nft}
                                                onOpen={() => { }}
                                                onClicks={[async () => { }, async () => { }]}
                                            />
                                        </SwiperSlide>
                                    )
                                }
                                )}
                            </>
                        </Swiper>
                    </MainContent>

                </div>
            </div>
        </div>
    )
}

Unstake.getInitialProps = async ({ store }) => {

};

const mapStateToProps = state => {

    return {
        people: state.people?.people || [],
        selectedPerson: state.people.selectedPerson,
        sidebarOpen: state.init.sidebarOpen
    };
};

const mapDispatchToProps = { handleSidebarOpen, handleSidebarClose };

export default connect(mapStateToProps, mapDispatchToProps)(Unstake);
