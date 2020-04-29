import React from "react";
import "./safe_details_widget.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faKey } from "@fortawesome/free-solid-svg-icons";
import { faEthereum } from "@fortawesome/free-brands-svg-icons";
import { useHistory } from "react-router-dom";
import makeBlockie from "ethereum-blockies-base64";
import Loader from "../Loader";
import { getBalance } from '../../services';

function SafeDetailsWidget(props) {
  let history = useHistory();

  const [loading, setLoading] = React.useState(true);
  const [safeBalance, setSafeBalance] = React.useState(0)

  React.useEffect(() => {
    console.log("Details Page");
    setLoading(false);
    const getBalanc = async () => {
      if (props.cpk !== null) {
        const bal = await getBalance(props.cpk.address.toString())
        setSafeBalance(bal / (10 ** 18))
      }
    }
    getBalanc()
  }, [props.cpk]);

  const setupBackup = async () => {
    props.setOpenModal(true)
    props.setModalConfig({
      title: 'Setup Recovery',
      type: 'setUpRecovery'
    })
  };

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
                  {props.address && <img
                    src={makeBlockie(props.address)}
                    alt="address blockie"
                    className="address-blockie"
                  />}
                </div>
                <div className="safe-name-address-container">
                  <div className="safe-name-detail">
                    <span className="safe-name">Safe</span>
                    <span className="safe-permissions">Owner</span>
                  </div>
                  <div className="safe-address-detail">
                    <span className="safe-address">{props.cpk.address.toString()}</span>
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
                      <div className="td">{safeBalance} ETH</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
      </div>
    </div>
  );
}

export default SafeDetailsWidget;
