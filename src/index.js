import { Component } from "react";

const eventsChanged = (yeoldevents, yonnewevents) =>
  yeoldevents.sort().toString() !== yonnewevents.sort().toString();

export default class Idle extends Component {
  static defaultProps = {
    defaultIdle: false,
    render: () => null,
    onChange: () => {},
    timeout: 1000,
    events: ["mousemove", "mousedown", "keydown", "touchstart", "scroll"]
  };

  state = {
    idle: this.props.defaultIdle
  };

  timeout = null;

  componentDidMount() {
    this.attachEvents();
    this.setTimeout();
  }

  componentWillUnmount() {
    this.removeEvents();
  }

  componentDidUpdate(prevProps) {
    if (eventsChanged(prevProps.events, this.props.events)) {
      this.removeEvents();
      this.attachEvents();
    }
  }

  attachEvents() {
    this.props.events.forEach(event => {
      window.addEventListener(event, this.handleEvent, true);
    });
  }

  removeEvents() {
    this.props.events.forEach(event => {
      window.removeEventListener(event, this.handleEvent);
    });
  }

  handleChange(idle) {
    this.props.onChange({ idle });
    this.setState({ idle });
  }

  handleEvent = () => {
    if (this.state.idle) {
      this.handleChange(false);
    }
    if (!this.props.states) {
      clearTimeout(this.timeout);
    } else {
      for (let i = 0; i < this.stateTimers.length; i++) {
        clearTimeout(this.stateTimers[i]);
      }
    }
    this.setTimeout();
  };

  setTimeout() {
    if (!this.props.states) {
      this.timeout = setTimeout(() => {
        this.handleChange(true);
      }, this.props.timeout);
    } else {
      this.stateTimers = [];
      for (let i = 0; i < this.props.states.length; i++) {
        this.stateTimers.push(
          setTimeout(() => {
            debugger;
            this.handleChange(this.props.states[i].id);
          }, this.props.states[i].timeout)
        );
      }
    }
  }

  render() {
    return this.props.render(this.state);
  }
}
