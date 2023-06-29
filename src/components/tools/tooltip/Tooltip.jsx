import React, { useState } from 'react';
import styles from './Tooltip.module.scss';
import cx from 'classnames';

export const Tooltip = (props) => {
  const [clicked, setClicked] = useState(false);

  const switchText = () => {
    setClicked(true);
    setTimeout(() => {
      setClicked(false);
    }, 5000);
  }

  return (
    <div className={styles.tooltipChild} onClick={props.onClickText ? switchText : null}>
      {props.children}
      <span className={cx(styles.tooltipText, { [styles.tooltipTextTop]: props.position === "top", [styles.tooltipTextLeft]: props.position === "left", [styles.tooltipTextRight]: props.position === "right"})}>
        {clicked ?
          props.onClickText
        :
          props.text
        }
      </span>
    </div>
  );
}