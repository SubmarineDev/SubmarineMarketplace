
export const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL;
//add your api routes here...
export const routes = {
    news: serverUrl + "/news",
    drops: serverUrl + "/drop",
    guides: serverUrl + "/guide",
    advert: serverUrl + "/advertise",
    services: serverUrl + "/our-service",
    category: serverUrl + "/category",
};

export const API_URL = `${serverUrl}/api`;

export const MARKETPLACES_API = {
    FEATURED_COLLECTIONS: `${API_URL}/banner`,
    UPCOMING_LAUNCHES: `${API_URL}/collection/upcoming`,
    NEW_COLLECTIONS: `${API_URL}/collection/new`,
    POPULAR_COLLECTIONS: `${API_URL}/collection/popular`,
    GET_ANALYTICS: `${API_URL}/collection/analytics/`,
    GET_FLOOR_PRICE: `${API_URL}/collection/floor-price/`,

    DISCOUNTED_NFTS: `${API_URL}/nft/discounted`,

    GET_COLLECTIONS: `${API_URL}/collection`,
    ALL_COLLECTIONS: `${API_URL}/collection/all`,
    GET_COLLECTION_DATA: `${API_URL}/collection/symbol/`,
    GET_ACTIVITY_WALLET: `${API_URL}/activity/wallet/`,
    GET_ACTIVITY_NFT: `${API_URL}/activity/nft/`,
    GET_ACTIVITY_COLLECTION: `${API_URL}/activity/collection/`,

    GET_LIST_ITEM: `${API_URL}/nft/item/`,
    GET_BID_WALLET: `${API_URL}/bid/wallet/`,
    GET_TOP_BID: `${API_URL}/bid/top/`,
    GET_RECEIVE_BIDs: `${API_URL}/bid/receive/`,

    GET_COLLECTION_NFTS: `${API_URL}/getListedNFTsByQuery`,
    GET_NFT_DATA: `${API_URL}/bid/getBids?walletAddress=`,
    GET_OFFER_ITEM: `${API_URL}/bid/nft/`,
    GET_OFFER_NFT_WALLET: `${API_URL}/bid/nft-wallet/`,
    GET_NFTS_WALLET: `${API_URL}/nft/wallet/`,
    GET_MORE_NFTS: `${API_URL}/nft/more/`,
    GET_PRICE_HISTORY: `${API_URL}/nft/price/`,

    GET_BUY_TX: `${API_URL}/nft/buytx`,
    GET_BUY_TX_CONF: `${API_URL}/nft/buy`,
    GET_MAKEBID_TX: `${API_URL}/bid/maketx`,
    GET_CANCELBID_TX: `${API_URL}/bid/cancelTx`,
    GET_ACCEPT_TX: `${API_URL}/bid/acceptTx`,
    GET_ACCEPT_TX_CONFT: `${API_URL}/bid/accept`,
    GET_CANCELBID_TX_CONF: `${API_URL}/bid/cancel`,
    GET_MAKEBID_TX_CONF: `${API_URL}/bid/make`,
    GET_MAKELSIT_TX: `${API_URL}/nft/listtx`,
    GET_MAKELSIT_TX_CONF: `${API_URL}/nft/list`,
    GET_UPDATE_NFT_TX: `${API_URL}/nft/updatelisttx`,
    GET_UPDATE_NFT_TX_CONF: `${API_URL}/nft/update`,
    GET_UNLIST_NFT_TX: `${API_URL}/nft/unlisttx`,
    GET_UNLIST_NFT_TX_CONF: `${API_URL}/nft/unlist`,

    GET_SETTING: `${API_URL}/setting/key/`,
}

export const GET_SOL_PRICE = `https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd,eur`;
export const GET_TPS = `http://solitary-white-violet.solana-mainnet.quiknode.pro/`;

export const ITEMS_PER_PAGE: number[] = [10, 25, 100]

export const ACTIVITY_TYPE = [
    {
        color: ``,
        text: ``
    },
    {
        color: `#22C55E`,
        text: `On Sale`
    },
    {
        color: `#A1A1AA`,
        text: `Canceled List`
    },
    {
        color: `#17A2B8`,
        text: `Update List`
    },
    {
        color: `#3B82F6`,
        text: `Buy`
    },
    {
        color: `#EAB308`,
        text: `Placed Bid`
    }, {
        color: `#FFFFFF`,
        text: `Update Bid`
    },
    {
        color: `#EF4444`,
        text: `Canceled Bid`
    },
    {
        color: `#42F5B3`,
        text: `Accept Bid`
    }
]

export const DAYTIME = 86400; // one day
export const DECIMAL = 1000000000;
export const REWARD = [5, 10, 17];
export const DEFAULT = 2;
export const PERIOD = [7, 14, 21];

export const TOTAL_SUPPLY = 5000;
export const LAMPORTS = 0.000000001;

export const PROGRAM_ID = "DuaozRp7uvmiT78R5ZpYCzfLRoGatBrZL2uNEGam4bNn";
export const VAULT = "6XAvF8upP414fjqk2xZARmo1GhBAv7TUNsLzrCKL3SsW";
export const CREATOR_ADDRESSES = ["35FM2ugAS35TxLz3gPAjmMbGscwKuSY9Se4Jh1x7MRXa", "4YmikyHxwKQ7ny3TUouWMXZMxkHzCaeLccECcCb3wsfJ"]
export const ADMIN_WALLET = "657ntzKyjwPW4ba3r4ZtWvzJFETKqF2Rosox6ZdHXfs1"