import { PropTypes, Component } from 'react';

class Status extends Component {
  static contextTypes = {
    router: PropTypes.shape({
      staticContext: PropTypes.object
    }).isRequired
  };
  static defaultProps = {
    code: '200'
  };

  static propTypes = {
    code: PropTypes.string
  };

  componentWillMount() {
    const { staticContext } = this.context.router;
    if (staticContext) {
      staticContext.status = this.props.code;
    }
  }

  render() {
    return null;
  }
}

export default Status;
