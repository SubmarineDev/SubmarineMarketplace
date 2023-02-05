import React, { useState, useEffect, Fragment } from 'react'
import { useRouter } from 'next/router'
import Sidebar from '../components/Sidebar'
import Header from '../components/Header'
import { handleSidebarOpen, handleSidebarClose } from "store/actions/init"
import { connect } from "react-redux"
import { useResize } from './../utils/Helper'

import styles from 'styles/Collection.module.scss'
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import commonService from "../config/services/common.service";
import { MARKETPLACES_API, serverUrl } from "../config";

import CollectionItem from '../components/CollectionItem'

const Collections = ({ sidebarOpen }) => {
    const { isMobile } = useResize();
    let width = sidebarOpen === true ? 199 : 90

    const [loading, setLoading] = useState<boolean>(false)
    const [collections, setCollections] = useState<any>([])

    useEffect(() => {
        (async () => {
            setLoading(true);

            let _collections: any = await commonService({
                method: "get",
                route: `${MARKETPLACES_API.GET_COLLECTIONS}`,
            });
            setCollections(_collections)

            setLoading(false)

        })()
    }, [])

    return (
        <div className={styles.collectionPage_container}>
            <Sidebar activeKey={1} />
            <div className={styles.profile_section} style={{ width: isMobile ? 'calc(100vw - 60px)' : `calc(100% - ${width}px)` }}>
                <Header sidebarOpen={sidebarOpen} />
                <div className={styles.profile_body} style={{ marginTop: "65px" }}>
                    <h3 style={{ marginTop: "100px", color: "#fff" }}>All Collections</h3>
                    <div className={styles.items_wrapper}>
                        <div className={styles.items_content_wrapper}>
                            <div className={styles.items_list_wrapper}>
                                <div className={styles.items_list}>
                                    {
                                        collections.length > 0 && collections.map((item: any, index: number) => (
                                            <div key={index} className={styles.each_item}>
                                                <CollectionItem key={index} imgUrl={item.baseImage} nftName={item.name} userName={item.nftName} symbol={item.symbol} description={item.description} />
                                            </div>
                                        ))
                                    }

                                </div>
                                {
                                    collections.length === 0 && <Typography sx={{ textAlign: "center", lineHeight: "200px" }} color="#aaa" >No available items</Typography>
                                }
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    )
}

Collections.getInitialProps = async ({ store }) => {

};

const mapStateToProps = state => {

    return {
        people: state.people?.people || [],
        selectedPerson: state.people.selectedPerson,
        sidebarOpen: state.init.sidebarOpen
    };
};

const mapDispatchToProps = { handleSidebarOpen, handleSidebarClose };

export default connect(mapStateToProps, mapDispatchToProps)(Collections);
