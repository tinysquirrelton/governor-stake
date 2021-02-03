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

  async getContract(w3) {
    if (w3.isAddressValid(this.address)) {
      this.contract = await new w3.web3.eth.Contract(ERC20.abi, this.address);
    }
  }

  async getPrice(w3, wethContract, usdcContract) {
    if (w3.isAddressValid(this.lpAddress)) {
      let w = await wethContract.methods.balanceOf(this.lpAddress).call();
      let wB = await w3.getWeiToETH(w);

      let x = await this.contract.methods.balanceOf(this.lpAddress).call();
      let xB = await w3.getWeiToETH(x);
      let p = wB / xB; // Price in ETH
	  
      if (testnet) {
	    if(parseInt(x) === 0) {
		  p = 0.00023927;
	    }
        this.price = p * 1250;
      } else {
        let i = await wethContract.methods.balanceOf(USDCWETHAddress).call();
        let iB = await w3.getWeiToETH(i);
        let j = BigNumber(
          await usdcContract.methods.balanceOf(USDCWETHAddress).call()
        ).toNumber();
        let jB = j / 10 ** 6;
        let ijP = jB / iB; // Price of WETH in USDC
        this.price = p * ijP; // Price of Token in USDC
      }
    }
  }

  async getGDAOPrice(w3, wethContract, usdcContract) {
    let w = await wethContract.methods.balanceOf(GDAOAddress).call();
    let wB = await w3.getWeiToETH(w);

    let GDAOContract = await new w3.web3.eth.Contract(ERC20.abi, GDAOAddress);
    let g = await GDAOContract.methods.balanceOf(GDAOAddress).call();
    let gB = await w3.getWeiToETH(g);
    let p = wB / gB; // Price in ETH
	
    if (testnet) {
      return p * 650;
    } else {
      let i = await wethContract.methods.balanceOf(USDCWETHAddress).call();
      let iB = await w3.getWeiToETH(i);
      let j = BigNumber(
        await usdcContract.methods.balanceOf(USDCWETHAddress).call()
      ).toNumber();
      let jB = j / 10 ** 6;
      let ijP = jB / iB; // Price of WETH in USDC
      let price = p * ijP; // Price of Token in USDC
      return price;
    }
  }

  async getTVL(w3) {
    if (w3.isAddressValid(this.address)) {
      let b = await this.contract.methods.balanceOf(stakeAddress).call();
      let bB = await w3.getWeiToETH(b);
      this.tvl = bB * this.price;
    }
  }

  async getStakeable(w3) {
    if (w3.isAddressValid() && w3.isAddressValid(this.address)) {
      let b = await this.contract.methods.balanceOf(w3.address).call();
      this.stakeable = b;
    }
  }

  async getStaked(w3, stakeContract) {
    if (w3.isAddressValid()) {
      let b = await stakeContract.methods.balanceOf(w3.address).call();
      this.staked = b;
    }
  }

  async getPendingLOYAL(w3, stakeContract) {
    if (w3.isAddressValid()) {
      let b = await stakeContract.methods
      .earned(w3.address)
      .call();
      this.rewards = await w3.getWeiToETHString(b);
    }
  }

  async getEstimatedDailyLOYAL(w3, stakeContract) {
    if (w3.isAddressValid()) {
      let rewardRate = await stakeContract.methods.rewardRate().call();
      let userStaked = await stakeContract.methods.balanceOf(w3.address).call();
      let totalStaked = await this.contract.methods.balanceOf(stakeAddress).call();
      userStaked = await w3.getWeiToETH(userStaked);
      totalStaked = await w3.getWeiToETH(totalStaked);
      rewardRate = await w3.getWeiToETH(rewardRate);
      let e = new BigNumber(userStaked / totalStaked * rewardRate * 60 * 60 * 24);
	  if(parseInt(totalStaked) === 0) {
		this.estimated = 0;
	  } else {
		this.estimated = e.toString(10);
	  }
    }
  }

  async getApprovedAmount(w3, stakeAddress) {
    if (w3.isAddressValid()) {
	  let GDAOContract = await new w3.web3.eth.Contract(ERC20.abi, GDAOAddress);
	  let allowance = await GDAOContract.methods.allowance(w3.address, stakeAddress).call();
	  this.approved = allowance;
    }
  }
}
