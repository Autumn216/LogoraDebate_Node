import { Location } from '@logora/debate.util.location';

export function getRoutes(routes) {
    let prefixPath = routes.prefixPath === undefined ? "/espace-debat" : (routes.prefixPath ? "/" + routes.prefixPath : "");
    const indexPath = routes.indexPath === undefined ? "/debats" : (routes.indexPath ? "/" + routes.indexPath : "");
    const debatePath = routes.debatePath === undefined ? "/debat" : (routes.debatePath ? "/" + routes.debatePath : "");
    const userPath = routes.userPath ? "/" + routes.userPath : "/user";
    const searchPath = routes.searchPath ? "/" + routes.searchPath : "/search";
    const consultationPath = routes.consultationPath === undefined ? "/consultation" : (routes.consultationPath ? "/" + routes.consultationPath : "");
    const consultationIndexPath = routes.consultationIndexPath === undefined ? "/consultations" : (routes.consultationIndexPath ? "/" + routes.consultationIndexPath : "");
    const challengePath = routes.challengePath === undefined ? "/duel" : (routes.challengePath ? "/" + routes.challengePath : "");
    const challengeCreatePath = routes.challengeCreatePath === undefined ? "/duels/demarrer" : (routes.challengeCreatePath ? "/" + routes.challengeCreatePath : "");
    const challengeIndexPath = routes.challengeIndexPath === undefined ? "/duels" : (routes.challengeIndexPath ? "/" + routes.challengeIndexPath : "");
    const suggestionPath = routes.suggestionPath === undefined ? "/suggestions" : (routes.suggestionPath ? "/" + routes.suggestionPath : "");
    const informationPath = routes.informationPath === undefined ? "/informations" : (routes.informationPath ? "/" + routes.informationPath : "");
    const commentPath = routes.commentPath === undefined ? "/commentaires" : (routes.commentPath ? "/" + routes.commentPath : "");

    if(routes.router === "hash") {
        prefixPath = "";
    }

    let RootLocation = new Location(prefixPath);
    let IndexLocation = new Location(prefixPath + indexPath);
    let DebateShowLocation = new Location(prefixPath + debatePath + '/:debateSlug', { debateSlug: "" });
    let UserEditLocation = new Location(prefixPath + userPath + '/edit');
    let UserShowLocation = new Location(prefixPath + userPath + '/:userSlug', { userSlug: "" });
    let SearchLocation = new Location(prefixPath + searchPath, {}, { q: "" });
    let ConsultationShowLocation = new Location(prefixPath + consultationPath + '/:consultationSlug', { consultationSlug: "" });
    let ConsultationIndexLocation = new Location(prefixPath + consultationIndexPath);
    let ChallengeShowLocation = new Location(prefixPath + challengePath + '/:challengeSlug', { challengeSlug: "" });
    let ChallengeCreateLocation = new Location(prefixPath + challengeCreatePath);
    let ChallengeIndexLocation = new Location(prefixPath + challengeIndexPath);
    let SuggestionLocation = new Location(prefixPath + suggestionPath);
    let InformationLocation = new Location(prefixPath + informationPath);
    let CommentShowLocation = new Location(prefixPath + commentPath + '/:articleUid', {articleUid: ""});

    return {
        rootLocation: RootLocation,
        indexLocation: IndexLocation,
        debateShowLocation: DebateShowLocation,
        userEditLocation: UserEditLocation,
        userShowLocation: UserShowLocation,
        searchLocation: SearchLocation,
        consultationShowLocation: ConsultationShowLocation,
        consultationIndexLocation: ConsultationIndexLocation,
        challengeShowLocation : ChallengeShowLocation,
        challengeCreateLocation: ChallengeCreateLocation,
        challengeIndexLocation: ChallengeIndexLocation,
        suggestionLocation: SuggestionLocation,
        informationLocation: InformationLocation,
        commentShowLocation: CommentShowLocation
    };
}

export function buildPath(routeConfig, path) {
    if(routeConfig.router === "hash") {
        const prefixPath = routeConfig.prefixPath === undefined ? "/espace-debat" : (routeConfig.prefixPath ? "/" + routeConfig.prefixPath : "");
        return prefixPath + "/#" + path;
    }
    return path;
}