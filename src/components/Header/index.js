import React from "react";
import "./header.scss";
import { getAccount } from "../../services";
import { useHistory } from "react-router-dom";
import makeBlockie from "ethereum-blockies-base64";
import { shortenAddress } from "../../utils";

function Header(props) {
  let history = useHistory();
  const handleConnect = async () => {
    const address = await getAccount();
    props.setAddress(address);
  };
  const getAddressTemplate = (address) => {
    if (address) {
      return (
        <div className="address-container">
          <span>{shortenAddress(address)}</span>
          <img
            src={makeBlockie(address)}
            alt="address blockie"
            className="address-blockie"
          />
        </div>
      );
    } else {
      return <div>Connect to Wallet</div>;
    }
  };
  return (
    <div className="header">
      <div className="header-first-container">
        <div className="logo-container">
          <img
            src={require("../../assets/icons/gnosis_safe_logo.png")}
            alt="logo"
            className="app-logo"
          />
          <span className="logo-title">CoolRecovery</span>
        </div>

        <div className="header-tab-container">
          <div
            className={`header-tab ${
              props.page !== "recover" ? "tab-active" : null
            }`}
            onClick={(e) => history.push("/wallet")}
          >
            Wallet
          </div>
          <div
            className={`header-tab ${
              props.page === "recover" ? "tab-active" : null
            }`}
            onClick={(e) => history.push("/recover")}
          >
            Recover
          </div>
        </div>
      </div>
      <div
        className={"wallet-container " + (props.address ? "connected" : null)}
        onClick={handleConnect}
      >
        {getAddressTemplate(props.address)}
      </div>
    </div>
  );
}

export default Header;
