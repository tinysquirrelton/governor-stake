import React from "react";
import "./style.scss";

export const ConnectButton = ({ account, setConnection }) => {
  let title;
  if (account !== null && account?.length == 42) {
    let pt1 = account.slice(0, 3);
    let pt2 = account.slice(-4);
    title = `Connected: ${pt1}...${pt2}`;
  } else {
    title = "Connect wallet";
  }
  return (
    <button className="connect-button" onClick={setConnection}>
      {title}
    </button>
  );
};
