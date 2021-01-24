import React, { Component } from "react";
import { toast } from "react-toastify";
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
      toDeposit: 0.0,
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

  onMaxDeposit = () => {
    let n = this.props.token.depositable;
    n = Math.floor(n / 10 ** 12) / 10 ** 6;
    this.setState({ toDeposit: n });
  };

  onMaxWithdraw = () => {
    let n = this.props.token.deposited;
    n = Math.floor(n / 10 ** 12) / 10 ** 6;
    this.setState({ toWithdraw: n });
  };

  onApprove = () => {
    const { w3, token, stakeContract } = this.props;
    let b = token.depositable * 2;
    let uB = this.onConvert(b / 10 ** 18);

    token.contract.methods
      .approve(stakeContract._address, uB)
      .send({ from: w3.address })
      .then((res) => {
        if (res.status === true) {
          toast.success("Successfully approved.");
          this.setState({ isApproved: true });
        }
      })
      .catch((err) => toast.error("Could not approve."));
  };

  onStakeExecute = () => {
    const { w3, token, stakeContract } = this.props;
    const tD = this.state.toDeposit;
    let d = this.onConvert(tD);

    stakeContract.methods
      .stake(d)
      .send({ from: w3.address })
      .then((res) => {
        toast.success("Successfully staked.");
        this.setState(() => ({
          toDeposit: 0.0,
        }));
      })
      .catch((err) => toast.error("Could not stake."));
  };

  onWithdrawExcecute = () => {
    const { w3, token, stakeContract } = this.props;
    const tW = this.state.toWithdraw;
    let w = this.onConvert(tW);

    stakeContract.methods
      .withdraw(w)
      .send({ from: w3.address })
      .then((res) => {
        toast.success("Successfully withdrawn.");
        this.setState(() => ({
          toWithdraw: 0.0,
        }));
      })
      .catch((err) => toast.error("Could not withdraw."));
  };

  onClaim = () => {
    const { w3, token, stakeContract } = this.props;
    stakeContract.methods
      .deposit(token.pid, 0)
      .send({ from: w3.address })
      .then((res) => {
        toast.success("Rewards claimed.");
        token.rewards = null;
        this.setState({});
      })
      .catch((err) => toast.error("Could not claim rewards."));
  };

  onDepositChange = (e) => {
    this.setState({ toDeposit: e.target.value });
  };

  onWithdrawChange = (e) => {
    this.setState({ toWithdraw: e.target.value });
  };

  render() {
    const { token, isConnected } = this.props;
    const { toDeposit, toWithdraw, isApproved } = this.state;

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
              t={`${token.unit} Deposited`}
              v={`${convertToETH(token.deposited, this.props.token.unit)} ${
                token.unit
              }`}
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
              title={"Your wallet"}
              current={convertToETH(token.depositable, this.props.token.unit)}
              unit={token.unit}
              onMax={this.onMaxDeposit}
              onAction={this.onStakeExecute}
              onAction1={this.onApprove}
              value={toDeposit}
              onChange={(e) => this.onDepositChange(e)}
              buttonTitle={"Deposit"}
              isConnected={isConnected}
              isApproved={isApproved}
              isDeposit={true}
              subtitle={"Stake GDAO"}
            />
            <InputField
              title={"Staked in contract"}
              current={convertToETH(token.deposited, this.props.token.unit)}
              unit={token.unit}
              onMax={this.onMaxWithdraw}
              onAction={this.onWithdrawExcecute}
              value={toWithdraw}
              onChange={(e) => this.onWithdrawChange(e)}
              buttonTitle={"Withdraw"}
              isConnected={isConnected}
              isDeposit={false}
              subtitle={"Withdraw and claim rewards"}
            />
          </div>
          <div className="claims">
            <div className="title">Available rewards:</div>
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
