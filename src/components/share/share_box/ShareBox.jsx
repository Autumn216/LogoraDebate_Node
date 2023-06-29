import React from 'react';
import styles from './ShareBox.module.scss';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { Tooltip } from '@logora/debate.tools.tooltip';
import { FacebookIcon, TwitterIcon, LinkIcon, MailIcon, CodeIcon } from '@logora/debate.icons';
import { useIntl } from 'react-intl';

export const ShareBox = (props) => {
    const intl = useIntl();

    const toggleSharing = (targetUrl) => {
        if(typeof window !== 'undefined') {
            let newWindow = window.open();
            newWindow.opener = null;
            newWindow.referrer = null;
            newWindow.location = targetUrl;
        }
    }

    return (
        <div className={styles.shareBox}>
            <Tooltip text={intl.formatMessage({ id:"share_copy_to_clipboard", defaultMessage: "Copy to clipboard" })} onClickText={intl.formatMessage({ id: "share_link_copied", defaultMessage: "Link copied !" })} position={props.tooltipPosition}>
                <CopyToClipboard tabIndex="0" className={styles.linkCopyButton} text={props.shareUrl}>
                    <div>
                        <LinkIcon role="button" className={styles.linkCopyIcon} data-tid={"action_embed_code_clipboard"} width={22} height={22} />
                    </div>
                </CopyToClipboard>
            </Tooltip>
            <Tooltip text={intl.formatMessage({ id:"share_facebook_share", defaultMessage: "Share on Facebook" })} position={props.tooltipPosition}>
                <div onClick={() => toggleSharing("https://www.facebook.com/sharer/sharer.php?u=" + encodeURIComponent(props.shareUrl))} className={styles.linkCopyButton} tabIndex={0}>
                    <FacebookIcon role="button" data-tid={"action_share_debate_facebook"} width={22} height={22} />
                </div>
            </Tooltip>
            <Tooltip text={intl.formatMessage({ id:"share_twitter_share", defaultMessage: "Share on Twitter" })} position={props.tooltipPosition}>
                <div onClick={() => toggleSharing("https://twitter.com/intent/tweet?text=" + encodeURIComponent(props.shareTitle) + "&url=" + encodeURIComponent(props.shareUrl))} className={styles.linkCopyButton} tabIndex={0}>
                    <TwitterIcon role="button" data-tid={"action_share_debate_twitter"} width={22} height={22} />
                </div>
            </Tooltip>
            <Tooltip text={intl.formatMessage({ id:"share_mail_share", defaultMessage: "Share by email" })} position={props.tooltipPosition}>
                <div onClick={() => toggleSharing("mailto:example@example.com?subject=" + props.shareTitle + "&body=" + props.shareText + "%0D%0A" + props.shareUrl)} className={styles.linkCopyButton} tabIndex={0}>
                    <MailIcon role="button" data-tid={"action_share_debate_mail"} width={23} height={22} />
                </div>
            </Tooltip>
            { props.showShareCode &&
                <Tooltip text={intl.formatMessage({ id:"share_embed_code_to_clipboard", defaultMessage: "Copy embed code" })} onClickText={intl.formatMessage({ id: "share_code_copied", defaultMessage: "Code copied !" })} position={props.tooltipPosition}>
                    <CopyToClipboard tabIndex="0" className={styles.codeCopyButton} text={props.shareCode}>
                        <div>
                            <CodeIcon role="button" data-tid={"action_embed_code_clipboard"} width={22} height={22} />
                        </div>
                    </CopyToClipboard>
                </Tooltip>
            }
        </div>
    );
}