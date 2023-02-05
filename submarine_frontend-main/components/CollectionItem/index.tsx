import styles from './CollectionItem.module.scss'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { useRouter } from 'next/router'
import { serverUrl } from "../../config";

const CollectionItem = ({ imgUrl, nftName, userName, symbol, description = '' }) => {
    const router = useRouter()

    return (
        <div className={styles.collection_item_wrapper} onClick={() => router.push(`/collection/${symbol}`, `/collection/${symbol}`, { shallow: true })}>
            <img className="img_responsive" src={serverUrl + imgUrl} />
            <div className={styles.item_info}>
                <div className={styles.nft_name}>{nftName}</div>
                {
                    description !== '' && <div className={styles.nft_description}>{description.substr(0, 50)}...</div>
                }
                <div className={styles.user_name}>
                    {/* <img src="/assets/images/checked.png" alt="" /> */}
                    <CheckCircleOutlineIcon sx={{ fontSize: "14px" }} />
                    <span>{userName}</span>
                </div>
            </div>
        </div>
    )
}

export default CollectionItem