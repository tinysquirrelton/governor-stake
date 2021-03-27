import React from "react";
import { RowItem } from "../RowItem";
import { roundValue } from "../../../../../utilities/helpers";

import "./style.scss";

const Row = (props) => {
  const { token, isConnected } = props;

  return (
    <div className="content">
      <div className="row-logo">
        <img src={token.logo} alt="" draggable={false} />
      </div>
      <RowItem
        c={"row-name"}
        t={token.name}
        s={token.text}
        isConnected={true}
      />
      <RowItem
        c={"row-apy"}
        t={"Daily Rewards"}
        s={`${roundValue(token.estimated)} LOYAL`}
        isConnected={isConnected}
      />
    </div>
  );
};

export default Row;
