import React, { useState, useEffect } from 'react';
import { useDataProvider } from '@logora/debate.data.data_provider';
import { useRoutes } from '@logora/debate.context.config_provider';
import { Link } from '@logora/debate.action.link';
import ChallengeFooter from './ChallengeFooter';
import ChallengeTextBox from './ChallengeTextBox';
import { Loader } from '@logora/debate.tools.loader';
import styles from './ChallengeBox.module.scss';

const ChallengeBox = (props) => {
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

    const firstPositionIndex = props.debate.group_context.positions[0].id === props.debate.debate_members[0].position.id ? 0 : 1;
    const secondPositionIndex = firstPositionIndex === 0 ? 1 : 0;

    return (
        <div className={styles.challengeBoxContainer}>
            <Link to={routes.challengeShowLocation.toUrl({challengeSlug: props.debate.slug})}>
                <div className={styles.challengeTitleBox} title={ props.debate.name }>
                    <div className={styles.challengeTitle}>
                        { props.debate.name }
                    </div>
                </div>
                <div className={styles.challengeUsers}>
                    {isLoading === false ?
                        <>
                            <div className={styles.userBox}>
                                <ChallengeTextBox
                                    argument={challengeMessages[0]}
                                    position={props.debate.from_argument ? secondPositionIndex : firstPositionIndex}
                                    slug={props.debate.slug}
                                    user={props.debate.from_argument ? props.debate.debate_members[1] : props.debate.debate_members[0]} 
                                />
                            </div>
                            <div className={styles.userBox}>
                                {props.debate.debate_members[1] &&
                                    <ChallengeTextBox
                                        argument={challengeMessages[1] && challengeMessages[1]}
                                        position={props.debate.from_argument ? firstPositionIndex : secondPositionIndex}
                                        slug={props.debate.slug}
                                        user={props.debate.from_argument ? props.debate.debate_members[0] : props.debate.debate_members[1]} 
                                    />
                                }
                            </div>
                        </>
                    :
                        <Loader />
                    }
                    
                </div>
                <div className={styles.challengeFooter}>
                    <ChallengeFooter 
                        debate={props.debate}
                        currentPhase={props.debate.current_phase} 
                        currentRound={props.debate.current_round} 
                        totalVotes={props.debate.votes_count.total}
                    />
                </div>
            </Link>
        </div>
    );
}

export default ChallengeBox;