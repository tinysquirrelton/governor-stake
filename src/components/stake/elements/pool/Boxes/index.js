import React from "react";
import { Statistics } from "../Statistics";
import { roundValue } from "../../../../../utilities/helpers";
import "./style.scss";

const Box = (props) => {
  const { token, isConnected } = props;

  return (
    <>
      <div className="upper">
        <div className="box-logo">
          <img src={token.logo} alt="" draggable={false} />
        </div>
        <div className="box-name">
          <div className="title">{token.name}</div>
          <div className="subtitle">{token.text}</div>
        </div>
      </div>
      <div className="lower">
        <Statistics
          t={"APY"}
          v={`${roundValue(token.apy)}%`}
          isConnected={isConnected}
        />
        <Statistics
          t={"TVL"}
          v={`$${roundValue(token.tvl)}`}
          isConnected={isConnected}
        />
      </div>
    </>
  );
};

export default Box;
