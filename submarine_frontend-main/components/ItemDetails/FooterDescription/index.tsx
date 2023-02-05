import { Fragment } from 'react'
import Box from '@mui/material/Box'

const FooterDescription = ({ label1, label2 = '' }) => {
    return <Box sx={{ marginTop: "15px", fontSize: "13px", color: "#aaa" }}>By clicking <span style={{ color: "#fff" }}>{label1}</span>
        {label2 !== '' ? <Fragment> or <span style={{ color: "#fff" }}>{label2}</span></Fragment> : ''}, you understand and agree to the <span style={{ color: "#00D2FF" }}>Terms of Service</span></Box>
}

export default FooterDescription