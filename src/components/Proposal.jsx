import React, { useState, useEffect } from "react";
import { useIntl } from "react-intl";
import { ArgumentHeader } from "@logora/debate.argument.argument_header";
import { ExpandableText } from '@logora/debate.text.expandable_text';
import { lexicalToHtml } from "@logora/debate.input.text-editor/lexicalToHtml";
import { HashScroll } from '@logora/debate.tools.hash_scroll';
import ProposalBoxFooter from "./ProposalBoxFooter";
import draftToHtml from "draftjs-to-html";
import cx from "classnames";
import styles from './Proposal.module.scss';

const Proposal = (props) => {
    const [richContent, setRichContent] = useState(null);
    const [flash, setFlash] = useState(false);
    const intl = useIntl();
    const proposalId = "proposal_" + props.proposal.id;

    useEffect(() => {
        if (props.proposal.rich_content) {
            const rawContent = JSON.parse(props.proposal.rich_content);
            if(rawContent.hasOwnProperty("root")) {
                const html = lexicalToHtml(rawContent);
                setRichContent(html);
            } else {
                const htmlContent = draftToHtml(rawContent);
                setRichContent(htmlContent);
            }
        }
    }, [props.proposal.rich_content]);

    return (
        <HashScroll elementId={proposalId} onScroll={() => setFlash(true)}>
            <div className={cx(styles.proposalBoxContainer, { [styles.flash]: flash })} id={proposalId}>
                <ArgumentHeader 
                    author={props.proposal.author} 
                    tag={props.proposal.tag && props.proposal.tag.display_name}
                    tagClassName={styles.proposalTagText}
                    date={props.proposal.created_at}
                    oneLine={false}
                />
                <div className={cx(styles.proposalBoxContent, { [styles.fixedHeight]: props.fixedContentHeight } )}>
                    <div>
                        <ExpandableText 
                            maxHeight={props.contentMaxHeight ? props.contentMaxHeight : 156}
                            expandText={intl.formatMessage({ id: "action.read_more" })}
                            collapseText={intl.formatMessage({ id: "action.read_less" })}
                        >
                            <div className={styles.proposalTitle}>
                            { props.proposal.title }
                            </div>
                                {richContent ? (
                                    <>
                                        <div
                                            dangerouslySetInnerHTML={{ __html: richContent }}
                                        ></div>
                                    </>
                                ) : (
                                    <>
                                        <div>{props.proposal.content}</div>
                                    </>
                                )}
                        </ExpandableText>
                    </div>
                </div>
                <div className={styles.proposalBoxFooter}> 
                    <ProposalBoxFooter proposal={props.proposal} disabled={props.disabled} userProfileProposal={props.userProfileProposal} hasReport={!props.proposal.author.consultation_id} />
                </div>
            </div>
        </HashScroll>
    )
}

export default Proposal;
