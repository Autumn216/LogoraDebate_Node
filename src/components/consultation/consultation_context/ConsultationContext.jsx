import React, { useMemo } from 'react';
import { UserIcon, ChatIcon } from '@logora/debate.icons';
import { ShareButton } from '@logora/debate.share.share_button';
import { useIntl, FormattedMessage, FormattedDate } from 'react-intl';
import { ExpandableText } from '@logora/debate.text.expandable_text';
import ProgressBar from "@logora/debate.tools.progress_bar";
import styles from './ConsultationContext.module.scss';
import cx from 'classnames';
import { useConfig } from '@logora/debate.context.config_provider';

export const ConsultationContext = (props) => {
    const consultation = props.consultation;
    const intl = useIntl();
    const date = useMemo(() => new Date());
    const endDate = new Date(consultation.ends_at);
	const config = useConfig();

    return (
		<div className={styles.consultationContextContainer} data-pid="consultation">
			<div className={styles.consultationContext}>
				<div className={styles.consultationHeader}>
					{props.disabled ?
						<div className={styles.consultationEnded}>
							<FormattedMessage id="consultation.consultation_context.consultation_ended" defaultMessage="Consultation is ended" />
						</div>
					:
						<div className={styles.consultationInProgress}>
							<FormattedMessage id="consultation.consultation_context.consultation_in_progress" defaultMessage="Consultation is in progress" />
						</div>
					}
					<div className={styles.consultationStats}>
						<p>
							<FormattedMessage id="consultation.consultation_context.consultation_end" defaultMessage="End of consultation: " /> 
							<FormattedDate value={new Date(consultation.ends_at)} year="numeric" month="long" day="2-digit" />
						</p>
						<div className={styles.consultationStatsBody}>
							<div className={styles.consultationsStatsIcons}>
								<div className={styles.consultationStatsBox}>
									<div>{consultation.proposals_count}</div>
									<ChatIcon width={17} height={20} {...(config.theme.iconTheme === "edge" && {variant: "edge"})} />
								</div>
								<div className={styles.consultationStatsBox}>
									<div>{consultation.total_participants || 0}</div> 
									<UserIcon width={17} height={20} />
								</div>
							</div>
							<div className={styles.shareButton}>
								<ShareButton
									shareUrl={"https://app.logora.fr/share/c/" + consultation.id} 
									shareTitle={intl.formatMessage({ id: "consultation.consultation_context.consultation_title", defaultMessage: "Share consultation" })} 
									shareText={intl.formatMessage({ id: "consultation.consultation_context.consultation_text", defaultMessage: "This consultation might interest you !" })} 
									showText 
								/>
							</div>
						</div>	
					</div>
				</div>
				<div className={styles.consultationTitle}>
					{consultation.title}
				</div>
				<ExpandableText 
					maxHeight={175}
					expandText={intl.formatMessage({ id: "consultation.consultation_context.read_more", defaultMessage: "Read more" })}
					collapseText={intl.formatMessage({ id: "consultation.consultation_context.read_less", defaultMessage: "Read less" })}
				>
					<div className={styles.consultationDescription}>
						{consultation.description} 
						{consultation.description_url && 
							<a href={consultation.description_url}>
								<FormattedMessage id="consultation.consultation_context.consultation_learn_more" defaultMessage="Learn more" />
							</a> 
						}
					</div>
				</ExpandableText>
				<div className={styles.consultationProgressBar}>
					<ProgressBar 
						progress={consultation.total_votes} 
						goal={consultation.vote_goal || 0}
						title={intl.formatMessage(
							endDate < date ? 
								{ id: "consultation.consultation_context.consultation_vote_number", defaultMessage: "Number of votes" }
							:
								{ id: "consultation.consultation_context.consultation_vote_goal", defaultMessage: "Vote goal" }
							)}
						showProgressSubtitle={true}
						progressUnit={"votes"}
						className={styles.consultationProgress} 
						barFull={endDate < date ? true : false}
					/>
				</div>
				<div className={cx(styles.consultationContextImageContainer, styles.mobile)}>
					<img loading={"lazy"} className={cx(styles.consultationContextImage, styles.mobile)} src={consultation.image_url} />
				</div>
			</div>
		</div>
    )
}