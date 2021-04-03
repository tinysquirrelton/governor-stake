import React from "react";
import { RowItem } from "../RowItem";

import "./style.scss";

const Row = (props) => {
  const { token } = props;

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
    </div>
  );
};

export default Row;
