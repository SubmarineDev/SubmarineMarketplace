import { useState, useEffect } from 'react'
import { Connection, PublicKey } from '@solana/web3.js';

export const useResize = () => {
    const [screenSize, setScreenSize] = useState({
        width: 0,
        height: 0,
        isMobile: false,
        isResponsive: false
    })

    const updateSize = () => {
        setScreenSize({
            width: window.innerWidth,
            height: window.innerHeight,
            isMobile: window.innerWidth < 768,
            isResponsive: window.innerWidth < 1320
        })
    }

    useEffect(() => {
        window.addEventListener("resize", updateSize)
        updateSize()

        return () => {
            window.removeEventListener("resize", updateSize)
        }
    }, [])

    return screenSize;
}

export const useDetectOutsideClick = (el: any, initialState: any) => {
    const [isActive, setIsActive] = useState(initialState);

    useEffect(() => {
        const onClick = (e: any) => {
            if (el.current !== null && !el.current.contains(e.target)) {
                setIsActive(!isActive);
            }
        };

        if (isActive) {
            window.addEventListener("click", onClick);
        }

        return () => {
            window.removeEventListener("click", onClick);
        };
    }, [isActive, el]);

    return [isActive, setIsActive];
};

export const getEnglishNumber = (num: number) => {
    return num.toLocaleString();
}

export const numberToFixed = (num: number, fixed: number) => {
    return Number(Number(num).toFixed(fixed));
}

export const getTokenBalanceByOwner = async (connection: Connection, user: PublicKey, token: PublicKey) => {
    let balance = 0;
    const tokenAccounts = await connection.getParsedTokenAccountsByOwner(user, { mint: token });
    console.log('tokenAccounts', tokenAccounts);
    tokenAccounts?.value?.forEach((account: any) => {
        balance += account?.account?.data?.parsed?.info?.tokenAmount?.amount / Math.pow(10, account?.account?.data?.parsed?.info?.tokenAmount?.decimals);
    })
    return balance;
}

