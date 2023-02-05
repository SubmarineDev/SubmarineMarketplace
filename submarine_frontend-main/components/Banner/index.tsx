import React from 'react'
import styles from './Banner.module.scss'
import Button from '../Button'
import Link from 'next/link'
import Typography from '@mui/material/Typography'
import { useResize } from '../../utils/Helper'
import { useRouter } from 'next/router'

import { serverUrl } from "../../config";
const Banner = ({ item }) => {
    const { isMobile } = useResize()
    const router = useRouter()

    return (
        <div className={styles.banner_main} style={{ backgroundImage: `url(${serverUrl}${item.bannerImage})` }}>
            <div className={styles.banner_section}>
                {/* <div className={styles.banner_left} style={{ backgroundImage: "url(" + item.image + ")" }}> */}
                <div className={styles.image_container}>
                    <img style={{ width: "300px", height: "300px" }} src={serverUrl + item.baseImage} alt="" />
                </div>
                <div className={styles.banner_right}>
                    <div>
                        <Link href="#">
                            <Typography sx={{ fontSize: "12px" }} color="#7FF9E6">FEATURED COLLECTION</Typography>
                        </Link>
                    </div>
                    <dl style={{ color: "#fff" }}>
                        <dt>
                            <h1 style={{ fontSize: isMobile ? '40px' : "48px" }}>{item.title}</h1>
                        </dt>
                        <dd>
                            <p>{item.description}</p>
                            {

                                // item.content.map((_item, _index) => (
                                //     <p key={_index}>{_item}</p>
                                // ))
                            }
                        </dd>
                    </dl>
                    <div style={{ marginTop: "-30px" }}>
                        <Button className="btn_explore" text="EXPLORE" icon={true} onClick={() => router.push(`/collection${item.actionLink}`, `/collection/${item.actionLink}`, { shallow: true })} />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Banner