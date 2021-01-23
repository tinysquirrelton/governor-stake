import BigNumber from "bignumber.js/bignumber";

import ERC20 from "./abi/ERC20.json";
import {
  testnet,
  USDCWETHAddress,
  GDAOAddress,
  stakeAddress,
} from "../../utilities/constants/constants";

export default class Token {
  constructor(address, name, text, unit, logo) {
    this.address = address;
    this.name = name;
    this.text = text;
    this.unit = unit;
    this.logo = logo;
    // Values below will be fetched
    this.contract = null;
    this.price = null;
    this.tvl = null;
    // Values below will be nullified on account change/disconnect
    this.depositable = null;
    this.deposited = null;
    this.rewards = null;
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

  async getDepositable(w3) {
    if (w3.isAddressValid() && w3.isAddressValid(this.address)) {
      let b = await this.contract.methods.balanceOf(w3.address).call();
      this.depositable = b;
    }
  }

  async getDeposited(w3, stakeContract) {
    if (w3.isAddressValid()) {
      let b = await stakeContract.methods.balanceOf(w3.address).call();
      this.deposited = b;
    }
  }

  async getPendingLOYAL(w3, stakeContract) {
    if (w3.isAddressValid()) {
      let b = await stakeContract.methods.earned(w3.address).call();
      this.rewards = await w3.getWeiToETH(b);
    }
  }
}
