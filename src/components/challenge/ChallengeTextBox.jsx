import React from 'react';
import { useIntl, FormattedMessage } from 'react-intl';
import { withConfig } from '@logora/debate.context.config_provider';
import { Link } from '@logora/debate.action.link';
import { withResponsive } from "@logora/debate.hooks.use_responsive";
import cx from 'classnames';
import styles from './ChallengeTextBox.module.scss';

const ChallengeTextBox = (props) => {
    const ARGUMENT_LENGTH = 100;
    const intl = useIntl();

    const formatArgumentContent = (content) => {
        return content.replace(/[\n\r]/g, ' ').slice(0,ARGUMENT_LENGTH);
    }

  return (
    <div className={cx(styles.challengeContainer, {[styles.containerIsMobile]: props.isMobile})}>
        <div className={styles.author}>
            <img src={props.user.user.image_url} width={35} height={35} alt={intl.formatMessage({ id:"alt.profile_picture" }) + props.user.user.full_name } title={props.user.user.full_name} />
            <div className={styles.authorInfos}>
                <span className={styles.authorName}>{props.user.user.full_name}</span>
                <div className={cx(styles.authorPosition, styles[`position-${props.position + 1}`])}>
                    {props.user.position.name}
                </div>
            </div>
        </div>
        <div className={styles.challengeMessage}>
            {props.argument ? 
                <> 
                    {props.argument.status !== "rejected" ?
                        <>
                            <span>{formatArgumentContent(props.argument.content)}</span>
                            {props.argument.content.toString().length > ARGUMENT_LENGTH && 
                                <>
                                    <span>...</span>
                                    <span className={styles.readMoreLink}>
                                        <Link to={props.routes.challengeShowLocation.toUrl({challengeSlug: props.slug})}>
                                            <FormattedMessage id="action.read_more" />
                                        </Link>
                                    </span>
                                </>
                            }
                        </>
                    :
                        <span className={styles.emptyText}><FormattedMessage id="info.duel_message_rejected" /></span>
                    }
                </>
            :
                <div className={styles.emptyText}><FormattedMessage id="group_invitation.waiting" /></div>
            }
        </div>
    </div>
  )
}

export default withResponsive(withConfig(ChallengeTextBox));