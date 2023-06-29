import React from "react";
import { ListContext } from './ListProvider';

export const withList = Component => props => {
    return (
      <ListContext.Consumer>
        {context => (
            <Component {...props} {...context} />
        )}
      </ListContext.Consumer>
    )
}