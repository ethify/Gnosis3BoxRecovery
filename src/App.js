import React from "react";
import "./App.scss";
import Header from "./components/Header";
import { withRouter } from "react-router";
import Modal from "./components/Modal";
import CreateSafeWidget from "./components/CreateSafeWidget";
import SafeDetailsWidget from "./components/SafeDetailsWidget";

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

      window.ethereum.on("networkChanged", async (changedChainId) => {});
    }
  };

  componentDidMount() {
    this.routeAction();
  }

  routeAction = () => {
    this.props.history.listen((location, action) => {
      const page = location.pathname.split("/");
      // console.log(page[page.length - 1]);
      this.setState({ page: page[page.length - 1] });
    });
    this.props.history.push("/wallet");
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
        {this.state.page === "wallet" ? <CreateSafeWidget /> : null}
        {this.state.page === "safe" ? (
          <SafeDetailsWidget
            address={"0x5d2629a9E885C5F0D558d6fE28A1f856ABdBDD54"}
          />
        ) : null}
      </div>
    );
  }
}

export default withRouter(App);
