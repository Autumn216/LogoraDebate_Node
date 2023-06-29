import React from 'react';
import PropTypes from "prop-types";
import { useRoutes } from '@logora/debate.context.config_provider';
import { FormattedMessage } from 'react-intl';
import { ArrowIcon } from "@logora/debate.icons";
import styles from './DebateEmbedOneLine.module.scss';

export const DebateEmbedOneLine = ({ debate }) => {
    const { name, slug } = debate;
    const routes = useRoutes();

    const debateUrl = routes.debateShowLocation.toUrl({ debateSlug: slug });

	return (
		<div className={styles.container}>
			<a href={debateUrl} className={styles.title} target="_top" title={name}>
				{ name }
			</a>
			<a href={debateUrl} className={styles.link} data-tid="link-widget" target="_top">
				<div>
					<FormattedMessage id="debate.debate_embed_one_line.call_to_action" defaultMessage={"Go to debate"} />
				</div>
				<span>
					<ArrowIcon width={30} height={30} />
				</span>
			</a>
		</div>
	);
}

DebateEmbedOneLine.propTypes = {
	/** debate object containing name and slug */
	debate: PropTypes.object
};