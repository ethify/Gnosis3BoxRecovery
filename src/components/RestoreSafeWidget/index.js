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

import GnosisSafe from "../../contracts/build/contracts/GnosisSafe.json";
import ThreeBoxRecoveryModule from "../../contracts/build/contracts/ThreeBoxRecoveryModule.json";
import CreateAndAddModules from "../../contracts/build/contracts/CreateAndAddModules.json";

import {
  getCPK,
  defaultAddress,
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
    const idWallet = new IdentityWallet(getConsent, { seed });
    const threeIdProvider = idWallet.get3idProvider();
    const box = await Box.openBox(null, threeIdProvider);
    await box.syncDone;

    const spaceName = oldAddress + safeAddress;
    console.log(spaceName);
    const space = await box.openSpace(spaceName.toLowerCase());

    const backupKey = await space.private.get("backupKey");
    console.log("backupKey", backupKey);
    const cryptr = new Cryptr(safePassword);
    const decryptedBackupKey = cryptr.decrypt(backupKey.encryptedKey);
    console.log("decryptedKye", decryptedBackupKey.toString("hex"));
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
                  value={safeAddress}
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
                <span>Create new Safe</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default RestoreSafeWidget;
