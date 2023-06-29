import React, { createContext, Component, lazy, Suspense } from "react";
import { withAuth } from "@logora/debate.auth.use_auth";
import { injectIntl } from "react-intl";
import { toast } from 'react-hot-toast';
const AlertContainer = lazy(() => import('@logora/debate.dialog.alert_container'));

export const AlertContext = createContext();

class AlertProvider extends Component {
    state = {
        toastAlert: (textKey, type, points, name, contentKey) => this.displayAlert(textKey, type, points, name, contentKey),
    };

    displayAlert = (textKey, type, points = 50, name, contentKey) => {
        toast(this.props.intl.formatMessage({ id: textKey }), { type: type, points: points });
        this.getAlert(name, contentKey);
    };

    setItem = (contentKey) => {
        if(typeof window !== "undefined") {
            window.localStorage.setItem(contentKey, true);
        }
    }

    getAlert = (name, contentKey) => {
        const isStoredChoice = JSON.parse(typeof window !== "undefined" && window.localStorage && window.localStorage.getItem(contentKey)) || false;
        switch(name) {
            case "ARGUMENT":
                if (!isStoredChoice && this.props.currentUser.messages_count === 0) {
                    toast(this.props.intl.formatMessage({ id: "alert.argument_first_step" }), { type: "info" });
                    this.setItem(contentKey);
                } else if (!isStoredChoice && this.props.currentUser.messages_count === 2) {
                    toast(this.props.intl.formatMessage({ id: "alert.argument_second_step" }), { type: "info" });
                    this.setItem(contentKey);
                }
                break;
            case "VOTE":
                if (!isStoredChoice && this.props.currentUser.votes_count === 0) {
                    toast(this.props.intl.formatMessage({ id: "alert.vote_first_step" }), { type: "info" });
                    this.setItem(contentKey);
                }
                break;
            case "PROPOSAL":
                if (!isStoredChoice && this.props.currentUser.proposals_count === 0) {
                    toast(this.props.intl.formatMessage({ id: "alert.vote_first_step" }), { type: "info" });
                    this.setItem(contentKey);
                }
                break;
            default:
                return null;
        }
    }

    render() {
        return (
            <AlertContext.Provider value={this.state}>
                {this.props.children}
                <Suspense fallback={null}>
                    <AlertContainer />
                </Suspense>
            </AlertContext.Provider>
        );
    }
}

export default injectIntl(withAuth(AlertProvider));

export const withAlert = Component => props => (
  <AlertContext.Consumer>
    {context => <Component {...props} {...context} />}
  </AlertContext.Consumer>
)