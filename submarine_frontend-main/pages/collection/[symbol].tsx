import React, { useState, useEffect, Fragment } from 'react'
import { useRouter } from 'next/router'
import { useDispatch } from 'react-redux'
import styles from '../../styles/Collection.module.scss'
import Sidebar from '../../components/Sidebar'
import AuctionItem from '../../components/AuctionItem'
import Dropdown from '../../components/Dropdown'
import Header from '../../components/Header'
import { handleSidebarOpen, handleSidebarClose } from "store/actions/init"

import { makeStyles, withStyles } from '@mui/styles';
import { styled, Theme, CSSObject } from '@mui/material/styles';
import { connect } from "react-redux"
// import { createTheme, ThemeProvider } from '@mui/material/styles';

import { AppBar, Tabs, Tab, Typography, Box, Slider, Button, CircularProgress, Backdrop } from '@mui/material'
import MuiAccordion from '@mui/material/Accordion'
import MuiAccordionSummary from '@mui/material/AccordionSummary'
import MuiAccordionDetails from '@mui/material/AccordionDetails'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import SearchIcon from '@mui/icons-material/Search';
import DoubleArrowIcon from '@mui/icons-material/DoubleArrow';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import FilterAltOutlinedIcon from '@mui/icons-material/FilterAltOutlined';
import QueryStatsOutlinedIcon from '@mui/icons-material/QueryStatsOutlined';

import dynamic from "next/dynamic";
import MuiDrawer from '@mui/material/Drawer';
import ClearIcon from '@mui/icons-material/Clear';

import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import ActivityList from '../../components/CustomTable/activityTable'
import TokenHolderTable from '@components/CustomTable/tokenHolderTable'
import TokenHolderDetailsTable from '@components/CustomTable/tokenHolderDetailsTable'
import { useResize } from './../../utils/Helper'
import { common } from '@mui/material/colors'

import commonService from "../../config/services/common.service";
import { MARKETPLACES_API, serverUrl, ITEMS_PER_PAGE } from "../../config";

const ActivityChart: any = dynamic(() => import("../../components/Chart"), {
    ssr: false
});

const drawerWidth = 300

const openedMixin = (theme: Theme): CSSObject => ({
    '&::-webkit-scrollbar': {
        width: '10px'
    },
    '&::-webkit-scrollbar-track': {
        margin: '5px',
        background: '#071421',
        borderRadius: '10px'
    },
    '&::-webkit-scrollbar-thumb ': {
        background: '#0B354D',
        borderRadius: '50px',
        cursor: 'pointer'
    },
    '&::-webkit-scrollbar-thumb:hover': {
        background: '#0B354D'
    },
    padding: "30px",
    width: useResize().isMobile ? "calc(100vw - 60px)" : drawerWidth,
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: 'hidden',
});

const closedMixin = (theme: Theme): CSSObject => ({
    padding: "30px 9px 0 16px",
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: `calc(${theme.spacing(7)} + 1px)`,
    [theme.breakpoints.up('sm')]: {
        width: "50px",
    },
    [theme.breakpoints.down('sm')]: {
        // width: `calc(${theme.spacing(8)} + 1px)`,
        width: "30px",
        display: "none"
    },
});

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
    ({ theme, open }) => ({
        width: drawerWidth,
        height: "calc(60vh)",
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

const Accordion: any = withStyles({
    root: {

        backgroundColor: "transparent",
        border: '1px solid rgba(0, 0, 0, .125)',
        boxShadow: 'none',
        '&:not(:last-child)': {
            borderBottom: 0,
        },
        '&:before': {
            display: 'none',
        },
        '&$expanded': {
            // margin: 'auto',
        },
    },
    expanded: {

    },
    rounded: {
        marginBottom: '20px'
    }
})(MuiAccordion);

const AccordionSummary: any = withStyles({
    root: {
        borderBottom: '1px solid rgba(0, 0, 0, .125)',
        marginBottom: -1,
        minHeight: '42px',
        borderRadius: "8px",
        fontSize: "14px",
        '&$expanded': {
            minHeight: 42,
        },

        '& .MuiAccordionSummary-expandIcon': {
            color: '#8fb0ce',
            '&$expanded': {
                transform: 'rotate(45deg)'
            },
        },
        '& .MuiAccordionSummary-content': {
            margin: '7px 0'
        }
    },
    content: {
        '&$expanded': {
            margin: '7px 0',
        },
    },
    expanded: {},
})(MuiAccordionSummary);

const AccordionDetails: any = withStyles((theme) => ({
    root: {
        padding: theme.spacing(0),
    },
}))(MuiAccordionDetails)


interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
    style: any;
}

function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;
    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box>
                    {children}
                </Box>
            )}
        </div>
    );
}

const TabItemsLabel = () => {
    return <Box sx={{ display: "flex" }}>
        <FormatListBulletedIcon sx={{ color: '#00D2FF' }} />
        <Typography sx={{ ml: 1 }}>Items</Typography>
    </Box>
}

const TabActivityLabel = () => {
    return <Box sx={{ display: "flex" }}>
        <AccessTimeIcon sx={{ color: '#00D2FF' }} />
        <Typography sx={{ ml: 1 }}>Activity</Typography>
    </Box>
}
const TabStatsLabel = () => {
    return <Box sx={{ display: "flex" }}>
        <QueryStatsOutlinedIcon sx={{ color: '#00D2FF' }} />
        <Typography sx={{ ml: 1 }}>Stats</Typography>
    </Box>
}

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        color: "#889ab1",
        '& .MuiAppBar-root': {
            boxShadow: 'none',
            borderBottom: '1px solid #0C4258'
        },
        '& .MuiTab-root': {
            // margin: '0 5px',
            // minWidth: '120px',
            color: "#fff"
        },
        '& .Mui-selected': {

        },
        '& .MuiTabs-indicator': {
            height: '3px',
            '&:after': {
                position: "absolute",
                left: "40%",
                bottom: "-20px",
                content: '""',
                display: "block",
                borderLeft: "12px solid transparent",
                borderRight: "12px solid transparent",
                borderBottom: "12px solid transparent",
                borderTop: "9px solid #00d2ff",
                zIndex: 5
            },
        }
    },
    indicator: {
        backgroundColor: '#00D2FF'
    },
    verify_button: {
        border: "1px solid #7FF9E6",
        color: "#7FF9E6"
    },
    feature_button: {
        border: "1px solid #00D2FF",
        color: "#00D2FF"
    },
    chart_content_wrapper: {
        padding: "20px 19px",
        background: "#0E1B29",
        borderRadius: "5px"
    },
    chart_header_wrapper: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "40px"
    },
    chart_header_title: {
        fontSize: "16px"
    },
    toggle_button_group: {
        backgroundColor: "#071421",
        overflow: 'auto'
    },
    individual_toggle_btn: {
        padding: "5px 8px",
        fontSize: "12px",
        color: "#aaa",
        textTransform: "none",
    },
    item_search_icon: {
        position: "absolute",
        top: '8px',
        right: '11px',
        zIndex: 1,
        fontSize: "25px",
        color: '#fff',
        cursor: "pointer"
    },
    activitylist_box: {
        margin: "40px 0"

    },
    stats_header_panel: {
        background: "#0E1B29",
        padding: "10px 20px",
        display: "flex",
        justifyContent: "space-between",
        marginBottom: '5px'
    },
    token_holders_content: {
        width: '20%',
        marginBottom: '20px'
    },
    token_holders_wallet_content: {
        // background: "#0E1B29",
        width: '78%',
        marginBottom: '20px'
    }

}));


const Collection = ({ sidebarOpen }) => {
    const router: any = useRouter()
    const { symbol, activeTab } = router.query
    const { isMobile } = useResize();
    const [open, setOpen] = React.useState(false);
    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };


    const [expanded, setExpanded] = React.useState<string | false>('panel1');
    const [schVisible, setSchVisible] = useState(false)

    const [selectedPropertyList, setSelectedProperyList] = useState<any>([]);
    const [changePropertyCount, setChangePropertyCount] = useState<number>(0)

    const handleChangeAccordion = (panel: string) => (event: React.ChangeEvent<{}>, newExpanded: boolean) => {
        setExpanded(newExpanded ? panel : false);
    };

    const [value, setValue] = React.useState(0);
    const [isActivity, setActivity] = React.useState(false)
    const [alignment, setAlignment] = React.useState('web');

    const [analyticsInfo, setAnalyticsInfo] = React.useState<any>({});
    const [tabIndex, setTabIndex] = useState<number>(0)


    const handleToggleButtonChange = (
        event: React.MouseEvent<HTMLElement>,
        newAlignment: string,
    ) => {
        setAlignment(newAlignment);
    };

    const classes = useStyles();

    const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
        setValue(newValue);
    };

    // const ExistInSelectedPropertyList = (trait_type: any, value: any) => {
    //     let result: boolean = false
    //     let _selectedPropertyList: any = selectedPropertyList
    //     const _filteredAttributes: any = _selectedPropertyList.find(item => item.trait_type === trait_type)
    //     let _index: number = -1
    //     _selectedPropertyList.map((item, index) => {
    //         if (item.trait_type == trait_type)
    //             _index = index
    //     })
    //     console.log('_index', _index)
    //     if (_index > 0) {
    //         if (_selectedPropertyList[_index].value.indexOf(value) > 0)
    //             result = true
    //     }
    //     return result
    // }

    const addSelectedPropertyList = (trait_type: any, value1: any, key_index: number) => {
        console.log('selectedPropertyList-----------------', selectedPropertyList)
        let _selectedPropertyList: any = selectedPropertyList

        let _index: number = key_index
        _selectedPropertyList.map((item, index) => {
            if (item && item.trait_type === trait_type)
                _index = index
        })


        if (!_selectedPropertyList[_index]) {
            selectedPropertyList[_index] = {
                trait_type: trait_type,
                value: [value1]
            }
        } else {
            _selectedPropertyList[_index].value.push(value1)
        }

        console.log('selectedPropertyList===================selectedPropertyList', selectedPropertyList[_index])

        // if (_index >= 0) {
        //     _selectedPropertyList[_index].value.push(value)
        // } else {
        //     _selectedPropertyList.push({
        //         trait_type: trait_type,
        //         value: [value]
        //     })
        // }

        setSelectedProperyList([..._selectedPropertyList])
        let _count: number = changePropertyCount
        _count++
        setChangePropertyCount(_count)

        console.log('_selectedPropertyList=====', _selectedPropertyList)
    }

    const removeSelectedPropertyList = (trait_type: any, value: any) => {
        let _selectedPropertyList: any = selectedPropertyList

        let _index: number = -1
        _selectedPropertyList.map((item, index) => {
            if (item && item.trait_type === trait_type)
                _index = index
        })

        _selectedPropertyList[_index].value.pop(value)
        if (_selectedPropertyList[_index].value.length === 0)
            _selectedPropertyList.pop(0)

        setSelectedProperyList([..._selectedPropertyList])
        let _count: number = changePropertyCount
        _count--
        setChangePropertyCount(_count)
    }

    const handleChangePrice = (newPrice) => {
    }

    let width = sidebarOpen === true ? 199 : 90

    const [loading, setLoading] = useState<boolean>(false)
    const [filter, setFilter] = useState<string>(`price_low_to_high`)
    const [search, setSearch] = useState<string>(``);
    const [searchByPrice, setSearchByPrice] = useState<boolean>(true);
    const [attributeFilter, setAttributeFilter] = useState<any>([]);

    const [isFilterPrice, setIsFilterPrice] = React.useState<boolean>(false)
    const [maxPrice, setMaxPrice] = useState<any>(0.00);
    const [minPrice, setMinPrice] = useState<any>(0.00);

    const [hasMore, setHasMore] = useState<boolean>(true);
    const [offset, setOffset] = useState<number>(0);

    const [data, setData] = useState({
        collection: {},
        nfts: { count: 0, rows: [] }
    });
    const [collectionData, setCollectionData] = useState<any>();
    const [nftData, setNftData] = useState<any>([]);
    const [collectionActivities, setCollectionActivities] = useState<any>([])

    const [sortValues, setSortValues] = React.useState([{ value: 'price_low_to_high', label: 'Sort:  Low to High' },])
    const [page, setPage] = useState<number>(1)
    const [pageLimit, setPageLimit] = useState<number>(ITEMS_PER_PAGE[0])
    const [pageCount, setPageCount] = useState<number>(0)
    const [totalCount, setTotalCount] = useState<number>(0)

    useEffect(() => {
        (async () => {
            setLoading(true);

            let _collectionData: any = await commonService({
                method: "get",
                route: `${MARKETPLACES_API.GET_COLLECTION_DATA}${symbol}`,
            });
            setCollectionData({ ..._collectionData });
            console.log('_collectionData', _collectionData)
            setMinPrice(_collectionData?.minPrice)

            if (!activeTab || activeTab === 'items') {
                setTabIndex(0)
                let result: any;

                let propertyList: any[] = []
                await selectedPropertyList.map((item: any, index: number) => {
                    if (item)
                        propertyList.push({ ...item })
                })

                console.log('-----------propertyList', propertyList)


                result = await commonService({
                    method: "post",
                    route: `${MARKETPLACES_API.GET_COLLECTION_DATA}`,
                    data: {
                        offset: 0,
                        limit: 100,
                        symbol: symbol,
                        sort: sortValues[0].value,
                        search: search,
                        price: {
                            min: minPrice || _collectionData?.minPrice,
                            max: maxPrice || _collectionData?.maxPrice
                        },
                        attributes: propertyList
                    }
                });
                setData({ ...result });
                setNftData([...result.nfts.rows]);


                setOffset(0);
                setHasMore(true);
            } else if (activeTab === 'activity') {
                setTabIndex(1)
                let _collectionActivities: any = await commonService({
                    method: "post",
                    route: `${MARKETPLACES_API.GET_ACTIVITY_COLLECTION}`,
                    data: {
                        symbol: symbol,
                        limit: pageLimit,
                        currentPage: page
                    }
                });

                setCollectionActivities(_collectionActivities?.rows)

                setTotalCount(_collectionActivities.count)
            } else if (activeTab === 'stats') {

                let _analyticsInfo: any = await commonService({
                    method: "post",
                    route: `${MARKETPLACES_API.GET_ANALYTICS}`,
                    data: {
                        symbol: symbol
                    }
                });
                setTabIndex(2)
                setAnalyticsInfo(_analyticsInfo)
            }

            setLoading(false);

        })()
    }, [symbol, activeTab, search, isFilterPrice, searchByPrice, attributeFilter, selectedPropertyList.length, changePropertyCount, sortValues[0].value, page, pageLimit])

    return (
        <div className={styles.collectionPage_container}>
            <Sidebar activeKey={1} />
            <div className={styles.profile_section} style={{ width: isMobile ? 'calc(100vw - 60px)' : `calc(100% - ${width}px)` }}>
                <Header sidebarOpen={sidebarOpen} />
                <div className={styles.profile_header}>
                    <div className={styles.profile_info}>
                        <div className={styles.profile_image}>
                            <img style={{ width: "150px", height: "150px" }} src={serverUrl + collectionData?.baseImage} alt="profile" />
                        </div>
                        <div className={styles.profile_description}>
                            <h2 className={styles.profile_name}>{collectionData?.name}</h2>
                            <p>{collectionData?.description}... read more</p>
                            <ul className={styles.profile_link_wrapper}>
                                <li>
                                    <Button className={classes.verify_button}>
                                        <CheckCircleOutlineIcon />
                                        verified
                                    </Button>
                                </li>
                                <li>
                                    <Button className={classes.feature_button}>
                                        <CheckCircleOutlineIcon />
                                        featured
                                    </Button>
                                </li>
                                <li>
                                    <a href="#" style={{ display: isMobile ? 'none' : '' }}><img src="/assets/images/twitter_icon.png" alt="" /></a>
                                </li>
                                <li>
                                    <a href="#" style={{ display: isMobile ? 'none' : '' }}><img src="/assets/images/discord_icon.png" alt="" /></a>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className={styles.chart_list_wrap}>
                        <ul className={styles.chart_list}>
                            <li className={styles.chart_item}>
                                <div className={styles.chart_info}>
                                    <dl>
                                        <dt>FLOOR  PRICE</dt>
                                        <dd>
                                            <span>{collectionData?.floorPrice} ◎</span>
                                            {/* <span className={styles.stick1}>+30%</span> */}
                                        </dd>
                                    </dl>
                                </div>
                                {/* <div className={styles.chart_area}>
                                    <img className="img_responsive" src="/assets/images/chart1.png" alt="" />
                                </div> */}
                            </li>
                            <li className={styles.chart_item}>
                                <div className={styles.chart_info}>
                                    <dl>
                                        <dt>ALL TIME VOLUME</dt>
                                        <dd>
                                            <span>{collectionData?.totalVolume} ◎</span>
                                        </dd>
                                    </dl>
                                </div>
                                {/* <div className={styles.chart_area}>
                                    <img className="img_responsive" src="/assets/images/chart3.png" alt="" />
                                </div> */}
                            </li>
                            <li className={styles.chart_item}>
                                <div className={styles.chart_info}>
                                    <dl>
                                        <dt>AVG SALE PRICE(24H)</dt>
                                        <dd>
                                            <span>{collectionData?.avgSalePrice} ◎</span>
                                            {/* <span className={styles.stick1}>+3%</span> */}
                                        </dd>
                                    </dl>
                                </div>
                                {/* <div className={styles.chart_area}>
                                    <img className="img_responsive" src="/assets/images/chart2.png" alt="" />
                                </div> */}
                            </li>
                            <li className={styles.chart_item}>
                                <div className={styles.chart_info}>
                                    <dl>
                                        <dt>LISTED COUNT</dt>
                                        <dd>
                                            <span>{collectionData?.listedCount}</span>
                                            {/* <span className={styles.stick2}>(1%)</span> */}
                                        </dd>
                                    </dl>
                                </div>
                                {/* <div className={styles.chart_area}>
                                    <img className="img_responsive" src="/assets/images/chart4.png" alt="" />
                                </div> */}
                            </li>
                        </ul>
                    </div>
                </div>
                <div className={styles.profile_body}>
                    <div className={classes.root}>
                        <AppBar position="static" color="transparent">
                            <Tabs value={tabIndex} onChange={handleChange} aria-label="simple tabs example" centered
                                classes={{ indicator: classes.indicator }}
                                sx={{
                                    margin: '0 10px',
                                    overflow: "visible",
                                    '& .MuiTabs-scroller': {
                                        overflow: "initial !important"
                                    }
                                }}
                            >
                                <Tab label={<TabItemsLabel />} sx={{ textTransform: "none", marginLeft: '0' }} onClick={() => {
                                    router.push(`/collection/${symbol}?activeTab=items`, `/collection/${symbol}?activeTab=items`, { shallow: true });
                                    setActivity(false);
                                }} />
                                <Tab label={<TabActivityLabel />} sx={{ textTransform: "none" }} onClick={() => {
                                    router.push(`/collection/${symbol}?activeTab=activity`, `/collection/${symbol}?activeTab=activity`, { shallow: true });



                                    setActivity(true);
                                    setExpanded(false);
                                }} />
                                <Tab label={<TabStatsLabel />} sx={{ textTransform: "none" }} onClick={() => {
                                    router.push(`/collection/${symbol}?activeTab=stats`, `/collection/${symbol}?activeTab=stats`, { shallow: true });
                                    setActivity(true);
                                    setExpanded(false);
                                }} />
                            </Tabs>
                        </AppBar>
                        <div className={styles.items_wrapper}>
                            <div className={styles.items_navigation_bar}>
                                <Drawer variant="permanent" open={open} style={{ display: isMobile ? 'contents' : 'block' }}
                                    sx={{
                                        '& .MuiDrawer-paper': {
                                            position: 'absolute',
                                            zIndex: 3,

                                            background: '#13202D',
                                            border: "none",
                                            borderRight: "1px solid #0C4258"
                                        }
                                    }}>
                                    {
                                        open
                                            ?
                                            <React.Fragment>
                                                <div className={styles.items_filter_bar}>
                                                    <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                                                        <Typography sx={{ fontSize: "16px", color: !isActivity ? "#fff" : "#192633" }}>Filters</Typography>
                                                        <DoubleArrowIcon sx={{ fontSize: "20px", color: "#00D2FF", cursor: "pointer", transform: 'rotate(180deg)', '&.Mui-selected:hover, &.Mui-selected': { fontSize: "24px" } }} onClick={handleDrawerClose} />
                                                    </Box>
                                                    <Box style={{ margin: "13px 0" }}>
                                                        <Typography sx={{ fontSize: "14px" }} color={!isActivity ? "#ccc" : "#192633"}>Price Range: {collectionData?.minPrice} ~ {collectionData?.maxPrice} ◎</Typography>
                                                    </Box>
                                                    <Box sx={{ display: "flex", margin: '10px 0 30px 0' }}>
                                                        <Slider defaultValue={20} min={collectionData?.minPrice} max={collectionData?.maxPrice} aria-label="Default" onChange={e => setMaxPrice(e.target.value)} valueLabelDisplay="auto"
                                                            sx={{
                                                                pointerEvents: isActivity ? "none !important" : "",
                                                                '& 	.MuiSlider-rail': {
                                                                    background: !isActivity ? "#071421" : "#071421",
                                                                    height: "15px",
                                                                    opacity: 1
                                                                },
                                                                '& .MuiSlider-track': {
                                                                    background: !isActivity ? "#0B354D" : "#192633",
                                                                    height: "15px",
                                                                    border: "none",
                                                                    opacity: 1
                                                                },
                                                                '& .MuiSlider-thumb': {
                                                                    background: !isActivity ? "#00D2FF" : "#324353"
                                                                }
                                                            }}
                                                        />
                                                        {
                                                            !isActivity && !isFilterPrice && <Button sx={{ marginLeft: "20px", padding: "3px 3px 2px 3px", border: "1px solid #fff", color: "#fff", fontSize: "14px" }} onClick={e => setIsFilterPrice(true)}>APPLY</Button>
                                                        }
                                                        {
                                                            (isActivity || isFilterPrice) && <Button sx={{ marginLeft: "20px", padding: "3px 3px 2px 3px", border: "1px solid #192633", color: "#192633", fontSize: "14px" }}>APPLY</Button>
                                                        }
                                                    </Box>
                                                </div>
                                                {
                                                    collectionData?.attributes.length > 0 && collectionData?.attributes.map((item, index) => (
                                                        <Fragment>
                                                            <Accordion onChange={handleChangeAccordion(`panel${(index + 1)}`)} expanded={expanded === `panel${(index + 1)}`}>
                                                                <AccordionSummary aria-controls={`panel${(index + 1)}-content`} id={`panel${(index + 1)}-header`} expandIcon={<KeyboardArrowDownIcon style={{ color: !isActivity ? "#fff" : "#324353", fontSize: 18 }} />}
                                                                    sx={{
                                                                        backgroundColor: !isActivity ? '#0B354D' : '#192633',
                                                                        pointerEvents: isActivity ? "none !important" : "",
                                                                        color: !isActivity ? "#ccc" : "#324353",
                                                                    }}
                                                                >
                                                                    <Typography sx={{ fontSize: "14px" }}>{item.trait_type}</Typography>
                                                                </AccordionSummary>
                                                                <AccordionDetails>
                                                                    <div className={styles.properties_list_wrap}>
                                                                        <ul className={styles.properties_list}>
                                                                            {
                                                                                item.value.map((value, key) => (
                                                                                    (!selectedPropertyList[index] || selectedPropertyList[index] && selectedPropertyList[index]?.trait_type === item.trait_type && !selectedPropertyList[index]?.value?.includes(value.text)) && <li key={key} className={styles.properties_item} onClick={() => addSelectedPropertyList(item.trait_type, value.text, index)}>
                                                                                        <span className={styles.prpt_value}>{value.text}
                                                                                            ({value.count})
                                                                                        </span>
                                                                                        {/* <span>Floor: {value.value}</span> */}
                                                                                    </li>
                                                                                ))
                                                                            }
                                                                        </ul>
                                                                    </div>
                                                                </AccordionDetails>
                                                            </Accordion>
                                                        </Fragment>
                                                    ))
                                                }
                                            </React.Fragment>
                                            :
                                            <React.Fragment>
                                                <DoubleArrowIcon sx={{ fontSize: "20px", color: "#00D2FF", cursor: "pointer", '&.Mui-selected:hover, &.Mui-selected': { fontSize: "24px" } }} onClick={handleDrawerOpen} />
                                            </React.Fragment>
                                    }
                                </Drawer>
                            </div>
                            {
                                (!activeTab || activeTab === 'items') && <Box style={{ width: isMobile ? '100%' : `calc(100% - ${open ? 300 : 50}px)` }}>
                                    <div className={styles.items_content_wrapper}>
                                        <div className={styles.items_top_bar}>
                                            <div className={styles.selection_bar}>
                                                <ul>
                                                    {isFilterPrice && <li onClick={() => setIsFilterPrice(false)} style={{ background: "#273a4d" }}>SOL: {minPrice.toFixed(2)}&nbsp;~&nbsp;{maxPrice.toFixed(2)} <span>X</span></li>}
                                                    {
                                                        selectedPropertyList.map((item, index) => (
                                                            item?.value.map((item1, index1) => (
                                                                <li key={index1} onClick={() => removeSelectedPropertyList(item.trait_type, item1)}>{item1} <span>X</span></li>
                                                            ))
                                                        ))
                                                    }
                                                </ul>
                                            </div>
                                            <Box className={styles.search_form_container} sx={{ display: isMobile ? "block" : "flex" }}>
                                                <div className={styles.items_search_form}>
                                                    <div onClick={handleDrawerOpen} style={{ display: isMobile ? 'flex' : 'none', alignItems: 'center', marginRight: '10px' }}><FilterAltOutlinedIcon sx={{ fontSize: '30px', color: '#00D2FF' }} /></div>
                                                    <input type="text" placeholder="Search..." style={{ display: schVisible ? 'block' : 'none' }} onChange={e => setSearch(e.target.value)} value={search} />
                                                    <SearchIcon
                                                        className={classes.item_search_icon}
                                                        onClick={() => setSchVisible(true)}
                                                    />
                                                </div>
                                                <div className={styles.dropdown_wrapper}>
                                                    <Dropdown values={sortValues} setValues={setSortValues} />
                                                </div>
                                            </Box>
                                        </div>
                                        {
                                            loading ? <Box sx={{ color: "Grey" }} >
                                                <CircularProgress sx={{ marginTop: "100px" }} color="inherit" />
                                                &nbsp; Loading...
                                            </Box> : <div className={styles.items_list_wrapper}>
                                                <div className={styles.items_list}>
                                                    {
                                                        nftData.length > 0 && nftData.map((item: any, index: number) => (
                                                            <div key={index} className={styles.each_item}>
                                                                <AuctionItem index={index} imgUrl={item.image} nftName={item.name} symbol={collectionData?.symbol} price={item.price} mintAddress={item.mintAddress} seller={item.walletAddress} />
                                                            </div>
                                                        ))
                                                    }

                                                </div>
                                                {
                                                    nftData.length === 0 && <Typography sx={{ textAlign: "center", lineHeight: "200px" }} color="#aaa" >No available items</Typography>
                                                }
                                            </div>

                                        }
                                    </div>
                                </Box>
                            }
                            {
                                activeTab === 'activity' && <Box style={{ width: isMobile ? '100%' : `calc(100% - ${open ? 301 : 50}px)`, textAlign: "left" }} >
                                    <div className={styles.activity_content_wrapper} id="chart_wrapper">
                                        <Box className={styles.activitylist_box}>
                                            {
                                                loading ? <Box sx={{ color: "Grey", textAlign: "center" }} >
                                                    <CircularProgress sx={{ marginTop: "100px" }} color="inherit" />
                                                    &nbsp; Loading...
                                                </Box> : <ActivityList activityList={collectionActivities} page={page} totalCount={totalCount} setPage={setPage} pageLimit={pageLimit} setPageLimit={setPageLimit} />
                                            }
                                        </Box>
                                    </div>
                                </Box>
                            }
                            {
                                activeTab === 'stats' && <Box style={{ width: isMobile ? '100%' : `calc(100% - ${open ? 300 : 50}px)`, textAlign: "left" }} >
                                    <div className={styles.activity_content_wrapper} style={{ padding: isMobile ? '20px' : '40px' }} id="chart_wrapper">
                                        {/* <Box className={classes.chart_content_wrapper}>
                                        <Box className={classes.chart_header_wrapper}>
                                            <Typography color="#fff" className={classes.chart_header_title}>Floor Price and Volume(SOL)</Typography>
                                            <ToggleButtonGroup
                                                value={alignment}
                                                className={classes.toggle_button_group}
                                                exclusive
                                                onChange={handleToggleButtonChange}
                                            >
                                                <ToggleButton value="web" className={classes.individual_toggle_btn} sx={{ '&.Mui-selected:hover, &.Mui-selected': { backgroundColor: "#1B6A97", color: '#fff' } }}>7 days</ToggleButton>
                                                <ToggleButton value="android" className={classes.individual_toggle_btn} sx={{ '&.Mui-selected:hover, &.Mui-selected': { backgroundColor: "#1B6A97", color: '#fff' } }} >30 days</ToggleButton>
                                                <ToggleButton value="ios" className={classes.individual_toggle_btn} sx={{ '&.Mui-selected:hover, &.Mui-selected': { backgroundColor: "#1B6A97", color: '#fff' } }}>90 days</ToggleButton>
                                                <ToggleButton value="ios1" className={classes.individual_toggle_btn} sx={{ '&.Mui-selected:hover, &.Mui-selected': { backgroundColor: "#1B6A97", color: '#fff' } }}>1 year</ToggleButton>
                                                <ToggleButton value="ios2" className={classes.individual_toggle_btn} sx={{ '&.Mui-selected:hover, &.Mui-selected': { backgroundColor: "#1B6A97", color: '#fff' } }}>All time</ToggleButton>
                                            </ToggleButtonGroup>
                                        </Box>
                                        <ActivityChart />
                                    </Box> */}
                                        <Box className={classes.chart_header_wrapper}>
                                            <Typography color="#fff" className={classes.chart_header_title} sx={{ marginBottom: isMobile ? '-20px' : '0px' }}>Top Holders</Typography>
                                        </Box>
                                        <div className={styles.stats_header}>
                                            <Box className={classes.stats_header_panel} sx={{ width: isMobile ? '100% !important' : '24%' }}>
                                                <Typography color="#fff" className={classes.chart_header_title}>Supply</Typography>
                                                <Typography color="#fff" className={classes.chart_header_title}>{analyticsInfo?.statistics?.totalSupply}</Typography>
                                            </Box>
                                            <Box className={classes.stats_header_panel} sx={{ width: isMobile ? '100% !important' : '24%' }}>
                                                <Typography color="#fff" className={classes.chart_header_title}>Holders</Typography>
                                                <Typography color="#fff" className={classes.chart_header_title}>{analyticsInfo?.statistics?.holders}</Typography>
                                            </Box>
                                            <Box className={classes.stats_header_panel} sx={{ width: isMobile ? '100% !important' : '24%' }} >
                                                <Typography color="#fff" className={classes.chart_header_title}>Avg Owned</Typography>
                                                <Typography color="#fff" className={classes.chart_header_title}>{analyticsInfo?.statistics?.avgOwned}</Typography>
                                            </Box>
                                            <Box className={classes.stats_header_panel} sx={{ width: isMobile ? '100% !important' : '24%' }}>
                                                <Typography color="#fff" className={classes.chart_header_title}>Unique Holders</Typography>
                                                <Typography color="#fff" className={classes.chart_header_title}>{analyticsInfo?.statistics?.uniqueHolders}</Typography>
                                            </Box>
                                        </div>
                                        <div className={styles.stats_content}>
                                            <Box className={classes.token_holders_content} sx={{ width: isMobile ? '100% !important' : '20%' }}>
                                                <TokenHolderTable data={analyticsInfo?.tokenHolders} />
                                            </Box>
                                            <Box className={classes.token_holders_wallet_content} sx={{ width: isMobile ? '100% !important' : '78%' }}>
                                                <TokenHolderDetailsTable data={analyticsInfo?.holderRanking} />
                                            </Box>
                                        </div>
                                    </div>
                                </Box>
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div >
    )
}

Collection.getInitialProps = async ({ store }) => {

};

const mapStateToProps = state => {

    return {
        people: state.people?.people || [],
        selectedPerson: state.people.selectedPerson,
        sidebarOpen: state.init.sidebarOpen
    };
};

const mapDispatchToProps = { handleSidebarOpen, handleSidebarClose };

export default connect(mapStateToProps, mapDispatchToProps)(Collection);
