import App from "next/app";
import Head from "next/head";
import css from "styled-jsx/css";
import { Provider } from "react-redux";
import React from "react";
import dynamic from "next/dynamic";
import { createWrapper } from "next-redux-wrapper";
import store from "../store";
import 'swiper/swiper.min.css'
import Topbar from '../components/Topbar'
import { ThemeProvider } from '@mui/material/styles';
import { MuiTheme } from "../components/MuiTheme"
import '/styles/css/utils.css'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
require("@solana/wallet-adapter-react-ui/styles.css");

const WalletConnectionProvider: any = dynamic(
  () => import("../components/WalletConnection/WalletConnectionProvider"),
  {
    ssr: false,
  }
);

// @ts-ignore
class MyApp extends App<any> {
  static async getInitialProps({ Component, ctx }) {
    return {
      pageProps: {
        // Call page-level getInitialProps
        ...(Component.getInitialProps ? await Component.getInitialProps(ctx) : {}),
      }
    };
  }
  render() {
    const { Component, pageProps } = this.props;
    return (
      <BasicHTML>
        <WalletConnectionProvider>
          <Provider store={store}>
            <ToastContainer
              position="bottom-center"
              autoClose={2000}
            />
            <ThemeProvider theme={MuiTheme}>
              <Topbar />
              <Component {...pageProps} />
            </ThemeProvider>
          </Provider>
        </WalletConnectionProvider>
      </BasicHTML>
    );
  }
}

const BasicHTML = ({ children }) => (
  <React.Fragment>
    <Head>
      <title>SUBMARINE</title>
      <meta {...({ charSet: "UTF-8" } as any)} />
      <meta name="description" content="SUBMARINE" />
      <meta name="keywords" content="submarine" />
      <meta name="author" content="guardian" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
      />
      <link rel="stylesheet" href="/assets/css/bootstrap.min.css" />
      <link rel="stylesheet" href="/assets/css/icofont.min.css" />
      <link rel="stylesheet" href="/assets/css/animate.css" />
      <link rel="stylesheet" href="/assets/css/swiper-bundle.min.css" />
      <link rel="stylesheet" href="/assets/css</link>/style.css" />
    </Head>
    {children}
    <style jsx global>
      {globalCSS}
    </style>
  </React.Fragment>
);

const globalCSS = css.global`
  * {
    margin: 0;
    padding: 0;
  }  

  ul {
    margin: 0;
    padding: 0;
  }
`;

// Change callback to customize store for every request
const makeStore: any = () => store;
const wrapper: any = createWrapper(makeStore);
export default wrapper.withRedux(MyApp);
