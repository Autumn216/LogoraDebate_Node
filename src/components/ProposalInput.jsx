import React, { useState, useRef, useEffect } from "react";
import { useDataProvider } from '@logora/debate.data.data_provider';
import { useAuth } from "@logora/debate.auth.use_auth";
import { useInput } from "@logora/debate.context.input_provider";
import { withAlert } from "../store/AlertProvider";
import { withInput } from "../store/InputAndListProvider";
import { useIntl } from "react-intl";
import { useList } from '@logora/debate.list.list_provider';
import { useAuthenticationRequired } from "@logora/debate.hooks.use_authentication_required";
import { defaultAuthor } from "./ArgumentInput";
import { Button } from '@logora/debate.action.button';
import { AuthorBox } from '@logora/debate.user.author_box';
import { useFormValidation } from '@logora/debate.hooks.use_form_validation';
import Select from '@logora/debate.input.select';
import TextEditor from '@logora/debate.input.text-editor';
import useSessionStorageState from '@rooks/use-sessionstorage-state';
import cx from "classnames";
import styles from "./ProposalInput.module.scss";

const ProposalInput = (props) => {
  const intl = useIntl();
  const api = useDataProvider();
  const list = useList();
  const { isLoggedIn, currentUser } = useAuth();
  const { setReset, setInputContent, setInputRichContent } = useInput();
  const { errors, validate } = useFormValidation();
  const proposalInputContainer = useRef(null);
  const [active, setActive] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [richContent, setRichContent] = useState();
  const [tagId, setTagId] = useState();
  const [resetSelect, setResetSelect] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);
  const [proposalId, setProposalId] = useState();
	const requireAuthentication = useAuthenticationRequired();
  const [savedProposal, setSavedProposal, removeSavedProposal] = useSessionStorageState(`logora:userProposal${props.consultation.id}`, {});

  useEffect(() => {
    if (savedProposal && Object.keys(savedProposal).length !== 0) {
      setActive(true);
      if (savedProposal.title) {
        setTitle(savedProposal.title);
      }
      if (savedProposal.tagId) {
        setTagId(savedProposal.tagId);
      }
    }
  }, [])

  useEffect(() => {
    if (Object.keys(props.editElement).length > 0) {
      setActive(true);
      const proposal = props.editElement;
      setTitle(proposal.title);
      setContent(proposal.content);
      setRichContent(proposal.rich_content);
      const rawContent = JSON.parse(proposal.rich_content);
      if(rawContent.hasOwnProperty("root")) {
        setInputRichContent(proposal.rich_content);
      } else {
        setInputContent(proposal.content);
      }
      setTagId(proposal.tag.id);
      setProposalId(proposal.id);
      setIsUpdate(true);
      scrollToContainer();
    }
  }, [props.editElement])

  useEffect(() => {
    if (active) {
      const saveContent = setInterval(() => {
        const proposalToSave = {
          title: title,
          content: content,
          richContent: richContent,
          tagId: tagId
        }
        setSavedProposal(proposalToSave);
      }, 1000);
      return () => clearInterval(saveContent);
    }
  }, [active, title, content, richContent, tagId])

  const handleContentChange = (content, richContent) => {
    setContent(content);
    setRichContent(richContent);
  }

  const resetEditor = () => {
    // RESET EDITOR
    setReset(true);
    setTitle("");
    setContent("");
    setRichContent(null);
    setTagId(null);
    setResetSelect(true);
    removeSavedProposal();
  }

  const scrollToContainer = () => {
    proposalInputContainer.current.scrollIntoView(true);
  }

  const handleSubmit = () => {
    if (isLoggedIn) {
      const data = {
        consultation_id: props.consultation.id,
        title: title,
        content: content,
        rich_content: richContent,
        tag_id: tagId,
      };
      if (props.consultation.tags.length === 1) {
        data.tag_id = props.consultation.tags[0].id
      }

      const proposalValidationRules = [
        { content: ["length", 10] },
        { title: ["required", null] },
        { content: ["required", null] },
      ]
      if (props.consultation.tags.length >= 2) { proposalValidationRules.push({ theme: ["required", null] }) }

      if (validate(data, proposalValidationRules)) {
        resetEditor();
        if (isUpdate) {
          setActive(false);
          api.update("proposals", proposalId, data).then(response => {
            if(response.data.success) {
              const proposal = response.data.data.resource;
              list.update("proposalsList", [proposal]);
              props.toastAlert("alert.proposal_modify", "success", "", "", "");
            }
          });
        } else {
          setActive(false);
          api.create("proposals", data).then(response => {
            if(response.data.success) {
              const proposal = response.data.data.resource;
              list.add("proposalsList", [proposal]);
              props.toastAlert("alert.proposal_create", "success", intl.formatMessage({ id: "alert.proposal_create_gain" }), "PROPOSAL", "alert.first_proposal");
            }
          });
        }
      }
    } else {
      requireAuthentication({});
    }
  }

  return (
    <div className={styles.proposalInputContainer} ref={proposalInputContainer}>
      { active ? 
        <>
        { props.consultation.tags.length >= 2 &&
          <div className={cx(styles.fadeIn, styles.proposalInputItem)}>
            <div className={styles.proposalInputTitle}>
              { intl.formatMessage({ id: "info.theme" }) }
            </div>
            <div className={styles.proposalInputSubtitle}>
              { intl.formatMessage({ id: "consultation.choose_theme" }) }
            </div>
            <div className={styles.proposalInputSelect}>
              <Select 
                displayOptionValue={tagId && tagId}
                selectClassName={errors?.theme && styles.proposalInputError}
                optionClassName={styles.selectInputOption}
                onChange={(option) => {setTagId(option.value)} }
                resetSelect={resetSelect}
                options={
                  ([{name: "", value: "", text: ""}, ...props.consultation.tags.sort((a, b) => {return (a['name'].localeCompare(b['name'], 'fr', {ignorePunctuation: true}))}).map(tag => { return { name: tag.display_name, value: tag.id, text: tag.display_name } })])
                }
              />
            </div>
            <div className={styles.proposalInputWarning}>{errors?.theme}</div>
          </div>
        }
          <div className={cx(styles.fadeIn, styles.proposalInputItem)}>
            <div className={styles.proposalInputTitle}>
              { intl.formatMessage({ id: "info.title"}) }
            </div>
            <div className={styles.proposalInputSubtitle}>
              { intl.formatMessage({ id: "consultation.add_title" }) }
            </div>
            <input 
              autoFocus 
              type={"text"}
              className={errors?.title ? cx(styles.proposalInput, styles.proposalInputError) : styles.proposalInput} 
              name="proposalInputTitle" 
              onChange={(e) => {setTitle(e.target.value);} } 
              placeholder={intl.formatMessage({ id:"alt.proposal.title" })} 
              value={title} 
              required 
            />
            <div className={styles.proposalInputWarning}>{errors?.title}</div>
          </div>
          <div className={cx(styles.fadeIn, styles.proposalInputItem)}>
            <div className={styles.proposalInputTitle}>
              { intl.formatMessage({ id: "info.proposal" }) }
            </div>
            <div className={styles.proposalInputSubtitle}>
              { intl.formatMessage({ id: "consultation.add_proposal_content" }) }
            </div>
            <div className={errors && errors.content ? cx(styles.proposalInputContent, styles.proposalInputError) : styles.proposalInputContent}>
              <TextEditor
                uid={"proposal_input"}
                handleChange={(value, rawValue) => { handleContentChange(value, rawValue); } }
                placeholder={intl.formatMessage({ id:"alt.proposal.content" })}
                hideSubmit={true}
                hideSourceAction={true}
                showStylesControls={true}
              />
            </div>
            <div className={styles.proposalInputWarning}>{errors?.content}</div>
            <Button handleClick={() => handleSubmit()} className={styles.proposalInputSubmit}>
              { intl.formatMessage({ id: "action.submit" }) }
            </Button>
          </div>
        </>
      :
        <>
          <div className={styles.proposalInputTitle}>
            { intl.formatMessage({ id: "consultation.submit_proposal" }) }
          </div>
          <div className={styles.proposalInputBox}>
            { props.disabled && (
              <div className={styles.disabledInputMask}>
                { intl.formatMessage({ id: "info.consultation_is_ended" }) }
              </div>) 
            }
            <div className={styles.proposalTextInputBox}>
              <div className={styles.proposalAuthorContainer}>
                <AuthorBox
                  author={Object.keys(currentUser).length === 0 ? defaultAuthor : currentUser} 
                />
              </div>
              <div className={styles.textEditorBox} onClick={() => setActive(true)}>
                { intl.formatMessage({ id:"alt.proposal_input" }) }
              </div>
            </div>
          </div>
        </>
      }
    </div>
  )
}

export default withInput(withAlert(ProposalInput));