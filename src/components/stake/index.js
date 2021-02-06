import React, { Component } from "react";
import { ConnectButton } from "./elements/connectButton";
import Pool from "./elements/pool";
import { roundValue } from "../../utilities/helpers";
import "./style.scss";

export default class Stake extends Component {
  render() {
    return (
      <div className="max-width-container">
        <div className="stake-container">
          <div className="stake-title">
            <div className="title-text">Loyalty Mine</div>
            <ConnectButton w3={this.props.w3} />
          </div>
          <div className="stake-subtitle">
            <span>TVL:</span>
            {`${
              this.props.isConnected
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
                <h1 className="card__name">?</h1>
                <h3 className="card__type">Coming soon</h3>
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
                <h1 className="card__name">?</h1>
                <h3 className="card__type">Coming soon</h3>
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
                <h1 className="card__name">?</h1>
                <h3 className="card__type">Coming soon</h3>
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
                <h1 className="card__name">?</h1>
                <h3 className="card__type">Coming soon</h3>
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
