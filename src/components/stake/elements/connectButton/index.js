import React from "react";
import "./style.scss";

export const ConnectButton = ({ w3, updateState }) => {
  const action = () => {
    if (!w3.isConnected && !w3.isAddressValid()) {
      w3.setConnection(updateState);
    }
  };

  return (
    <button className="connect-button" onClick={action}>
      {w3.isConnected && w3.isAddressValid()
        ? `Connected: ${w3.address.slice(0, 3)}...${w3.address.slice(-4)}`
        : "Connect wallet"}
    </button>
  );
};
