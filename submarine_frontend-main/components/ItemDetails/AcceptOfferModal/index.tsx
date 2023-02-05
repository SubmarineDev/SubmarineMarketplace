import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import ActionButton from '../Button'
import Grid from '@mui/material/Grid'
import Paper from '@mui/material/Paper'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { useResize } from '../../../utils/Helper';
// toast import
import { toast } from 'react-toastify'

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

const handleAcceptOffer = () => {
    toast.error("Error Message", { theme: 'dark' })
    toast.success("Success Message", { theme: 'dark' })
}
const AcceptOfferModal = ({ item, collectionName, highestOfferPrice, open, handleOpen, handleClose, acceptOffer }) => {
    const { isMobile } = useResize();
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
                        Accept Offer
                    </Typography>
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                            <img className="img_responsive" src={item.image} alt="" />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Box className="ds-flex justify-between" sx={{ flexDirection: "column", height: "100%", marginBottom: "10px", color: "#7FF9E6" }}>
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
                                        Current Price
                                    </Typography>
                                    <Typography component="div" color="#fff" sx={{ fontSize: "24px" }}>
                                        {item.price} ◎
                                    </Typography>
                                </Box>
                                <Box>
                                    <Typography component="div" color="#aaa" sx={{ fontSize: "14px" }}>
                                        Highest Offer
                                    </Typography>
                                    <Typography component="div" color="#fff" sx={{ fontSize: "24px" }}>
                                        {highestOfferPrice ? highestOfferPrice : 0} ◎
                                    </Typography>
                                </Box>
                            </Box>
                        </Grid>
                    </Grid>
                    <Typography color="#aaa" sx={{ mt: 3, fontSize: "14px" }}>You are about to accept the highest offer on your item at {highestOfferPrice} SOL, please type <span style={{ color: "#fff", fontSize: "15px" }}>{highestOfferPrice} SOL</span> to confirm that you accept the offer which is 90.45% of the listing price. </Typography>
                    <Box sx={{ mb: 1 }}>
                        {/* <input className="input-field1" type="text" /> */}
                    </Box>
                    <ActionButton text="Confirm" bgColor="#1B6A97" onClick={acceptOffer}></ActionButton>
                </Box>
            </Modal>
        </div >
    )
}

export default AcceptOfferModal