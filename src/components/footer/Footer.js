import React, { Component } from "react";
import Logo from "../../assets/logos/governor-plain.png";
import Aragon from "../../assets/logos/aragon.png";
import { medias } from "./medias";
import ReactTypingEffect from "react-typing-effect";
import "./style.scss";

class Footer extends Component {
  render() {
    return (
      <div className="footer-bar">
        <div className="footer-container">
          <div className="upper">
            <div className="navigation">
              <div className="item">
                <div className="header">Applications</div>
                <a href="https://mine.governordao.org/">Liquidity Mine</a>
                <a href="https://swap.governordao.org/">Swap</a>
                <a href="https://airdrop.governordao.org/">Airdrop</a>
              </div>
              <div className="item">
                <div className="header">Social</div>
                <a href="https://t.me/GovernorProject">Telegram</a>
                <a href="https://discord.gg/5UKw3BC">Discord</a>
                <a href="https://twitter.com/Governor_DAO">Twitter</a>
              </div>
              <div className="item">
                <div className="header">Resources</div>
                <a href="https://governordao.org/media">Media</a>
                <a href="https://gdao.network/">Forum</a>
                <a
                  href="/"
                  onClick={() =>
                    window.open(
                      "https://governordao.org/papers/GDAO-Litepaper.pdf",
                      "_blank"
                    )
                  }
                >
                  Litepaper
                </a>
                <a href="https://governor.social/">Archive</a>
              </div>
              <div className="item">
                <img
                  src={Aragon}
                  draggable={false}
                  alt=""
                  onClick={() => window.open("https://aragon.org/", "_blank")}
                />
              </div>
            </div>
            <div className="media">
              <div className="header">Find us</div>
              <div className="items">
                {medias.map((m) => (
                  <a
                    key={m[1]}
                    href={m[2]}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <img src={m[0]} alt={m[1]} />
                  </a>
                ))}
                <a
                  className="powered-by"
                  href="https://aragon.org/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img src={Aragon} alt="" />
                </a>
              </div>
            </div>
          </div>
          <div className="bottom">
            <a href="https://governordao.org">
              <img src={Logo} alt="" className="logo" />
            </a>
            <div className="footer-typer-container">
              <ReactTypingEffect
                text={[
                  "Governance_as_a_Service.",
                  "We_Are_One._We_Are_All.",
                  "Governor_DAO_Rises.",
                ]}
                cursorRenderer={(cursor) => (
                  <span className="footer-typer-cursor">{cursor}</span>
                )}
                displayTextRenderer={(text, i) => {
                  return (
                    <div className="footer-typer-text">
                      {text.split("").map((char, index) => {
                        return (
                          <span key={index}>
                            {char !== "_" ? (
                              char
                            ) : (
                              <span className="typer-text-space" />
                            )}
                          </span>
                        );
                      })}
                    </div>
                  );
                }}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Footer;
