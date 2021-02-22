import React, { Component } from "react";
import { Link } from "react-router-dom";
import Logo from "../../assets/logos/governor-plain.png";
import { Menu, X, ChevronDown, ChevronUp } from "react-feather";
import { statistics, applications, resources, social } from "./items";
import "./style.scss";

export default class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isSmall: null,
      isMedium: null,
      isLarge: null,
      isExpanded: null,
      isItemOpen: null,
    };
  }

  componentDidMount() {
    window.addEventListener("resize", this.onResize);
    this.onResize();
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.onResize());
  }

  onResize = () => {
    this.setState({
      isLarge: window.innerWidth >= 992,
      isMedium: window.innerWidth >= 768 && window.innerWidth < 992,
      isSmall: window.innerWidth < 768,
    });
  };

  onToggleDrawer = () => {
    this.setState((prevState) => ({ isExpanded: !prevState.isExpanded }));
  };

  onToggleAccordion = (item) => {
    if (this.state.isItemOpen === item) {
      this.setState({ isItemOpen: null });
    } else {
      this.setState({ isItemOpen: item });
    }
  };

  getAccordion = (item, content) => {
    let title = item[0].toUpperCase() + item.substring(1);
    return (
      <div className="accordion-container">
        <div
          className="accordion-toggle"
          onClick={() => this.onToggleAccordion(item)}
        >
          {title}
          {this.state.isItemOpen === item ? <ChevronUp /> : <ChevronDown />}
        </div>
        <div
          className={`accordion-menu ${
            this.state.isItemOpen === item ? "expanded" : ""
          }`}
        >
          {content.map((c, index) => (
            <a
              key={index}
              href={c.to}
              onClick={() => {
                this.setState({ isExpanded: null, isItemOpen: null });
                if (c.title === "Litepaper") {
                  window.open(
                    "https://governordao.org/papers/GDAO-Litepaper.pdf",
                    "_blank"
                  );
                }
              }}
            >
              {c.title}
            </a>
          ))}
        </div>
      </div>
    );
  };

  getLink = (item) => {
    // Other apps
    return (
      <a
        href={item.to}
        className="menu-item"
        onClick={() => {
          this.setState({ isExpanded: null, isItemOpen: null });
        }}
      >
        {item.title}
      </a>
    );
  };

  render() {
    // Small to medium navigation
    const XSNav = () => {
      return (
        <>
          <div className="xs-nav-toggle" onClick={this.onToggleDrawer}>
            {!this.state.isExpanded ? <Menu /> : <X />}
          </div>
          <div
            className={`xs-nav-menu ${this.state.isExpanded ? "expanded" : ""}`}
          >
            {this.getLink(statistics)}
            {this.getAccordion("applications", applications)}
            {this.getAccordion("resources", resources)}
            {this.getAccordion("social", social)}
          </div>
        </>
      );
    };
    // Large navigation
    const LGNav = () => {
      return (
        <>
          <div className="lg-nav-menu">
            {this.getLink(statistics)}
            {this.getAccordion("applications", applications)}
            {this.getAccordion("resources", resources)}
            {this.getAccordion("social", social)}
          </div>
        </>
      );
    };

    return (
      <div className="header-container">
        <div className="header-content">
          <a href="https://governordao.org" className="logo-container">
            <div className="logo-img">
              <img src={Logo} alt="logo" />
            </div>
            <div className="logo-title">Governor</div>
          </a>
          {this.state.isSmall || this.state.isMedium ? <XSNav /> : <LGNav />}
        </div>
      </div>
    );
  }
}
