import React from "react";
import "./create_safe_widget.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { useHistory } from "react-router-dom";
import Loader from "../Loader";

function CreateSafeWidget(props) {
  let history = useHistory();
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    setLoading(false);
  }, []);

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
                onClick={(e) => {
                  history.push("/safe");
                }}
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

export default CreateSafeWidget;
