import React from "react";
import { useIntl } from "react-intl";
import { useVote } from "@logora/debate.hooks.use_vote";
import { ClapIcon } from "@logora/debate.icons";
import { Tooltip } from "@logora/debate.tools.tooltip";
import cx from "classnames";
import styles from "./VoteButton.module.scss";

const VoteButton = (props) => {
  const intl = useIntl();
  const { totalUpvotes, activeVote, handleVote } = useVote(
    props.voteableType,
    props.voteableId,
    props.totalUpvotes,
    props.totalDownvotes
  );

  const handleKeyDown = (event) => {
    const ENTER_KEY = 13;
    if (event.keyCode == ENTER_KEY) {
      handleVote();
    }
  };

  return (
    <Tooltip text={intl.formatMessage({ id: "alt.vote" })}>
      <div
        tabIndex="0"
        className={cx(
          styles.voteButton,
          { [styles.active]: activeVote },
          styles[`position-${props.positionIndex}`]
        )}
        onClick={() => handleVote(true)}
        onKeyDown={() => handleKeyDown(true)}
      >
        <span data-tid={"action_vote_argument"} className={styles.voteIcon}>
          <ClapIcon
            data-tid={"action_vote_argument"}
            height={28}
            width={28}
            aria-label={intl.formatMessage({ id: "icons.vote" })}
          />
        </span>
        &nbsp;<span className={styles.voteNumber}>{totalUpvotes}</span>
      </div>
    </Tooltip>
  );
};

export default VoteButton;
