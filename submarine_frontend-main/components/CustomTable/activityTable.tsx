import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import InputLabel from '@mui/material/InputLabel';
import TableContainer from '@mui/material/TableContainer';
import TableFooter from '@mui/material/TableFooter';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight'
import LastPageIcon from '@mui/icons-material/LastPage';
import Link from 'next/link'

import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';

import Pagination from '../Pagination'
import moment from 'moment';



const CustomTable = ({ activityList, page, totalCount, setPage, pageLimit, setPageLimit }) => {
    // const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);

    return (
        <div>
            <table>
                <thead>
                    <tr>
                        <th>NAME</th>
                        <th>TXN ID</th>
                        <th>TYPE</th>
                        <th>TIME</th>
                        <th>AMOUNT</th>
                        <th>BUYER</th>
                        <th>SELLER</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        activityList.length > 0 && activityList.map((item, index) => (
                            <tr key={index}>
                                <td>
                                    <img src={item.image} style={{ marginRight: "10px" }} alt="" />
                                    {item.name}
                                </td>
                                <td>
                                    <span>{item.signature?.substr(0, 6)} ... {item.signature?.substr(item.signature?.lenth - 3, 3)}</span>
                                </td>
                                <td>
                                    {item.type === 1 && 'List'}
                                    {item.type === 2 && 'Unlist'}
                                    {item.type === 3 && 'Update List'}
                                    {item.type === 4 && 'Buy'}
                                    {item.type === 5 && 'Make Offer'}
                                    {item.type === 6 && 'Update Offer'}
                                    {item.type === 7 && 'Cancel Offer'}
                                    {item.type === 8 && 'Accept Offer'}
                                </td>
                                <td> {moment(item.created_at).fromNow()}</td>
                                <td> {item.price} ◎</td>
                                <td>
                                    <span>{item.from?.substr(0, 6)} ... {item.from?.substr(item.from?.lenth - 3, 3)}</span>
                                </td>
                                <td> <span>{item.to?.substr(0, 6)} ... {item.to?.substr(item.to?.lenth - 3, 3)}</span></td>
                            </tr>
                        ))
                    }
                </tbody>
            </table>
            {
                activityList.length === 0 && <Typography sx={{ textAlign: "center", lineHeight: "300px" }} color="#aaa" >No available items</Typography>
            }
            {
                activityList.length > 0 && <Pagination page={page} totalCount={totalCount} setPage={setPage} pageLimit={pageLimit} setPageLimit={setPageLimit} />
            }
        </div>
    )
}

export default CustomTable