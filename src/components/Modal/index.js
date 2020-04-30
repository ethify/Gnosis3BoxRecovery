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

import { getCPK, defaultAddress } from "../../services";

const seed =
  "0x7acca0ba544b6bb4f6ad3cfccd375b76a2c1587250f0036f00d1d476bbb679b3";

const getConsent = async ({ type, origin, spaces }) => {
  return true;
};

function Modal(props) {
  const [userSecret, setUserSecret] = React.useState("");

  const submitBackup = async () => {
    // Deploy Contract
    const gnosisSafe = contract(GnosisSafe);
    const threeBoxRecoveryModule = contract(ThreeBoxRecoveryModule);

    console.log(ethUtil);
    let privateKey = ethUtil.sha256(Buffer.from(userSecret));
    console.log("privateKey", privateKey.toString("hex"));

    //console.log(address.toString('hex'))
    console.log("Click Submit");
    const idWallet = new IdentityWallet(getConsent, { seed });
    const threeIdProvider = idWallet.get3idProvider();
    const box = await Box.openBox(null, threeIdProvider);
    await box.syncDone;
    const userAddress = await defaultAddress();
    const safeCPK = await getCPK();
    const spaceName = userAddress + safeCPK.address;
    console.log("spceName", spaceName);
    const space = await box.openSpace(spaceName.toLowerCase());
    const cryptr = new Cryptr(userSecret);
    const encryptedKey = cryptr.encrypt(privateKey);
    const txObject = await props.cpk.execTransactions(
      [
        {
          to: "0x86dc3c59704A297C268635AefACA1F560a2ABA69",
          value: 0,
          data: "0x00",
          operation: CPK.CALL,
        },
      ],
      { gasPrice: `${67e9}` }
    );

    console.log(txObject);
    await space.private.set("backupKey", { encryptedKey });
    const keyObj = await space.private.get("backupKey");
    console.log(keyObj);
    console.log("Done");
    alert("Done");
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
                  placeholder="Primary input"
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
