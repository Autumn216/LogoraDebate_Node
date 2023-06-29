import React from 'react';
import { Switch, Route } from 'react-router-dom';
import loadable from '@loadable/component';
import { useConfig, useRoutes } from '@logora/debate.context.config_provider';
import { useUrlInitAuth } from './hooks/useUrlInitAuth';
import { useUpdateUserConsent } from './hooks/useUpdateUserConsent';
import Navbar from './Navbar';
import { ScrollToTop } from '@logora/debate.tools.scroll_to_top';
const Index = loadable(() => import('./Index'));
const Debate = loadable(() => import('./debate/Debate'));
const Search = loadable(() => import('./Search'));
const User = loadable(() => import('./user/User'));
const UserEdit = loadable(() => import('./user/UserEdit'));
const Consultation = loadable(() => import('./consultation/Consultation'));
const ConsultationIndex = loadable(() => import('@logora/debate.consultation.consultation_index'));
const Challenge = loadable(() => import('./challenge/Challenge'));
const ChallengeIndex = loadable(() => import('./challenge/ChallengeIndex'));
const ChallengeCreate = loadable(() => import('./challenge/ChallengeCreate'));
const SuggestionIndex = loadable(() => import('./SuggestionIndex'));
const Informations = loadable(() => import('./Informations'));
const Comments = loadable(() => import('./Comments'));
import Footer from '@logora/debate.layout.footer';
import StandardErrorBoundary from "@logora/debate.error.standard_error_boundary";
import NavbarButton from './NavbarButton';
import styles from './App.module.scss';

const App = () => {
    const config = useConfig();
    const routes = useRoutes();
    useUrlInitAuth();
    useUpdateUserConsent();

    return (
        <>
            <StandardErrorBoundary>
                { config.layout.hideNav === true ? null : (
                    <>
                        <Navbar />
                        <>
                            { config.layout.hideNavbarButton === true ? null : (
                                <NavbarButton />
                            )}
                        </>
                    </>
                )}
                <div className={styles.layout}>
                    <ScrollToTop elementId={config.isDrawer == true ? "logora_navbar" : "logora_app" } />
                    <Switch>
                        <Route path={routes.searchLocation.path} component={Search} />
                        <Route exact path={routes.userEditLocation.path} component={UserEdit} />
                        <Route path={routes.userShowLocation.path} component={User} />
                        {config.modules.consultation && <Route path={routes.consultationShowLocation.path} component={Consultation} />}
                        {config.modules.consultation && <Route path={routes.consultationIndexLocation.path} component={ConsultationIndex} />}
                        <Route path={routes.debateShowLocation.path} component={Debate} />
                        <Route path={routes.challengeShowLocation.path} component={Challenge} />
                        <Route exact path={routes.challengeCreateLocation.path} component={ChallengeCreate} />
                        <Route exact path={routes.challengeIndexLocation.path} component={ChallengeIndex} />
                        <Route exact path={routes.suggestionLocation.path} component={SuggestionIndex} />
                        <Route exact path={routes.informationLocation.path} component={Informations} />
                        {config.modules.comments && <Route exact path={routes.commentShowLocation.path} component={Comments} />}
                        <Route exact path={routes.indexLocation.path} component={Index} />
                        <Route exact path={routes.rootLocation.path} component={Index} />
                    </Switch>
                </div>
                { config.layout.hideNav === true || config.layout.hideFooter === true ? null : (
                    <Footer />
                )}
            </StandardErrorBoundary>
        </>
    );
}

export default App;
