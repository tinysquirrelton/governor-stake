import React, { Component } from "react";
import { ConnectButton } from "./elements/connectButton";
import Pool from "./elements/pool";
import { roundValue } from "../../utilities/helpers";
import "./style.scss";

export default class Stake extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  updateState = () => {
    this.setState({});
  };

  render() {
    return (
      <div className="max-width-container">
        <div className="stake-container">
          <div className="stake-title">
            <div className="title-text">GDAO Stake</div>
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
            <span>Circulating Supply:</span>
            {` ${this.props.circulatingSupply}`}
          </div>
          <div className="stake-subtitle">
            <a
              href="https://i.imgur.com/lYdHXb2.gif"
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
          <Pool token={this.props.token} {...this.props} />
        </div>
        <div className="nft-container">
          <div className="nft-title">NFT Swap</div>
          <div className="nft-subtitle">Coming Soon</div>

          <div className="nft-card-container">
            <div id="cards">
              <figure class="card card--dark">
                <div class="card__image-container">
                  <img
                    src="https://media.giphy.com/media/26BRqPg05olzXG1bi/giphy.gif"
                    alt="Eevee"
                    class="card__image"
                  />
                </div>
                <figcaption class="card__caption">
                  <h1 class="card__name">XXXXXXX</h1>
                  <h3 class="card__type">Coming soon</h3>
                  <table class="card__stats">
                    <tbody>
                      <tr>
                        <th>XXXXXXX</th>
                        <td>YYYYYYY</td>
                      </tr>
                      <tr>
                        <th>XXXXXXX</th>
                        <td>YYYYYYY</td>
                      </tr>
                      <tr>
                        <th>XXXXXXX</th>
                        <td>YYYYYYY</td>
                      </tr>
                      <tr>
                        <th>XXXXXXX</th>
                        <td>YYYYYYY</td>
                      </tr>
                    </tbody>
                  </table>
                  <div class="card__abilities">
                    <h4 class="card__ability">
                      <span class="card__label">XXXXXXX</span>
                      YYYYYYY
                    </h4>
                    <h4 class="card__ability">
                      <span class="card__label">XXXXXXX</span>
                      YYYYYYY
                    </h4>
                  </div>
                </figcaption>
              </figure>
            </div>
          </div>
        </div>
        <div className="gdao-texture-bg" />
        <div className="gdao-phoenix-bg" />
      </div>
    );
  }
}
