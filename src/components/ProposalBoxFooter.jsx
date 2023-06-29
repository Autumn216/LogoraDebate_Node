import React, { lazy, Suspense } from "react";
import { EllipsisIcon } from '@logora/debate.icons';
import { useConfig, useRoutes } from '@logora/debate.context.config_provider';
import { useAuth } from "@logora/debate.auth.use_auth";
import { useModal } from '@logora/debate.dialog.modal';
import { useReportContent } from "@logora/debate.hooks.use_report_content";
import { useDeleteContent } from "@logora/debate.hooks.use_delete_content";
import { withInput } from "../store/InputAndListProvider";
import { useIntl } from "react-intl";
import { Dropdown } from '@logora/debate.tools.dropdown';
import { Link } from "react-router-dom";
import ProposalVoteBox from "./ProposalVoteBox";
const ShareModal = lazy(() => import('@logora/debate.share.share_modal'));
import styles from "./ProposalBoxFooter.module.scss";

const ProposalBoxFooter = (props) => {
    const intl = useIntl();
    const config = useConfig();
    const routes = useRoutes();
    const { currentUser } = useAuth();
    const { showModal } = useModal();
	const { reportContent } = useReportContent("Proposal", props.proposal.id, intl.formatMessage({ id: "header.report_proposal" }));
    const { deleteContent } = useDeleteContent(props.proposal, 
                                "proposals", 
                                "proposalsList", 
                                intl.formatMessage({ id: "info.delete_proposal" }),
                                intl.formatMessage({ id: "info.confirm_delete_proposal" }),
                                "alert.proposal_delete");

    const currentUserIsAuthor = () => {
        return props.proposal.author.id === currentUser.id;
    }

    const handleEditProposal = () => {
        props.setEditElement(props.proposal);
    }

    const handleShowShareModal = () => {
        showModal(
            <Suspense fallback={null}>
                <ShareModal
                    shareUrl={"https://app.logora.fr/share/p/" + props.proposal.id}
                    shareTitle={intl.formatMessage({ id: "share.proposal.title"}) }
                    shareText={intl.formatMessage({ id: "share.proposal.text"}) }
                    title={intl.formatMessage({ id: "share.proposal" })}
                    showShareCode={true}
                    shareCode={'<iframe src="https://api.logora.fr/embed.html?shortname=' + config.shortname + '&id=' + props.proposal.id + '&resource=proposal" frameborder="0" width="100%" height="335px" scrolling="no"></iframe>'}
                />
            </Suspense>
        );
    }

    const goToProposal = () => {
        if (config.routes.router === "hash") { return ( routes.consultationShowLocation.toUrl({ consultationSlug: props.proposal.consultation.slug }) + "/proposal_" + props.proposal.id);}
		return ( routes.consultationShowLocation.toUrl({ consultationSlug: props.proposal.consultation.slug }) + "/#proposal_" + props.proposal.id);
    }

    return (
        <div className={styles.proposalBoxFooterContainer}>
            <div className={styles.proposalUpvoteActions}>
                <ProposalVoteBox voteableType={"Proposal"} voteableId={props.proposal.id} totalUpvotes={props.proposal.total_upvotes} totalDownvotes={props.proposal.total_downvotes} disabled={props.disabled} />
            </div>
                <>
                    {props.hasReport && 
                        <div className={styles.proposalMoreActions}>
                            <Dropdown dropdownListRight={true} closeOnContentClick={true}>
                                <EllipsisIcon width={25} height={25} />
                                <div>
                                    {props.userProfileProposal !== true ? 
                                        <>
                                            {currentUserIsAuthor() && (
                                                <>
                                                    {!props.disabled &&
                                                        <>
                                                            <div className={styles.dropdownItem} tabIndex='0' onClick={() => handleEditProposal()}>
                                                                { intl.formatMessage({ id: 'action.update' }) }
                                                            </div>
                                                            <div className={styles.dropdownItem} tabIndex='0' onClick={() => deleteContent()}>
                                                                { intl.formatMessage({ id: 'action.delete' }) }
                                                            </div>
                                                        </>
                                                    }
                                                </>
                                            )} 
                                            <div className={styles.dropdownItem} onClick={() => reportContent()}>
                                                { intl.formatMessage({ id: 'action.report' }) }
                                            </div>
                                            <div className={styles.dropdownItem} onClick={() => handleShowShareModal()}>
                                                { intl.formatMessage({ id: 'action.share' }) }
                                            </div>
                                        </>
                                    :
                                        <Link className={styles.dropdownItem} to={goToProposal()}>
                                            { intl.formatMessage({ id: 'action.go_to_proposal' }) }
                                        </Link>
                                    }
                                </div>
                            </Dropdown>
                        </div> 
                    }            
                </>
        </div>
    )
}

export default withInput(ProposalBoxFooter);