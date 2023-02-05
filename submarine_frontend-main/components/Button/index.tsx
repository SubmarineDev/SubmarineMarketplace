import { Fragment } from 'react'
import styles from './Button.module.scss'
import Link from 'next/link'
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';

const Button = ({ text, className, icon = false, link = '', onClick }) => {
    return (
        <button
            onClick={onClick}
            className={styles[className]}>
            {
                link === '' ? <Fragment>
                    {text}
                    {icon ? <ArrowRightAltIcon /> : ''}
                </Fragment> : <Link href={link}>
                    <div>
                        {text}
                        {icon ? <ArrowRightAltIcon sx={{ fontSize: "30px" }} /> : ''}
                    </div>
                </Link>
            }
        </button>
    )
}

export default Button