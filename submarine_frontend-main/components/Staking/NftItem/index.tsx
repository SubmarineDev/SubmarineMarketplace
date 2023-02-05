/* eslint-disable jsx-a11y/img-redundant-alt */
import React, { useEffect, useState } from "react";

import { Theme, alpha } from "@mui/material/styles";
import { createStyles, makeStyles } from "@mui/styles";

import UnstakeButton from "../UnstakeButton"
import StakeButton from "../StakeButton"

import styles from './index.module.scss';
import { Select, MenuItem } from "@mui/material";
import { useConnection } from "@solana/wallet-adapter-react";
import { PERIOD, REWARD } from '../../../config'

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
      // color: theme.syscolor.light
    },
    remainTime: {
      color: theme.palette.text.primary
    },
    furr: {
      color: theme.palette.text.primary,
      // background: alpha(`${theme.syscolor.dark}`, 0.85)
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

type Props = {
  children: React.ReactNode,
  className?: string,
  info: {
    image: string,
    title: string,
    fluff: number,
    attr: any,
    remainTime: number,
    spawnState: number
  }
}

const NftItem = (props: any) => {
  const { info, onClicks } = props;
  const classes = useStyles();
  const [canStake, setCanStake] = useState(true);
  const [selType, setSelType] = useState(0);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    (async () => {
      if (info.isStarted) {
        setCanStake(false)
      }
      if (info.canClaim) {
      }
    }
    )();
  }, [props]);

  const handleChange = (e: any) => {
    setSelType(e.target.value)
    setOpen(false);
    if (canStake) {
      setSelType(e.target.value);
    }
  }


  const handleSelect = (e: any) => {
    setOpen(!open);
  }
  return (<>
    {
      <div className={'box_image'}>
        <div className={`imageWrapper`}>
          <div className={`imageOver`}>
            <img src={info.imageUrl} alt="Furrsol Image" />
          </div>
        </div>

        <div className={`content ${styles.nftContent}`}>
          <p className={`font-quick ${styles.nftName} ${classes.nftName}`}>{info.name}</p>
          <p className={`font-quick ${styles.nftAttribute} ${classes.nftAttribute}`}>Claimed $Sol: {info.claimedAmount}</p>
          <span className={`font-quick ${styles.nftAttribute} ${classes.nftAttribute}`}>Collected $Sol: </span><span className={`font-quick ${classes.collected} ${styles.nftAttribute} ${classes.nftAttribute}`}>{Math.round(info.availableAmount * 10000) / 10000}</span>
          <br></br>
          {
            info.isStarted ?
              <div className="d-flex  justify-content-between staked_box">
                <UnstakeButton
                  enabled={false}
                  fullWidth={false}
                  className={`${styles.nftButton}`}
                  onClick={onClicks[0]}
                >{"STAKED"}</UnstakeButton>

                <UnstakeButton
                  enabled={info.canClaim}
                  className={`${styles.nftButton} ${styles.claim_btn}`}
                  onClick={onClicks[1]}
                >{'CLAIM'}</UnstakeButton>
              </div> : <div className={`"d-flex justify-content-between unstaked_box" ${styles.unstaked_box}`}>
                {/* <Select className={classes.sel} disabled={!canStake} value={selType} onClick={(e) => handleSelect(e)} onChange={(e) => handleChange(e)} open={open} >
                  <MenuItem value={0}>{'7 days'}</MenuItem>
                  <MenuItem value={1}>{'14 days'}</MenuItem>
                  <MenuItem value={2}>{'21 days'}</MenuItem>
                </Select> */}
                <StakeButton
                  enabled={canStake}
                  fullWidth={false}
                  className={`${styles.nftButton} ml-16`}
                  onClick={onClicks[0]}
                >{"STAKE"}</StakeButton>
              </div>
          }


        </div>

        {/* </Grid> */}
        {/* </Grid> */}
      </div>
      // <div>
      // </div>
    }
  </>
  )
}

export default NftItem;
