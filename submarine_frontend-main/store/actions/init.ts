import { Balance } from "@mui/icons-material";
import { SIDEBAR_OPEN, SIDEBAR_CLOSE, WALLET_INFO } from "store/actionTypes/init";

export const handleSidebarOpen = () => ({
  type: SIDEBAR_OPEN
});

export const handleSidebarClose = () => ({
  type: SIDEBAR_CLOSE
});

export const setWalletInfo = (walletInfo) => ({
  type: WALLET_INFO,
  walletInfo: walletInfo
});


