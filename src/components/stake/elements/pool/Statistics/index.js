import React from "react";

export const Statistics = ({ t, v, isConnected }) => (
  <div className="stats">
    <div className="title">{t}:</div>
    <div className="value">
      {v === null ||
      v === "undefined" ||
      v === "$null" ||
      v === "null%" ||
      v === "$Infinity" ||
      v === "Infinity%" ||
      !isConnected
        ? "-"
        : v}
    </div>
  </div>
);
