import CharacterCount from "@tiptap/extension-character-count";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import Underline from "@tiptap/extension-underline";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import {
    Bold,
    Heading1,
    Heading2,
    Italic,
    Link as LinkIcon,
    List,
    ListOrdered,
    Redo,
    Underline as UnderlineIcon,
    Undo,
    Unlink
} from 'lucide-react';
import { useEffect, useState } from "react";
import { Button, Form, Modal } from 'react-bootstrap';

export default function RichTextEditor({ content = "", onChange }) {
    const [wordCount, setWordCount] = useState(0);
    const [charCount, setCharCount] = useState(0);
    const [showLinkModal, setShowLinkModal] = useState(false);
    const [linkUrl, setLinkUrl] = useState('');
    const [linkText, setLinkText] = useState('');

    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                heading: {
                    levels: [1, 2, 3],
                }, underline: false,
                link: false
            }),
            Underline,
            Link.configure({
                openOnClick: false,
                linkOnPaste: true,
                HTMLAttributes: {
                    class: 'text-blue-500 underline cursor-pointer',
                },
            }),
            Placeholder.configure({
                placeholder: 'Write something amazing...',
            }),
            CharacterCount.configure({
                limit: 10000,
            }),
        ],
        content: content || "<p>Start writing...</p>",
        editorProps: {
            attributes: {
                class: 'prose dark:prose-invert max-w-none p-4 min-h-[200px] focus:outline-none text-zinc-900 dark:text-slate-50 text-left',
            },
        },
        onUpdate: ({ editor }) => {
            if (onChange) {
                onChange(editor.getHTML());
            }
            updateCounts(editor);
        },
        onCreate: ({ editor }) => {
            updateCounts(editor);
        },
    });

    const updateCounts = (editor) => {
        if (editor?.storage?.characterCount) {
            setWordCount(editor.storage.characterCount.words());
            setCharCount(editor.storage.characterCount.characters());
        }
    };

    useEffect(() => {
        if (editor && content !== editor.getHTML()) {
            editor.commands.setContent(content);
            updateCounts(editor);
        }
    }, [content, editor]);

    if (!editor) return null;

    const ToolbarButton = ({ onClick, isActive, icon: Icon, title }) => (
        <button
            type="button"
            onClick={onClick}
            title={title}
            className={`p-2 rounded-lg transition-all duration-200 ${isActive
                ? 'bg-zinc-200 text-zinc-900 dark:bg-zinc-700 dark:text-slate-50'
                : 'text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800'
                }`}
        >
            <Icon size={18} />
        </button>
    );

    const openLinkModal = () => {
        const { from, to } = editor.state.selection;
        const selectedText = editor.state.doc.textBetween(from, to, ' ');

        setLinkText(selectedText);

        // If current selection has a link, get its URL
        if (editor.isActive('link')) {
            const attrs = editor.getAttributes('link');
            setLinkUrl(attrs.href || '');
        } else {
            setLinkUrl('');
        }

        setShowLinkModal(true);
    };

    const handleLinkSubmit = () => {
        if (linkUrl) {
            // If there's selected text, use it, otherwise use the URL as text
            if (linkText && !editor.state.selection.empty) {
                editor.chain().focus().setLink({ href: linkUrl }).run();
            } else {
                // Insert link with the URL as text
                editor
                    .chain()
                    .focus()
                    .insertContent(`<a href="${linkUrl}" target="_blank">${linkUrl}</a>`)
                    .run();
            }
        }
        setShowLinkModal(false);
        setLinkUrl('');
        setLinkText('');
    };

    const removeLink = () => {
        editor.chain().focus().unsetLink().run();
    };

    return (
        <>
            <div className="w-full bg-slate-50 dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-700 overflow-hidden">
                {/* Toolbar */}
                <div className="flex flex-wrap items-center gap-1 p-2 bg-zinc-50 dark:bg-zinc-800 border-b border-zinc-200 dark:border-zinc-700">
                    {/* Text formatting */}
                    <ToolbarButton
                        onClick={() => editor.chain().focus().toggleBold().run()}
                        isActive={editor.isActive('bold')}
                        icon={Bold}
                        title="Bold"
                    />
                    <ToolbarButton
                        onClick={() => editor.chain().focus().toggleItalic().run()}
                        isActive={editor.isActive('italic')}
                        icon={Italic}
                        title="Italic"
                    />
                    <ToolbarButton
                        onClick={() => editor.chain().focus().toggleUnderline().run()}
                        isActive={editor.isActive('underline')}
                        icon={UnderlineIcon}
                        title="Underline"
                    />

                    <div className="w-px h-6 bg-zinc-300 dark:bg-zinc-600 mx-1" />

                    {/* Headings */}
                    <ToolbarButton
                        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                        isActive={editor.isActive('heading', { level: 1 })}
                        icon={Heading1}
                        title="Heading 1"
                    />
                    <ToolbarButton
                        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                        isActive={editor.isActive('heading', { level: 2 })}
                        icon={Heading2}
                        title="Heading 2"
                    />

                    <div className="w-px h-6 bg-zinc-300 dark:bg-zinc-600 mx-1" />

                    {/* Lists */}
                    <ToolbarButton
                        onClick={() => editor.chain().focus().toggleBulletList().run()}
                        isActive={editor.isActive('bulletList')}
                        icon={List}
                        title="Bullet List"
                    />
                    <ToolbarButton
                        onClick={() => editor.chain().focus().toggleOrderedList().run()}
                        isActive={editor.isActive('orderedList')}
                        icon={ListOrdered}
                        title="Numbered List"
                    />

                    <div className="w-px h-6 bg-zinc-300 dark:bg-zinc-600 mx-1" />

                    {/* Link */}
                    <ToolbarButton
                        onClick={openLinkModal}
                        isActive={editor.isActive('link')}
                        icon={LinkIcon}
                        title="Add Link"
                    />

                    {editor.isActive('link') && (
                        <ToolbarButton
                            onClick={removeLink}
                            isActive={false}
                            icon={Unlink}
                            title="Remove Link"
                        />
                    )}

                    <div className="flex-1" />

                    {/* Undo/Redo */}
                    <ToolbarButton
                        onClick={() => editor.chain().focus().undo().run()}
                        isActive={false}
                        icon={Undo}
                        title="Undo"
                    />
                    <ToolbarButton
                        onClick={() => editor.chain().focus().redo().run()}
                        isActive={false}
                        icon={Redo}
                        title="Redo"
                    />
                </div>

                {/* Editor Content */}
                <div className="p-4">
                    <EditorContent editor={editor} />
                </div>

                {/* Character/Word Count */}
                <div className="flex justify-end gap-4 px-4 py-2 text-xs text-zinc-500 dark:text-zinc-400 border-t border-zinc-200 dark:border-zinc-700">
                    <span>{wordCount} words</span>
                    <span>{charCount} characters</span>
                    {charCount > 0 && (
                        <span className={charCount >= 5000 ? 'text-red-500' : 'text-emerald-600 dark:text-emerald-400'}>
                            {5000 - charCount} remaining
                        </span>
                    )}
                </div>
            </div>

            {/* Link Modal */}
            <Modal
                show={showLinkModal}
                onHide={() => setShowLinkModal(false)}
                centered
                contentClassName="dark:bg-zinc-900"
            >
                <Modal.Header className="dark:bg-zinc-900 dark:text-white dark:border-b-slate-600">
                    <Modal.Title>Add Link</Modal.Title>
                </Modal.Header>
                <Modal.Body className="dark:bg-zinc-900">
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label className="dark:text-slate-200">Link Text</Form.Label>
                            <Form.Control
                                type="text"
                                value={linkText}
                                onChange={(e) => setLinkText(e.target.value)}
                                placeholder="Enter link text"
                                className="dark:bg-zinc-800 dark:text-slate-50 dark:border-zinc-600"
                            />
                            <Form.Text className="text-muted dark:!text-slate-50">
                                {editor.state.selection.empty
                                    ? "No text selected. This will be the link text."
                                    : "Selected text will be used as link text."}
                            </Form.Text>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label className="dark:text-slate-200">URL</Form.Label>
                            <Form.Control
                                type="url"
                                value={linkUrl}
                                onChange={(e) => setLinkUrl(e.target.value)}
                                placeholder="https://example.com"
                                className="dark:bg-zinc-800 dark:text-slate-50 dark:border-zinc-600"
                                autoFocus
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer className="dark:bg-zinc-900 dark:border-t-slate-600">
                    <Button
                        variant="secondary"
                        onClick={() => setShowLinkModal(false)}
                        className="dark:bg-zinc-700 text-zinc-900 dark:border-zinc-600 dark:!text-slate-50"
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="primary"
                        onClick={handleLinkSubmit}
                        className="dark:bg-slate-700 text-zinc-900 dark:border-slate-600 dark:!text-slate-50"
                        disabled={!linkUrl}
                    >
                        Add Link
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}