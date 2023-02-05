import React, { useState, useEffect } from 'react'
import { Box, Typography, Button, InputLabel } from '@mui/material';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight'
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';

import { ITEMS_PER_PAGE } from "../../config";

const Pagination = ({ page, totalCount, setPage, pageLimit, setPageLimit }) => {
    const [pageCount, setPageCount] = useState<number>(0)

    const handleChangePage = (newPage: number) => {
        if (newPage > 0 && newPage <= pageCount)
            setPage(newPage)
    }

    const handleChangePageLimit = (newPageLimit: number) => {
        const _pageCount = Math.ceil(totalCount / newPageLimit)
        setPageCount(_pageCount)
        setPageLimit(newPageLimit)
        setPage(1)
    }

    useEffect(() => {
        const _pageCount = Math.ceil(totalCount / pageLimit)
        setPageCount(_pageCount)
    }, [])

    return <Box sx={{ display: "flex", justifyContent: "space-between", marginTop: "20px" }}>
        <Box sx={{ display: "flex", alignItems: "center" }}>
            <Button sx={{ margin: "0 5px", padding: "12px 8px", minWidth: "0", background: page > 1 ? "#1B6A97" : "#0E1B29", color: page > 1 ? "#fff" : "#324353" }} onClick={() => { page > 1 ? setPage(1) : {} }}>
                <KeyboardDoubleArrowLeftIcon sx={{ fontSize: "16px", fontWeight: "bold" }} />
            </Button>
            <Button sx={{ margin: "0 5px", padding: "12px 8px", minWidth: "0", background: page > 1 ? "#1B6A97" : "#0E1B29", color: page > 1 ? "#fff" : "#324353" }} onClick={() => { page > 1 ? setPage(page - 1) : {} }}>
                <KeyboardArrowLeftIcon sx={{ fontSize: "16px", fontWeight: "bold" }} />
            </Button>
            <Typography color="#fff" sx={{ margin: "0 18px", fontSize: "14px" }}>Page {page} of {pageCount}</Typography>

            <Button sx={{ margin: "0 5px", padding: "12px 8px", minWidth: "0", background: page < pageCount ? "#1B6A97" : "#0E1B29", color: page < pageCount ? "#fff" : "#324353" }} onClick={() => { page < pageCount ? setPage(page + 1) : {} }}>
                <KeyboardArrowRight sx={{ fontSize: "16px", fontWeight: "bold" }} />
            </Button>
            <Button sx={{ margin: "0 5px", padding: "12px 8px", minWidth: "0", background: page < pageCount ? "#1B6A97" : "#0E1B29", color: page < pageCount ? "#fff" : "#324353" }} onClick={() => { page < pageCount ? setPage(pageCount) : {} }}>
                <KeyboardDoubleArrowRightIcon sx={{ fontSize: "16px", fontWeight: "bold" }} />
            </Button>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center" }}>
            <InputLabel htmlFor="outlined-adornment-password" sx={{ marginRight: "9px", color: '#fff', fontSize: "14px" }}>Go to Page</InputLabel>
            <input type="text" style={{ paddingLeft: "10px", width: "67px", height: "39px", outline: "none", backgroundColor: "#13202D", color: "#fff", borderRadius: "5px", border: "1px solid #1B6A97", fontSize: "14px" }} onChange={e => handleChangePage(e.target.value)} value={page} />
            <InputLabel htmlFor="outlined-adornment-password" sx={{ margin: "0 9px", color: '#fff', fontSize: "14px" }}>Show</InputLabel>
            <select style={{ padding: "10px", width: "102px", outline: "none", border: "1px solid #1B6A97", backgroundColor: "#13202D", borderRadius: "5px", color: "#fff" }} onChange={e => handleChangePageLimit(e.target.value)} value={pageLimit}>
                {
                    ITEMS_PER_PAGE.map((value, key) => (
                        <option key={key} value={value}>{value === -1 ? 'All' : value}</option>
                    ))
                }
            </select>
        </Box>
    </Box>
}

export default Pagination