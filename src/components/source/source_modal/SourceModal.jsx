import React, { useState } from 'react';
import { Modal, useModal } from '@logora/debate.dialog.modal';
import { useDataProvider } from '@logora/debate.data.data_provider';
import { SourcePreview } from '@logora/debate.source.source_preview';
import { Button } from '@logora/debate.action.button';
import SearchInput from '@logora/debate.input.search_input';
import styles from './SourceModal.module.scss';
import { FormattedMessage, useIntl } from 'react-intl';

export const SourceModal = (props) => {
    const [disabled, setDisabled] = useState(false);
    const [source, setSource] = useState({});
    const [showPreview, setShowPreview] = useState(false);
    const [showPreviewError, setShowPreviewError] = useState(false);

    const dataProvider = useDataProvider();
    const intl = useIntl();
    const { hideModal } = useModal();
    
    const handleAddSource = () => {
        props.onAddSource(source);
        setSource({});
        setShowPreview(false);
        hideModal();
        if (props.onHideModal) {
            props.onHideModal();
        }
    }
  
    const fetchSource = (input) => {
        const data = {
            query: input,
        };
        setShowPreview(true);
        setDisabled(true);
        setShowPreviewError(false);
        dataProvider.create("sources/fetch", data).then(response => {
            if(response.data.success) {
                setSource(response.data.data.resource);
                setDisabled(false);
            } else {
                setDisabled(false);
                setShowPreviewError(true);
            }
        }, error => {
            setDisabled(false);
            setShowPreviewError(true);
        });
    }

    return (
        <div>
            <Modal data-vid={"source_modal"} title={intl.formatMessage({ id: "source.source_modal.modal_title", defaultMessage: "Ajouter une source" })} showCloseButton>
                <div className={styles.sourceModalBody}>
                    <div className={styles.sourceInputContainer}>
                        <SearchInput
                            placeholder={intl.formatMessage({ id:"source.source_modal.input_placeholder", defaultMessage: "Entrez l'URL de la source..."}) }
                            onSearchSubmit={(query) => fetchSource(query)}
                            disabled={disabled}
                        />
                    </div>
                    <div className={styles.sourcePreviewBox}>
                        { showPreview ? (
                            !showPreviewError ? (
                                <div>
                                    <SourcePreview source={source} showLoader={disabled} />
                                    { !disabled ? (
                                        <Button data-tid={"action_submit_source"} className={styles.sourcePreviewButton} handleClick={handleAddSource}>
                                            <FormattedMessage id="source.source_modal.submit_label" defaultMessage="Ajouter" />
                                        </Button>
                                    ) : null}
                                </div>
                            ) :  (
                                <div className={styles.sourcePreviewError}>
                                    <FormattedMessage id="source.source_modal.error" defaultMessage="Problème lors de la récupération de la source" />
                                </div>
                            )
                        ) : null}
                    </div>
                </div>
            </Modal>
        </div>
    );
}