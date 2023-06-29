import React from "react";
import { Modal, useModal } from "@logora/debate.dialog.modal";
import { useIntl, FormattedMessage } from "react-intl";
import { Button } from '@logora/debate.action.button';
import { AnnouncementIcon } from "@logora/debate.icons";
import PropTypes from "prop-types";
import styles from "./SideModal.module.scss";

export const SideModal = (props) => {
  const intl = useIntl();
  const { hideModal } = useModal();

  const handleChoosePosition = (position) => {
    hideModal();
    props.onChooseSide(position);
  };

  return (
    <Modal
      data-vid={"side_modal"}
      title={intl.formatMessage({ id: "modal.side_modal.modal_title", defaultMessage: "Choose your side" })}
    >
      <div className={styles.modalContent}>{props.debateName}</div>
      <div className={styles.modalActions}>
        {props.debatePositions.slice(0, 2).map((position) => {
          if (
            props.disabledPositions &&
            props.disabledPositions.length > 0 &&
            props.disabledPositions.filter((pos) => pos.id === position.id)
              .length > 0
          ) {
            return null;
          }
          return (
            <Button
              data-tid={"action_choose_side"}
              key={position.id}
              className={styles.modalAction}
              onClick={() => handleChoosePosition(position.id)}
            >
              {position.name}
            </Button>
          );
        })}
      </div>
      {props.disabledPositions && props.disabledPositions.length > 0 && (
        <div className={styles.argumentInputWarning}>
          <AnnouncementIcon
            className={styles.warningIcon}
            height={20}
            width={20}
          />
          <FormattedMessage
            id={"modal.side_modal.side_limit_short"}
            values={{ position: props.disabledPositions[0].name }}
          />
        </div>
      )}
      {props.isNeutral && props.debatePositions[2] && (
        <div className={styles.neutralPosition}>
          <div className={styles.userChoice}>
            <FormattedMessage
              id={"modal.side_modal.neutral_position"}
            />
            <span className={styles.neutralPositionName}>
              {props.debatePositions[2].name}
            </span>
          </div>
          <FormattedMessage
            id={"modal.side_modal.neutral_position_change"}
          />
        </div>
      )}
    </Modal>
  );
};

SideModal.propTypes = {
  /** Name of the debate */
  debateName: PropTypes.string.isRequired,
  /** An array of objects containing the id and name of each position in the debate. */
  debatePositions: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
    })
  ).isRequired,
  /** An array of objects containing the id and name of each position that should be disabled. */
  disabledPositions: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
    })
  ),
  /** Whether to show a neutral position option in the modal. */
  isNeutral: PropTypes.bool,
  /** A callback function that will be called with the selected position id when a user chooses a side. */
  onChooseSide: PropTypes.func.isRequired,
};

SideModal.defaultProps = {
  isNeutral: false,
};
