import { memo, useEffect, useRef, useState } from 'react';
import classNames from 'classnames/bind';
import Tippy from '@tippyjs/react/headless';
import DefaultTippy from '@tippyjs/react';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { Editor } from 'react-draft-wysiwyg';
import { ContentState, EditorState, getDefaultKeyBinding, Modifier, convertToRaw } from 'draft-js';
import 'draft-js/dist/Draft.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';

import { AtIcon, FaceLaughIcon } from '~/components/Icons';
import { Wrapper as Popper } from '~/components/Popper';
import Emojis from './Emojis';
import styles from './CommentEditor.module.scss';
import Mention from './MentionSuggestions';
import MentionStyle from './MentionStyle';

const cx = classNames.bind(styles);

const LINE_HEIGHT = 17;
const MAX_LENGTH = 150;

const CommentEditor = ({
    autoFocus,
    hasBtnClose,
    placeholder = 'Add comment...',
    sendBtnLabel = 'Post',
    onClose = () => {},
    onSendComment = () => {},
}) => {
    const findMentionEntities = (contentBlock, callback, contentState) => {
        contentBlock.findEntityRanges((character) => {
            const entityKey = character.getEntity();
            return entityKey !== null && contentState.getEntity(entityKey).getType() === 'MENTION';
        }, callback);
    };

    const [isShowBorder, setShowBorder] = useState(false);
    const [keepFocus, setKeepFocus] = useState(false);
    const [editorState, setEditorState] = useState(() => EditorState.createEmpty());
    const [showCountChar, setShowCountChar] = useState(false);
    const [showEmojiPopper, setShowEmojiPopper] = useState(false);
    const [mentionTrigger, setMentionTrigger] = useState({ value: '@', position: -1 });

    const mentionsSet = useRef(null);
    if (mentionsSet.current === null) {
        mentionsSet.current = new Set();
    }
    mentionsSet.current.clear();
    const contentState = editorState.getCurrentContent();
    const entityValues = Object.values(convertToRaw(contentState).entityMap);
    const metionsArray = entityValues.map((entity) => ({ name: entity.data?.name?.trim(), pos: entity.data?.position }));
    console.log(entityValues);

    for (let mention of metionsArray) {
        mentionsSet.current.add(mention);
    }
    console.log(Array.from(mentionsSet.current));

    const editorRef = useRef(null);
    const value = editorState.getCurrentContent().getPlainText();
    const currentPosition = editorState.getSelection().getFocusOffset();
    const searchValue = mentionTrigger.position > -1 ? value.slice(mentionTrigger.position + 1, currentPosition) : '';

    const handleSendComment = () => {
        if (value) {
            const mentionsSetToArray = Array.from(mentionsSet.current);
            let postValue = value;
            // let tags = [];
            // if (mentionsSetToArray.length > 0) {
            //     // const mentionsArrToString = mentionsSetToArray.join('|');
            //     // let regExp = new RegExp(String.raw`${mentionsArrToString}`, 'g');
            //     // postValue = value.replace(regExp, (mention) => {
            //     //     return `<a>${mention}</a>`;
            //     // });
            //     // tags = [...mentionsSetToArray];
            //     tags
            // }

            onSendComment(postValue, mentionsSetToArray);
            const newEditorState = EditorState.push(editorState, ContentState.createFromText(''));
            setEditorState(newEditorState);
        }
    };

    const handleEditorChange = (editorState) => {
        setEditorState(editorState);
        const _value = editorState.getCurrentContent().getPlainText();
        if (
            mentionTrigger.position > -1 &&
            editorState.getSelection().getHasFocus() &&
            (_value[mentionTrigger.position] !== mentionTrigger.value || _value.length === value.length)
        ) {
            setMentionTrigger((prev) => ({ ...prev, position: -1 }));
        }
    };

    const _handleBeforeInput = (chars, editorState) => {
        const currentContent = editorState.getCurrentContent().getPlainText();
        const currentContentLength = currentContent.length;
        const value = editorState.getCurrentContent().getPlainText();
        if (chars === mentionTrigger.value) {
            setMentionTrigger((prev) => ({ ...prev, position: editorState.getSelection().getFocusOffset() }));
        }
        if (currentContentLength + chars.length > MAX_LENGTH) {
            return 'handled';
        }
    };

    const _handlePastedText = (pastedText) => {
        const currentContent = editorState.getCurrentContent().getPlainText();
        const currentContentLength = currentContent.length;
        if (currentContentLength + pastedText.length > MAX_LENGTH) {
            return 'handled';
        }
    };

    const _KeyBindingFn = (e) => {
        if (e.keyCode === 13) {
            //Enter
            return 'send-comment';
        } else if (e.keyCode >= 37 && e.keyCode <= 40 && mentionTrigger.position > -1) {
            //ArrowLeft, ArrowUp, ArrowDown, ArrowRight
            return 'move-caret';
        }
        return getDefaultKeyBinding(e);
    };

    const _handleKeyCommand = (command) => {
        if (command === 'send-comment') {
            handleSendComment();
            return 'handled';
        } else if (command === 'move-caret') {
            return 'handled';
        }
        return 'not-handled';
    };

    const _handleReturn = (e) => {
        if (e.shiftKey) {
            //press Shift + Enter
            handleSendComment();
            return 'handled';
        }
        return 'not-handled';
    };

    const handleFocus = () => {
        setShowBorder(true);
        setEditorState(EditorState.forceSelection(editorState, editorState.getSelection()));
    };

    const handleBlur = () => {
        if (!keepFocus) {
            setShowBorder(false);
        }
        if (editorRef.current.clientHeight <= LINE_HEIGHT) {
            setShowCountChar(false);
        }
    };

    const handleClickMentionButton = () => {
        editorRef.current.focus();
        const newEditorState = insertText(mentionTrigger.value);
        setMentionTrigger((prev) => ({ ...prev, position: editorState.getSelection().getFocusOffset() }));
        setEditorState(newEditorState);
    };

    const handleClickEmojiButton = () => {
        editorRef.current.focus();
        setShowEmojiPopper(!showEmojiPopper);
        setEditorState(EditorState.forceSelection(editorState, editorState.getSelection()));
    };

    const insertText = (text) => {
        const contentState = Modifier.replaceText(
            editorState.getCurrentContent(),
            editorState.getSelection(),
            text,
            editorState.getCurrentInlineStyle(),
        );

        const newEditorState = EditorState.push(editorState, contentState, 'insert-characters');
        return EditorState.forceSelection(newEditorState, contentState.getSelectionAfter());
    };

    const handleSelectedEmoji = (emoji) => {
        setKeepFocus(false);
        const newEditorState = insertText(emoji);
        setEditorState(newEditorState);
        setShowEmojiPopper(false);
    };

    const insertFieldEntry = (name) => {
        const content = editorState.getCurrentContent();
        const currentPosition = editorState.getSelection().getFocusOffset();
        const start = value.slice(0, currentPosition).lastIndexOf(mentionTrigger.value);
        const selection = editorState.getSelection().merge({
            anchorOffset: start,
            focusOffset: currentPosition,
            isBackward: false,
        });

        const contentStateWithEntity = content.createEntity('MENTION', 'IMMUTABLE', { name, position: start });
        const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
        const textWithEntity = Modifier.replaceText(content, selection, name, null, entityKey);
        const newState = EditorState.push(editorState, textWithEntity, 'insert-characters');
        return EditorState.forceSelection(newState, textWithEntity.getSelectionAfter());
    };

    const handleSelectedMention = (nickname) => {
        setKeepFocus(false);
        const newEditorState = insertFieldEntry(`@${nickname} `);
        setEditorState(newEditorState);
        setMentionTrigger((prev) => ({ ...prev, position: -1 }));
    };

    const handleClose = () => {
        onClose();
    };

    const handleKeepFocus = () => {
        setKeepFocus(true);
    };

    const handleCancelFocus = () => {
        setKeepFocus(false);
    };

    useEffect(() => {
        autoFocus && editorRef.current?.focus();
    }, []);

    useEffect(() => {
        if (editorRef.current) {
            setShowCountChar(editorRef.current.clientHeight > LINE_HEIGHT);
        }
    }, [value]);

    return (
        <div className={cx('comment-box')}>
            <div
                className={cx('comment-input')}
                style={{ borderColor: isShowBorder ? 'rgba(22, 24, 35, 0.2)' : 'transparent' }}
            >
                <div className={cx('editor-wrapper')}>
                    <Editor
                        editorRef={(ref) => (editorRef.current = ref)}
                        editorClassName={cx('draft-editor')}
                        placeholder={placeholder}
                        toolbarHidden
                        editorState={editorState}
                        handleKeyCommand={_handleKeyCommand}
                        keyBindingFn={_KeyBindingFn}
                        handleReturn={_handleReturn}
                        handleBeforeInput={_handleBeforeInput}
                        handlePastedText={_handlePastedText}
                        onFocus={handleFocus}
                        onBlur={handleBlur}
                        onEditorStateChange={handleEditorChange}
                        customDecorators={[{ strategy: findMentionEntities, component: MentionStyle }]}
                    />
                    {showCountChar && (
                        <span
                            className={cx('count-characters')}
                            style={{
                                color: value.length === MAX_LENGTH ? 'var(--primary)' : 'rgba(22, 24, 35, 0.5)',
                            }}
                        >
                            {value.length}/{MAX_LENGTH}
                        </span>
                    )}
                </div>
                <div className={cx('btn-mention')} onMouseEnter={handleKeepFocus} onMouseLeave={handleCancelFocus}>
                    <Tippy
                        placement="top-end"
                        offset={[-80, 10]}
                        onClickOutside={() => setMentionTrigger((prev) => ({ ...prev, position: -1 }))}
                        visible={mentionTrigger.position > -1}
                        interactive
                        render={(attrs) => (
                            <div className="box" tabIndex="-1" {...attrs}>
                                <Popper>
                                    {mentionTrigger.position > -1 && (
                                        <Mention searchValue={searchValue.trim()} onSelected={handleSelectedMention} />
                                    )}
                                </Popper>
                            </div>
                        )}
                    >
                        <DefaultTippy content='"@" a user to tag them in your comments' maxWidth={248}>
                            <span className={cx('cmt-icon')} onClick={handleClickMentionButton}>
                                <AtIcon />
                            </span>
                        </DefaultTippy>
                    </Tippy>
                </div>

                <div className={cx('btn-emoji')} onMouseEnter={handleKeepFocus} onMouseLeave={handleCancelFocus}>
                    <Tippy
                        placement="top-end"
                        onClickOutside={() => setShowEmojiPopper(false)}
                        visible={showEmojiPopper}
                        interactive
                        render={(attrs) => (
                            <div className="box" tabIndex="-1" {...attrs}>
                                <Popper>
                                    <Emojis onSelected={handleSelectedEmoji} />
                                </Popper>
                            </div>
                        )}
                    >
                        <DefaultTippy content="Click to add emojis">
                            <span
                                className={cx('cmt-icon')}
                                onClick={handleClickEmojiButton}
                                style={showEmojiPopper ? { backgroundColor: 'rgba(0, 0, 0, 0.12)' } : {}}
                            >
                                <FaceLaughIcon />
                            </span>
                        </DefaultTippy>
                    </Tippy>
                </div>
            </div>
            <span
                className={cx('btn-send', { disabled: value.length === 0 })}
                style={{ color: value.length > 0 ? 'var(--primary)' : 'rgba(22, 24, 35, 0.34)' }}
                onClick={handleSendComment}
            >
                {sendBtnLabel}
            </span>
            {hasBtnClose && (
                <span className={cx('btn-close')} onClick={handleClose}>
                    <FontAwesomeIcon icon={faXmark} />
                </span>
            )}
        </div>
    );
};

export default memo(CommentEditor);
