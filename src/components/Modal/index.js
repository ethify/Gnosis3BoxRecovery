import React from "react";
import "./modal.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faKey } from "@fortawesome/free-solid-svg-icons";
import {
  faCheckCircle,
  faTimesCircle,
  faCopy,
} from "@fortawesome/free-regular-svg-icons";
import Loader from "../Loader";

import * as ethUtil from "ethereumjs-util";
import IdentityWallet from "identity-wallet";
import * as Cryptr from "cryptr";
import Box from "3box";
// import * as contract from "@truffle/contract";
import CPK from "contract-proxy-kit";

// import GnosisSafe from "../../contracts/build/contracts/GnosisSafe.json";
// import ThreeBoxRecoveryModule from "../../contracts/build/contracts/ThreeBoxRecoveryModule.json";
import * as Web3 from "web3";
import * as EthereumTx from "ethereumjs-tx";

import {
  getCPK,
  defaultAddress,
  getContractsRecovery,
  getWeb3,
} from "../../services";
import copy from "clipboard-copy";

const getConsent = async ({ type, origin, spaces }) => {
  return true;
};

function Modal(props) {
  const [userSecret, setUserSecret] = React.useState("");

  // const createAndAddModulesData = async (dataArray) => {
  //   // Remove method id (10) and position of data in payload (64)
  //   const ModuleDataWrapperGlobal = await getModuleDataWrapper();
  //   return dataArray.reduce(
  //     (acc, data) =>
  //       acc +
  //       ModuleDataWrapperGlobal.methods.setup(data).encodeABI().substr(74),
  //     "0x"
  //   );
  // };

  const submitBackup = async () => {
    // Deploy Contract
    // const gnosisSafe = contract(GnosisSafe);
    // const threeBoxRecoveryModule = contract(ThreeBoxRecoveryModule);
    try {
      props.setModalConfig({
        type: "transaction",
        status: "pending",
        title: "Recovery Setup Started",
        message: "Your safe recovery setup has been started.",
      });
      console.log(ethUtil);
      let privateKey = ethUtil.sha256(Buffer.from(userSecret));
      const privateKeyString = privateKey.toString("hex");
      let backupAddress = ethUtil.privateToAddress(privateKey);
      backupAddress = backupAddress.toString("hex");
      console.log("privateKey", privateKey.toString("hex"));

      //console.log(address.toString('hex'))
      console.log("Click Submit");
      const idWallet = new IdentityWallet(getConsent, {
        seed: "0x" + privateKeyString,
      });
      const threeIdProvider = idWallet.get3idProvider();
      const box = await Box.openBox(null, threeIdProvider);
      await box.syncDone;
      const userAddress = await defaultAddress();
      const safeCPK = await getCPK();
      const spaceName = userAddress + safeCPK.address;
      console.log("spceName", spaceName);
      const space = await box.openSpace(spaceName.toLowerCase());
      const cryptr = new Cryptr(userSecret);
      const encryptedKey = cryptr.encrypt(privateKeyString);

      const [gSafeContract, threeBModuleContract] = await getContractsRecovery(
        safeCPK
      );

      console.log("gSafeCOntract", gSafeContract);
      console.log("threeBModuleCOntract", threeBModuleContract);
      let enableData = await gSafeContract.contract.methods
        .enableModule(threeBModuleContract.address)
        .encodeABI();
      let moduleData = threeBModuleContract.contract.methods
        .setup(backupAddress)
        .encodeABI();

      const transaction = await safeCPK.execTransactions(
        [
          {
            operation: CPK.CALL,
            to: safeCPK.address,
            value: 0,
            data: enableData,
          },
          {
            operation: CPK.CALL,
            to: threeBModuleContract.address,
            value: 0,
            data: moduleData,
          },
        ],
        { gas: 1000000 }
      );

      console.log(transaction);

      await space.private.set("backupKey", { encryptedKey });
      await space.private.set("moduleAddress", {
        address: threeBModuleContract.address,
      });
      const keyObj = await space.private.get("backupKey");
      console.log("moduleAddress", await space.private.get("moduleAddress"));
      console.log(keyObj);
      console.log("Done");
      props.setModalConfig({
        type: "transaction",
        status: "success",
        title: "Recovery Setup Done",
        message: "Your safe recovery setup has been completed.",
      });
      setTimeout(() => {
        props.setOpenModal(false);
      }, 3000);
    } catch (err) {
      console.log(err);
      props.setModalConfig({
        type: "transaction",
        status: "fail",
        title: "Recovery Setup Error",
        message: err.message,
      });
      setTimeout(() => {
        props.setOpenModal(false);
      }, 3000);
    }
    //const [threeBModule, createAndAdd, gnosisSafeProxy] = await getContracts();
    // const moduleData = threeBModule.contract.methods
    //   .setup(backupAddress)
    //   .encodeABI();
    // console.log("moduleData", moduleData);
    // const threeBcreateData = gnosisSafeProxy.contract.methods
    //   .createProxy("0x9185652F251E85B8fD8601F3d4B0Eb5298Bf7571", moduleData)
    //   .encodeABI();
    // console.log("threeBcreateData", threeBcreateData);
    // const modulesCreationData = await createAndAddModulesData([
    //   threeBcreateData,
    // ]);

    // console.log("modulesCreationData", modulesCreationData);

    // const createAndAddModuleData = createAndAdd.contract.methods
    //   .createAndAddModules(
    //     "0x8607F6d28316fEc1F8A09e18A40c49B17a7D369a",
    //     modulesCreationData
    //   )
    //   .encodeABI();

    // console.log(props, "props");

    // const txObject = await safeCPK.execTransactions(
    //   [
    //     {
    //       operation: CPK.DELEGATECALL, // Not needed because this is the default value.
    //       data: createAndAddModuleData, // Not needed because this is the default value.
    //       to: "0x41B76A41d7b5C9cc7316645C0676Ae56328BC11E",
    //       value: 0,
    //       gas: 200000,
    //     },
    //   ],
    //   { gasLimit: 1500000 }
    // );
  };

  const startRecovery = async () => {
    props.setModalConfig({
      type: "transaction",
      status: "pending",
      title: "Recovery Setup Started",
      message: "Your safe recovery setup has been started.",
    });
    const web3 = await getWeb3();
    const transactionObj = {
      to: props.config.recoveryConfig.moduleAddress.address,
      data: props.config.recoveryConfig.recoverData,
      gas: 1000000,
      gasPrice: 15,
      from: props.config.recoveryConfig.backupAddress,
      nonce: await web3.eth.getTransactionCount(
        props.config.recoveryConfig.backupAddress
      ),
    };

    var tx = new EthereumTx.Transaction(transactionObj, {
      chain: "rinkeby",
    });

    tx.sign(props.config.recoveryConfig.correctKey);
    var stx = tx.serialize();

    const nWeb3 = new Web3(
      new Web3.providers.WebsocketProvider(
        "wss://rinkeby.infura.io/ws/v3/8b8d0c60bfab43bc8725df20fc660d15"
      )
    );

    nWeb3.eth.sendSignedTransaction(
      "0x" + stx.toString("hex"),
      async (err, hash) => {
        if (err) {
          // Error Somethin
          props.setModalConfig({
            type: "transaction",
            status: "fail",
            title: "Recovery Safe Failed",
            message: "Your safe recovery has been failed for " + err.message,
          });
          setTimeout(() => {
            props.setOpenModal(false);
          }, 3000);
          console.log("buy error", err);
        }
        // Here Modal to be shown with new account confirmation
        // Current Account in Metamask - New Safe owner
        props.setModalConfig({
          type: "transaction",
          status: "success",
          title: "Recovery Safe Done",
          message:
            "Your safe recovery has been completed. Your current account is now the new safe owner",
        });
        setTimeout(() => {
          props.setOpenModal(false);
        }, 3000);
        console.log("buy hash" + hash);
      }
    );
  };

  return (
    <div>
      <div
        className={`modal-overlay ${!props.openModal ? "closed" : null}`}
        id="modal-overlay"
        onClick={(e) => props.setOpenModal(false)}
      ></div>

      <div className={`modal ${!props.openModal ? "closed" : null}`} id="modal">
        <button
          className="close-button"
          id="close-button"
          onClick={(e) => props.setOpenModal(false)}
        >
          <FontAwesomeIcon icon={faTimes} />
        </button>
        <div className="modal-guts">
          {props.config.type === "setUpRecovery" && (
            <div className="modal-recovery-setup">
              <div className="modal-title">{props.config.title}</div>
              <h4 className="modal-desc">
                Please Send some ETH to the safe before this transaction
              </h4>
              <div className="modal-message">
                <input
                  className="user-secret-input"
                  type="password"
                  placeholder="Enter Secret Password"
                  onChange={(e) => {
                    setUserSecret(e.target.value);
                  }}
                />
                <button
                  type="button"
                  className="user-secret-add-button"
                  onClick={submitBackup}
                >
                  <FontAwesomeIcon icon={faKey} />
                  <span>Submit</span>
                </button>
              </div>
            </div>
          )}
          {props.config.type === "transaction" && (
            <div>
              <div>
                <div className="modal-loader">
                  {props.config.status === "pending" ? (
                    <Loader loaderType="circle" />
                  ) : null}
                  {props.config.status === "success" ? (
                    <div className="icon-container">
                      <FontAwesomeIcon
                        icon={faCheckCircle}
                        className="success-icon"
                      />
                    </div>
                  ) : null}
                  {props.config.status === "fail" ? (
                    <div className="icon-container">
                      <FontAwesomeIcon
                        icon={faTimesCircle}
                        className="fail-icon"
                      />
                    </div>
                  ) : null}
                </div>
              </div>
              <div
                className={`modal-title ${
                  props.config.status === "fail" ? "fail" : "success"
                }`}
              >
                {props.config.title}
              </div>
              <div className="modal-message">{props.config.message}</div>
            </div>
          )}
          {props.config.type === "showBackupAccount" && (
            <div className="modal-recovery">
              <div className="modal-title">{props.config.title}</div>
              <h4 className="modal-desc">
                Please Send some ETH to the backup account before this
                transaction
              </h4>
              <div className="modal-message">
                <div>
                  <b>Backup Account</b>
                </div>
                <div
                  className="backup-account-details"
                  onClick={(e) => copy(props.config.backupAccountAddress)}
                >
                  <div className="backup-account-details-item">
                    <div>Address: </div>
                    <div className="backup-account-details-item-data">
                      {props.config.backupAccountAddress}
                    </div>
                  </div>
                  <div>
                    <FontAwesomeIcon icon={faCopy} />
                  </div>
                </div>
                <div
                  className="backup-account-details"
                  onClick={(e) => copy(props.config.backupAccountPrivateKey)}
                >
                  <div className="backup-account-details-item">
                    <div>Private Key: </div>
                    <div className="backup-account-details-item-data">
                      {props.config.backupAccountPrivateKey}
                    </div>
                  </div>
                  <div>
                    <FontAwesomeIcon icon={faCopy} />
                  </div>
                </div>
                <div className="start-recover-button-container">
                  <button
                    type="button"
                    className="user-secret-add-button"
                    onClick={startRecovery}
                  >
                    Start Recovery
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Modal;
