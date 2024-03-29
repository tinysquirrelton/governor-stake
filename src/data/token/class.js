import BigNumber from "bignumber.js/bignumber";

import ERC20 from "./abi/ERC20.json";
import {
  testnet,
  USDCWETHAddress,
  GDAOAddress,
  stakeAddress,
} from "../../utilities/constants/constants";

export default class Token {
  constructor(address, lpAddress, name, text, unit, logo) {
    this.address = address;
    this.lpAddress = lpAddress;
    this.name = name;
    this.text = text;
    this.unit = unit;
    this.logo = logo;
    // Values below will be fetched
    this.contract = null;
    this.price = null;
    this.tvl = null;
    // Values below will be nullified on account change/disconnect
    this.stakeable = null;
    this.staked = null;
    this.rewards = null;
    this.estimated = null;
    this.approved = 0;
  }

  async getContract(web3) {
    if (web3?.utils.isAddress(this.address)) {
      this.contract = await new web3.eth.Contract(ERC20.abi, this.address);
    }
  }

  getWeiToETH(web3, balance) {
    return BigNumber(web3.utils.fromWei(balance, "ether")).toNumber();
  }

  getWeiToETHString(web3, balance) {
    return BigNumber(web3.utils.fromWei(balance, "ether")).toString(10);
  }

  async getPrice(web3, wethContract, usdcContract) {
    if (web3?.utils.isAddress(this.lpAddress)) {
      let w = await wethContract.methods.balanceOf(this.lpAddress).call();
      let wB = await this.getWeiToETH(web3, w);

      let x = await this.contract.methods.balanceOf(this.lpAddress).call();
      let xB = await this.getWeiToETH(web3, x);
      let p = wB / xB; // Price in ETH

      if (testnet) {
        if (parseInt(x) === 0) {
          p = 0.00023927;
        }
        this.price = p * 1250;
      } else {
        let i = await wethContract.methods.balanceOf(USDCWETHAddress).call();
        let iB = await this.getWeiToETH(web3, i);
        let j = BigNumber(
          await usdcContract.methods.balanceOf(USDCWETHAddress).call()
        ).toNumber();
        let jB = j / 10 ** 6;
        let ijP = jB / iB; // Price of WETH in USDC
        this.price = p * ijP; // Price of Token in USDC
      }
    }
  }

  async getGDAOPrice(web3, wethContract, usdcContract) {
    let w = await wethContract.methods.balanceOf(GDAOAddress).call();
    let wB = await this.getWeiToETH(web3, w);

    let GDAOContract = await new web3.eth.Contract(ERC20.abi, GDAOAddress);
    let g = await GDAOContract.methods.balanceOf(GDAOAddress).call();
    let gB = await this.getWeiToETH(web3, g);
    let p = wB / gB; // Price in ETH

    if (testnet) {
      return p * 650;
    } else {
      let i = await wethContract.methods.balanceOf(USDCWETHAddress).call();
      let iB = await this.getWeiToETH(web3, i);
      let j = BigNumber(
        await usdcContract.methods.balanceOf(USDCWETHAddress).call()
      ).toNumber();
      let jB = j / 10 ** 6;
      let ijP = jB / iB; // Price of WETH in USDC
      let price = p * ijP; // Price of Token in USDC
      return price;
    }
  }

  async getTVL(web3) {
    if (web3 != null && web3?.utils.isAddress(this.address)) {
      let b = await this.contract.methods.balanceOf(stakeAddress).call();
      let bB = await web3?.utils.fromWei(b, "ether");
      this.tvl = bB * this.price;
    }
  }

  async getStakeable(web3, account) {
    if (web3?.utils.isAddress(account) && web3?.utils.isAddress(this.address)) {
      let b = await this.contract.methods.balanceOf(account).call();
      this.stakeable = b;
    }
  }

  async getStaked(web3, stakeContract, account) {
    if (web3?.utils.isAddress(account)) {
      let b = await stakeContract.methods.balanceOf(account).call();
      this.staked = b;
    }
  }

  async getPendingLOYAL(web3, stakeContract, account) {
    if (web3?.utils.isAddress(account)) {
      let b = await stakeContract.methods.earned(account).call();
      this.rewards = await this.getWeiToETHString(web3, b);
    }
  }

  async getEstimatedDailyLOYAL(web3, stakeContract, account) {
    if (web3?.utils.isAddress(account)) {
      let rewardRate = await stakeContract.methods.rewardRate().call();
      let userStaked = await stakeContract.methods.balanceOf(account).call();
      let totalStaked = await this.contract.methods
        .balanceOf(stakeAddress)
        .call();
      userStaked = await this.getWeiToETH(web3, userStaked);
      totalStaked = await this.getWeiToETH(web3, totalStaked);
      rewardRate = await this.getWeiToETH(web3, rewardRate);
      let e = new BigNumber(
        (userStaked / totalStaked) * rewardRate * 60 * 60 * 24
      );
      if (parseInt(totalStaked) === 0) {
        this.estimated = 0;
      } else {
        this.estimated = e.toString(10);
      }
    }
  }

  async getApprovedAmount(web3, stakeAddress, account) {
    if (web3?.utils.isAddress(account)) {
      let GDAOContract = await new web3.eth.Contract(ERC20.abi, GDAOAddress);
      let allowance = await GDAOContract.methods
        .allowance(account, stakeAddress)
        .call();
      this.approved = allowance;
    }
  }
}
