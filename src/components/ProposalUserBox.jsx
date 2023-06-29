import React from 'react';
import styles from './ProposalUserBox.module.scss';
import { withConfig } from '@logora/debate.context.config_provider';
import { Link } from 'react-router-dom';
import Proposal from './Proposal';
import TextFormatter from '../utils/TextFormatter';

const ProposalUserBox = props => {
    const consultation = props.proposal.consultation;

    const date = new Date();
    const endDate = new Date(consultation.ends_at);

    const goToProposal = () => {
		if (props.config.routes.router === "hash") { return ( props.routes.consultationShowLocation.toUrl({ consultationSlug: consultation.slug }) + "/proposal_" + props.proposal.id);}
		return ( props.routes.consultationShowLocation.toUrl({ consultationSlug: consultation.slug }) + "/#proposal_" + props.proposal.id);
	};

    return (
        <div className={styles.proposalUserBox}>
            <Link to={goToProposal()}>
                <div className={styles.proposalUserBoxHeader}>
                    <div className={styles.proposalTitleBox}>
                        <div className={styles.proposalUserBoxTitle}>{consultation.title}</div>
                    </div>
                    { date > endDate ?
                        <div className={styles.consultationEnded}><TextFormatter id="info.consultation_ended" /></div>
                    :
                        <div className={styles.consultationInProgress}><TextFormatter id="info.consultation_in_progress" /></div>
                    }
                </div>
            </Link>
            <Proposal proposal={props.proposal} disabled={date > endDate} userProfileProposal={props.userProfileProposal} />
        </div>
    )
}

export default withConfig(ProposalUserBox);