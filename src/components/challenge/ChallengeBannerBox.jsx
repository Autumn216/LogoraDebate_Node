import React, { useState, useEffect } from 'react';
import { withResponsive } from "@logora/debate.hooks.use_responsive";
import { useDataProvider } from '@logora/debate.data.data_provider';
import { useRoutes } from '@logora/debate.context.config_provider';
import { FormattedMessage } from 'react-intl';
import { ArrowIcon } from "@logora/debate.icons";
import { Link } from '@logora/debate.action.link';
import ChallengeFooter from './ChallengeFooter';
import Argument from '../Argument';
import { Loader } from '@logora/debate.tools.loader';
import ChallengeArgumentBlankBox from './ChallengeArgumentBlankBox';
import cx from 'classnames';
import styles from "./ChallengeBannerBox.module.scss";

const ChallengeBannerBox = (props) => {
    const api = useDataProvider();
    const routes = useRoutes();
    const [challengeMessages, setChallengeMessages] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
		loadMessages(props.debate.slug);
	}, [])

    const loadMessages = (challengeSlug) => {
		api.getList("debates/" + challengeSlug + "/messages", { page: 1, per_page: 10, sort: "+created_at" }).then(
			response => {
				if(response.data.success) {
                    if(response.data.data) {
                        const message = response.data.data;
                        setChallengeMessages(message);
                        setIsLoading(false);
                    }
				}
			}
		)
	}

    return (
      <>
        {isLoading === false ?
            <div className={styles.challengeBannerContainer}>
                <div className={styles.challengeBannerTitle}>
                    <FormattedMessage id="challenge.banner_title" />
                </div>
                <div className={styles.challengeInfoContainer}>
                    <div className={styles.challengeTitle}>{props.debate.name}</div>
                    <div className={cx(styles.challengeArgumentsContainer, {[styles.isArgumentsContainerMobile]: props.isMobile})}>
                        <div className={cx(styles.challengeArgument, {[styles.isArgumentMobile]: props.isMobile})}>
                            {challengeMessages.length === 0 ?
                                <ChallengeArgumentBlankBox
                                    nextUser={props.debate.debate_members.find(member => member.user.id !== props.debate.next_user_id)}
                                    positionIndex={props.debate.group_context.positions.map((e) => e.id).indexOf(props.debate.debate_members[0].position.id)}
                                />
                            :
                                <Argument
                                    positionIndex={props.debate.group_context.positions.map((e) => e.id).indexOf(challengeMessages[0].position.id) + 1}
                                    debateIsActive={true}
                                    debatePositions={props.debate.group_context.positions}
                                    argumentNoFooter={true}
                                    argument={challengeMessages[0]}
                                    key={challengeMessages[0].id}
                                    expandable={true}
                                    challengeBannerArgument={true}
                                />
                            }
                        </div>
                        <div className={cx(styles.challengeArgument, {[styles.challengeBlankArgument]: challengeMessages.length < 2, [styles.isArgumentMobile]: props.isMobile})}>
                            {challengeMessages.length < 2 ?
                                <ChallengeArgumentBlankBox
                                    nextUser={props.debate.debate_members.find(member => member.user.id === props.debate.next_user_id)}
                                    positionIndex={props.debate.group_context.positions.map((e) => e.id).indexOf(props.debate.debate_members[1].position.id)}
                                />
                            :
                                <Argument
                                    positionIndex={props.debate.group_context.positions.map((e) => e.id).indexOf(challengeMessages[1].position.id)}
                                    debateIsActive={true}
                                    debatePositions={props.debate.group_context.positions}
                                    argumentNoFooter={true}
                                    argument={challengeMessages[1]}
                                    key={challengeMessages[1].id}
                                    expandable={true}
                                    challengeBannerArgument={true}
                                />
                            }
                        </div>
                    </div>
                    <ChallengeFooter 
                        debate={props.debate}
                        currentPhase={props.debate.current_phase} 
                        currentRound={props.debate.current_round} 
                        totalVotes={props.debate.votes_count.total}
                    />
                </div>
                <div className={cx(styles.challengeBannerButtonContainer, { [styles.isButtonMobile]: props.isMobile })}>
                    <Link data-tid={"action_challenge_banner_view"} className={styles.challengeBannerButton} to={ routes.challengeShowLocation.toUrl({challengeSlug: props.debate.slug}) }>
                        <span className={styles.challengeTextButton}>
                            <FormattedMessage id="action.view_challenge" />
                        </span>
                        <span>
                            <ArrowIcon width={30} height={30} />
                        </span>
                    </Link>
                </div>
            </div>
        :
            <Loader />
        }
      </>
    )
}

export default withResponsive(ChallengeBannerBox);