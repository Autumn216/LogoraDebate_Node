import React, { createContext, Component } from "react";

export const InputAndListContext = createContext({
  startInput: false,
  editElement: {},
  setStartInput: () => {},
  setEditElement: () => {}
});

class InputAndListProvider extends Component {
  state = {
    startInput: false,
    editElement: {},
    setStartInput: startInput => this.setState({ startInput: startInput }),
    setEditElement: editElement => this.setState({ editElement: editElement }),
  };

  render() {
    return (
      <InputAndListContext.Provider value={this.state}>
        {this.props.children}
      </InputAndListContext.Provider>
    );
  }
}

export default InputAndListProvider;

export const withInput = Component => props => (
  <InputAndListContext.Consumer>
    {context => <Component {...props} {...context} />}
  </InputAndListContext.Consumer>
)