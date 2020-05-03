import React from "react";
import "./App.scss";
import Header from "./components/Header";
import { withRouter, Route, Redirect } from "react-router";
import Modal from "./components/Modal";
import CreateSafeWidget from "./components/CreateSafeWidget";
import SafeDetailsWidget from "./components/SafeDetailsWidget";
import RecoverSafeWidget from "./components/RecoverSafeWidget";
import RestoreSafeWidget from "./components/RestoreSafeWidget";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      address: undefined,
      page: "safe",
      openModal: false,
      modalConfig: {},
      cpk: null,
    };
  }

  setcpk = (cpk) => {
    this.setState({ cpk });
  };

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

      window.ethereum.on("networkChanged", async (changedChainId) => {});
    }
  };

  render() {
    this.checkEthereumChange();
    return (
      <div className="App">
        {
          <Modal
            setOpenModal={this.setOpenModal}
            openModal={this.state.openModal}
            config={this.state.modalConfig}
            setModalConfig={this.setModalConfig}
            cpk={this.state.cpk}
          />
        }
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
            <CreateSafeWidget
              setCPK={this.setcpk}
              setAddress={this.changeAddress}
            />
          )}
        />

        <Route
          path="/wallet/safe"
          exact
          render={() =>
            this.state.cpk ? (
              <SafeDetailsWidget
                address={this.state.cpk.address}
                cpk={this.state.cpk}
                setModalConfig={this.setModalConfig}
                setOpenModal={this.setOpenModal}
              />
            ) : (
              <Redirect to="/wallet" />
            )
          }
        />
        <Route
          path="/recover"
          exact
          render={() => (
            <RestoreSafeWidget
              cpk={this.state.cpk}
              setModalConfig={this.setModalConfig}
              setOpenModal={this.setOpenModal}
            ></RestoreSafeWidget>
          )}
        />

        <Route exact path="/" render={() => <Redirect to="/wallet" />} />
      </div>
    );
  }
}

export default withRouter(App);
