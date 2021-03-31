import React, { Component } from "react";
import { toast } from "react-toastify";
import { ConnectButton } from "./elements/connectButton";
import Pool from "./elements/pool";
import { roundValue } from "../../utilities/helpers";
import "./style.scss";

import ERC20 from "./abi/ERC20.json";
import NFTPurchase from "../../data/token/abi/NFTPurchase.json";
import {
  NFTStafferSwap,
  NFTRepresentativeSwap,
  NFTCouncilSwap,
  NFTGovernorSwap,
  LOYALAddress
} from "../../utilities/constants/constants";


export default class Stake extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
      isSaleActive: false,
      approvedAmounts: ['0','0','0','0'],
      hasPurchasedArray: [false,false,false,false]
    }
    
    this.loyalTokenContract = null;
    this.purchaseStafferContract = null;
    this.purchaseRepresentativeContract = null;
    this.purchaseCouncilContract = null;
    this.purchaseGovernorContract = null;
    this.contractArray = [];
    this.contractAddressArray = [];
    this.burnAddress = '0x000000000000000000000000000000000000dEaD';
    this.NFTInfo = {
      priceArray: ['1000','2000','4000','8000'],
      name: ['Staffer', 'Representative', 'Council', 'Governor']
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
    
    setTimeout( async() => {
      await this.init();
    }, 2000);
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
        this.onApprove(tokenId, this.NFTInfo.priceArray[tokenId]);
      }
    });
    
  }
  
  onApprove = (tokenId, amount) => {
    if(tokenId >= 0 && tokenId < 4) {
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
    }
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
        <div className="nft-container">
          <div className="nft-title">NFT Swap</div>
          <div className="nft-subtitle">Coming Soon</div>
          <div className="nft-subtitle loyal-balance">Your LOYAL Balance: {this.props.userLoyalBalance}</div>

          <div className="nft-card-container">

            {this.NFTInfo.priceArray.map((price,index) => {
              return <figure className="card card--dark" key={index}>
              <div className="card__image-container">
                <img
                  src="https://media.giphy.com/media/26BRqPg05olzXG1bi/giphy.gif"
                  alt="Eevee"
                  className="card__image"
                />
              </div>
              <figcaption className="card__caption">
                <h1 className="card__name">{this.NFTInfo.name[index]}</h1>
                <h3 className="card__type">{price} LOYAL</h3>
                <button
                  className="card__claim-btn"
                  onClick={() => this.onPurchase(index)}
                  disabled={!this.state.isSaleActive || price > this.props.userLoyalBalance || this.state.hasPurchasedArray[index]}
                >
                { this.state.hasPurchasedArray[index] ? 'Already Purchased' : (this.state.approvedAmounts[index] < parseInt(price) ? 'Approve' : 'Get NFT')  }
                </button>
              </figcaption>
            </figure>
            })}

          </div>
        </div>
        <div className="gdao-texture-bg" />
        <div className="gdao-phoenix-bg" />
      </div>
    );
  }
}
