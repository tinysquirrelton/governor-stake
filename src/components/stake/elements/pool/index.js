import React, { Component } from "react";
import { toast } from "react-toastify";
import BigNumber from "bignumber.js/bignumber";

import Box from "./Boxes";
import Row from "./Rows";
import { InputField } from "./inputField";
import { Statistics } from "./Statistics";
import { roundValue, convertToETH } from "../../../../utilities/helpers";

export default class Pool extends Component {
  constructor(props) {
    super(props);
    this.token = null;
    this.state = {
      isSmall: null,
      toStake: 0.0,
      toWithdraw: 0.0,
      isApproved: false,
    };
  }

  componentDidMount() {
    window.addEventListener("resize", this.onResize.bind(this));
    this.onResize();
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.onResize());
  }

  onResize = () => {
    this.setState({
      isSmall: window.innerWidth < 768,
    });
  };

  onConvert = (n) => {
    return this.props.w3.web3.utils.toWei(n.toString());
  };

  onMaxStake = () => {
    let n = this.props.token.stakeable;
    n = Math.floor(n / 10 ** 12) / 10 ** 6;
    this.setState({ toStake: n });
  };

  onMaxWithdraw = () => {
    let n = this.props.token.staked;
    n = Math.floor(n / 10 ** 12) / 10 ** 6;
    this.setState({ toWithdraw: n });
  };

  onApprove = () => {
    const { w3, token, stakeContract } = this.props;
    let b = token.stakeable * 4;
    let uB = this.onConvert(b / 10 ** 18);

    token.contract.methods
      .approve(stakeContract._address, uB)
      .send({ from: w3.address })
      .then((res) => {
        if (res.status === true) {
          token.getApprovedAmount(w3, token.stakeAddress);
          toast.success("Successfully Approved.");
          this.setState({ isApproved: true });
        }
      })
      .catch((err) => toast.error("Failed to Approve."));
  };

  onStakeExecute = () => {
    const { w3, stakeContract } = this.props;
    const tD = this.state.toStake;
    let d = this.onConvert(tD);

    stakeContract.methods
      .stake(d)
      .send({ from: w3.address })
      .then((res) => {
        toast.success("Successfully Staked.");
        this.props.getTokenValues();
        this.setState(() => ({
          toStake: 0.0,
        }));
      })
      .catch((err) => toast.error("Failed to Stake."));
  };

  onWithdrawExcecute = () => {
    const { w3, token, stakeContract } = this.props;
    const tW = this.state.toWithdraw;
    let w = this.onConvert(tW);

    stakeContract.methods
      .withdraw(w)
      .send({ from: w3.address })
      .then((res) => {
        toast.success("Successfully Withdrawn.");
        toast.success("Successfully Claimed.");
        token.rewards = null;
        this.props.getTokenValues();
        this.setState(() => ({
          toWithdraw: 0.0,
        }));
      })
      .catch((err) => toast.error("Failed to Withdraw."));
  };

  onClaim = () => {
    const { w3, token, stakeContract } = this.props;
    stakeContract.methods
      .getReward()
      .send({ from: w3.address })
      .then((res) => {
        toast.success("Successfully Claimed.");
        token.rewards = null;

        this.setState({});
      })
      .catch((err) => toast.error("Failed to Claim."));
  };

  onStakeChange = (e) => {
    let stakable = BigNumber(
      convertToETH(this.props.token.stakeable, this.props.token.unit)
    ).toNumber();

    let toStake =
      BigNumber(e.target.value).toNumber() > stakable
        ? stakable
        : BigNumber(e.target.value).toNumber();

    this.setState({
      toStake: isNaN(toStake) ? "" : toStake,
    });
  };

  onWithdrawChange = (e) => {
    let staked = BigNumber(
      convertToETH(this.props.token.staked, this.props.token.unit)
    ).toNumber();

    let toWithdraw =
      BigNumber(e.target.value).toNumber() > staked
        ? staked
        : BigNumber(e.target.value).toNumber();

    this.setState({ toWithdraw: isNaN(toWithdraw) ? "" : toWithdraw });
  };

  render() {
    const { token, isConnected } = this.props;
    const { toStake, toWithdraw } = this.state;

    const approved = this.props.w3?.web3?.utils.fromWei(
      token.approved.toString()
    );
    const currApproved = approved !== undefined ? approved : "-";

    return (
      <div className={`stake-${this.state.isSmall ? "box" : "row"}-container`}>
        {this.state.isSmall ? (
          <Box token={token} isConnected={isConnected} />
        ) : (
          <Row token={token} isConnected={isConnected} />
        )}
        <div className="expanded">
          <div className="statistics">
            <div className="title">Statistics:</div>
            <Statistics
              t={`${token.unit} Staked`}
              v={`${convertToETH(token.staked, token.unit)} ${token.unit}`}
              isConnected={isConnected}
            />
            <Statistics
              t={"Claimable Rewards"}
              v={`${roundValue(token.rewards)} LOYAL`}
              isConnected={isConnected}
            />
          </div>
          <div className="fields">
            <InputField
              title={"Wallet Balance"}
              current={convertToETH(token.stakeable, token.unit)}
              unit={token.unit}
              onMax={this.onMaxStake}
              onAction={this.onStakeExecute}
              onAction1={this.onApprove}
              value={toStake}
              onChange={(e) => this.onStakeChange(e)}
              buttonTitle={"Stake"}
              isConnected={isConnected}
              isStake={true}
              valueApproved={token.approved}
              subtitle={"Approved: " + currApproved}
              subtitleAltStyle={true}
            />
            <InputField
              title={"Staked Amount"}
              current={convertToETH(token.staked, token.unit)}
              unit={token.unit}
              onMax={this.onMaxWithdraw}
              onAction={this.onWithdrawExcecute}
              value={toWithdraw}
              onChange={(e) => this.onWithdrawChange(e)}
              buttonTitle={"Withdraw"}
              isConnected={isConnected}
              isStake={false}
              subtitle={""}
            />
          </div>
          <div className="claims">
            <div className="title">Available Rewards:</div>
            <div className="value">{`${
              isConnected ? roundValue(token.rewards) : "-"
            } LOYAL`}</div>
            <button
              className="claim-btn"
              onClick={this.onClaim}
              disabled={!isConnected}
            >
              Claim Rewards
            </button>
          </div>
        </div>
      </div>
    );
  }
}
