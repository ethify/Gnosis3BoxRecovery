import React from "react";
import "./App.scss";
import Header from "./components/Header";
import { withRouter, Route, Redirect } from "react-router";
import Modal from "./components/Modal";
import CreateSafeWidget from "./components/CreateSafeWidget";
import SafeDetailsWidget from "./components/SafeDetailsWidget";
import { getAccount } from './services'
import RestoreSafeWidget from "./components/RestoreSafeWidget";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      address: undefined,
      page: "safe",
      openModal: false,
      modalConfig: {},
    };
  }

  changeAddress = (address) => {
    this.setState({ address });
  };

  changePage = (page) => {
    this.setState({ page });
  };

  setOpenModal = (pFlag) => {
    this.setState({ openModal: pFlag });
  };

  setModalConfig = (pConfig) => {
    this.setState({ modalConfig: pConfig });
  };

  checkEthereumChange = () => {
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", (accounts) => {
        if (this.state.address !== undefined) {
          this.setState({ address: accounts[0] });
        }
      });

      window.ethereum.on("networkChanged", async (changedChainId) => { });
    }
  };

  render() {
    this.checkEthereumChange();
    return (
      <div className="App">
        {/* <Modal
          setOpenModal={this.setOpenModal}
          openModal={this.state.openModal}
          config={this.state.modalConfig}
        /> */}
        <Header
          setAddress={this.changeAddress}
          address={this.state.address}
          page={this.state.page}
          changePage={this.changePage}
        />
        <Route
          path="/wallet"
          exact
          render={() => (
            <CreateSafeWidget setAddress={this.changeAddress} address={this.state.address} />
          )}
        />

        <Route
          path="/wallet/safe"
          exact
          render={() => (
            <SafeDetailsWidget
              setAddress={this.changeAddress}
              address={this.state.address}
            />
          )}
        />
        <Route
          path="/recover"
          exact
          render={() => (
            <RestoreSafeWidget
              address={"0x5d2629a9E885C5F0D558d6fE28A1f856ABdBDD54"}
            />
          )}
        />


        <Route exact path="/" render={() => <Redirect to="/wallet" />} />
      </div>
    );
  }
}

export default withRouter(App);
