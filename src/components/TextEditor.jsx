import React, { Component } from 'react';
import { Editor, ContentState, EditorState, RichUtils, convertFromRaw, convertToRaw } from 'draft-js';
import styles from './TextEditor.module.scss';
import 'draft-js/dist/Draft.css';
import { Button } from '@logora/debate.action.button';
import { LinkIcon, SendIcon, BoldIcon, ItalicIcon, UnderlineIcon, OrderedListIcon, BlockquoteIcon } from '@logora/debate.icons';
import TextFormatter from "../utils/TextFormatter";
import SourceListItem from "@logora/debate.source.source_list_item";
import cx from 'classnames';
import { getSessionStorageItem, setSessionStorageItem, removeSessionStorageItem } from "../utils/SessionStorage";

class TextEditor extends Component {
    state = {
        editorContent: '',
        editorRichContent: '',
        editorState: EditorState.createEmpty(),
        active: false
    };

    constructor(props) {
        super(props);
        this.setEditor = (editor) => {
            this.editor = editor;
        };
        this.focus = () => { this.setState({ active: true }); this.props.onActivation(); this.editor.focus() };
        this.onChange = (editorState) => this.setState({ editorState: editorState });
        this.toggleStyle = (style, type) => this._toggleStyle(style, type);
    }

    componentDidMount() {
        if (getSessionStorageItem(`userContent${this.props.uid}`)) {
            const data = JSON.parse(getSessionStorageItem(`userContent${this.props.uid}`));
            this.setContent(data.richContent, data.content);
        }
        if (this.props.displayContent && Object.keys(this.props.displayContent).length > 0) {
            this.setContent(this.props.displayContent.richContent, this.props.displayContent.content);
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.state.active && !prevState.active && this.props.uid && (this.state.editorContent || this.state.editorRichContent)) {
            this.saveInterval = setInterval(() => {
                this.saveContent();
            }, 1000);
        }
        if (prevProps.displayContent != this.props.displayContent) {
            if(this.props.displayContent != null) {
                this.setContent(this.props.displayContent.richContent, this.props.displayContent.content);
            }
        }
    }

    componentWillUnmount() {
        clearInterval(this.saveInterval);
    }

    _toggleStyle(style, type) {
        if(type) {
            this.onChange(
                RichUtils.toggleBlockType(
                    this.state.editorState,
                    style
                )
            );
        } else {
            this.onChange(
                RichUtils.toggleInlineStyle(
                    this.state.editorState,
                    style
                )
            );
        }
    }

    setFocus = () => {
        this.editor.focus();
        let newEditorState = EditorState.moveFocusToEnd(this.state.editorState);
        this.setState({ editorState: newEditorState });
        this.props.onActivation();
    }

    reset = () => {
        let newEditorState = EditorState.moveFocusToEnd(EditorState.push(this.state.editorState, ContentState.createFromText(''), 'remove-range'));
        removeSessionStorageItem(`userContent${this.props.uid}`);
        this.setState({ editorContent: '', editorRichContent: null, editorState: newEditorState });
    }

    setContent = (richContent, content) => {
        if(!richContent) {
            richContent = convertToRaw(ContentState.createFromText(content));
        }
        let newEditorState = EditorState.moveFocusToEnd(EditorState.createWithContent(convertFromRaw(richContent)));
        this.setState({ active: true, editorContent: '', editorRichContent: richContent, editorState: newEditorState });
        this.props.onActivation();
    }

    saveContent = () => {;
        const editorState = this.state.editorState;
        const value = editorState.getCurrentContent();
        const textValue = value.getPlainText('\n');
        const rawValue = convertToRaw(value);
        let sessionUserContent = {
            content: textValue,
            richContent: rawValue,
            uid: this.props.uid
        };
        setSessionStorageItem("userContent" + this.props.uid, JSON.stringify(sessionUserContent));
    }

    handleChange = (editorState) => {
        this.setState({ editorState: editorState });
        const value = editorState.getCurrentContent();
        const textValue = value.getPlainText('\n');
        const rawValue = convertToRaw(value);
        this.setState({ editorContent: textValue, editorRichContent: rawValue });
        this.props.handleChange(textValue, rawValue);
    }

    handleSubmit = (event) => {
        event.preventDefault();
        if(this.state.editorContent) {
            this.props.onSubmit(event);
        }
    }

    displaySource = (source, index) => {
        return (
            <SourceListItem key={index} publisher={source.publisher} url={source.source_url} title={source.title} index={index} />
        );
    }

    render() {
        return (
            <div className={cx(styles.textEditorContainer, { [styles.active]: this.state.active || this.props.showStylesControls})}>
                <div className={styles.textEditor} onClick={this.focus}>
                    <Editor 
                        ref={this.setEditor} 
                        editorState={this.state.editorState} 
                        onChange={this.handleChange} 
                        placeholder={this.props.placeholder} 
                        readOnly={this.props.disabled}
                        spellCheck={true}
                    />
                </div>
                { this.props.sources && this.props.sources.length !== 0 ? (
                    <div className={styles.sourcesBox}>
                        <div className={styles.sourceList}>
                            { this.props.sources.length === 0 ? (
                                <div className={styles.emptyText}><TextFormatter id="fallback.no_sources" /></div>
                            ) : (
                                this.props.sources.map(this.displaySource)
                            )}
                        </div>
                    </div>
                ) : null }
                <div className={cx(styles.textEditorControlBar, { [styles.active]: this.state.active || this.props.showStylesControls })}>
                    { this.state.active || this.props.showStylesControls ?
                        <StyleControls
                            editorState={this.state.editorState}
                            onToggle={this.toggleStyle}
                            shortBar={this.props.shortBar}
                        /> : null
                    }
                    { this.props.hideActions ? null :
                        <ActionControls
                            hideSubmit={this.props.hideSubmit}
                            intl={this.props.intl}
                            onAddSource={this.props.onAddSource}
                            onSubmit={this.handleSubmit}
                            showSourceAction={this.state.active && !this.props.hideSourceAction}
                            showIcons={this.props.showIcons}
                        />
                    }
                </div>
            </div>
        );
    }
}

const STYLE_CONTROLS = [
    {label: 'Bold', style: 'BOLD', isBlock: false, icon: <BoldIcon width={24} height={24} />},
    {label: 'Italic', style: 'ITALIC', isBlock: false, icon: <ItalicIcon width={24} height={24} />},
    {label: 'Underline', style: 'UNDERLINE', isBlock: false, icon: <UnderlineIcon width={24} height={24} />},
    {label: 'Blockquote', style: 'blockquote', isBlock: true, icon: <BlockquoteIcon width={24} height={24} />},
    {label: 'OL', style: 'ordered-list-item', isBlock: true, icon: <OrderedListIcon width={24} height={24} />},
];

const StyleControls = (props) => {
    const isActive = (type, editorState) => {
        if(type.isBlock) {
            const selection = editorState.getSelection();
            const blockType = editorState
                .getCurrentContent()
                .getBlockForKey(selection.getStartKey())
                .getType();
            return type.style === blockType;
        } else {
            var currentStyle = editorState.getCurrentInlineStyle();
            return currentStyle.has(type.style);
        }
    }

    return (
        <div className={cx(styles.styleControlBar, { [styles.shortBar]: props.shortBar })}>
            {STYLE_CONTROLS.map((type) =>
                <StyleButton
                    key={type.label}
                    active={isActive(type, props.editorState)}
                    label={type.label}
                    onToggle={props.onToggle}
                    style={type.style}
                    type={type.isBlock}
                    icon={type.icon}
                />
            )}
        </div>
    );
}

const ActionControls = (props) => {
    return (
        <div className={styles.actionControlBar}>
            { props.showSourceAction === false ? null :
                <div className={styles.inputSourceAction}>
                    <Button data-tid={"action_add_source"} className={cx(styles.inputSourceActionButton, { [styles.shortActionButton]: props.showIcons })}
                            active={true} handleClick={props.onAddSource}>
                        { props.showIcons ?
                            <LinkIcon height={24} width={24} />
                            :
                            <>
                                <LinkIcon height={24} width={24} />
                                <div className={styles.inputSourceText}>
                                    &nbsp;<TextFormatter id="info.sources"/>
                                </div>
                            </>
                        }
                    </Button>
                </div>
            }
            { props.hideSubmit ? null :
                <div className={styles.inputSubmitAction}>
                    <Button className={cx(styles.inputSubmitActionButton, { [styles.shortActionButton]: props.showIcons })} type="submit" handleClick={props.onSubmit}>
                        { props.showIcons ?
                            <SendIcon data-tid={"action_submit_argument"} width={20} height={20} className={styles.inputSubmitIcon} />
                            :
                            <>
                                <SendIcon data-tid={"action_submit_argument"} width={20} height={20} className={styles.inputSubmitIcon} />
                                <span data-tid={"action_submit_argument"} className={styles.inputSubmitText}><TextFormatter id="action.submit"/></span>
                            </>
                        }
                    </Button>
                </div>
            }
        </div>
    );
}

class StyleButton extends React.Component {
    constructor() {
        super();
        this.onToggle = (e) => {
            e.preventDefault();
            this.props.onToggle(this.props.style, this.props.type);
        };
    }

    render() {
        return (
            <span title={this.props.label} className={cx(styles.styleButton, { [styles.activeButton]: this.props.active })} onMouseDown={this.onToggle}>
                {this.props.icon}
            </span>
        );
    }
}

export default TextEditor;