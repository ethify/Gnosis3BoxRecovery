import React from "react";
import "./create_safe_widget.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { useHistory } from "react-router-dom";
import Loader from "../Loader";
import { getAccount } from "../../services";
import Box from '3box';

function CreateSafeWidget(props) {
  let history = useHistory();
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    setLoading(false);
  }, []);

  const createNewSafe = async () => {
    try {
      if (!props.address) {
        console.log("Create", props.address)
        const address = await getAccount()
        props.setAddress(address)
      }
      history.push('/wallet/safe')
    } catch (err) {
      console.log(err)
    }
  }

  const getConsent = async ({ type, origin, spaces }) => {
    // For testing purposes a function that just returns
    // true can be used. In prodicution systems the user
    // should be prompted for input.
    return true
  }

  const testFunction = async () => {
    console.log(Box.idUtils)
    console.log('COnfig', await Box.getConfig('0x5aA7EBf9aBFbf5a89DA80e0af428fB1d1FCF1b56'));
    //const provider = await Box.get3idConnectProvider() // recomended provider
    console.log('web3shit', window.web3)
    const box = await Box.openBox(window.web3.currentProvider.selectedAddress, window.web3.currentProvider)
    console.log('box', box);

    const isSynced = await box.syncDone
    console.log('isSynced', isSynced);
    const space = await box.openSpace('myApp')
    console.log('spcasd', space);

    console.log('In if')
    console.log('lists', await box.listAddressLinks())
    // console.log('boxauthmethod', await box.addAuthMethod('0x4f3edf983ac636a65a842ce7c78d9aa706d3b113bce9c46f30d7d21715b23b1d') )
    // const authSecret = '0x4f3edf983ac636a65a842ce7c78d9aa706d3b113bce9c46f30d7d21715b23b1d' // a hex encoded secret
    // const idWallet = new IdentityWallet(getConsent, { authSecret })
    // console.log(idWallet);
    // const authLog = await idWallet.authenticate(['space1'], {authSecret})
    // console.log('authLog', authLog);

    // const threeIdProvider = idWallet.get3idProvider()
    // const box = await Box.openBox(null, threeIdProvider)
    // console.log('box', box);


    // const log = await idWallet.addAuthMethod(authSecret)
    // console.log('log',log);

    // const linkk = await idWallet.linkAddress('0x5aA7EBf9aBFbf5a89DA80e0af428fB1d1FCF1b56', window.web3)
    // console.log(linkk);
  }

  return (
    <div className="create-safe-widget">
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
                <h2 className="create-safe-title">Welcome to Gnosis Safe</h2>
                <button
                  type="button"
                  className="create-button"
                  onClick={createNewSafe}
                >
                  <FontAwesomeIcon icon={faPlus} />
                  <span>Create new Safe</span>
                </button>
                {/* <button
                type="button"
                className="create-button"
                onClick={testFunction}
              >
                <FontAwesomeIcon icon={faPlus} />
                <span>Testing</span>
              </button> */}
              </div>
            </div>
          )}
      </div>
    </div>
  );
}

export default CreateSafeWidget;
