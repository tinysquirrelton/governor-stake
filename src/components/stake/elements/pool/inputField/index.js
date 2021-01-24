import React from "react";

export const InputField = ({
  title,
  current,
  unit,
  onMax,
  onAction,
  onAction1,
  value,
  onChange,
  buttonTitle,
  isConnected,
  isApproved,
  isStake,
  subtitle,
}) => (
  <form onSubmit={(e) => e.preventDefault()} className="input-field">
    <div className="input-label">
      <span>{`${title}:`}</span>
      {` ${current !== null && isConnected ? current : "-"} ${unit}`}
    </div>
    <div className="input-container">
      <button className="max-btn" onClick={onMax} disabled={!isConnected}>
        Max
      </button>
      <div className="input">
        <input
          type="number"
          value={value}
          step={0.001}
          onChange={onChange}
          disabled={!isConnected}
        />
      </div>
    </div>
    {subtitle !== null && <div className={isStake ? "input-subtitle attention" : "input-subtitle"}>{subtitle}</div>}
    <div className="button-box">
      <button className={isStake ? "action-btn" : "hide"} onClick={onAction1}>Approve</button>
      <button
        className="action-btn"
        onClick={onAction}
        disabled={!isConnected}
      >{`${buttonTitle} ${unit}`}</button>
    </div>
  </form>
);
