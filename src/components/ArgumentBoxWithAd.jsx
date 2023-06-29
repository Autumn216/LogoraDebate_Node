import React from 'react';
import Argument from './Argument';
import { AdUnit } from '@logora/debate.ad.ad_unit';

const ArgumentBoxWithAd = (props) => {
  const AD_INDEX = 3;
  let adType = "thread";
  let adIndex = (props.index + 1) / AD_INDEX;
  if (props.index + 1 === 1) {
    adType = "thread-main";
    adIndex = null;
  } else if (props.index === AD_INDEX) {
    adType = "thread-secondary";
    adIndex = null;
  }
  return (
    <>
      <Argument
        argument={props.argument}
        debatePositions={props.debatePositions}
        debateGroupContext= {props.debateGroupContext}
        debateName= {props.debateName}
        replies={props.replies}
        nestingLevel={props.nestingLevel}
        expandable={props.expandable}
        debateIsActive={props.debateIsActive}
      />
      {props.displayAd && (props.index + 1) % AD_INDEX === 1 &&
        <AdUnit type={adType} sizes={[[300, 250]]} index={props.index} />
      }
    </>
  );
}

export default ArgumentBoxWithAd;