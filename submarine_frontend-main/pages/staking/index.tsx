import React, { useState, useEffect, Fragment } from 'react'
import { useRouter } from "next/router"
import Sidebar from '../../components/Sidebar'
import Header from '../../components/Header'
import { handleSidebarOpen, handleSidebarClose } from "store/actions/init"
import { connect } from "react-redux"
import { useResize } from '../../utils/Helper'

import styles from 'styles/Staking.module.scss'
import portalStyles from '../../components/Staking/TotalPart/index.module.scss';

import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import CircularProgress from '@mui/material/CircularProgress'
import Typography from '@mui/material/Typography'

import TotalPart from '../../components/Staking/TotalPart'
import MainContent from '../../components/Staking/MainContent'
import CalendarItem from '../../components/Staking/CalendarItem'

import { ADMIN_WALLET, CREATOR_ADDRESSES, DECIMAL, LAMPORTS, PROGRAM_ID, TOTAL_SUPPLY } from "../../config"


import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'

import { Swiper, SwiperSlide } from "swiper/react"
import NftItem from '../../components/Staking/NftItem'
import * as anchor from '@project-serum/anchor'
import { useConnection, useAnchorWallet } from "@solana/wallet-adapter-react"
import { PublicKey, SystemProgram } from "@solana/web3.js"
import { SolanaClient, SolanaClientProps } from 'config/helpers/sol'
import { IDL } from 'constants/submarine_reward_contract'
import { sendTransactions } from 'config/helpers/sol/connection'
import ProcessingModal from '@components/ProcessingModal';

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

const Staking = ({ sidebarOpen }) => {
    const router = useRouter()
    const { tab } = router.query
    const { isMobile } = useResize()
    let width = sidebarOpen === true ? 199 : 90

    const [loading, setLoading] = useState<boolean>(false)
    const [tabIndex, setTabIndex] = useState<number>(0)
    const [stakedApes, setStakedApes] = useState<any[]>([])
    const [unstakedApes, setUnstakedApes] = useState<any[]>([])
    const [totalStakedApes, setTotalStakedApes] = useState(0)
    const [totalClaimed, setTotalClaimed] = useState(0) // for entire contract
    const [totalUserClaimed, setTotalUserClaimed] = useState(0)
    const [totalFunded, setTotalFunded] = useState(0)
    const [collectible, setCollectible] = useState(0)
    const [isAdmin, setIsAdmin] = useState(false);
    const [depositAmount, setDepositAmount] = useState(0);
    const wallet = useAnchorWallet()
    const { connection } = useConnection()
    const solanaClient = new SolanaClient({ rpcEndpoint: process.env.NEXT_PUBLIC_SOLANA_RPC_HOST! } as SolanaClientProps)
    const [txProcessing, setTxProcessing] = useState<boolean>(false)

    useEffect(() => {
        (async () => {
            setLoading(true)
            if (!tab || tab === 'reward') {
                setTabIndex(0)
            } else if (tab === 'stake') {
                setTabIndex(1)
            } else if (tab === 'unstake') {
                setTabIndex(2)
            }
            setLoading(false)

        })()
    }, [tab])

    useEffect(() => {
        (async () => {
            if (wallet) {
                setLoading(true)
                checkAdmin()
                await getTotalData()
                await getWalletNft()
                setLoading(false)
            }
        })()
    }, [wallet])
    const checkAdmin = () => {
        if (wallet!.publicKey.toString() === ADMIN_WALLET) {
            setIsAdmin(true)
        } else {
            setIsAdmin(false)
        }
    }

    const getTotalData = async () => {
        if (wallet) {
            const provider = getProvider()
            const program = new anchor.Program(IDL, new PublicKey(PROGRAM_ID), provider)
            let [dataPda, bump_data] = await anchor.web3.PublicKey.findProgramAddress([
                Buffer.from('program data')
            ], program.programId)
            let dataInfo = await connection.getAccountInfo(dataPda)
            if (dataInfo === null) {
                setLoading(false)
                return
            }
            const data = await program.account.data.fetch(dataPda)
            let totalAmount = Number.parseFloat(data.totalAmount.toString()) / DECIMAL
            let totalClaimedAmount = Number.parseFloat(data.claimedAmount.toString()) / DECIMAL
            let totalStarted = Number.parseInt(data.startedCount.toString())
            setTotalFunded(totalAmount)
            setTotalClaimed(totalClaimedAmount) // for entire users from contract
            setTotalStakedApes(totalStarted)
        }
    }

    const getWalletNft = async () => {
        if (!wallet) return
        const pubkey = wallet.publicKey.toString()
        const provider = getProvider()
        const program = new anchor.Program(IDL, new PublicKey(PROGRAM_ID), provider)
        let result: any
        try {
            result = await solanaClient.getAllCollectiblesWithCreator([pubkey], CREATOR_ADDRESSES)
            if (result[pubkey]) {
                let stakedNFT: any[] = []
                let unstakedNFT: any[] = []
                let availableForUser = 0
                let claimedForUser = 0
                let [dataPda, bump_data] = await anchor.web3.PublicKey.findProgramAddress([
                    Buffer.from('program data')
                ], program.programId)
                let dataInfo = await connection.getAccountInfo(dataPda)
                if (dataInfo === null) {
                    setLoading(false)
                    return
                }
                const data = await program.account.data.fetch(dataPda)
                let totalAmount = Number.parseFloat(data.totalAmount.toString()) / DECIMAL
                let totalClaimedAmount = Number.parseFloat(data.claimedAmount.toString()) / DECIMAL
                let totalStarted = Number.parseInt(data.startedCount.toString())
                setTotalFunded(totalAmount)
                setTotalClaimed(totalClaimedAmount) // for entire users from contract
                setTotalStakedApes(totalStarted)
                for (let i = 0; i < result[pubkey].length; i++) {
                    let nft = result[pubkey][i]
                    let [pool, bump_pool] = await anchor.web3.PublicKey.findProgramAddress([
                        Buffer.from('pool'), new PublicKey(nft.mint).toBuffer()
                    ], program.programId)
                    const poolInfo = await connection.getAccountInfo(pool)
                    let newNFT: any = {}
                    if (poolInfo) {
                        let poolData = await program.account.pool.fetch(pool)
                        if (poolData.isStarted) {
                            let claimedAmount = Number.parseFloat(poolData.claimedAmount.toString()) / DECIMAL
                            let availableAmount = totalAmount / TOTAL_SUPPLY - claimedAmount
                            newNFT = {
                                name: nft.name,
                                imageUrl: nft.image,
                                mint: new PublicKey(nft.mint),
                                isStarted: poolData.isStarted,
                                canClaim: availableAmount > LAMPORTS,
                                claimedAmount: claimedAmount,
                                availableAmount: availableAmount > LAMPORTS ? availableAmount : 0
                            }
                            availableForUser += newNFT.availableAmount
                            claimedForUser += newNFT.claimedAmount
                            stakedNFT.push(newNFT)
                        } else {
                            newNFT = {
                                name: nft.name,
                                imageUrl: nft.image,
                                mint: new PublicKey(nft.mint),
                                isStarted: false,
                                canClaim: false,
                                claimedAmount: 0,
                                availableAmount: 0
                            }
                            unstakedNFT.push(newNFT)
                        }
                    } else {
                        newNFT = {
                            name: nft.name,
                            imageUrl: nft.image,
                            mint: new PublicKey(nft.mint),
                            isStarted: false,
                            canClaim: false,
                            claimedAmount: 0,
                            availableAmount: 0
                        }
                        unstakedNFT.push(newNFT)
                    }
                }
                setStakedApes(stakedNFT)
                setUnstakedApes(unstakedNFT)
                setCollectible(availableForUser)
                setTotalUserClaimed(claimedForUser)
            }
        } catch (error) {
            console.log(error)
            setLoading(false)
            return
        }

    }

    const onStake = async (nft: any) => {
        if (!wallet) {
            return
        }

        const provider = getProvider()
        const program = new anchor.Program(IDL, new PublicKey(PROGRAM_ID), provider)
        setTxProcessing(true)
        setLoading(true)

        try {
            let [dataPda, bump_data] = await anchor.web3.PublicKey.findProgramAddress([
                Buffer.from('program data')
            ], program.programId)

            let instructionSet: any = []
            let signerSet: any = []
            let instructions: any = []
            let signers: any = []
            let makeStartTx: any
            makeStartTx = await makeStartTransaction(dataPda, nft, program)
            if (makeStartTx.instructions.length !== 0) {
                instructions = [...makeStartTx.instructions]
                signers = []
            }
            if (instructions.length === 0) {
                setLoading(false)
                setTxProcessing(false)
                return
            }
            instructionSet.push(instructions)
            signerSet.push(signers)
            const result = await sendTransactions(connection, wallet, instructionSet, signerSet)
            if (result.success) {
                let newUnstakedApes = (unstakedApes.filter(unstartedNFT => unstartedNFT.mint !== nft.mint))
                let totalAmount = totalFunded / TOTAL_SUPPLY
                let newnft = {
                    ...nft,
                    started: true,
                    canClaim: totalAmount > 0,
                    availableAmount: totalAmount
                }
                let newCollectible = collectible + totalAmount
                setUnstakedApes(newUnstakedApes)
                setStakedApes([...stakedApes, newnft])
                setTotalStakedApes(totalStakedApes + 1)
                setCollectible(newCollectible) // unclaimed amount

            }
            setLoading(false)
            setTxProcessing(false)
        } catch (error) {
            console.log(error)
            setLoading(false)
            setTxProcessing(false)
            return
        }
    }

    const onClaim = async (nft: any) => {
        if (!wallet) {
            return
        }
        let instructionSet: any = []
        let signerSet: any = []
        let instructions: any = []
        let signers: any = []
        const provider = getProvider()
        const program = new anchor.Program(IDL, new PublicKey(PROGRAM_ID), provider)

        setLoading(true)
        setTxProcessing(true)

        try {
            let [dataPda, bump_data] = await anchor.web3.PublicKey.findProgramAddress([
                Buffer.from('program data')
            ], program.programId)

            let makeClaimTx = await makeClaimTransaction(dataPda, program, nft)
            if (makeClaimTx.instructions.length !== 0) {
                instructions = [...makeClaimTx.instructions]
                signers = [...makeClaimTx.signers]
            }
            if (instructions.length === 0) {
                setLoading(false)
                setTxProcessing(false)

                return
            }
            instructionSet.push(instructions)
            signerSet.push(signers)

            const result = await sendTransactions(connection, wallet, instructionSet, signerSet)
            if (result.success) {
                let totalAmount = totalFunded / TOTAL_SUPPLY
                setStakedApes(stakedApes.map(staked => {
                    if (staked.mint === nft.mint) {
                        return {
                            ...staked,
                            canClaim: false,
                            availableAmount: 0,
                            claimedAmount: totalAmount
                        }
                    } else {
                        return {
                            ...staked
                        }
                    }
                }))
                let newCollectible = collectible - nft.availableAmount
                setCollectible(newCollectible) // unclaimed amount
                setTotalUserClaimed(totalUserClaimed + nft.availableAmount) // total earned for user
                setLoading(false)
                setTxProcessing(false)
            }
        } catch (error) {
            setLoading(false)
            setTxProcessing(false)
            console.log(error)
            return
        }
    }

    const onClaimAll = async () => {
        if (!wallet) {
            return
        }
        let instructionSet: any = []
        let signerSet: any = []
        let instructions: any = []
        const provider = getProvider()
        const program = new anchor.Program(IDL, new PublicKey(PROGRAM_ID), provider)

        setLoading(true)
        setTxProcessing(true)

        try {
            let [dataPda, bump_data] = await anchor.web3.PublicKey.findProgramAddress([
                Buffer.from('program data')
            ], program.programId)
            let makeClaimTx: any

            let count = 0
            for (let i = 0; i < stakedApes.length; i++) {
                let nft = stakedApes[i]
                if (!nft.canClaim) continue
                makeClaimTx = await makeClaimTransaction(dataPda, program, nft)
                if (makeClaimTx.instructions.length !== 0) {
                    instructions = [...instructions, ...makeClaimTx.instructions]
                    count++
                }

                if (count === 5) {
                    instructionSet.push(instructions)
                    signerSet.push([])
                    instructions = []
                    count = 0
                }
            }

            if (instructions.length !== 0) {
                instructionSet.push(instructions)
                signerSet.push([])
            }

            if (instructionSet.length === 0) {
                setLoading(false)
                setTxProcessing(false)
                return
            }

            const result = await sendTransactions(connection, wallet, instructionSet, signerSet)
            if (result.success) {
                let newStakednft: any = []
                for (let i = 0; i < stakedApes.length; i++) {
                    let nft = stakedApes[i]
                    let totalAmount = totalFunded / TOTAL_SUPPLY
                    nft = {
                        ...nft,
                        canClaim: false,
                        availableAmount: 0,
                        claimedAmount: totalAmount
                    }
                    newStakednft.push(nft)
                }

                setStakedApes(newStakednft)
                setCollectible(0) // unclaimed amount
                setTotalUserClaimed(totalUserClaimed + collectible) // total earned for user
                setLoading(false)
                setTxProcessing(false)

            } else {
                setLoading(false)
                setTxProcessing(false)
            }


        } catch (error) {
            console.log(error)
            setLoading(false)
        }
    }

    const onDeposit = async () => {
        if (!wallet) {
            return
        }
        setLoading(true)
        setTxProcessing(true)
        let instructions: any = []
        let instructionSet: any = []
        let signerSet: any = []
        const provider = getProvider()
        const program = new anchor.Program(IDL, new PublicKey(PROGRAM_ID), provider)
        try {
            let [dataPda, bump_data] = await anchor.web3.PublicKey.findProgramAddress([
                Buffer.from('program data')
            ], program.programId)
            let [vault, nonce] = await anchor.web3.PublicKey.findProgramAddress([
                Buffer.from('submarine vault')
            ], program.programId)

            const value = Math.round(depositAmount)
            const secondValue = (depositAmount - value) * DECIMAL
            instructions.push(program.instruction.deposit(value, secondValue, {
                accounts: {
                    data: dataPda,
                    admin: wallet.publicKey,
                    vault: vault,
                    systemProgram: SystemProgram.programId
                }
            }))
            if (instructions.length > 0) {
                instructionSet.push(instructions)
                signerSet.push([])
            } else {
                return
            }
            const result = await sendTransactions(connection, wallet, instructionSet, signerSet)
            if (result.success) {
                await getTotalData()
                setLoading(false)
                setTxProcessing(false)
            } else {
                console.log("failed")
                setLoading(false)
                setTxProcessing(false)
            }
        } catch (error) {
            console.log(error)
            setLoading(false)
            setTxProcessing(false)
        }
    }

    const getProvider = () => {
        if (wallet)
            return new anchor.Provider(connection, wallet as anchor.Wallet, 'confirmed' as anchor.web3.ConfirmOptions)
    }

    const makeStartTransaction = async (data: any, nft: any, program: anchor.Program<any>) => {
        let instructions: any = []
        let signers: any = []
        if (!wallet) {
            setLoading(false)
            setTxProcessing(false)
            return { instructions, signers }
        }

        let [pool, bump_pool] = await anchor.web3.PublicKey.findProgramAddress([
            Buffer.from('pool'), nft.mint.toBuffer()
        ], program.programId)

        let poolInfo = await connection.getAccountInfo(pool)
        if (poolInfo) {
            setLoading(false)
            setTxProcessing(false)
            return { instructions, signers }
        } else {
            try {
                instructions.push(program.instruction.createPool(bump_pool, {
                    accounts: {
                        user: wallet.publicKey,
                        mint: nft.mint,
                        pool: pool,
                        systemProgram: SystemProgram.programId
                    }
                }))
            } catch (error) {
                console.log(error)
                setLoading(false)
                setTxProcessing(false)
                return { instructions, signers }
            }
            try {
                instructions.push(program.instruction.start({
                    accounts: {
                        user: wallet.publicKey,
                        pool: pool,
                        mint: nft.mint,
                        data: data,
                        systemProgram: SystemProgram.programId
                    }
                }))
            } catch (error) {
                console.log(error)
                setLoading(false)
                setTxProcessing(false)
                return { instructions, signers }
            }
        }
        return { instructions, signers }
    }

    const makeClaimTransaction = async (data: PublicKey, program: any, nft: any) => {
        let instructions: any = []
        let signers: any = []
        try {
            let [pool, bump_pool] = await anchor.web3.PublicKey.findProgramAddress([
                Buffer.from('pool'), nft.mint.toBuffer()
            ], program.programId)
            let [vault, nonce_vault] = await anchor.web3.PublicKey.findProgramAddress([
                Buffer.from('submarine vault')
            ], program.programId)
            let poolInfo = await connection.getAccountInfo(pool)
            if (!poolInfo) {
                setLoading(false)
                setTxProcessing(false)
                return {
                    instructions, signers
                }
            } else if (!nft.canClaim) {
                setLoading(false)
                setTxProcessing(false)
                return {
                    instructions, signers
                }
            }
            else {
                instructions.push(program.instruction.claim({
                    accounts: {
                        pool: pool,
                        data: data,
                        user: wallet?.publicKey,
                        mint: nft.mint,
                        systemProgram: SystemProgram.programId,
                        vault: vault,
                    }
                }
                ))
            }
        } catch (error) {
            console.log(error)
            setLoading(false)
            setTxProcessing(false)
        }
        return {
            instructions, signers
        }

    }

    const handleChange = (e: any) => {
        let value = e.target.value;
        let amount = Number.parseFloat(value)
        console.log("amount: ", amount)
        setDepositAmount(amount)
    }
    return (
        <div className={styles.collectionPage_container}>
            <Sidebar activeKey={2} />
            <div className={styles.staking_section} style={{ width: isMobile ? 'calc(100vw - 60px)' : `calc(100% - ${width}px)` }}>
                <Header sidebarOpen={sidebarOpen} />
                <div className={styles.staking_content}>
                    <TotalPart
                        onClaimAll={() => { onClaimAll() }}
                        totalStaked={totalStakedApes}
                        totalCollected={totalFunded}
                        totalNFT={stakedApes.length + unstakedApes.length}
                        stakeCount={stakedApes.length}
                        unstakeCount={unstakedApes.length}
                        walletCollectedAmount={collectible}
                    >
                    </TotalPart>
                    <Box className={styles.staking_main_content}>
                        <Tabs value={tabIndex} aria-label="basic tabs example"
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
                            <Tab label="Staked Aqua Apes" onClick={() => router.push('/staking?tab=stake', '/staking?tab=stake', { shallow: true })} />
                            <Tab label="Unstaked Aqua Apes" onClick={() => router.push('/staking?tab=unstake', '/staking?tab=unstake', { shallow: true })} />
                        </Tabs>
                    </Box>
                    <MainContent>
                        {

                            (!tab || tab === 'reward') && <Fragment>
                                <Grid container spacing={3}>
                                    <Grid item xs={12} sm={12} md={7}>
                                        <div>
                                            <div className={`font-quick ${styles.textTitle}`}>STAKING GUIDE</div>
                                            <div className={`font-quick ${styles.textContent} mt-8`}>{""}</div>
                                        </div>
                                        <div className={`mt-32`}>
                                            <div className={`font-quick ${styles.textTitle}`}>LOCKUP PERIOD REWARDS</div>

                                            <div className={`mt-16 ${styles.calendarGroup}`}>
                                                {
                                                    calendarConstant.map((item, index) => <CalendarItem key={index} day={item.day} perFurr={item.perFurr}></CalendarItem>)
                                                }
                                            </div>
                                        </div>
                                    </Grid>
                                    <Grid item xs={12} sm={12} md={5}>
                                        <div className={`font-quick ${styles.textTitle}`}>TOTAL EARNED $SOL</div>
                                        <div className={`font-quick ${styles.textDailyEarn}`}>
                                            <div className={`font-quick ${styles.textTotal}`}>{`${totalUserClaimed.toFixed(5)}`}</div>
                                            <div className={`font-quick ${styles.textFluff}`}> &nbsp;$SOL</div>
                                        </div>
                                        <div className={`mt-32`}>
                                            <div className={`font-quick ${styles.textTitle}`}>LOCKUP PERIOD REWARDS</div>
                                            {/* <div className={`font-quick ${styles.textContent} mt-8`}>7 days = {1} staked</div>
                                            <div className={`font-quick ${styles.textContent} mt-8`}>14 days = {2} staked</div>
                                            <div className={`font-quick ${styles.textContent} mt-8`}>21 days = {3} staked</div> */}

                                            {

                                                isAdmin &&
                                                <div className={`mt-32`}>
                                                    <div className={`font-quick ${styles.textTitle}`}>SET DEPOSIT AMOUNT</div>
                                                    <div>
                                                        <input type='number' value={depositAmount} style={{ outline: "none", paddingLeft: "10px", background: "#d4d4d48f", border: "none", borderRadius: "3px", margin: "5px 0", color: "#fff" }} onChange={(e) => handleChange(e)}></input>
                                                        <div className={`font-quick ${portalStyles.btnClaim}`} onClick={onDeposit}>DEPOSIT ALL</div>

                                                        {/* <button onClick={onDeposit}>{"DEPOSIT"}</button> */}
                                                    </div>
                                                </div>
                                            }
                                        </div>
                                        {/* <div className={`mt-56`}>
                                            <div className={`font-quick ${styles.textTitle}`}>YOUR DAILY EARNINGS</div>
                                            <div className={`font-quick ${styles.textDailyEarn}`}>
                                                <div className={`font-quick ${styles.textTotal}`}>{1}</div>
                                                <div className={`font-quick ${styles.textFluff}`}> &nbsp$SOL</div>
                                            </div>
                                        </div> */}
                                    </Grid>
                                </Grid>
                            </Fragment>
                        }
                        {
                            tab === 'stake' && <Fragment>
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
                                        {loading ? <Box sx={{ color: "Grey", textAlign: "center" }} >
                                            <CircularProgress sx={{ marginTop: "100px" }} color="inherit" />
                                            &nbsp; Loading...
                                        </Box> : stakedApes.length > 0 ? stakedApes.map((nft: any, index: number) => {
                                            return (
                                                <SwiperSlide key={index}>
                                                    <NftItem
                                                        info={nft}
                                                        onOpen={() => { }}
                                                        onClicks={[async () => { }, async () => { onClaim(nft) }]}
                                                    />
                                                </SwiperSlide>
                                            )
                                        }) : <Typography sx={{ textAlign: "center", lineHeight: "300px" }} color="#aaa" >No available items</Typography>
                                        }
                                    </>
                                </Swiper>
                            </Fragment>
                        }
                        {
                            tab === 'unstake' && <Fragment>
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
                                        {loading ? <Box sx={{ color: "Grey", textAlign: "center" }} >
                                            <CircularProgress sx={{ marginTop: "100px" }} color="inherit" />
                                            &nbsp; Loading...
                                        </Box> : unstakedApes.length > 0 ? unstakedApes.map((nft: any, index: number) => {
                                            return (
                                                <SwiperSlide key={index}>
                                                    <NftItem
                                                        info={nft}
                                                        onOpen={() => { }}
                                                        onClicks={[async () => { onStake(nft) }, async () => { }]}
                                                    />
                                                </SwiperSlide>
                                            )
                                        }) : <Typography sx={{ textAlign: "center", lineHeight: "300px" }} color="#aaa" >No available items</Typography>
                                        }
                                    </>
                                </Swiper>
                            </Fragment>
                        }
                    </MainContent>
                </div>
                <ProcessingModal loading={txProcessing} />
            </div>
        </div>
    )
}

Staking.getInitialProps = async ({ store }) => {

}

const mapStateToProps = state => {

    return {
        people: state.people?.people || [],
        selectedPerson: state.people.selectedPerson,
        sidebarOpen: state.init.sidebarOpen
    }
}

const mapDispatchToProps = { handleSidebarOpen, handleSidebarClose }

export default connect(mapStateToProps, mapDispatchToProps)(Staking)
