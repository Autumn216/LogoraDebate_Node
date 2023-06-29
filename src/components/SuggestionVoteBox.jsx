import React, { lazy, Suspense } from "react";
import { useAuth } from "@logora/debate.auth.use_auth";
import { useModal } from "@logora/debate.dialog.modal";
import { useVote } from "@logora/debate.hooks.use_vote";
import { useIntl } from "react-intl";
import { useConfig } from "@logora/debate.context.config_provider";
import TextFormatter from "../utils/TextFormatter";
import { ChatIcon, AnnouncementIcon } from "@logora/debate.icons";
import { ConfirmModal } from "@logora/debate.modal.confirm_modal";
import cx from "classnames";
import styles from "./SuggestionVoteBox.module.scss";

const SuggestionVoteBox = (props) => {
  const intl = useIntl();
  const { isLoggedIn } = useAuth();
  const { activeVote, voteSide, handleVote } = useVote(
    props.voteableType,
    props.voteableId,
    props.totalUpvotes,
    props.totalDownvotes,
    props.onVote
  );
  const { showModal } = useModal();
  const config = useConfig();

  const handleDownvote = () => {
    if (isLoggedIn) {
      showModal(
        <Suspense fallback={null}>
          <ConfirmModal
            title={intl.formatMessage({ id: "suggestion.downvote" })}
            question={intl.formatMessage({
              id: "info.confirm_suggestion_downvote",
            })}
            confirmLabel={intl.formatMessage({ id: "info.yes" })}
            cancelLabel={intl.formatMessage({ id: "info.no" })}
            onConfirmCallback={() => handleVote(false)}
          />
        </Suspense>
      );
    }
  };

  return (
    <div className={styles.voteButtonsContainer}>
      <div
        className={cx(styles.voteButton, styles.upvotes, {
          [styles.active]: activeVote && voteSide,
        })}
        onClick={() => handleVote(true)}
      >
        <ChatIcon
          width={15}
          height={15}
          {...(config.theme.iconTheme === "edge" && { variant: "edge" })}
        />
        <span>
          <TextFormatter id="suggestion.upvote" />
        </span>
      </div>
      <div
        className={cx(styles.voteButton, styles.downvotes, {
          [styles.active]: activeVote && !voteSide,
        })}
        onClick={() => handleDownvote()}
      >
        <AnnouncementIcon width={15} height={15} />
        <span>
          <TextFormatter id="suggestion.downvote" />
        </span>
      </div>
    </div>
  );
};

export default SuggestionVoteBox;
