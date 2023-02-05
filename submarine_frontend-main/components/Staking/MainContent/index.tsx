import * as React from "react";

import { createStyles, makeStyles } from "@mui/styles";
import Grid from '@mui/material/Grid';

import styles from './index.module.scss';

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      background: 'none',
    },

    filter: {
      background: 'rgba(0,0,0,0.1)'
    },

    mainContent: {
      background: '#151515',
      minHeight: '540px',
      height: '540px',
      marginBottom: '50px',
      padding: "20px",
      width: '100%',
      '@media (max-width: 1000px)': {
        height: 'unset',
      },
    }
  })
)

type Props = {
  children: any,
  className?: string
}

const HeaderPart = (props: Props) => {
  const { children } = props;
  const classes = useStyles();

  return (
    <main>
      <Grid container direction="row" justifyContent="space-between" className={`${styles.root} ${classes.root}`}>

        <Grid item md={12} className={`pl-24 pr-24 pt-32 pb-24 ${styles.mainContent} ${classes.mainContent}`}>
          {children}
        </Grid>
      </Grid>
    </main>
  )
}

export default HeaderPart;
