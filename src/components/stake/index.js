import React, { Component } from "react";
import { toast } from "react-toastify";
import BigNumber from "bignumber.js/bignumber";
import { ConnectButton } from "./elements/connectButton";
import Pool from "./elements/pool";
import { roundValue } from "../../utilities/helpers";
import "./style.scss";

import ERC20 from "./abi/ERC20.json";
import NFTPurchase from "./abi/NFTPurchase.json";
import LoyalGdaoSwap from "./abi/Swap.json";
import {
  NFTStafferSwap,
  NFTRepresentativeSwap,
  NFTCouncilSwap,
  NFTGovernorSwap,
  GDAOSwap,
  LOYALAddress
} from "../../utilities/constants/constants";


import StafferMp4 from "../../assets/nfts/staffer-nft.mp4";
import RepresentativeMp4 from "../../assets/nfts/representative-nft.mp4";
import CouncilMp4 from "../../assets/nfts/council-nft.mp4";
import GovernorMp4 from "../../assets/nfts/governor-nft.mp4";

const zeroPad = (num, places) => String(num).padStart(places, '0');

export default class Stake extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
      isSaleActive: false,
      hasSaleStarted: true,
      hasSaleEnded: false,
      saleStartCountdown: '00:00:00',
      approvedAmounts: ['0','0','0','0'],
      hasPurchasedArray: [false,false,false,false],
      toSwap: 0,
      toReceive: 0
    }
    
    this.saleStartTime = 1617220800*1000;
    this.saleEndTime = 1618081200*1000;
    this.loyalTokenContract = null;
    this.purchaseStafferContract = null;
    this.purchaseRepresentativeContract = null;
    this.purchaseCouncilContract = null;
    this.purchaseGovernorContract = null;
    this.gdaoSwapContract = null;
    this.contractArray = [];
    this.contractAddressArray = [];
    this.burnAddress = '0x000000000000000000000000000000000000dEaD';
    this.NFTInfo = {
      priceArray: ['1000','2000','4000','8000'],
      name: ['Staffer', 'Representative', 'Council', 'Governor'],
      mp4Link: [StafferMp4, RepresentativeMp4, CouncilMp4, GovernorMp4]
    };
    this.initialized = false;
  }
  
  init = async() => {
    if(await this.props.walletconnect != null && !this.initialized) {
      this.loyalTokenContract = await new this.props.walletconnect.web3.eth.Contract(ERC20.abi, LOYALAddress);
      this.purchaseStafferContract = await new this.props.walletconnect.web3.eth.Contract(NFTPurchase.abi, NFTStafferSwap);
      this.purchaseRepresentativeContract = await new this.props.walletconnect.web3.eth.Contract(NFTPurchase.abi, NFTRepresentativeSwap);
      this.purchaseCouncilContract = await new this.props.walletconnect.web3.eth.Contract(NFTPurchase.abi, NFTCouncilSwap);
      this.purchaseGovernorContract = await new this.props.walletconnect.web3.eth.Contract(NFTPurchase.abi, NFTGovernorSwap);
      this.gdaoSwapContract = await new this.props.walletconnect.web3.eth.Contract(LoyalGdaoSwap.abi, GDAOSwap);
      
      this.contractArray = [
        this.purchaseStafferContract,
        this.purchaseRepresentativeContract,
        this.purchaseCouncilContract,
        this.purchaseGovernorContract,
      ];
      
      this.contractAddressArray = [
        NFTStafferSwap,
        NFTRepresentativeSwap,
        NFTCouncilSwap,
        NFTGovernorSwap,
      ];
      
      
      let saleActive = await this.contractArray[0].methods.active().call();
      this.setState({isSaleActive: saleActive});

      this.getApprovedAmounts();
      this.checkHasPurchasedStatus();

      this.initialized = true;
    }
  }
  
  componentDidMount = async() => {
    
    let self = this;
    let countdownInterval = setInterval(function() {
      let now = new Date().getTime();
      let endDistance = self.saleEndTime - now;

      let hours = Math.floor((endDistance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      let minutes = Math.floor((endDistance % (1000 * 60 * 60)) / (1000 * 60));
      let seconds = Math.floor((endDistance % (1000 * 60)) / 1000);

      let newTimer = zeroPad(hours,2) + ":" + zeroPad(minutes,2) + ":" + zeroPad(seconds,2);
      self.setState({saleStartCountdown: newTimer});

      if (endDistance < 0) {
        self.setState({hasSaleEnded: true});
      }
      
    }, 1000);
    
    setTimeout( async() => {
      await this.init();
    }, 1000);
  }
  
  onPurchase = async(tokenId) => {  
    this.getApprovedAmounts().then(async() => {
      
      if(parseInt(this.state.approvedAmounts[tokenId]) >= parseInt(this.NFTInfo.priceArray[tokenId])) {
        if(tokenId >= 0 && tokenId < this.contractArray.length) {
          
          this.contractArray[tokenId].methods
            .purchase()
            .send({ from: this.props.walletconnect?.account })
            .then(async(res) => {
              toast.success("Successfully purchased NFT.");
              await this.getApprovedAmounts();
            })
            .catch((err) => toast.error("Failed to purchase."));
  
        }
      } else {
        this.onApprove(this.NFTInfo.priceArray[tokenId]);
      }
    });
    
  }
  
  onApprove = (amount) => {
    let approveSpender = this.burnAddress;
    
    let amountWei = this.props.walletconnect?.web3.utils.toWei(amount, 'ether');
    this.loyalTokenContract?.methods
      .approve(approveSpender, amountWei)
      .send({ from: this.props.walletconnect?.account })
      .then((res) => {
        if (res.status === true) {
          this.getApprovedAmounts();
          toast.success("Successfully Approved.");
        }
      })
      .catch((err) => toast.error("Failed to Approve."));
  };
  
  
  getApprovedAmounts = async() => {
    if (this.props.walletconnect?.web3?.utils.isAddress(this.props.walletconnect?.account)) {
      let checkedApprovedAmounts = ['0','0','0','0'];
      for(let i=0; i<this.state.approvedAmounts.length; i++) {
        let spenderAddress = this.burnAddress;
        let allowance = await this.loyalTokenContract?.methods
          .allowance(this.props.walletconnect?.account, spenderAddress)
          .call();
        allowance = this.props.walletconnect?.web3.utils.fromWei(allowance, 'ether');
        checkedApprovedAmounts[i] = allowance;
      }
      this.setState({ approvedAmounts: checkedApprovedAmounts });
    }
  }

  checkHasPurchasedStatus = async() => {
    let statusArray = [false,false,false,false];
    for(let i=0; i<4; i++) {
      statusArray[i] = (await this.contractArray[i]?.methods.hasPurchased(this.props.walletconnect.account).call());
    }
    this.setState({ hasPurchasedArray: statusArray });
  }
  
  onGetSwapAmount = async(tokenAmount) => {
    let amountWei = this.props.walletconnect?.web3.utils.toWei(tokenAmount.toString(), 'ether');
    let swapCalculated = await this.gdaoSwapContract.methods.calculateTokens(amountWei).call();
    let swapCalculatedFinal = BigNumber(this.props.walletconnect?.web3.utils.fromWei(swapCalculated.toString(), 'ether'));
    this.setState({ toReceive: swapCalculatedFinal.toFixed(4) });
  }
  
  onToswapChange = (e) => {
    
    let swappable = BigNumber(
      this.props.userLoyalBalanceRaw
    ).toNumber();

    let toSwap =
      BigNumber(e.target.value).toNumber() > swappable
        ? swappable
        : BigNumber(e.target.value).toNumber();
    
    this.onGetSwapAmount(toSwap);
    
    this.setState({
      toSwap: isNaN(toSwap) ? "" : toSwap,
    });
  };
  
  onMax = () => {
    this.setState({ toSwap: this.props.userLoyalBalanceRaw });
  };
  
  onSwap = async() => {
    if(this.state.approvedAmounts[0] < this.state.toSwap) {
      console.log(this.state.toSwap);
      this.onApprove(this.state.toSwap.toString());
    } else {
      let toSwap = this.props.walletconnect?.web3.utils.toWei(this.state.toSwap.toString(), 'ether');
      this.gdaoSwapContract.methods
        .swapTokens(toSwap)
        .send({ from: this.props.walletconnect?.account })
        .then(async(res) => {
          toast.success("Successfully swapped LOYAL for GDAO.");
          await this.getApprovedAmounts();
        })
        .catch((err) => toast.error("Swap failed."));
    }
  }
  
  render() {
    return (
      <div className="max-width-container">
        <div className="stake-container">
          <div className="stake-title">
            <div className="title-text">Loyalty Mine</div>
            <ConnectButton
              account={this.props.walletconnect?.account}
              setConnection={this.props.walletconnect?.connectWeb3Manual}
            />
          </div>
          <div className="stake-subtitle">
            <span>TVL:</span>
            {`${
              this.props.walletconnect?.isConnected
                ? ` $${roundValue(this.props.token.tvl)}`
                : " -"
            }`}
          </div>
          <div className="stake-subtitle">
            <span>LOYAL Remaining:</span>
            {` ${this.props.loyalLeft}`}
          </div>
          <div className="stake-subtitle">
            <a
              href="https://etherscan.io/address/0xda58927f4065f1d02a6ea850c2aac49d7362a643#code"
              rel="noreferrer"
              target="_blank"
              style={{
                fontSize: "0.8em",
                color: "#ffffff",
                display: "inline-block",
                textAlign: "center",
              }}
            >
              Stake Contract
            </a>
          </div>
          <div className="learn-loyal">
            <a
              href="https://gdao.network/t/loyalty-points-for-gdao-staking/79"
              target="_blank"
              rel="noreferrer"
            >
              Learn about LOYAL and GDAO staking
            </a>
          </div>
          <Pool token={this.props.token} {...this.props} />
        </div>
        <div className="swap-wrapper">
          <div className="card">
            <h2>LOYAL-GDAO Swap</h2>
            <div className="input-container">
              <button className="max-btn" onClick={this.onMax} disabled={!this.props.walletconnect?.isConnected}>
                Max
              </button>
              <div className="input">
                <input
                  type="number"
                  value={this.state.toSwap}
                  step={0.001}
                  onChange={(e) => this.onToswapChange(e)}
                  disabled={!this.props.walletconnect?.isConnected}
                  min="0"
                />
              </div>
            </div>
            You will receive {this.state.toReceive} GDAO.
            <br/><br/>
            <button
              className="card__swap-btn"
              onClick={this.onSwap}
              //todo: uncomment
              //disabled={!this.state.hasSaleEnded || this.props.userLoyalBalanceRaw <= 0}
            >
            { this.state.approvedAmounts[0] < this.state.toSwap ? 'Approve' : 'Swap' }
            </button>
          </div>
        </div>
        <div className="nft-container">
          <div className="nft-title">NFT Swap</div>
          <div className="nft-subtitle loyal-balance">Your LOYAL Balance: {this.props.userLoyalBalance}</div>

          <div className="nft-card-container" style={!(this.state.isSaleActive || this.state.hasSaleStarted) ? {filter: 'blur(5px)'} : {}}>

            {this.NFTInfo.priceArray.map((price,index) => {
              return <figure className="card card--dark" key={index}>
              <div className="card__image-container">
                <video width="300" height="270" loop autoPlay muted>
                  <source src={this.NFTInfo.mp4Link[index]} type="video/mp4"></source>
                  Your browser does not support the video tag.
                </video>
              </div>
              <figcaption className="card__caption">
                <h1 className="card__name">{this.NFTInfo.name[index]}</h1>
                <h3 className="card__type">{price} LOYAL</h3>
                <button
                  className="card__claim-btn"
                  onClick={() => this.onPurchase(index)}
                  disabled={!(this.state.isSaleActive || this.state.hasSaleStarted) || price > this.props.userLoyalBalanceRaw || this.state.hasPurchasedArray[index]}
                >
                { this.state.hasPurchasedArray[index] ? 'Already Purchased' : (this.state.approvedAmounts[index] < parseInt(price) ? 'Approve' : 'Get NFT')  }
                </button>
              </figcaption>
            </figure>
            })}

          </div>
          <div className={!this.state.hasSaleEnded ? "nft-lock" : "nft-lock active" }>
            <div className="infoWrapper">
              <h3 className="header">NFT sale has concluded</h3>
            </div>
          </div>
        </div>
        <div className="gdao-texture-bg" />
        <div className="gdao-phoenix-bg" />
      </div>
    );
  }
}
