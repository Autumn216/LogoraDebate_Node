import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { useConfig, useRoutes } from '@logora/debate.context.config_provider';
import { useResponsive } from "@logora/debate.hooks.use_responsive";
import { useIntl } from 'react-intl';
import { AdUnit } from '@logora/debate.ad.ad_unit';
import { EmbedHeader } from '@logora/debate.embed.embed_header';
import { ArgumentBox } from '@logora/debate.argument.argument_box';
import ProgressBar from "@logora/debate.tools.progress_bar";
import { ProposalBlankBox } from '@logora/debate.proposal.proposal_blank_box';
import { LinkButton } from '@logora/debate.action.link_button';
import styles from './ConsultationEmbed.module.scss';

export const ConsultationEmbed = ({ consultation }) => {
	const { slug, title, ends_at, total_votes = 0, vote_goal = 0, proposals = [], online_users_count = 0} = consultation;
	const intl = useIntl();
	const config = useConfig();
	const routes = useRoutes();
    const [isMobile, isDesktop, isTablet] = useResponsive();

	const consultationUrl = routes.consultationShowLocation.toUrl({ consultationSlug: slug });
	const date = useMemo(() => new Date());
    const endDate = new Date(ends_at);

	const seed = useMemo(() => Math.random());
	const randomProposal = proposals[Math.floor(seed * proposals?.length)];

	return (
		<div className={styles.container}>
			<EmbedHeader 
				title={title} 
				titleRedirectUrl={consultationUrl} 
				headerLabel={intl.formatMessage({ id: "consultation.consultation_embed.title", defaultMessage: "Consultation" })} 
				onlineUsersCount={online_users_count} 
				textLeft={true}
			/>
			<div className={styles.body}>
				<div className={styles.leftColumn}>
					<div className={styles.progressContainer}>
						<ProgressBar 
							progress={total_votes} 
							goal={vote_goal || 0}
							isLeft={true}
							showProgressSubtitle={true}
							progressUnit={"votes"}
							className={styles.progress} 
							barFull={endDate < date ? true : false}
						/>
					</div>
					<LinkButton 
						to={consultationUrl} 
						className={styles.callToAction}
						target="_top" 
						external
					>
						{ intl.formatMessage({ id: "consultation.consultation_embed.call_to_action", defaultMessage: "Give your opinion" }) }
					</LinkButton>
				</div>
				{ isMobile &&
					<AdUnit type={"article"} sizes={[[300, 250], [300, 50]]} />
				}
				<div className={styles.topProposal}>
					{ proposals?.length > 0 ?
						<ArgumentBox
							author={randomProposal?.author}
							link={consultationUrl}
							tag={randomProposal?.tag?.display_name}
							content={randomProposal.content}
							headerOneLine
						/>
					:
						<ProposalBlankBox redirectUrl={consultationUrl} />
					}
				</div>
				<LinkButton 
						to={consultationUrl} 
						className={styles.footerButton}
						target="_top" 
						external
					>
					{ intl.formatMessage({ id: "consultation.consultation_embed.call_to_action", defaultMessage: "Give your opinion" }) }
				</LinkButton>
			</div>
			{ (config.modules?.drawer && config.insertType !== 'iframe') && <div id="logora_app"></div> }
		</div>
	);
}

ConsultationEmbed.propTypes = {
    /** Object containing the consultation information */
    consultation: PropTypes.object.isRequired
}