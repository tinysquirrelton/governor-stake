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
    this.circulatingSupply = 0;
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
      // Calculate circulating supply
      await this.getLoyalLeft();
	  console.log(this.loyalLeft);
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
      }
      this.setState({ isConnected: isConnected });
    }
  }

  getToken = () => {
    return new Token(pool.address, pool.lpAddress, pool.name, pool.text, pool.unit, pool.logo);
  };

  getContract = (w3, address) => {
    return new w3.web3.eth.Contract(ERC20.abi, address);
  };

  getContractStake = (w3, address) => {
    return new w3.web3.eth.Contract(StakeABI.abi, address);
  };

  getCirculatingSupply = async () => {
    /*let totalSupply =
      (await this.gdaoContract.methods.totalSupply().call()) / 10 ** 18;
    let airdropUnclaimed =
      (await this.gdaoContract.methods.balanceOf(AirdropAddress).call()) /
      10 ** 18;
    let minesBalance =
      (await this.gdaoContract.methods.balanceOf(MinesAddress).call()) /
      10 ** 18;
    let airdropRewardBalance =
      (await this.gdaoContract.methods
        .balanceOf(AirdropRewardAddresss)
        .call()) /
      10 ** 18;
    let burnPurgatoryBalance =
      (await this.gdaoContract.methods.balanceOf(BurnPurgatoryAddress).call()) /
      10 ** 18;
    this.circulatingSupply = Number(
      (
        totalSupply -
        airdropUnclaimed -
        minesBalance -
        airdropRewardBalance -
        burnPurgatoryBalance
      ).toFixed(0)
    ).toLocaleString();*/
	let totalSupply =
      (await this.gdaoContract.methods.totalSupply().call()) / 10 ** 18;
    this.circulatingSupply = Number(
      (totalSupply).toFixed(0)
    ).toLocaleString();
  };

  getLoyalLeft = async () => {
	let loyalInPool =
      (await this.loyalContract.methods.balanceOf(stakeAddress).call()) / 10 ** 18;
    this.loyalLeft = Number(
      (loyalInPool).toFixed(0)
    ).toLocaleString();
  };

  setChanged = async (changeType) => {
    if (changeType === "DISCONNECTED") {
      this.tokens.forEach((token) => {
        token.stakeable = null;
        token.staked = null;
        token.rewards = null;
      });
      this.setState({ isConnected: false });
    } else if (changeType === "CHANGED_ACCOUNT") {
      const tasks = this.tokens.map(async (token) => {
        await token.getStakeable(this.w3);
        await token.getStaked(this.w3, this.stakeContract);
        await token.getPendingLOYAL(this.w3, this.stakeContract);
      });
      await Promise.all(tasks);
      this.setState({ isConnected: true });
    }
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
          circulatingSupply={this.circulatingSupply}
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
