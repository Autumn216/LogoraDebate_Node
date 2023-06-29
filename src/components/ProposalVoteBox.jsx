import React from "react";
import { useVote } from "@logora/debate.hooks.use_vote";
import TextFormatter from "../utils/TextFormatter";
import { DownvoteIcon, UpvoteIcon } from "@logora/debate.icons";
import cx from "classnames";
import styles from "./ProposalVoteBox.module.scss";

const ProposalVoteBox = (props) => {
  const { totalUpvotes, totalDownvotes, activeVote, voteSide, handleVote } =
    useVote(
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
    <div className={styles.voteButtonsContainer}>
      <div
        className={cx(styles.upvoteContainer, {
          [styles.voteDisabled]: props.disabled,
          [styles.active]: activeVote && voteSide,
        })}
        onClick={props.disabled ? null : () => handleVote(true)}
        onKeyDown={() => handleKeyDown(true)}
      >
        <span>
          <TextFormatter
            id="consultation.supporter"
            variables={{ variable: totalUpvotes }}
            count={totalUpvotes}
          />
        </span>{" "}
        <UpvoteIcon width={27} height={25} />
      </div>
      <div
        className={cx(styles.downvoteContainer, {
          [styles.voteDisabled]: props.disabled,
          [styles.active]: activeVote && !voteSide,
        })}
        onClick={props.disabled ? null : () => handleVote(false)}
        onKeyDown={() => handleKeyDown(true)}
      >
        <span>
          <TextFormatter
            id="consultation.opponent"
            variables={{ variable: totalDownvotes }}
            count={totalDownvotes}
          />
        </span>{" "}
        <DownvoteIcon width={27} height={25} />
      </div>
    </div>
  );
};

export default ProposalVoteBox;
