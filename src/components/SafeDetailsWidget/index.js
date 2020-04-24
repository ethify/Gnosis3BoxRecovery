import React from "react";
import "./safe_details_widget.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faKey } from "@fortawesome/free-solid-svg-icons";
import { faEthereum } from "@fortawesome/free-brands-svg-icons";
import { useHistory } from "react-router-dom";
import makeBlockie from "ethereum-blockies-base64";
import Loader from "../Loader";
import { getCPK } from "../../services";

function SafeDetailsWidget(props) {
  let history = useHistory();
  const [loading, setLoading] = React.useState(true);
  const [safeCPK, setSafeCPK] = React.useState({});
  const [isModal, setIsModal] = React.useState(false);
  const [ userSecret, setUserSecret ] = React.useState('')

  React.useEffect(() => {
    setLoading(false);
    const createCPK = async () => {
      const cpk = await getCPK();
      console.log("cpkkk", cpk);
      setSafeCPK(cpk);
    };
    createCPK();
  }, []);

  const setupBackup = async () => {
    setIsModal(true);
  };

  const submitBackup = async () => {
    console.log('Click Submit')
  }

  return (
    <div className="safe-details-widget">
      <div className="widget-main-container">
        <div className="widget-header">
          <h3 className="widget-header-title">Your Safe</h3>
        </div>
        {loading ? (
          <Loader loaderType="box" />
        ) : (
          <div className="safe-details-container">
            <div className="safe-header-container">
              <div className="safe-blockie-container">
                <img
                  src={makeBlockie(props.address)}
                  alt="address blockie"
                  className="address-blockie"
                />
              </div>
              <div className="safe-name-address-container">
                <div className="safe-name-detail">
                  <span className="safe-name">Test Safe</span>
                  <span className="safe-permissions">Owner</span>
                </div>
                <div className="safe-address-detail">
                  <span className="safe-address">{safeCPK.address}</span>
                </div>
              </div>
              <div className="recovery-setup-container">
                <button
                  type="button"
                  className="create-button"
                  onClick={setupBackup}
                >
                  <FontAwesomeIcon icon={faKey} />
                  <span>Setup Restore</span>
                </button>
              </div>
            </div>
            <div className="safe-balance-container">
              <div className="widget-tabs">
                <div className="tab-item">
                  <div className="tab-link active">Assets</div>
                </div>
              </div>
              <div className="asset-lists">
                <div className="thead">
                  <div className="tr">
                    <div className="td">Assets</div>
                    <div className="td">Balance</div>
                  </div>
                </div>
                <div className="tbody">
                  <div className="tr">
                    <div className="td">
                      <span className="token-icon">
                        <FontAwesomeIcon icon={faEthereum} />
                      </span>
                      <span className="token-name">Ether</span>
                    </div>
                    <div className="td">15,000 ETH</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      {isModal ? (
        <div className="modal">
          <div className="modal-background"></div>
          <div className="modal-content">
            <div className="widget-main-container">
            <div className="field">
              <div className="control">
                <h3>Enter a Secret</h3>
                <input
                  className="input is-primary"
                  type="text"
                  placeholder="Primary input"
                  onChange = {(e) => {setUserSecret(e.target.value)}}
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
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default SafeDetailsWidget;
