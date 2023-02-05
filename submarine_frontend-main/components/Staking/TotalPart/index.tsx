import * as React from "react";
import { Grid } from '@mui/material';
import styles from './index.module.scss';
import { TOTAL_SUPPLY } from "config";

type Props = {
  children: any,
  className?: string,
  onClaimAll: any,
  totalStaked: any,
  totalCollected: any,
  totalNFT: any,
  stakeCount: any,
  unstakeCount: any,
  walletCollectedAmount: any
}

const TotalPart = (props: Props) => {
  const { onClaimAll, totalStaked, totalCollected, totalNFT, stakeCount, unstakeCount, walletCollectedAmount } = props;

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6} sm={12}>
        <div className={`totalState ${styles.totalState}`}>
          <div className={`${styles.totalFurrsol}`}>
            <div className={`font-quick ${styles.totalCount}`}>{totalStaked}</div>
            <div className={`font-quick ${styles.totalPercent}`}>STAKED AQUA APES</div>
            <div className={`font-quick ${styles.totalPercent}`}>{totalStaked}/{TOTAL_SUPPLY} ({((totalStaked / 2000) * 100).toFixed(2)}%)</div>
          </div>
          <div className={`${styles.totalFluff}`}>
            <div className={`${styles.boxFluffCount}`}>
              {/* <img className={`font-quick ${styles.fluffImage}`} src="/images/fluff.png" /> */}
              <div className={`font-quick ${styles.totalCount}`}>{totalCollected.toFixed(2)}</div>
            </div>
            <div className={`font-quick ${styles.totalPercent}`}>{"DEPOSITED SOL BALANCE"}</div>
          </div>
        </div>
      </Grid>
      <Grid item xs={12} md={6} sm={12}>
        <div className={`walletState ${styles.walletState}`}>
          <div className={`${styles.walletFurrsol}`}>
            <div className={`font-quick ${styles.totalCount}`}>
              <span className={`${styles.activeText} ${styles.largeText}`}>{stakeCount}</span>
              <span className={`${styles.activeText} ${styles.normalText}`}>/{totalNFT}</span></div>
            <div className={`font-quick ${styles.totalPercent}`}>STAKED AQUA APES</div>
          </div>
          <div className={`${styles.unstakeFurrsol}`}>
            <div className={`font-quick ${styles.totalCount}`}>
              <span className={`${styles.disableText} ${styles.largeText}`}>{unstakeCount}</span>
              <span className={`${styles.disableText} ${styles.normalText}`}>/{totalNFT}</span></div>
            <div className={`font-quick ${styles.totalPercent}`}>UNSTAKED AQUA APES</div>
          </div>
          <div className={`${styles.totalFluff}`}>
            <div className={`${styles.boxFluffCount}`}>
              {/* <img className={`font-quick ${styles.fluffImage}`} src="/images/fluff.png" /> */}
              <div className={`font-quick ${styles.activeText} ${styles.largeText}`}>{walletCollectedAmount.toFixed(5)}</div>
            </div>
            <div className={`font-quick ${styles.totalPercent}`}>UNCLAIMED $SOL</div>
            <div className={`font-quick ${styles.btnClaim}`} onClick={onClaimAll}>COLLECT ALL</div>
          </div>
        </div>
      </Grid>
    </Grid>
  )
}

export default TotalPart;
