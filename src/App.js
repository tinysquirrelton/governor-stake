import React, { Component } from "react";
import Routes from "./routes";
import { ToastContainer } from "react-toastify";
import { X } from "react-feather";
import W3C from "./data/web3/class";
import Token from "./data/token/class";
import { pool } from "./utilities/constants/constants";
import ERC20 from "./data/token/abi/ERC20.json";
import StakeABI from "./data/token/abi/StakeABI.json";

import {
  wETHAddress,
  USDCAddress,
  stakeAddress,
  GDAOAddress, // stakingToken
  LOYALAddress,
  testnet,
} from "./utilities/constants/constants";

const Close = ({ closeToast }) => <X size={20} onClick={closeToast} />;

export default class App extends Component {
  constructor(props) {
    super(props);
    this.w3 = new W3C();
    this.token = this.getToken();
    this.wethContract = null;
    this.usdcContract = null;
    this.stakeContract = null;
    this.loyalLeft = 0;
    this.state = { isConnected: false };
  }

  async componentDidMount() {
    let chainId;

    // Init Web3
    const isConnected = await this.w3.setConnection();
    this.w3.onAccountChange(this.setChanged);
    this.w3.onNetworkChange();

    // Get contracts to derive from
    if (this.w3.web3 !== null) {
      this.wethContract = this.getContract(this.w3, wETHAddress);
      this.usdcContract = this.getContract(this.w3, USDCAddress);
      this.gdaoContract = this.getContract(this.w3, GDAOAddress);
      this.loyalContract = this.getContract(this.w3, LOYALAddress);
      this.stakeContract = this.getContractStake(this.w3, stakeAddress);
      // Init Token Contracts if Mainnet or Test-mode enabled
      chainId = await this.w3.web3.eth.getChainId();
      await this.getLoyalLeft();
    }

    if (
      chainId === 1 ||
      (testnet && this.wethContract !== null && this.usdcContract !== null)
    ) {
      await this.token.getContract(this.w3);
      await this.token.getPrice(this.w3, this.wethContract, this.usdcContract);
      await this.token.getTVL(this.w3);
      if (isConnected && this.stakeContract !== null) {
        await this.token.getStakeable(this.w3);
        await this.token.getStaked(this.w3, this.stakeContract);
        await this.token.getPendingLOYAL(this.w3, this.stakeContract);
        await this.token.getEstimatedDailyLOYAL(this.w3, this.stakeContract);
        await this.token.getApprovedAmount(this.w3, stakeAddress);
      }
      this.setState({ isConnected: isConnected });
    }
  }

  getToken = () => {
    return new Token(
      pool.address,
      pool.lpAddress,
      pool.name,
      pool.text,
      pool.unit,
      pool.logo
    );
  };

  getContract = (w3, address) => {
    return new w3.web3.eth.Contract(ERC20.abi, address);
  };

  getContractStake = (w3, address) => {
    return new w3.web3.eth.Contract(StakeABI.abi, address);
  };

  getLoyalLeft = async () => {
    let rewardRate = await this.stakeContract.methods.rewardRate().call();
    rewardRate = await this.w3.getWeiToETH(rewardRate);
    let timeRemainingInPeriod = await this.stakeContract.methods
      .timeRemainingInPeriod()
      .call();

    let loyalInPool = rewardRate * (parseInt(timeRemainingInPeriod) - 111379);

    if (loyalInPool < 0) {
      loyalInPool = 0;
    }

    this.loyalLeft = Number(loyalInPool.toFixed(2)).toLocaleString();
  };

  setChanged = async (changeType) => {
    if (changeType === "DISCONNECTED") {
      this.token.stakeable = null;
      this.token.staked = null;
      this.token.rewards = null;
      this.setState({ isConnected: false });
    } else if (changeType === "CHANGED_ACCOUNT") {
      await this.token.getStakeable(this.w3);
      await this.token.getStaked(this.w3, this.stakeContract);
      await this.token.getPendingLOYAL(this.w3, this.stakeContract);
      await this.token.getEstimatedDailyLOYAL(this.w3, this.stakeContract);
      await this.token.getApprovedAmount(this.w3, stakeAddress);
      this.setState({ isConnected: true });
    }
  };

  getTokenValues = async () => {
    await this.token.getStakeable(this.w3);
    await this.token.getStaked(this.w3, this.stakeContract);
    await this.token.getPendingLOYAL(this.w3, this.stakeContract);
    await this.token.getEstimatedDailyLOYAL(this.w3, this.stakeContract);
    await this.token.getApprovedAmount(this.w3, stakeAddress);
    this.setState({});
  };

  render() {
    return (
      <>
        <ToastContainer
          position={"bottom-right"}
          autoClose={3000}
          closeButton={<Close />}
          pauseOnFocusLoss={false}
          draggable={true}
          draggablePercent={25}
        />
        <Routes
          w3={this.w3}
          token={this.token}
          getTokenValues={this.getTokenValues}
          loyalLeft={this.loyalLeft}
          stakeContract={this.stakeContract}
          isConnected={this.state.isConnected}
          isSmall={this.state.isSmall}
          isMedium={this.state.isMedium}
          isLarge={this.state.isLarge}
        />
      </>
    );
  }
}
