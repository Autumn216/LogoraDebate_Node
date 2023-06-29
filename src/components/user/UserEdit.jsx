import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useIntl, FormattedMessage } from 'react-intl';
import { Loader } from '@logora/debate.tools.loader';
import { useAuth } from "@logora/debate.auth.use_auth";
import { useDataProvider } from '@logora/debate.data.data_provider';
import { withAlert } from '../../store/AlertProvider';
import { useRoutes } from '@logora/debate.context.config_provider';
import { Button } from '@logora/debate.action.button';
import { CameraIcon } from '@logora/debate.icons';
import { TextInput } from '@logora/debate.input.text_input';
import { Toggle } from "@logora/debate.input.toggle";
import cx from 'classnames';
import styles from './UserEdit.module.scss';

const UserEdit = (props) => {
    const auth = useAuth();
    const intl = useIntl();
    const history = useHistory();
    const api = useDataProvider();
    const routes = useRoutes();
    const [description, setDescription] = useState(auth.currentUser.description);
    const [previewPictureBase64, setPreviewPictureBase64] = useState(auth.currentUser.image_url);
    const [previewPicture, setPreviewPicture] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [submitDisabled, setSubmitDisabled] = useState(false);
    const [receivesActivityEmail, setReceivesActivityEmail] = useState(auth.currentUser.receives_activity_email);    
    const [receivesGroupFollowedEmail, setReceivesGroupFollowedEmail] = useState(auth.currentUser.receives_group_followed_email);
    const [receivesNewsletterEmail, setReceivesNewsletterEmail] = useState(auth.currentUser.receives_newsletter_email);
    const [firstName, setFirstName] = useState(auth.currentUser.first_name);
    const [lastName, setLastName] = useState(auth.currentUser.last_name);
    
    const handleUpload = (files) => {
		const picture = files[0];
		if(picture && picture.type.includes('image/')) {
            setPreviewPicture(picture);
			displayPreview(picture);
		}
	}
    
    const displayPreview = (uri) => {
		const reader = new FileReader();
		reader.onloadend = () => { setPreviewPictureBase64(reader.result) }
		reader.readAsDataURL(uri);
	}
    
    const handleSubmit = (event) => {
        event.preventDefault();
        setIsLoading(true);
        const data = new FormData();
        if (description) { data.append('description', description); }
        if (previewPicture) { data.append('image', previewPicture); }
        if (firstName) { data.append('first_name', firstName); }
        if (lastName) { data.append('last_name', lastName); }
        data.append('receives_activity_email', receivesActivityEmail);
        data.append('receives_group_followed_email', receivesGroupFollowedEmail);
        data.append('receives_newsletter_email', receivesNewsletterEmail);
        setSubmitDisabled(false);
        api.update("users", auth.currentUser.slug, data).then(response => {
            if(response.data.success) {
                auth.setCurrentUser(response.data.data.resource);
                history.push({
                    pathname: routes.userShowLocation.toUrl({userSlug: response.data.data.resource.slug}),
                    state: { prevPath: true }
                });
                props.toastAlert("alert.profile_update", "success", "", "", "");
            } else {
                setSubmitDisabled(false);
            }
            setIsLoading(false);
        });
    }

    return (
        <div id="userEdit" className={styles.userEdit}>
            { !isLoading ? (
                <form encType="multipart/form-data" onSubmit={handleSubmit}>
                    <div className={styles.userDescriptionContainer}>
                        <div className={styles.userDescriptionBox}>
                            <div className={styles.userPictureUpload}>
                                <div className={styles.imageEdit}>
                                    <img className={styles.imagePreview} src={previewPictureBase64} width={120} height={120} alt={intl.formatMessage({ id:"alt.my_profile_picture", defaultMessage:"Ma photo de profil" })} />
                                    <input id="user_image" className={styles.imageInput} name="user_image" type="file" accept="image/*"  onChange={e => handleUpload(e.target.files)} />
                                    <label htmlFor="user_image" className={styles.imageOverlay}>
                                        <CameraIcon height={20} width={20} alt={intl.formatMessage({ id:"user.user_edit.profile_picture", defaultMessage:"Profile picture" })}/>
                                    </label>
                                </div>    
                            </div>
                            <div className={styles.userDescriptionContent}>
                                <div className={styles.userNameInputs}>
                                    <TextInput 
                                        type={"text"} 
                                        name={"first_name"} 
                                        role="input"
                                        placeholder={intl.formatMessage({ id:"auth_signup_form_first_name_placeholder", defaultMessage: "First name" })} 
                                        onChange={e => setFirstName(e.target.value)}
                                        data-testid={"first-name-input"}
                                        value={firstName}
                                    />
                                    <TextInput 
                                        type={"text"} 
                                        name={"last_name"} 
                                        role="input"
                                        placeholder={intl.formatMessage({ id:"auth_signup_form_last_name_placeholder", defaultMessage: "First name" })} 
                                        onChange={e => setLastName(e.target.value)}
                                        data-testid={"last-name-input"}
                                        value={lastName}
                                    />
                                </div>
                                <div className={styles.userDescription}>
                                    <textarea 
                                        className={styles.formControl} 
                                        placeholder={intl.formatMessage({ id:"user.user_edit.user_description", defaultMessage: "Describe yourself in a few words" })} 
                                        value={description} 
                                        onChange={(e) => setDescription(e.target.value)} 
                                    />
                                </div>
                            </div>
                            <div className={styles.userSaveBox}>
                                <Button data-tid={"action_save_profile"} className={styles.userSaveButton} type="submit" disabled={submitDisabled}>
                                    <FormattedMessage id="user.user_edit.save" defaultMessage={"Save"}/>
                                </Button>
                            </div>                               
                        </div>
                    </div>
                    <div className={styles.userEditNav}>
                        <div className={styles.fullWidth}>
                            <ul className={styles.navTabs}>
                                <li className={styles.navItem}>
                                    <div className={cx(styles.navLink, styles.active)}>
                                        <FormattedMessage id="user.user_edit.user_notifications" defaultMessage={"Mails notifications"}/>
                                    </div>
                                </li>
                            </ul>
                            <div className={styles.userSettingsBox}>
                                <div className={styles.tabPaneTitle}>
                                    <FormattedMessage id="user.user_edit.section_header" defaultMessage={"Allow email notifications to stay informed of your news. You can disable them at any time."}/>
                                </div>
                                <div className={styles.userEditTab}>
                                    <div className={styles.userSettingsForm} tabIndex="0">
                                        <Toggle 
                                            type={"checkbox"} 
                                            name={"receives_activity_email"} 
                                            role="input"
                                            style={{ fontSize: 18 }}
                                            checked={receivesActivityEmail} 
                                            label={intl.formatMessage({ id:"user.user_edit.user_activity", defaultMessage: "Answer in your debate"} )}
                                            onInputChanged={() => setReceivesActivityEmail(!receivesActivityEmail)} 
                                        />
                                        <Toggle 
                                            type={"checkbox"} 
                                            name={"receives_group_followed_email"} 
                                            role="input"
                                            style={{ fontSize: 18 }}
                                            checked={receivesGroupFollowedEmail} 
                                            label={intl.formatMessage({ id:"user.user_edit.user_group_followed", defaultMessage: "Followed debates activity"} )}
                                            onInputChanged={() => setReceivesGroupFollowedEmail(!receivesGroupFollowedEmail)} 
                                        />
                                        <Toggle 
                                            type={"checkbox"} 
                                            name={"receives_newsletter_email"} 
                                            role="input"
                                            style={{ fontSize: 18 }}
                                            checked={receivesNewsletterEmail} 
                                            label={intl.formatMessage({ id:"user.user_edit.user_newsletter", defaultMessage: "Debates picked for you"} )}
                                            onInputChanged={() => setReceivesNewsletterEmail(!receivesNewsletterEmail)} 
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={styles.userSaveBox}>
                        <Button data-tid={"action_save_profile"} className={styles.userSaveButton} type="submit" disabled={submitDisabled}>
                            <FormattedMessage id="user.user_edit.save" defaultMessage={"Save"}/>
                        </Button>
                    </div>
                </form>
            ) : (
                <Loader />
            )}
        </div>
    );
}

export default withAlert(UserEdit);
