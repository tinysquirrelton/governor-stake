import { Component } from "react";
import { withRouter } from "react-router-dom";

class OnPageChange extends Component {
  componentDidUpdate(prevProps) {
    const cL = this.props.location.pathname;
    const pL = prevProps.location.pathname;

    if (cL !== pL) {
      this.pageDidChange();
    }
  }

  pageDidChange() {
    window.scrollTo(0, 0);
    //insert analytics events?
  }

  render() {
    return this.props.children;
  }
}

export default withRouter(OnPageChange);
