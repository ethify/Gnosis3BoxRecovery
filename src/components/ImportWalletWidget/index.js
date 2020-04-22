import React from "react";
import "./import_wallet_widget.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronRight, faPlus } from "@fortawesome/free-solid-svg-icons";
import { useHistory } from "react-router-dom";
import Loader from "../Loader";

function ImportWalletWidget(props) {
  let history = useHistory();
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    setLoading(false);
  }, []);

  return (
    <div className="receipt-widget">
      <div className="widget-main-container">
        {loading ? <Loader loaderType="box" /> : <div></div>}
      </div>
    </div>
  );
}

export default ImportWalletWidget;
