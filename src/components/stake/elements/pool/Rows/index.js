import React from "react";
import { RowItem } from "../RowItem";
import { roundValue, convertToETH } from "../../../../../utilities/helpers";

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
        t={"Daily reward forecast"}
        s={`${roundValue(token.estimated)} LOYAL`}
        isConnected={isConnected}
      />
      <RowItem
        c={"row-tvl"}
        t={"TVL"}
        s={`$${roundValue(token.tvl)}`}
        isConnected={isConnected}
      />
      <RowItem
        c={"row-stake"}
        t={"Available to stake"}
        s={convertToETH(token.stakeable, token.unit)}
        isConnected={isConnected}
      />
    </div>
  );
};

export default Row;
