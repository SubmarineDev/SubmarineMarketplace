/* eslint-disable jsx-a11y/img-redundant-alt */
import React from "react"
import { createStyles, makeStyles } from '@mui/styles'
import { Theme, alpha } from "@mui/material/styles";

import styles from './index.module.scss';

import { DAYTIME, PERIOD, REWARD } from '../../../config';
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {

    },
    title: {
      color: theme.palette.text.primary
    },
    nftName: {
      color: theme.palette.text.primary
    },
    nftAttribute: {
      color: theme.palette.text.secondary
    },
    fluff: {
      color: theme.syscolor.light
    },
    remainTime: {
      color: theme.palette.text.primary
    },
    furr: {
      color: theme.palette.text.primary,
      background: alpha(`${theme.syscolor.dark}`, 0.85)
    },
    furrImg: {
      width: '12px !important',
      height: '12px !important'
    }
    , collected: {
      color: '#00ffce'
    },
    lockTime: {
      color: '#00e3ff'
    },
    sel: {
      background: `#1B1B1B`,
      '& > * ': {
        paddingLeft: 5
      }
    }
  })
)

const CalendarItem = (props: any) => {
  const { day, perFurr } = props;

  return (
    <div className={`${styles.boxCalendar}`}>
      <div className={`${styles.boxItems}`}>
        {
          [...Array(35)].map((ele, index) =>
            index < day ?
              <div className={`${styles.boxItemActive}`}></div>
              :
              index < 31 ?
                <div className={`${styles.boxItem}`}></div>
                :
                <div className={`${styles.boxItemDeactive}`}></div>
          )
        }
      </div>
      <div className={`font-quick ${styles.textTitle}`}>{day} DAYS</div>
      {/* <div className={`font-quick ${styles.textPerFurrsol}`}>+{perFurr} $FLUFF per FurrSol</div> */}

    </div>
  )
}

export default CalendarItem;
