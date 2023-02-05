import * as React from "react";
import {
  Routes,
  Route,
  Outlet,
  Link,
  useMatch,
  useResolvedPath,
} from "react-router-dom";
import type { LinkProps } from "react-router-dom";

import * as anchor from '@project-serum/anchor';
import { useConnection, useAnchorWallet, useWallet } from '@solana/wallet-adapter-react';
import {
  WalletMultiButton,
} from '@solana/wallet-adapter-react-ui';

import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import Button from '@material-ui/core/Button';

import { getImg } from "../../../utils/Helper";

import { MARKET_PAGES } from "./../../../constants/routers";

import styles from './index.module.scss';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      borderBottom: '0px solid rgba(0,0,0,0.3)',
      marginTop: '28px',
      overflow: 'auto',
    },
    tab: {
      flex: 'none',
      '&.active': {
        background: '#151515'
      },
      '& a': {
        color: theme.palette.text.disabled,
        '&.active': {
          color: '#00E3FF',
        }
      }
    },
    collection: {
      color: theme.palette.text.primary
    },
    getCollection: {
      background: '#7D3CCF',
      color: theme.palette.text.primary,
      fontSize: '0.875rem',
      boxShadow: '0px 2px 0px rgba(0, 0, 0, 0.25)',
      '&:hover': {
        opacity: 0.75,
        color: theme.palette.text.primary,
        background: '#7D3CCF'
      }
    },
    nav: {
      marginLeft: '0px',
      color: '#151515'
    }
  })
)

type Props = {
  staked: number,
  unstaked: number,
}

const CustomNav = ({ children, to, ...props }: LinkProps) => {
  let resolved = useResolvedPath(to);
  let match = useMatch({ path: resolved.pathname, end: true });

  const classes = useStyles();

  return (
    <div className={`${styles.tab} ${match && `active`} ${classes.tab}`}>
      <Link
        to={to}
        {...props}
        className={`font-quick ${match && `active`}`}
      >
        {children}
      </Link>
    </div>
  );
}

const NavPart = (props: Props) => {
  const { staked, unstaked } = props;
  const daily = 0;
  const classes = useStyles();
  const countNft = [daily, staked, unstaked];

  return (
    <section
      className={`d-flex align-items-center justify-content-between ${classes.root}`}
    >
      <div className={`d-flex align-items-center justify-content-between ${classes.nav}`}>
        {MARKET_PAGES.map((tab, index) => {
          return <CustomNav to={tab.url} key={index} >{`${tab.node} ${countNft[index] !== 0 ? `(${countNft[index]})` : ''}`}</CustomNav>
        })}
      </div>
    </section>
  )
}

export default NavPart;
