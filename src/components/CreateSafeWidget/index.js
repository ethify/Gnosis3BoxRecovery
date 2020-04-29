import React from "react";
import "./create_safe_widget.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { useHistory } from "react-router-dom";
import Loader from "../Loader";
import { getAccount } from "../../services";
import Box from '3box';
import { getCPK } from '../../services';

function CreateSafeWidget(props) {
  let history = useHistory();
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    setLoading(false);
  }, []);

  const createNewSafe = async () => {
    const cpk = await getCPK();
    console.log("cpkkk", cpk);
    props.setCPK(cpk)
    history.push('/wallet/safe')
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
