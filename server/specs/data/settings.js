function createMockSettings() {
    return {
        logo: {
            desktop: 'https://res.cloudinary.com/mboulgour/image/upload/v1655815229/logo-desktop_3x_r95sie.jpg',
            mobile: 'https://logora-logos.s3-eu-west-1.amazonaws.com/logora-logo.png',
            favicon: ''
        },
        theme: {
            callPrimaryColor: '#417EC7',
            forPrimaryColor: '#C24D50',
            againstPrimaryColor: '#7980BB',
            fontFamily: 'Montserrat',
            firstPositionColorPrimary: '#417EC7',
            secondPositionColorPrimary: '#C24D50',
            thirdPositionColorPrimary: '#9b9b9b'
        },
        modules: {
            consultation: true,
            challenges: true,
            suggestions: { active: true, vote_goal: '1' },
            drawer: true,
            comments: true,
            subApplications: true,
            statistics: true,
            allowTagDuplicate: true,
            contextSources: true,
            announcementDialog: true,
            announcementMessage: '29 composants / 80'
        },
        synthesis: { newDesign: true, defaultGroup: true },
        provider: {
            name: 'LogoraDémo',
            url: 'https://test.logora.fr',
            companyName: '',
            companyAddress: '4 rue de la super entreprise trop cool',
            companyDescription: ''
        },
        badges: {},
        routes: {
            prefixPath: '',
            indexPath: 'debats',
            debatePath: 'debat',
            challengePath: 'duel',
            challengeIndexPath: 'duels',
            commentPath: 'commentaires',
            consultationPath: 'consultation',
            consultationIndexPath: 'consultations',
            searchPath: 'recherche',
            userPath: 'utilisateur',
            suggestionPath: 'suggestions',
            router: 'hash'
        },
        ads: {
            display: false,
            googleAdManager: {}
        },
        consent: {},
        auth: {
            type: 'social',
            anonymousFirstName: 'Débatteur',
            anonymousLastName: 'Anonyme',
            login_url: 'https://login.com',
            authDialogEndpoint: 'https://login.com',
            showEmailConsent: true
        },
        analytics: {},
        locale: { language: 'fr' },
        moderation: { type: 'pre', mode: 'smart' },
        notifications: { email: true, newsletter: false },
        layout: {
            hideMargins: true,
            messageReplySubject: '{sender_name} {receiver_name} {provider_name}',
            miscGoToDebate: 'salut !',
            newsletterWeeklyHeader: '{provider_description}, {provider_address}',
            actionAbout: 'C ki ?',
            headerMainDebate: 'Le débat EN AVANT',
            actionDelete: 'supppprrriiiiiiiimmer'
        },
        excluded_tags: { list: [] },
        vote: { neutralThesis: true, name: 'NSPP' },
        admin: { minArticlesPerTag: 3 },
        id: 1,
        provider_token: '39zY5F2wfOqktnPsoduUL_z3WS8qeBxSs6aDvVG48GY',
        api_key: '39zY5F2wfOqktnPsoduUL_z3WS8qeBxSs6aDvVG48GY'
    }
}

module.exports = {
    createMockSettings
}