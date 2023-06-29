import React, { useState } from 'react';
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import LexicalErrorBoundary from "@lexical/react/LexicalErrorBoundary";
import { ToolbarPlugin } from "./plugins/ToolbarPlugin";
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { AutoSavePlugin } from "./plugins/AutoSavePlugin";
import { SetContentPlugin } from "./plugins/SetContentPlugin";
import { SetRichContentPlugin } from "./plugins/SetRichContentPlugin";
import { ResetPlugin } from "./plugins/ResetPlugin";
import { FocusPlugin } from "./plugins/FocusPlugin";
import { QuoteNode } from "@lexical/rich-text";
import { ListItemNode, ListNode } from "@lexical/list";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import styles from './TextEditor.module.scss';
import EditorTheme from './EditorTheme';
import SourceModal from '@logora/debate.source.source_modal';
import SourceListItem from '@logora/debate.source.source_list_item';
import cx from "classnames";
import { $getRoot } from "lexical";
import { useModal } from '@logora/debate.dialog.modal';

export const TextEditor = (props) => {
    const [isActive, setIsActive] = useState(false);
    const [editorText, setEditorText] = useState("");
    const [editorRichText, setEditorRichText] = useState("");
    const [editorSources, setEditorSources] = useState([]);
    const { showModal } = useModal();

    const activate = () => {
        if(!isActive) {
            setIsActive(true);
            if(props.onActivation) {
                props.onActivation();
            }
        }
    }

    const editorConfig = {
        editable: props.disabled ? false : true,
        theme: EditorTheme,
        onError(error) {
            throw error;
        },
        nodes: [ListNode, ListItemNode, QuoteNode],
    };

    const setFocus = () => {
        activate();
    }

    const onChange = (editorState) => {
        editorState.read(() => {
            const text = $getRoot().getTextContent();
            const richText = JSON.stringify(editorState);
            setEditorText(text);
            setEditorRichText(richText);
            if (props.handleChange) {
                props.handleChange(text, richText);
            }
        });
    }

    const handleSubmit = () => {
        const textContent = editorText;
        const richContent = editorRichText;
        const sources = editorSources;
        if(props.onSubmit) {
            props.onSubmit(textContent, richContent, sources);
        }
    }

    const handleShowSourceModal = () => {
        showModal(
            <SourceModal onAddSource={handleAddSource} />
        )
    }

    const handleAddSource = (newSource) => {
        setEditorSources([...editorSources, newSource]);
    }

    const displaySource = (source, index) => {
        return (
            <SourceListItem key={index} publisher={source.publisher} url={source.source_url} title={source.title} index={index} />
        );
    }

    const Placeholder = () => {
        return <div className={styles.editorPlaceholder}>{props.placeholder}</div>;
    }

    return (
        <>
            <LexicalErrorBoundary>
                <LexicalComposer initialConfig={editorConfig}>
                    <div className={styles.editorContainer} onClick={setFocus}>
                        <div className={cx(styles.editorInner, {[styles.editorInnerInactive]: !isActive && !props.showStylesControls })}>
                            <RichTextPlugin
                                contentEditable={<ContentEditable className={cx(styles.editorInput, {[styles.editorInputInactive]: !isActive})} />}
                                placeholder={props.placeholder && <Placeholder />}
                            />
                            <ToolbarPlugin 
                                hideSourceAction={props.hideSourceAction} 
                                hideSubmit={props.hideSubmit}
                                shortBar={props.shortBar}
                                onSubmit={handleSubmit}
                                onAddSource={handleShowSourceModal}
                                isActive={isActive || props.showStylesControls}
                            />
                            <ListPlugin />
                            <HistoryPlugin />
                            <OnChangePlugin onChange={onChange} />
                            <AutoSavePlugin onSetContent={activate} storageUid={props.uid} />
                            <SetContentPlugin />
                            <SetRichContentPlugin />
                            <FocusPlugin />
                            <ResetPlugin storageUid={props.uid} />
                        </div>
                    </div>
                </LexicalComposer>
                { props.sources && props.sources.length !== 0 ? (
                    <div className={styles.sourcesBox}>
                        <div className={styles.sourceList}>
                            { props.sources.map(displaySource) }
                        </div>
                    </div>
                ) : null }
            </LexicalErrorBoundary>
        </>
  );
}