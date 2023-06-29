import React, { useState } from 'react';
import { Modal, useModal } from '@logora/debate.dialog.modal';
import { useIntl } from 'react-intl';
import { useDataProvider } from '@logora/debate.data.data_provider';
import Select from '@logora/debate.input.select';
import { Loader } from '@logora/debate.tools.loader';
import { Button } from '@logora/debate.action.button';
import cx from 'classnames';
import styles from './ReportModal.module.scss';

export const ReportModal = (props) => {
    const [step, setStep] = useState('SUBMIT');
    const [reportDescription, setReportDescription] = useState("");
    const [reportType, setReportType] = useState(null);
    const intl = useIntl();
    const { hideModal } = useModal();
    const dataProvider = useDataProvider();

    const handleReportSubmit = (event) => {
        event.preventDefault();
        const data = {
            reportable_id: props.reportableId,
            reportable_type: props.reportableType,
            classification: reportType,
            description: reportDescription,
        };
        setStep('LOADING');
        dataProvider.create("reports", data).then(response => {
            setStep('SUCCESS');
        }, error => {
            setStep('SUCCESS');
        });
    }

    return (
        <div>
            <Modal data-vid={"report_modal"} title={props.title}>
                <div className={cx(styles.reportModalBody)}>
                    {
                        {
                           'SUBMIT':
                                <form onSubmit={handleReportSubmit} className={styles.reportForm}>
                                    <div className={styles.formGroup}>
                                        <label htmlFor="reportType">
                                            { intl.formatMessage({ id: "report.report_modal.type_input_label", defaultMessage: "Report type" }) }
                                        </label>
                                        <Select 
                                            onChange={e => setReportType(e.value)}
                                            options={
                                                [
                                                    { name: "Spam", value: "spam", text: intl.formatMessage({ id:"report.report_modal.spam_option", defaultMessage: "Undesirable or bad quality content"}) },
                                                    { name: "Harassement", value: "harrassement", text: intl.formatMessage({ id:"report.report_modal.harrassment_option", defaultMessage: "Harrassment"}) },
                                                    { name: "Hate speech", value: "hate-speech", text: intl.formatMessage({ id:"report.report_modal.hate_speech_option", defaultMessage: "Hate speech" }) },
                                                    { name: "Plagiarism", value: "plagiarism", text: intl.formatMessage({ id:"report.report_modal.plagiarism_option", defaultMessage: "Plagiarism"}) },
                                                    { name: "Fake news", value: "fake-news", text: intl.formatMessage({ id:"report.report_modal.fake_news_option", defaultMessage: "Fake news"}) }
                                                ]
                                            }
                                        />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label htmlFor="reportDescription">
                                            { intl.formatMessage({ id: "report.report_modal.description_input_label", defaultMessage: "Tell us more about your report" }) }
                                        </label>
                                        <textarea
                                            className={styles.formControl} 
                                            id="reportDescription"
                                            role='textbox'
                                            rows={4}
                                            value={reportDescription}
                                            onChange={e => setReportDescription(e.target.value)}
                                            placeholder={intl.formatMessage({ id:"report.report_modal.description_input_placeholder", defaultMessage: "Tell us more" }) }
                                        ></textarea>
                                   </div>
                                   <div className={cx(styles.formGroup, styles.reportFormSubmit)}>
                                        <Button handleClick={() => null} data-tid={"action_submit_report"} type="submit">
                                            { intl.formatMessage({ id: "report.report_modal.submit_label", defaultMessage: "Send" }) }
                                        </Button>
                                   </div>
                                </form>,
                           'LOADING': <Loader />,
                           'SUCCESS':
                               <div>
                                    <div className={styles.successText}>
                                        { intl.formatMessage({ id: "report.report_modal.success", defaultMessage: "Thank you for your submission !" }) }
                                    </div>
                                    <div className={styles.successButtonBox}>
                                        <Button handleClick={hideModal}>
                                            { intl.formatMessage({ id: "report.report_modal.close", defaultMessage: "Close" }) }
                                        </Button>
                                    </div>
                               </div>
                        }[step]
                    }
                </div>
            </Modal>
        </div>
    );
}