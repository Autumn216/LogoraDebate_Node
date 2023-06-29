import React from "react";
import { useRoutes } from '@logora/debate.context.config_provider';
import { useIntl } from "react-intl";
import { ReadMore } from '@logora/debate.text.read_more';
import { Link } from '@logora/debate.action.link'; 
import styles from './ProposalSynthesisBox.module.scss';

const ProposalSynthesisBox = (props) => {
    const intl = useIntl();
    const routes = useRoutes();

    const capitalizeFirstLetter = (tag) => {
        return tag.charAt(0).toUpperCase() + tag.slice(1);
    }

    return (
        <div className={styles.container}>
            <div className={styles.theme}>
                { props.proposal.tag && 
                    <span>{ capitalizeFirstLetter(props.proposal.tag.display_name) }</span>
                }
            </div>
            <div className={styles.title}>
                <span>{ capitalizeFirstLetter(props.proposal.title) } -</span>
                    <Link to={routes.userShowLocation.toUrl({userSlug: props.proposal.author.slug})}>
                        <img className={styles.authorImage} src={props.proposal.author.image_url} loading={"lazy"} alt={props.proposal.author.full_name} height="25" width="25" />
                    </Link>
                { props.proposal.author.first_name && props.proposal.author.last_name ?
                    <Link to={routes.userShowLocation.toUrl({userSlug: props.proposal.author.slug})}>
                        <span className={styles.authorName}>
                            { capitalizeFirstLetter(String(props.proposal.author.first_name)).slice(0, 1) + "."}&nbsp;{capitalizeFirstLetter(props.proposal.author.last_name)}
                        </span>
                    </Link>
                :
                    props.proposal.author.full_name
                }
            </div>
            <div className={styles.content}>
                <ReadMore
                    content={props.proposal.content.replace(/[\n\r]/g, ' ')}
                    contentCharCount={40}
                    readMoreText={intl.formatMessage({ id: "action.read_more" })}
                    readLessText={intl.formatMessage({ id: "action.read_less" })}
                />
            </div>
        </div>
    )
}

export default ProposalSynthesisBox;
