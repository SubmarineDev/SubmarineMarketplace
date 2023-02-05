const path = require('path')
const withSass = require('@zeit/next-sass');
module.exports = withSass({
    /* bydefault config  option Read For More Optios
    here https://github.com/vercel/next-plugins/tree/master/packages/next-sass

    
    */
    cssModules: true
})
module.exports = {
    reactStrictMode: true,
     eslint: { ignoreDuringBuilds: true },
    /* Add Your Scss File Folder Path Here */
    sassOptions: {
        includePaths: [path.join(__dirname, 'styles')],
    }
}
const withTM = require("next-transpile-modules")([
  "@blocto/sdk",
  "@project-serum/sol-wallet-adapter",
  "@solana/wallet-adapter-base",
  "@solana/wallet-adapter-react",
  "@solana/wallet-adapter-wallets",
  "@solana/wallet-adapter-react-ui",
  "@solana/wallet-adapter-bitpie",
  "@solana/wallet-adapter-blocto",
  "@solana/wallet-adapter-coin98",
  "@solana/wallet-adapter-ledger",
  "@solana/wallet-adapter-mathwallet",
  "@solana/wallet-adapter-phantom",
  "@solana/wallet-adapter-safepal",
  "@solana/wallet-adapter-slope",
  "@solana/wallet-adapter-solflare",
  "@solana/wallet-adapter-sollet",
  "@solana/wallet-adapter-solong",
  "@solana/wallet-adapter-torus",
]);

/** @type {import('next').NextConfig} */
module.exports = withTM({
  reactStrictMode: true,
   eslint: { ignoreDuringBuilds: true },
   typescript: {
        ignoreBuildErrors: true,
        strictNullChecks: false,
    },
  reactDevOverlay: false,
  webpack: (config) => {
    config.resolve.fallback = {
      fs: false,
      os: false,
      path: false,
      crypto: false,
    };

    return config;
  },
});




