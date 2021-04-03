import React from "react";
import "./style.scss";

const Box = (props) => {
  const { token } = props;

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
    </>
  );
};

export default Box;
