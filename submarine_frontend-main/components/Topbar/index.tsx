import React, { useState, useEffect } from 'react';
import { Box, Typography, Container, Stack, Paper } from '@mui/material';
import { styled } from '@mui/material/styles';
import { createStyles, Theme } from "@mui/material/styles";
import { makeStyles } from "@mui/styles";
import { useResize } from '../../utils/Helper';
import styles from './Topbar.module.scss'
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore, { Autoplay, Navigation, Pagination } from "swiper"

import commonService from "../../config/services/common.service";
import { GET_SOL_PRICE, GET_TPS } from "../../config";

// const useStyles = makeStyles({
// 	root: {

//     },
//     headerLetter: {
//         fontSize: '14px !important'
//     },
//     headerDisplay: {
//         display: 'flex',
//         justifyContent: 'center'
//     }
// })

const Item = styled(Paper)(({ theme }) => ({
    display: "flex",
    backgroundColor: 'transparent',
    ...theme.typography.body2,

    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
    boxShadow: "none"
}));


const Topbar = () => {
    // const classes = useStyles();
    const { isMobile } = useResize();
    const [curSolPrice, setCurSolPrice] = useState<any>(0.00)
    const [tps, setTps] = useState<number>(0)

    SwiperCore.use([Navigation, Pagination])

    useEffect(() => {
        (async () => {
            let result: any;
            result = await commonService({
                method: "get",
                route: `${GET_SOL_PRICE}`,
            });
            setCurSolPrice(result?.solana?.usd || 0);

            let _tpsResult = await commonService({
                method: "post",
                route: `${GET_TPS}`,
                data: {
                    method: "getRecentPerformanceSamples",
                    jsonrpc: "2.0",
                    params: [
                        5
                    ],
                    id: "98bafce8-9e2c-4632-b153-099649a768a4"
                }
            });
            console.log('tps======================', _tpsResult)
        })()
    }, [])


    return (
        <React.Fragment>
            <Box sx={{
                position: "fixed", width: "100%", background: "#071421", zIndex: "3"
            }}>
                <Container maxWidth="lg">
                    {!isMobile ?
                        <Stack direction="row" spacing={5} sx={{ justifyContent: "center" }}>
                            <Item className={styles.headerDisplay}>
                                <Typography color="#fff" className={styles.headerLetter}>Total Volume: &nbsp;</Typography>
                                <Typography color="#00d2ff" className={styles.headerLetter}>2,5000,000 SOL</Typography>
                            </Item>
                            <Item>
                                <Typography color="#fff" className={styles.headerLetter}>SOL/USD: &nbsp;</Typography>
                                <Typography color="#00d2ff" className={styles.headerLetter}>${curSolPrice}</Typography>
                            </Item>
                            <Item>
                                <Typography color="#fff" className={styles.headerLetter}>Solana Network: &nbsp;</Typography>
                                <Typography color="#00d2ff" className={styles.headerLetter}>2500 TPS</Typography>
                            </Item>
                        </Stack>
                        :
                        <Stack direction="row" spacing={5} sx={{ justifyContent: "center" }}>
                            <Swiper
                                slidesPerView={1}
                                spaceBetween={30}
                                loop
                                loopFillGroupWithBlank
                                // scrollbar={{ draggable: true }}
                                modules={[Pagination, Navigation, Autoplay]}
                                className="mySwiper"
                                onSlideChange={() => { }}
                                onSwiper={() => { }}
                                autoplay={{ delay: 2500 }}
                                speed={1000}
                            >
                                <SwiperSlide>
                                    <Item className={styles.headerDisplay}>
                                        <Typography color="#fff" className={styles.headerLetter}>Total Volume: &nbsp;</Typography>
                                        <Typography color="#00d2ff" className={styles.headerLetter}>2,5000,000 SOL</Typography>
                                    </Item>
                                </SwiperSlide>
                                <SwiperSlide>
                                    <Item className={styles.headerDisplay}>
                                        <Typography color="#fff" className={styles.headerLetter}>SOL/USD: &nbsp;</Typography>
                                        <Typography color="#00d2ff" className={styles.headerLetter}>${curSolPrice}</Typography>
                                    </Item>
                                </SwiperSlide>
                                <SwiperSlide>
                                    <Item className={styles.headerDisplay}>
                                        <Typography color="#fff" className={styles.headerLetter}>Solana Network: &nbsp;</Typography>
                                        <Typography color="#00d2ff" className={styles.headerLetter}>2500 TPS</Typography>
                                    </Item>
                                </SwiperSlide>
                            </Swiper>
                        </Stack>
                    }

                </Container>
            </Box>
        </React.Fragment>
    )
}

export default Topbar