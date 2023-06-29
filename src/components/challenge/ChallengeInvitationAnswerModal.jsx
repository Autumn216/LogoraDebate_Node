import React, { useState, useEffect } from 'react';
import { Modal, useModal } from '@logora/debate.dialog.modal';
import { useDataProvider } from '@logora/debate.data.data_provider';
import { withAlert } from '../../store/AlertProvider';
import { useRoutes } from '@logora/debate.context.config_provider';
import { useHistory } from 'react-router-dom';
import { useAuth } from "@logora/debate.auth.use_auth";
import { useIntl } from 'react-intl';
import { Loader } from '@logora/debate.tools.loader';
import ChallengeInvitationBox from './ChallengeInvitationBox';
import styles from './ChallengeInvitationAnswerModal.module.scss';

const ChallengeInvitationAnswerModal = (props) => {
    const [challengeInvitation, setChallengeInvitation] = useState(null);
    const [status, setStatus] = useState("LOADING");
    const intl = useIntl();
    const routes = useRoutes();
    const api = useDataProvider();
    const history = useHistory();
    const { currentUser } = useAuth();
    const { hideModal } = useModal();

    useEffect(() => {
        if (props.invitationUid) {
            api.getOneWithToken("debate_invitations", props.invitationUid).then(response => {
                if (response.data.success) {
                    const challengeInvitation = response.data.data.resource;
                    if (challengeInvitation.target.id !== currentUser.id) {
                        setChallengeInvitation(null);
                        props.toastAlert("challenge_invitation.error.unauthorized", "error");
                        hideModal();
                    }
                    if (challengeInvitation.is_answered) {
                        if(challengeInvitation.is_accepted) {
                            if(challengeInvitation.debate) {
                                const challengeSlug = challengeInvitation.debate.slug;
                                if (typeof window !== 'undefined') {
                                    history.push({
                                        pathname: routes.challengeShowLocation.toUrl({ challengeSlug: challengeSlug }),
                                        state: { prevPath: true }
                                    });
                                }
                            }
                        }
                        props.toastAlert("challenge_invitation.error.answered", "info");
                        hideModal();
                    }
                    setChallengeInvitation(challengeInvitation);
                    setStatus("INIT");
                } else {
                    props.toastAlert("challenge_invitation.error.unauthorized", "error");
                    hideModal();
                }
            }).catch(error => {
                props.toastAlert("challenge_invitation.error.unauthorized", "error");
                hideModal();
            });
        } else {
            props.toastAlert("challenge_invitation.error.unauthorized", "error");
            hideModal();
        }
    }, []);

    return (
        <div>
            <Modal data-vid={"group_invitation_answer_modal"} title={intl.formatMessage({ id: "challenge_invitation.answer_modal_title" })}>
                <div>
                    { status === "INIT" &&
                        <ChallengeInvitationBox challenge_invitation={ challengeInvitation } hideModal={ () => hideModal() } />
                    }
                    { status === "LOADING" &&
                        <div className={styles.modalContent}>
                            <Loader />
                        </div>
                    }
                </div>
            </Modal>
        </div>
    );
}

export default withAlert(ChallengeInvitationAnswerModal);
