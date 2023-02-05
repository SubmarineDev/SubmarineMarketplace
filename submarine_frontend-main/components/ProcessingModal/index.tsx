import * as React from 'react';
import Modal from '@mui/material/Modal'
import { useResize } from '../../utils/Helper';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { CircularProgress } from '@mui/material';
import styles from '../ItemDetails/MakeOfferModal/index.module.scss'
import FadeLoader from "react-spinners/FadeLoader";


// const { isMobile } = useResize();
const progressModalStyle = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    height: 320,
    color: "#fff",
    bgcolor: '#FFFFFF',
    border: '2px solid #000000',
    borderRadius: '10px',
    background: '#0B354C',
    boxShadow: 24,
    p: 3,
};

const ProcessingModal = ({ loading }) => {
    return (
        <Modal open={loading}>
            <Box sx={progressModalStyle} style={{ width: '500px' }}>
                <div className={styles.modalContainer}>
                    <Typography sx={{ mb: 2, fontSize: "24px", fontWeight: "bold" }}>Processing Transaction</Typography>
                    {/* <CircularProgress sx={{ color: "#00D2FF", mt: '15%' }}></CircularProgress> */}
                    <div className={styles.progressSpinner}>
                        <FadeLoader color={`#00D2FF`} height={10} width={10} radius={10} />
                    </div>
                    <Typography color="#AAAAAA" sx={{ fontSize: "15px", mt: '30%' }}>Do not close this Window</Typography>
                    <Typography color="#fff" sx={{ fontSize: "15px", mt: 2 }}>Your transaction will be processed in a few seconds after your wallet interaction. Please wait.</Typography>
                </div>
            </Box>
        </Modal>
    )
}

export default ProcessingModal