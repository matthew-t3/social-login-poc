

import web3auth from '@web3auth/node-sdk'
import pkg from '@web3auth/ethereum-provider';
import adapter from '@web3auth/openlogin-adapter';

const { Web3Auth } = web3auth;
const { EthereumPrivateKeyProvider } = pkg;
const { OpenloginAdapter } = adapter;
const WEB3AUTH_CLIENT_ID = 'BGikvhnv-q2D14q6oN1LcoSWRJE4AzLSSj8At8D7L57bnCVMs1A0XBqcs1f69Dt_QK-47FG8ShCxl0jVB8pn28c'

const w3a = new Web3Auth({
  clientId: WEB3AUTH_CLIENT_ID,
  web3AuthNetwork: 'sapphire_devnet',
  enableLogging: true,
});

const etherProvider = new EthereumPrivateKeyProvider({
  config: {
    chainConfig: {
      chainId: "0x1",
      rpcTarget: "https://rpc.ankr.com/eth",
      displayName: "Ethereum Mainnet",
      blockExplorer: "https://etherscan.io",
      ticker: "ETH",
      tickerName: "Ethereum",
    },
  },
})

w3a.init({ provider: etherProvider })
// w3a.configureAdapter()

export default w3a
