import React, { Component } from "react";
import Routes from "./routes";
import { ToastContainer } from "react-toastify";
import { X } from "react-feather";
import Token from "./data/token/class";
import { pool } from "./utilities/constants/constants";
import ERC20 from "./data/token/abi/ERC20.json";
import StakeABI from "./data/token/abi/StakeABI.json";
import BigNumber from "bignumber.js/bignumber";

import WalletConnect from "./governor-common/components/walletconnect/WalletConnect";

import {
  wETHAddress,
  USDCAddress,
  stakeAddress,
  GDAOAddress, // stakingToken
  LOYALAddress,
} from "./utilities/constants/constants";

const Close = ({ closeToast }) => <X size={20} onClick={closeToast} />;
BigNumber.config({ DECIMAL_PLACES: 4 });

export default class App extends Component {
  constructor(props) {
    super(props);
    this.token = this.getToken();
    this.wethContract = null;
    this.usdcContract = null;
    this.stakeContract = null;
    this.state = {
      loyalLeft: 0,
    };

    this.walletconnect = null;
    this.web3 = null;
  }

  async componentDidMount() {
    this.walletconnect = await new WalletConnect(
      this.onConnect,
      this.onResetConnect
    );
    await this.walletconnect.connectWeb3();
    this.web3 = await this.walletconnect.getWeb3();

    this.getMineStats();
    let self = this;
    this.statsInterval = setInterval(function () {
      self.getMineStats();
    }, 5000);
  }

  onConnect = async (web3) => {
    const cAddresses = [
      wETHAddress,
      USDCAddress,
      GDAOAddress,
      LOYALAddress,
      stakeAddress,
    ];

    const [wethC, ussdcC, gdaoC, loyalC, stakeC] = await Promise.all(
      cAddresses.map(async (c) => {
        let contract;
        if (c !== stakeAddress) {
          contract = await this.getContract(web3, c);
        } else {
          contract = await this.getContractStake(web3, c);
        }
        return contract;
      })
    );

    this.wethContract = wethC;
    this.usdcContract = ussdcC;
    this.gdaoContract = gdaoC;
    this.loyalContract = loyalC;
    this.stakeContract = await stakeC;
    await this.getLoyalLeft();
  };

  onResetConnect = () => {
    this.token.stakeable = null;
    this.token.staked = null;
    this.token.rewards = null;
    this.setState({});
  };

  getMineStats = async () => {
    if (
      this.web3 != null &&
      this.walletconnect?.account != null &&
      this.web3?.utils.isAddress(this.walletconnect?.account)
    ) {
      await this.token.getContract(this.web3);
      await this.token.getPrice(
        this.web3,
        this.wethContract,
        this.usdcContract
      );
      await this.token.getTVL(this.web3);
      if (this.walletconnect?.isConnected && this.stakeContract !== null) {
        let account = this.walletconnect?.account;
        await this.token.getStakeable(this.web3, account);
        await this.token.getStaked(this.web3, this.stakeContract, account);
        await this.token.getPendingLOYAL(
          this.web3,
          this.stakeContract,
          account
        );
        await this.token.getEstimatedDailyLOYAL(
          this.web3,
          this.stakeContract,
          account
        );
        await this.token.getApprovedAmount(this.web3, stakeAddress, account);
      }
    }
    this.setState({});
  };

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

  getContract = (web3, address) => {
    return new web3.eth.Contract(ERC20.abi, address);
  };

  getContractStake = (web3, address) => {
    return new web3.eth.Contract(StakeABI.abi, address);
  };

  getLoyalLeft = async () => {
    let rewardRate = await this.stakeContract.methods.rewardRate().call();
    rewardRate = BigNumber(
      await this.web3.utils.fromWei(rewardRate, "ether")
    ).toNumber();

    let timeRemainingInPeriod = await this.stakeContract.methods
      .timeRemainingInPeriod()
      .call();

    let loyalInPool = rewardRate * (parseInt(timeRemainingInPeriod) - 111379);

    if (loyalInPool < 0) {
      loyalInPool = 0;
    }
    this.setState({
      loyalLeft: Number(loyalInPool.toFixed(2)).toLocaleString(),
    });
  };

  getTokenValues = async () => {
    await this.token.getStakeable(this.web3);
    await this.token.getStaked(this.web3, this.stakeContract);
    await this.token.getPendingLOYAL(this.web3, this.stakeContract);
    await this.token.getEstimatedDailyLOYAL(this.web3, this.stakeContract);
    await this.token.getApprovedAmount(this.web3, stakeAddress);
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
          w3={this.web3}
          token={this.token}
          getTokenValues={this.getTokenValues}
          loyalLeft={this.state.loyalLeft}
          stakeContract={this.stakeContract}
          walletconnect={this.walletconnect}
        />
      </>
    );
  }
}
