import React from "react";
import "./safe_details_widget.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faKey } from "@fortawesome/free-solid-svg-icons";
import { faEthereum } from "@fortawesome/free-brands-svg-icons";
import { useHistory } from "react-router-dom";
import makeBlockie from "ethereum-blockies-base64";
import Loader from "../Loader";

function SafeDetailsWidget(props) {
  let history = useHistory();
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    setLoading(false);
  }, []);

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
                  <span className="safe-address">{props.address}</span>
                </div>
              </div>
              <div className="recovery-setup-container">
                <button
                  type="button"
                  className="create-button"
                  onClick={(e) => {}}
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
    </div>
  );
}

export default SafeDetailsWidget;
