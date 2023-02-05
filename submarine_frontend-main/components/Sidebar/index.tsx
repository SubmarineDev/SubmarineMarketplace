import { useSelector, useDispatch } from 'react-redux'
import styles from './Sidebar.module.scss'
import { useRouter } from 'next/router'

import React, { useEffect } from 'react';
import { styled, Theme, CSSObject } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import List from '@mui/material/List';
// import CssBaseline from '@mui/material/CssBaseline';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { handleSidebarOpen, handleSidebarClose } from 'store/actions/init'

const drawerWidth = 199;

const openedMixin = (theme: Theme): CSSObject => ({
    width: drawerWidth,
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: 'hidden',
});

const closedMixin = (theme: Theme): CSSObject => ({
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    // width: `calc(${theme.spacing(7)} + 1px)`,
    width: "60px",
    [theme.breakpoints.up('md')]: {
        // width: `calc(${theme.spacing(8)} + 1px)`,
        width: "90px",
    },
});

const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing(0, 1),
    cursor: 'pointer',
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
    ({ theme, open }) => ({
        zIndex: 1,
        width: drawerWidth,
        flexShrink: 0,
        whiteSpace: 'nowrap',
        boxSizing: 'border-box',
        ...(open && {
            ...openedMixin(theme),
            '& .MuiDrawer-paper': openedMixin(theme),
        }),
        ...(!open && {
            ...closedMixin(theme),
            '& .MuiDrawer-paper': closedMixin(theme),
        }),
    }),
);

let menuList: any[] = [
    { icon: 'Home_icon', text: 'Home', url: '/' },
    { icon: 'Collections_icon', text: 'Collection', url: '/collections' },
    { icon: 'Staking_icon', text: 'Staking', url: '/staking' },
    { icon: 'Community_icon', text: 'Community', url: '/#' },
]
const Sidebar = ({ activeKey = -1 }) => {
    const router = useRouter()
    // const theme = useTheme();
    const dispatch = useDispatch()
    const [open, setOpen] = React.useState(localStorage.getItem('SIDEBAR_STATUS') === '1' ? true : false);

    const handleDrawerOpen = () => {
        setOpen(true);
        localStorage.setItem('SIDEBAR_STATUS', '1')
        dispatch(handleSidebarOpen())
    };

    const handleDrawerClose = () => {
        setOpen(false);
        localStorage.setItem('SIDEBAR_STATUS', '0')
        dispatch(handleSidebarClose())
    };


    useEffect(() => {
        let _open: any = localStorage.getItem('SIDEBAR_STATUS')
        setOpen(_open === '1' ? true : false)

    }, [open])

    return (
        <Drawer variant="permanent" open={open}
            sx={{
                '& .MuiDrawer-paper': {
                    top: "36px",
                    background: '#13202D',
                    border: "none",
                    borderRight: "1px solid #0C4258"
                }
            }}>
            <DrawerHeader>
                <img src={`/assets/images/logo${open ? "" : "_sm"}.png`} alt="" onClick={() => router.push(`/`, `/`, { shallow: true })} />
            </DrawerHeader>
            <Box sx={{
                position: "absolute", top: "50%", right: 0, zIndex: 100000, padding: "3px 5px 4px 9px", background: "#071421", borderTopLeftRadius: "5px", borderBottomLeftRadius: "5px", cursor: "pointer"
            }} onClick={open ? handleDrawerClose : handleDrawerOpen}>
                <img src={`/assets/images/${open ? "left" : "right"}_angle.png`} alt="" />
            </Box>
            <List>
                {menuList.map((item, index) => (
                    <ListItemButton
                        key={item.text}
                        sx={{
                            minHeight: 48,
                            justifyContent: open ? 'initial' : 'center',
                            px: 2.5,
                            background: index === activeKey ? '#092B3E' : 'transparent',
                            '&:hover': {
                                background: '#092B3E',
                            }
                        }}
                        onClick={() => router.push(`${item.url}`, `${item.url}`, { shallow: true })}
                    >
                        {!open && <ListItemIcon
                            sx={{
                                minWidth: 0,

                                justifyContent: 'center',
                                color: "#fff",
                            }}
                        >
                            <img src={`/assets/images/${item.icon}${index === activeKey ? '2' : ''}.png`} alt="" />
                        </ListItemIcon>}
                        {open && <ListItemText primary={item.text} sx={{ color: index === activeKey ? '#fff' : '#fff', opacity: open ? 1 : 0 }} />}
                    </ListItemButton>
                ))}
            </List>
            <Box sx={{
                position: "absolute",
                bottom: '14px',
                width: "100%",
                borderTop: "1px solid #0C4258",
                textAlign: "center",
                margin: '30px 0',
                paddingTop: '30px',

                img: {
                    display: !open ? "block" : "",
                    margin: !open ? "5px auto" : '0 10px',
                    paddingBottom: "20px"
                }
            }}>
                <img src="/assets/images/twitter_icon.png" alt="" />
                <img src="/assets/images/discord_icon.png" alt="" />
            </Box>
        </Drawer>
    )
}

export default Sidebar