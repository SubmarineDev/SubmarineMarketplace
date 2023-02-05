import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        // backgroundColor: theme.palette.common.black,
        padding: "10px 20px",
        backgroundColor: "#0B354C",
        // color: theme.palette.common.white,
        color: "#00D2FF",
        border: "3px solid #102841",
        borderRadius: "10px"
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
    }
}));


const CustomTable = ({ data }) => {

    return (
        <TableContainer component={Paper} sx={{ backgroundColor: "#102841", boxShadow: "none" }}>
            <Table aria-label="custom pagination table">
                <TableHead>
                    <TableRow>
                        <StyledTableCell align="left">Token</StyledTableCell>
                        <StyledTableCell align="left">Holders</StyledTableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {data?.map((row: any, index: number) => (
                        <TableRow key={index}>
                            <TableCell style={{ width: "16%" }} align="left" sx={{ padding: "15px 25px", borderBottom: "1px solid #0C4258", color: '#fff' }}>
                                {index === 0 && '1'}
                                {index === 1 && '2 - 5'}
                                {index === 2 && '6 - 24'}
                                {index === 3 && '25 - 50'}
                                {index === 4 && 'Over 50+'}
                            </TableCell>
                            <TableCell style={{ width: "16%" }} align="left" sx={{ padding: "15px 25px", borderBottom: "1px solid #0C4258", color: '#fff' }}>
                                {row}
                            </TableCell>
                        </TableRow>
                    ))}

                </TableBody>

            </Table>
        </TableContainer >
    )
}

export default CustomTable