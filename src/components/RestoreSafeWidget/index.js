import React from "react";
import "./restore_safe_widget.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { useHistory } from "react-router-dom";
import Loader from "../Loader";
import Box from '3box';

function RestoreSafeWidget(props) {
  let history = useHistory();
  const [loading, setLoading] = React.useState(true);
  const [safeAddress, setSafeAddress] = React.useState('');
  const [safeMasterKey, setSafeMasterKey] = React.useState('');

  React.useEffect(() => {
    setLoading(false);
  }, []);

  const recoverSafe = async () => {
    // history.push('/safe')
    // console.log(safeMasterKey, safeAddress)
  }


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
                  <h2 className="create-safe-title">Simply recover your safe using master key</h2>
                </div>
                <div className="safe-address-container">
                  <input type="text" className="safe-address-input" value={safeAddress} onChange={e => setSafeAddress(e.target.value)} placeholder="Enter safe address" />
                </div>
                <div className="safe-master-key-container">
                  <input type="password" className="safe-master-key-input" value={safeMasterKey} onChange={e => setSafeMasterKey(e.target.value)} placeholder="Enter your master key to recover" />
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
