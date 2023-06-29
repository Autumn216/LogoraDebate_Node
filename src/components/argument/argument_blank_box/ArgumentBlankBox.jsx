import React from 'react';
import PropTypes from "prop-types";
import { LinkButton } from '@logora/debate.action.link_button';
import { Button } from '@logora/debate.action.button';
import { FormattedMessage } from 'react-intl';
import cx from 'classnames';
import styles from './ArgumentBlankBox.module.scss';

export const ArgumentBlankBox = ({ debateUrl, position, positionClassName, handleClick, oneLineBottom = true }) => {
    const getDebateUrl = () => {
        const debateUri = new URL(debateUrl);
        debateUri.searchParams.append("initArgument", "true");
        debateUri.searchParams.append("positionId", position?.id);
        return debateUri.href;
    }

    return (
        <div className={styles.argumentBlankBox}>
            <div className={styles.argumentHeader}>
                <div className={styles.authorBox}>
                    <div className={styles.argumentPlaceholderRound}></div>
                    <div className={styles.argumentHeaderPlaceholderBox}>
                        <div className={styles.argumentPlaceholder}></div>
                        <div className={styles.argumentPlaceholder}></div>
                    </div>
                </div>
                { position?.name &&
                    <div className={styles.argumentHeaderRight}>
                        <div className={cx(styles.argumentPositionBox, positionClassName)}>
                            <div className={styles.argumentPosition}>
                                { position?.name }
                            </div>
                        </div>
                    </div>
                }
            </div>
            <div className={styles.argumentContent}>
                <div className={styles.placeholderFullWidthMargin}></div>
                { oneLineBottom === true && <div className={styles.placeholderFullWidth}></div> }
            </div>
            { handleClick ? 
                <Button className={styles.argumentBlankButton} handleClick={handleClick}>
                    <FormattedMessage id="argument.argument_blank_box.call_to_action" defaultMessage={"Add an argument"} />
                </Button>
            :
                <LinkButton 
                    to={getDebateUrl()}
                    target={"_top"}
                    data-tid={"action_add_argument"} 
                    className={styles.argumentBlankButton}
                    external
                >
                    <FormattedMessage id="argument.argument_blank_box.call_to_action" defaultMessage={"Add an argument"} />
                </LinkButton>
            }
        </div>
    );
}

ArgumentBlankBox.propTypes = {
    /** URL of the debate */
    debateUrl: PropTypes.string,
    /** A position object with an ID and a name */
    position: PropTypes.object,
    /** Class name of the argument position box */
    positionClassName: PropTypes.string,
    /** Function invoked when the add argument button is clicked */
    handleClick: PropTypes.func,
    /** To show an extra placeholder line at the bottom */
    oneLineBottom: PropTypes.bool
};

ArgumentBlankBox.defaultProps = {
    positionClassName: "",
    handleClick: null,
    oneLineBottom: true
};