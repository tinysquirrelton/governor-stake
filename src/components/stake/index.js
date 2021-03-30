import React, { Component } from "react";
import { toast } from "react-toastify";
import { ConnectButton } from "./elements/connectButton";
import Pool from "./elements/pool";
import { roundValue } from "../../utilities/helpers";
import "./style.scss";

import ERC20 from "./abi/ERC20.json";
import NFTPurchase from "./abi/NFTPurchase.json";
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
      userLoyalBalance: 0,
      approvedAmounts: [0,0,0,0]
    }
    
    this.loyalTokenContract = null;
    this.purchaseStafferContract = null;
    this.purchaseRepresentativeContract = null;
    this.purchaseCouncilContract = null;
    this.purchaseGovernorContract = null;
    this.contractArray = [];
    this.contractAddressArray = [];
    this.priceArray = [1000*10**18,2000*10**18,4000*10**18,8000*10**18];
  }
  
  componentDidMount = async() => {
    
    if(await this.props.walletconnect != null) {
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
        this.NFTStafferSwap,
        this.NFTRepresentativeSwap,
        this.NFTCouncilSwap,
        this.NFTGovernorSwap,
      ];
      
      this.getApprovedAmounts();
      
      let saleActive = await this.contractArray[0].methods.active().call();
      this.setState({isSaleActive: saleActive});
    }
    //todo remove dis
    this.setState({isSaleActive: true});
  }
  
  onPurchase = async(tokenId) => {
    this.getApprovedAmounts().then(async() => {
      
      if(this.state.approvedAmounts[tokenId] >= this.priceArray[tokenId]) {
        if(tokenId >= 0 && tokenId < this.contractArray.length) {
          let hasPurchased = await this.contractArray[tokenId].methods.hasPurchased(this.props.walletconnect?.account).call();
          
          if(!hasPurchased) {
            this.contractArray[tokenId].methods
              .purchase()
              .send({ from: this.props.walletconnect?.account })
              .then(async(res) => {
                toast.success("Successfully purchased NFT.");
                await this.getApprovedAmounts();
              })
              .catch((err) => toast.error("Failed to purchase."));
          } else {
            toast.error("You have already claimed this NFT.");
          }
        }
      } else {
        this.onApprove(tokenId, this.priceArray[tokenId]);
      }
    });
  }
  
  onApprove = (tokenId, amount) => {
    if(tokenId >= 0 && tokenId < this.contractAddressArray.length && amount > 0 && amount <= 8000*10**18) {
      let approveSpender = this.contractAddressArray[tokenId];

      this.loyalTokenContract?.contract.methods
        .approve(approveSpender, amount)
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
      let checkedApprovedAmounts = [0,0,0,0];
      for(let i=0; i<this.state.approvedAmounts.length; i++) {
        let spenderAddress = this.contractAddressArray[i];
        let allowance = await this.loyalTokenContract?.methods
          .allowance(this.props.walletconnect?.account, spenderAddress)
          .call();
        if(allowance >= 0 && !isNaN(allowance)) {
          checkedApprovedAmounts[i] = allowance;
        }
      }
      this.setState({ approvedAmounts: checkedApprovedAmounts });
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
        <div className="nft-container">
          <div className="nft-title">NFT Swap</div>
          <div className="nft-subtitle">Coming Soon</div>

          <div className="nft-card-container">
            <figure className="card card--dark">
              <div className="card__image-container">
                <img
                  src="https://media.giphy.com/media/26BRqPg05olzXG1bi/giphy.gif"
                  alt="Eevee"
                  className="card__image"
                />
              </div>
              <figcaption className="card__caption">
                <h1 className="card__name">Staffer</h1>
                <h3 className="card__type">1,000 LOYAL</h3>
                <button
                  className="card__claim-btn"
                  onClick={() => this.onPurchase(0)}
                  disabled={!this.state.isSaleActive}
                >
                { this.state.approvedAmounts[0] < this.priceArray[0] ? 'Approve' : 'Get NFT' }
                </button>
              </figcaption>
            </figure>
            <figure className="card card--dark">
              <div className="card__image-container">
                <img
                  src="https://media.giphy.com/media/26BRqPg05olzXG1bi/giphy.gif"
                  alt="Eevee"
                  className="card__image"
                />
              </div>
              <figcaption className="card__caption">
                <h1 className="card__name">Representative</h1>
                <h3 className="card__type">2,000 LOYAL</h3>
                <button
                  className="card__claim-btn"
                  onClick={() => this.onPurchase(1)}
                  disabled={!this.state.isSaleActive}
                >
                { this.state.approvedAmounts[1] < this.priceArray[1] ? 'Approve' : 'Get NFT' }
                </button>
              </figcaption>
            </figure>
            <figure className="card card--dark">
              <div className="card__image-container">
                <img
                  src="https://media.giphy.com/media/26BRqPg05olzXG1bi/giphy.gif"
                  alt="Eevee"
                  className="card__image"
                />
              </div>
              <figcaption className="card__caption">
                <h1 className="card__name">Council</h1>
                <h3 className="card__type">4,000 LOYAL</h3>
                <button
                  className="card__claim-btn"
                  onClick={() => this.onPurchase(2)}
                  disabled={!this.state.isSaleActive}
                >
                { this.state.approvedAmounts[2] < this.priceArray[2] ? 'Approve' : 'Get NFT' }
                </button>
              </figcaption>
            </figure>
            <figure className="card card--dark">
              <div className="card__image-container">
                <img
                  src="https://media.giphy.com/media/26BRqPg05olzXG1bi/giphy.gif"
                  alt="Eevee"
                  className="card__image"
                />
              </div>
              <figcaption className="card__caption">
                <h1 className="card__name">Governor</h1>
                <h3 className="card__type">8,000 LOYAL</h3>
                <button
                  className="card__claim-btn"
                  onClick={() => this.onPurchase(3)}
                  disabled={!this.state.isSaleActive}
                >
                { this.state.approvedAmounts[3] < this.priceArray[3] ? 'Approve' : 'Get NFT' }
                </button>
              </figcaption>
            </figure>
          </div>
        </div>
        <div className="gdao-texture-bg" />
        <div className="gdao-phoenix-bg" />
      </div>
    );
  }
}
