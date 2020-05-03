import React from "react";
import "./restore_safe_widget.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { useHistory } from "react-router-dom";
import Loader from "../Loader";

import * as ethUtil from "ethereumjs-util";
import IdentityWallet from "identity-wallet";
import * as Cryptr from "cryptr";
import Box from "3box";
import * as contract from "@truffle/contract";
import CPK from "contract-proxy-kit";

import * as Web3 from 'web3';

import * as EthereumTx from "ethereumjs-tx";

import GnosisSafe from "../../contracts/build/contracts/GnosisSafe.json";
import ThreeBoxRecoveryModule from "../../contracts/build/contracts/ThreeBoxRecoveryModule.json";
import CreateAndAddModules from "../../contracts/build/contracts/CreateAndAddModules.json";

import {
  getCPK,
  defaultAddress,
  getWeb3,
  getThreeBoxModule,
  getContracts,
  getModuleDataWrapper,
} from "../../services";

const seed =
  "0x7acca0ba544b6bb4f6ad3cfccd375b76a2c1587250f0036f00d1d476bbb679b3";

function RestoreSafeWidget(props) {
  let history = useHistory();
  const [loading, setLoading] = React.useState(true);
  const [oldAddress, setOldAddress] = React.useState("");
  const [safeAddress, setSafeAddress] = React.useState("");
  const [safePassword, setSafePassword] = React.useState("");

  React.useEffect(() => {
    setLoading(false);
  }, []);

  const createNewSafe = async () => {
    const cpk = await getCPK();
    console.log("cpkkk", cpk);
    props.setCPK(cpk);
    history.push("/safe");
  };

  const getConsent = async ({ type, origin, spaces }) => {
    return true;
  };

  const recoverSafe = async () => {
    console.log(ethUtil);
    console.log('safePassword', safePassword)
    
    let privateKey = ethUtil.sha256(Buffer.from(safePassword));
    const privateKeyString = privateKey.toString("hex");
    
    console.log("privateKey", privateKey.toString("hex"));

    const idWallet = new IdentityWallet(getConsent, { seed: "0x" +privateKeyString });
    const threeIdProvider = idWallet.get3idProvider();
    const box = await Box.openBox(null, threeIdProvider);
    await box.syncDone;

    const spaceName = oldAddress + safeAddress;
    console.log(spaceName);
    const space = await box.openSpace(spaceName.toLowerCase());

    const backupKey = await space.private.get("backupKey");
    /// THis will give error (Invalid Something)
    const moduleAddress = await space.private.get("moduleAddress");

    console.log("backupKey", backupKey);
    console.log("moduleAddress", moduleAddress);

    const cryptr = new Cryptr(safePassword);
    const decryptedBackupKey = await cryptr.decrypt(backupKey.encryptedKey);
    console.log("decryptedKye", decryptedBackupKey.toString("hex"));
    
    const threeBModule = await getThreeBoxModule()
    console.log('threeBModule', threeBModule)
    const currentAddress = await defaultAddress()

    const recoverData = threeBModule.contract.methods.recoverAccess(currentAddress).encodeABI();
    console.log("selfBuyData", recoverData);


    const correctKey = new Buffer.from(decryptedBackupKey, "hex");
    console.log(correctKey, correctKey.length, 'corectkey', correctKey.toString('hex'))
    let backupAddress = ethUtil.privateToAddress(correctKey);
    backupAddress = backupAddress.toString("hex");
    console.log('backupAddress',backupAddress)

    const web3 = await getWeb3()

    backupAddress = web3.utils.toChecksumAddress("0x" + backupAddress)
    console.log('new backup address', backupAddress)

    const transactionObj = {
      to: moduleAddress.address,
      data: recoverData,
      gas: 1000000,
      gasPrice: 15,
      from: backupAddress,
      nonce: await web3.eth.getTransactionCount(backupAddress),
    };

    var tx = new EthereumTx.Transaction(transactionObj, {'chain':'rinkeby'});
    
    tx.sign(correctKey);
    var stx = tx.serialize();

    const nWeb3 = new Web3(
      new Web3.providers.WebsocketProvider("wss://rinkeby.infura.io/ws/v3/8b8d0c60bfab43bc8725df20fc660d15")
    );


    nWeb3.eth.sendSignedTransaction(
      "0x" + stx.toString("hex"),
      async (err, hash) => {
        if (err) {
          // Error Somethin
          console.log("buy error", err);
        }
        // Here Modal to be shown with new account confirmation
        // Current Account in Metamask - New Safe owner
        console.log("buy hash" + hash);
      }
    );
  };

  return (
    <div className="recover-safe-widget">
      <div className="widget-main-container">
        {loading ? (
          <Loader loaderType="box" />
        ) : (
          <div className="create-safe-container">
            <div className="logo-container">
              <img
                src={require("../../assets/icons/gnosis_safe_logo.png")}
                alt="safe logo"
                className="gnosis-safe-logo"
              />
            </div>
            <div className="create-button-container">
              <div className="create-safe-title-container">
                <h2 className="create-safe-title">
                  Simply recover your safe using master key
                </h2>
              </div>
              <div className="safe-address-container">
                <input
                  type="text"
                  className="safe-address-input"
                  value={safeAddress}
                  onChange={(e) => setSafeAddress(e.target.value)}
                  placeholder="Enter safe address"
                />
              </div>
              <div className="safe-old-owner-container">
                <input
                  type="text"
                  className="safe-old-owner-input"
                  value={oldAddress}
                  onChange={(e) => setOldAddress(e.target.value)}
                  placeholder="Enter Old Safe Owner Address"
                />
              </div>
              <div className="safe-master-key-container">
                <input
                  type="password"
                  className="safe-master-key-input"
                  value={safePassword}
                  onChange={(e) => setSafePassword(e.target.value)}
                  placeholder="Enter your master key to recover"
                />
              </div>
              <button
                type="button"
                className="create-button"
                onClick={recoverSafe}
              >
                <FontAwesomeIcon icon={faPlus} />
                <span>Recover Safe</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default RestoreSafeWidget;
