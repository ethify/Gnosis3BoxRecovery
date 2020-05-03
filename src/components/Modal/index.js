import React from "react";
import "./modal.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faKey } from "@fortawesome/free-solid-svg-icons";
import {
  faCheckCircle,
  faTimesCircle,
} from "@fortawesome/free-regular-svg-icons";
import Loader from "../Loader";

import * as ethUtil from "ethereumjs-util";
import IdentityWallet from "identity-wallet";
import * as Cryptr from "cryptr";
import Box from "3box";
import * as contract from "@truffle/contract";
import CPK from "contract-proxy-kit";

import GnosisSafe from "../../contracts/build/contracts/GnosisSafe.json";
import ThreeBoxRecoveryModule from "../../contracts/build/contracts/ThreeBoxRecoveryModule.json";

import {
  getCPK,
  defaultAddress,
  getContracts,
  getModuleDataWrapper,
  getContractsRecovery
} from "../../services";

const seed =
  "0x7acca0ba544b6bb4f6ad3cfccd375b76a2c1587250f0036f00d1d476bbb679b3";

const getConsent = async ({ type, origin, spaces }) => {
  return true;
};

function Modal(props) {
  const [userSecret, setUserSecret] = React.useState("");

  const createAndAddModulesData = async (dataArray) => {
    // Remove method id (10) and position of data in payload (64)
    const ModuleDataWrapperGlobal = await getModuleDataWrapper();
    return dataArray.reduce(
      (acc, data) =>
        acc +
        ModuleDataWrapperGlobal.methods.setup(data).encodeABI().substr(74),
      "0x"
    );
  };

  const testBackup = async () => {
    const safeCPK = await getCPK();
    console.log(ethUtil);
    let privateKey = ethUtil.sha256(Buffer.from(userSecret));

    let backupAddress = ethUtil.privateToAddress(privateKey);
    backupAddress = backupAddress.toString("hex");
    console.log("privateKey", privateKey.toString("hex"));

    const [ gSafeContract,  threeBModuleContract ] = await getContractsRecovery(safeCPK)
    console.log('gSafeCOntract', gSafeContract)
    console.log('threeBModuleCOntract', threeBModuleContract)
    let enableData = await gSafeContract.contract.methods.enableModule(threeBModuleContract.address).encodeABI();
    let moduleData = threeBModuleContract.contract.methods
      .setup(backupAddress)
      .encodeABI();


    const transaction = await safeCPK.execTransactions([
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
    ], {gas: 1000000});

    console.log(transaction)

  }

  const submitBackup = async () => {
    // Deploy Contract
    const gnosisSafe = contract(GnosisSafe);
    const threeBoxRecoveryModule = contract(ThreeBoxRecoveryModule);

    console.log(ethUtil);
    let privateKey = ethUtil.sha256(Buffer.from(userSecret));
    const privateKeyString = privateKey.toString('hex')
    let backupAddress = ethUtil.privateToAddress(privateKey);
    backupAddress = backupAddress.toString("hex");
    console.log("privateKey", privateKey.toString("hex"));

    //console.log(address.toString('hex'))
    console.log("Click Submit");
    const idWallet = new IdentityWallet(getConsent, { seed: "0x" + privateKeyString });
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

    const [ gSafeContract,  threeBModuleContract ] = await getContractsRecovery(safeCPK)

    console.log('gSafeCOntract', gSafeContract)
    console.log('threeBModuleCOntract', threeBModuleContract)
    let enableData = await gSafeContract.contract.methods.enableModule(threeBModuleContract.address).encodeABI();
    let moduleData = threeBModuleContract.contract.methods
      .setup(backupAddress)
      .encodeABI();


    const transaction = await safeCPK.execTransactions([
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
    ], {gas: 1000000});

    console.log(transaction)
    
    await space.private.set("backupKey", { encryptedKey });
    await space.private.set("moduleAddress", {address: threeBModuleContract.address})
    const keyObj = await space.private.get("backupKey");
    console.log('moduleAddress', await space.private.get('moduleAddress'))
    console.log(keyObj);
    console.log("Done");
    alert("Done");
    
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
          {props.config.type === "setUpRecovery" ? (
            <div className="modal-recovery">
              <div className="modal-title">{props.config.title}</div>
              <h4 className="modal-desc">
                Please Send some ETH to the safe before this transaction
              </h4>
              <div className="modal-message">
                <input
                  className="user-secret-input"
                  type="text"
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

                <button
                  type="button"
                  className="user-secret-add-button"
                  onClick={testBackup}
                >
                  <FontAwesomeIcon icon={faKey} />
                  <span>Test Submit</span>
                </button>
              </div>
            </div>
          ) : (
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
              <div className="modal-message">
                <input
                  className="input is-primary"
                  type="text"
                  placeholder="Primary input"
                  onChange={(e) => {
                    setUserSecret(e.target.value);
                  }}
                />
                <button
                  type="button"
                  className="create-button"
                  onClick={submitBackup}
                >
                  <FontAwesomeIcon icon={faKey} />
                  <span>Submit</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Modal;
