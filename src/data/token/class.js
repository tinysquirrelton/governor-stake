import BigNumber from "bignumber.js/bignumber";

import ERC20 from "./abi/ERC20.json";
import {
  testnet,
  USDCWETHAddress,
  GDAOAddress,
  GDAOWETHLPAddress,
  stakeAddress,
} from "../../utilities/constants/constants";

export default class Token {
  constructor(address, lpAddress, name, text, unit, logo, pid) {
    this.address = address;
    this.lpAddress = lpAddress;
    this.name = name;
    this.text = text;
    this.unit = unit;
    this.logo = logo;
    this.pid = pid;
    // Values below will be fetched
    this.contract = null;
    this.lpContract = null;
    this.price = null;
    this.apy = null;
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

  async getLPContract(w3) {
    if (w3.isAddressValid(this.lpAddress)) {
      this.lpContract = await new w3.web3.eth.Contract(
        ERC20.abi,
        this.lpAddress
      );
    }
  }

  async getPrice(w3, wethContract, usdcContract) {
    if (w3.isAddressValid(this.lpAddress)) {
      let p;
      let xB;
      let w = await wethContract.methods.balanceOf(this.lpAddress).call();
      let wB = await w3.getWeiToETH(w);

      if (this.name === "GDAO / ETH") {
        let wB2x = wB * 2; // 2x number of WETH in (GDAO-WETH)
        let tS = await this.lpContract.methods.totalSupply().call(); // Total Supply of (GDAO-WETH)
        let tSB = await w3.getWeiToETH(tS);
        p = wB2x / tSB; // Price in ETH
      } else {
        let x = await this.contract.methods.balanceOf(this.lpAddress).call();
        if (["USDC", "WBTC"].includes(this.name)) {
          x = BigNumber(x).toNumber();
        }
        if (this.name === "USDC") {
          xB = x / 10 ** 6;
        } else if (this.name === "WBTC") {
          xB = x / 10 ** 8;
        } else {
          xB = await w3.getWeiToETH(x);
        }
        p = wB / xB; // Price in ETH
      }

      if (testnet) {
        this.price = p * 650;
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

  async getAPY(w3, wethContract, usdcContract) {
    if (w3.isAddressValid(this.address)) {
      let bB;
      const gdaoPrice = await this.getGDAOPrice(w3, wethContract, usdcContract);
      const xBy = this.name === "GDAO / ETH" ? 400000 : 100000;
      let b = await this.contract.methods.balanceOf(stakeAddress).call();

      if (("USDC", "WBTC".includes(this.name))) {
        b = BigNumber(b).toNumber();
      }
      if (this.name === "USDC") {
        bB = b / 10 ** 6;
      } else if (this.name === "WBTC") {
        bB = b / 10 ** 8;
      } else {
        bB = await w3.getWeiToETH(b);
      }

      let n = gdaoPrice * xBy;
      let d = this.price * bB;
      this.apy = (n / d) * 2 * 100;
    }
  }

  async getGDAOPrice(w3, wethContract, usdcContract) {
    let w = await wethContract.methods.balanceOf(GDAOWETHLPAddress).call();
    let wB = await w3.getWeiToETH(w);

    let GDAOContract = await new w3.web3.eth.Contract(ERC20.abi, GDAOAddress);
    let g = await GDAOContract.methods.balanceOf(GDAOWETHLPAddress).call();
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
      let bB;
      let b = await this.contract.methods.balanceOf(stakeAddress).call();
      if (("USDC", "WBTC".includes(this.name))) {
        b = BigNumber(b).toNumber();
      }
      if (this.name === "USDC") {
        bB = b / 10 ** 6;
      } else if (this.name === "WBTC") {
        bB = b / 10 ** 8;
      } else {
        bB = await w3.getWeiToETH(b);
      }
      this.tvl = bB * this.price;
    }
  }

  async getDepositable(w3) {
    if (w3.isAddressValid() && w3.isAddressValid(this.address)) {
      let b = await this.contract.methods.balanceOf(w3.address).call();
      // let bB;
      // if (this.name === "USDC") {
      //   bB = b / 10 ** 6;
      // } else if (this.name === "WBTC") {
      //   bB = b / 10 ** 8;
      // } else {
      //   bB = await w3.getWeiToETH(b.toString());
      // }
      this.depositable = b;
    }
  }

  async getDeposited(w3, stakeContract) {
    if (w3.isAddressValid()) {
      let b = await stakeContract.methods.userInfo(this.pid, w3.address).call();
      //let bB;
      // if (this.name === "USDC") {
      //   bB = b.amount / 10 ** 6;
      // } else if (this.name === "WBTC") {
      //   bB = b.amount / 10 ** 8;
      // } else {
      //   bB = b.amount
      // }
      this.deposited = b.amount;
    }
  }

  async getPendingGDAO(w3, stakeContract) {
    if (w3.isAddressValid()) {
      let b = await stakeContract.methods
        .pendingGDAO(this.pid, w3.address)
        .call();
      this.rewards = await w3.getWeiToETH(b);
    }
  }
}
