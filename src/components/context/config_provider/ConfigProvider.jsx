import React, { createContext, useState } from "react";

export const ConfigContext = createContext();

export const ConfigProvider = (props) => {
  const [config, setConfig] = useState(props.config);
  const [routes, setRoutes] = useState(props.routes);

  return (
    <ConfigContext.Provider value={{ config, routes }}>
      {props.children}
    </ConfigContext.Provider>
  );
}

export const withConfig = Component => props => (
  <ConfigContext.Consumer>
    {context => <Component {...props} {...context} />}
  </ConfigContext.Consumer>
)