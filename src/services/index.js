import Onboard from "bnc-onboard";
import * as Web3 from "web3";
import CPK from 'contract-proxy-kit'

import * as contract from "@truffle/contract";

import GnosisSafe from "../contracts/build/contracts/GnosisSafe.json";
import ThreeBoxRecoveryModule from "../contracts/build/contracts/ThreeBoxRecoveryModule.json";
import CreateAndAddModules from "../contracts/build/contracts/CreateAndAddModules.json"
import GnosisSafeProxyFactory from "../contracts/build/contracts/GnosisSafeProxyFactory.json"

let web3;

const onboard = Onboard({
  dappId: "052b3fe9-87d5-4614-b2e9-6dd81115979a", // [String] The API key created by step one above
  networkId: 4, // [Integer] The Ethereum network ID your Dapp uses.
  subscriptions: {
    wallet: (wallet) => {
      web3 = new Web3(wallet.provider);
    },
  },
});

export const getAccount = async () => { 
  await onboard.walletSelect();
  await onboard.walletCheck();
  const currentState = onboard.getState();

  return currentState.address;
};

export const defaultAddress = async () => {
  const currentState = onboard.getState()
  return currentState.address
}

export const getBalance = (address) => {
  return web3.eth.getBalance(address)
}

export const getCPK = async () => {
  if (!web3) {
    await getAccount()
  }
  const cpk = await CPK.create({ web3 });
  return cpk
}

export const getWeb3 = async () => {
  if (!web3) {
    await getAccount()
  }
  return web3
}

export const getContracts = async () => {
  const threeBoxRecoveryModuleContract = contract(ThreeBoxRecoveryModule)
  const createAndAddModulesContract = contract(CreateAndAddModules)
  const gnosisSafeProxyFactory = contract(GnosisSafeProxyFactory)

  threeBoxRecoveryModuleContract.setProvider(web3.currentProvider)
  createAndAddModulesContract.setProvider(web3.currentProvider)
  gnosisSafeProxyFactory.setProvider(web3.currentProvider)

  const threeBModule = await threeBoxRecoveryModuleContract.at('0x9185652F251E85B8fD8601F3d4B0Eb5298Bf7571')
  const createandAdd = await createAndAddModulesContract.at('0x41B76A41d7b5C9cc7316645C0676Ae56328BC11E')
  const gnosisSProxy = await gnosisSafeProxyFactory.at('0x8607F6d28316fEc1F8A09e18A40c49B17a7D369a')

  console.log('threeBoxRecoveryModuleContract',threeBModule)
  console.log('createAndAddModulesContract',createandAdd)
  console.log('gnosisSProxy',gnosisSProxy)

  return [threeBModule, createandAdd, gnosisSProxy]
}

export const getThreeBoxModule = async () => {
  const threeBoxRecoveryModuleContract = contract(ThreeBoxRecoveryModule)
  threeBoxRecoveryModuleContract.setProvider(web3.currentProvider)

  const threeBModule = await threeBoxRecoveryModuleContract.deployed()

  return threeBModule
}

export const getContractsRecovery = async (cpk) => {
  const threeBoxRecoveryModule = contract(ThreeBoxRecoveryModule)
  const gnosisSafe = contract(GnosisSafe)

  gnosisSafe.setProvider(web3.currentProvider)
  threeBoxRecoveryModule.setProvider(web3.currentProvider)

  let gnosisSafeContract = await gnosisSafe.at(cpk.masterCopyAddress)

  console.log('web3address', web3.givenProvider.selectedAddress)
  let threeBoxRecoveryModuleContract = await threeBoxRecoveryModule.new({from: web3.givenProvider.selectedAddress})

  return [gnosisSafeContract, threeBoxRecoveryModuleContract]
}

export const getModuleDataWrapper = async () => {
  const moduleDataWrapper =  new web3.eth.Contract([{"constant":false,"inputs":[{"name":"data","type":"bytes"}],"name":"setup","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"}]);
  console.log('moduleDataWrapper', moduleDataWrapper)

  return moduleDataWrapper
}