import React from "react";
import "./recover_safe_widget.scss";
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
import CreateAndAddModules from "../../contracts/build/contracts/CreateAndAddModules.json"

import {
  getCPK,
} from "../../services";

const seed = "0x7acca0ba544b6bb4f6ad3cfccd375b76a2c1587250f0036f00d1d476bbb679b3";

function RecoverSafeWidget(props) {
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
    await box.syncDone

    const spaceName = oldAddress + safeAddress;
    console.log(spaceName)
    const space = await box.openSpace(spaceName.toLowerCase());
    
    const backupKey = await space.private.get("backupKey");
    console.log('backupKey', backupKey)
    const cryptr = new Cryptr(safePassword);
    const decryptedBackupKey = cryptr.decrypt(backupKey.encryptedKey);
    console.log('decryptedKye', decryptedBackupKey.toString('hex'));
  };

  const recoverSafeTest = async () => {
    const threeBoxRecoveryModuleContract = contract(ThreeBoxRecoveryModule)
    const createAndAddModulesContract = contract(CreateAndAddModules)

    console.log('threeBoxRecoveryModuleContract',threeBoxRecoveryModuleContract)
  }

  return (
    <div className="recover-safe-widget">
      <div className="widget-main-container">
        {loading ? (
          <Loader loaderType="box" />
        ) : (
          <div className="recover-safe-container">
            <div className="recover-button-container">
              <h2 className="recover-safe-title">Recover You Safe</h2>
              <p>
                <b>Enter You Gnosis Safe Address</b>
              </p>
              <input
                onChange={(e) => {
                  setSafeAddress(e.target.value);
                }}
                className="recover-safe-text"
                type="text"
              />
              <p>
                <b>Enter Old Safe Owner Address</b>
              </p>
              <input
                onChange={(e) => {
                  setOldAddress(e.target.value);
                }}
                className="recover-safe-text"
                type="text"
              />
              <p>
                <b>Enter Recovery Secret Password</b>
              </p>
              <input
                onChange={(e) => {
                  setSafePassword(e.target.value);
                }}
                className="recover-safe-text"
                type="text"
              />
              <br />
              <br />
              <button
                type="button"
                className="recover-button"
                onClick={recoverSafe}
              >
                <FontAwesomeIcon icon={faPlus} />
                <span>Recover Safe</span>
              </button>

              <button
                type="button"
                className="recover-button"
                onClick={recoverSafeTest}
              >
                <FontAwesomeIcon icon={faPlus} />
                <span>Recover Safe Test</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default RecoverSafeWidget;
