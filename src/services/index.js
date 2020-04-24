import Onboard from "bnc-onboard";
import * as Web3 from "web3";
import CPK from 'contract-proxy-kit'

let web3;
let cpk;

const onboard = Onboard({
  dappId: "052b3fe9-87d5-4614-b2e9-6dd81115979a", // [String] The API key created by step one above
  networkId: 4, // [Integer] The Ethereum network ID your Dapp uses.
  subscriptions: {
    wallet: (wallet) => {
      web3 = new Web3(wallet.provider);
    },
  },
});

export const getWeb3 = () => {
  return web3
}

export const getAccount = async () => { 
  await onboard.walletSelect();
  await onboard.walletCheck();
  const currentState = onboard.getState();

  return currentState.address;
};

export const getCPK = async () => {
  if (!web3) {
    await getAccount()
  }
  const cpk = await CPK.create({ web3 });
  console.log('cpk',cpk)
  return cpk
}