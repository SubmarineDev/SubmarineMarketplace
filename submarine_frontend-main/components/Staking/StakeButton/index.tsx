import * as React from "react";

import { Theme } from '@mui/material/styles'
import { createStyles, makeStyles } from "@mui/styles";
import Button from '@mui/material/Button';

import styles from './index.module.scss';


const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      background: '#2F9BE9',
      borderColor: theme.palette.grey,
      borderStyle: 'solid',
      borderWidth: '1px',
      borderRadius: '3px !important',
      fontSize: '10px !important',
      padding: '6px 15px',
      width: '70px !important',
      height: 30,
      color: theme.palette.text.primary,
      '&.active': {
        background: 'none',
        color: theme.syscolor.semi,
        '&:hover': {
          background: theme.syscolor.semi,
          color: theme.palette.text.primary
        },
      },
      '&:hover': {
        background: 'none',
        color: theme.syscolor.semi,
      },
      '&:disabled': {
        border: '1px solid #444444',
        background: '#333333',
        color: '#444444'
      }
    }
  })
)

type Props = {
  children: React.ReactNode,
  enabled?: boolean,
  className?: string,
  onClick?: React.MouseEventHandler<HTMLButtonElement>
  fullWidth?: boolean
}

const StakeButton = (props: Props) => {
  const { children, enabled, className, onClick, fullWidth } = props;
  const classes = useStyles();
  return <Button
    variant="contained"
    fullWidth={fullWidth == undefined ? true : fullWidth}
    className={`${className} ${styles.root} ${classes.root}`}
    disabled={enabled == undefined ? false : !enabled}
    onClick={onClick}
  >
    {children}
  </Button>
}

export default StakeButton;
