import React from 'react';
import { IntlProvider } from 'react-intl';
import { ConfigProvider } from '@logora/debate.context.config_provider';
import { DebateBox } from './DebateBox';
import { Location } from '@logora/debate.util.location';
import { BrowserRouter } from 'react-router-dom';

let UserShowLocation = new Location('espace-debat/user/:userSlug', { userSlug: "" })
let DebateShowLocation = new Location('espace-debat/group/:debateSlug', { debateSlug: "" })

const routes = {
    userShowLocation: UserShowLocation,
    debateShowLocation: DebateShowLocation
}

const debate = {
		id: 243,
		is_public: true,
		name: "Transition écologique: faut-il investir davantage dans le transport ferroviaire ?",
		slug: "transition-ecologique-faut-il-investir-davantage-dans-le-transport-ferroviaire-ytPDq",
		description: null,
		created_at: "2022-11-28T14:07:16.866Z",
		score: 0,
		image_url: "https://dfrx2oay1w3r9.cloudfront.net/uploads/default_group.jpg",
		banner_image_url: "https://dfrx2oay1w3r9.cloudfront.net/uploads/default_group.jpg",
		votes_count: {
			655: "2",
			656: "6",
			657: "0",
			total: "8"
		},
		direct_url: "https://test.logora.fr/#/debat/transition-ecologique-faut-il-investir-davantage-dans-le-transport-ferroviaire-ytPDq",
		participants_count: 3,
		group_context: {
			id: 273,
			name: "Transition écologique : faut-il investir davantage dans le transport ferroviaire ?",
			created_at: "2022-11-28T14:07:16.815Z",
			positions: [
				{
					id: 655,
					name: "Oui"
				},
				{
					id: 656,
					name: "Non"
				},
				{
					id: 657,
					name: "Sans opinion"
				}
			],
			author: {
				id: 2,
				first_name: "Logora",
				last_name: "Admin",
				slug: "logora-admin",
				image_url: "https://dfrx2oay1w3r9.cloudfront.net/uploads/standard_437915418381d5ce4157188295044388.jpg",
				full_name: "Logora Admin",
				description: null,
				last_activity: "2022-11-24T16:05:27.257Z",
				is_expert: false,
				is_admin: true,
				points: 13800,
				eloquence_title: "debate_suggestion_accepted"
			}
		},
		participants: [
			{
				id: 39,
				first_name: "Gilles",
				last_name: "Seum",
				slug: "gilles-seum",
				image_url: "https://dfrx2oay1w3r9.cloudfront.net/uploads/standard_78bed8abdcdea92085e0040ee404636d.jpg",
				full_name: "Gilles Seum",
				description: null,
				last_activity: "2022-12-06T10:51:58.764Z",
				is_expert: false,
				is_admin: false,
				points: 41,
				eloquence_title: null,
				occupation: null
			},
			{
				id: 82,
				first_name: "dlfkjlkj",
				last_name: "lkjdlkfjlk",
				slug: "dlfkjlkj-lkjdlkfjlk",
				image_url: "https://dfrx2oay1w3r9.cloudfront.net/uploads/standard_9361b20e60b70964d6ef1b7696dea781.jpg",
				full_name: "Dlfkjlkj Lkjdlkfjlk",
				description: null,
				last_activity: "2023-02-13T10:03:16.792Z",
				is_expert: false,
				is_admin: false,
				points: 1589,
				eloquence_title: null,
				occupation: null
			}
		]
	}

export const DefaultDebateBox = () => {
    return (
        <BrowserRouter>
            <IntlProvider locale="en">
                <ConfigProvider routes={{...routes}} config={{ modules: {}}}>
                    <DebateBox debate={debate} />
                </ConfigProvider>
            </IntlProvider>
        </BrowserRouter>
    )
};