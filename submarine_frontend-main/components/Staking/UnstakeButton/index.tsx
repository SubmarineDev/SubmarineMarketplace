import * as React from "react";

import { Theme } from '@mui/material/styles'
import { createStyles, makeStyles } from "@mui/styles";
import Button from '@mui/material/Button';

import styles from './index.module.scss';


const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      background: theme.syscolor.neutral,
      borderColor: theme.syscolor.neutral,
      borderStyle: 'solid',
      lineHeight: 1,
      borderWidth: '1px',
      marginTop: '10px',
      borderRadius: '3px !important',
      fontSize: '10px !important',
      padding: '6px 25px',
      color: theme.palette.text.primary,
      '&.active': {
        background: 'none',
        color: theme.syscolor.neutral,
        '&:hover': {
          background: theme.syscolor.neutral,
          color: theme.palette.text.primary
        },
      },
      '&:hover': {
        background: 'none',
        color: theme.syscolor.neutral,
      },
      '&:disabled': {
        border: '1px solid #444444',
        background: '#333333',
        width: `calc(50% - 2.5px)`,
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

const UnstakeButton = (props: Props) => {
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

export default UnstakeButton;
