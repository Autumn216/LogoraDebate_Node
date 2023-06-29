import React from "react";
import { Modal } from '@logora/debate.dialog.modal';
import { ShareBox } from "@logora/debate.share.share_box";
import styles from "./ShareModal.module.scss";

export const ShareModal = (props) => {
    const buildShareLink = () => {
        let shareUrl = props.shareUrl;
        if(typeof window !== 'undefined') {
            shareUrl += "?redirect_url=" + window.location.protocol + "//" + window.location.hostname;
        }
        return shareUrl;
    }

    const shareUrl = buildShareLink();

    return (
        <div>
            <Modal title={props.title}>
                <div className={styles.modalContainer}>
                    <ShareBox 
                        shareUrl={shareUrl} 
                        shareTitle={props.shareTitle} 
                        shareText={props.shareText} 
                        tooltipPosition={"top"} 
                        showShareCode={props.showShareCode ? true : false}
                        shareCode={props.shareCode}
                    />
                </div>
            </Modal>
        </div>
    )
}
