import React from 'react';
import { Link } from '@logora/debate.action.link';
import cx from 'classnames';
import styles from './LinkButton.module.scss';

export const LinkButton = (props) => {
  const { className, to, external, children, ...rest } = props;

  return (
    <Link 
      to={to} 
      className={cx(styles.primaryLink, className)}
      external={external}
      {...rest}
    >
      { children }
    </Link>
  );
}