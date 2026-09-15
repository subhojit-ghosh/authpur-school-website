"use client";

import { useState } from "react";
import { EditorContent, useEditor, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import { Bold, Italic, Link2, Link2Off, List, ListOrdered, Quote, Redo2, Undo2 } from "lucide-react";
import { RICH_TEXT_LIMIT } from "@/lib/rich-text";
import { cn } from "@/lib/utils";

/**
 * Small rich-text field used for notice and event descriptions. The HTML is
 * kept in a hidden input so the form posts it like any other field; it is
 * sanitised again on the server before being stored.
 */

function ToolButton({
  onClick,
  active,
  disabled,
  label,
  children,
}: {
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={label}
      aria-label={label}
      aria-pressed={active}
      className={cn(
        "grid size-8 place-items-center rounded-md text-muted-foreground transition-colors",
        "hover:bg-accent hover:text-brand disabled:pointer-events-none disabled:opacity-40",
        active && "bg-brand text-brand-foreground hover:bg-brand hover:text-brand-foreground",
      )}
    >
      {children}
    </button>
  );
}

function Toolbar({ editor }: { editor: Editor }) {
  const setLink = () => {
    const previous = editor.getAttributes("link").href as string | undefined;
    const url = window.prompt("Link address (leave empty to remove)", previous ?? "https://");
    if (url === null) return;
    if (url.trim() === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url.trim() }).run();
  };

  return (
    <div className="flex flex-wrap items-center gap-0.5 border-b bg-muted/40 p-1.5">
      <ToolButton label="Bold" onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive("bold")}>
        <Bold className="size-4" />
      </ToolButton>
      <ToolButton label="Italic" onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive("italic")}>
        <Italic className="size-4" />
      </ToolButton>
      <span className="mx-1 h-5 w-px bg-border" />
      <ToolButton label="Bulleted list" onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive("bulletList")}>
        <List className="size-4" />
      </ToolButton>
      <ToolButton label="Numbered list" onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive("orderedList")}>
        <ListOrdered className="size-4" />
      </ToolButton>
      <ToolButton label="Quote" onClick={() => editor.chain().focus().toggleBlockquote().run()} active={editor.isActive("blockquote")}>
        <Quote className="size-4" />
      </ToolButton>
      <span className="mx-1 h-5 w-px bg-border" />
      <ToolButton label="Add or edit link" onClick={setLink} active={editor.isActive("link")}>
        <Link2 className="size-4" />
      </ToolButton>
      <ToolButton
        label="Remove link"
        onClick={() => editor.chain().focus().extendMarkRange("link").unsetLink().run()}
        disabled={!editor.isActive("link")}
      >
        <Link2Off className="size-4" />
      </ToolButton>
      <span className="ml-auto flex items-center gap-0.5">
        <ToolButton label="Undo" onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()}>
          <Undo2 className="size-4" />
        </ToolButton>
        <ToolButton label="Redo" onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()}>
          <Redo2 className="size-4" />
        </ToolButton>
      </span>
    </div>
  );
}

export function RichTextEditor({
  name,
  defaultValue = "",
  placeholder = "Add more detail…",
  ariaLabel,
}: {
  name: string;
  defaultValue?: string;
  placeholder?: string;
  ariaLabel?: string;
}) {
  const [html, setHtml] = useState(defaultValue);

  const editor = useEditor({
    // Required for server rendering in the App Router.
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({ heading: { levels: [3, 4] }, horizontalRule: false, codeBlock: false }),
      Link.configure({ openOnClick: false, autolink: true, protocols: ["http", "https", "mailto", "tel"] }),
    ],
    content: defaultValue,
    editorProps: {
      attributes: {
        class:
          "prose-admin min-h-32 w-full px-3.5 py-3 text-sm outline-none [&_p]:my-1.5 [&_ul]:my-1.5 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:my-1.5 [&_ol]:list-decimal [&_ol]:pl-5 [&_a]:text-brand [&_a]:underline [&_blockquote]:border-l-2 [&_blockquote]:border-gold [&_blockquote]:pl-3 [&_blockquote]:italic [&_h3]:font-heading [&_h3]:text-base [&_h3]:font-semibold [&_h4]:font-semibold",
        "aria-label": ariaLabel ?? "Description",
      },
    },
    onCreate: ({ editor }) => setHtml(editor.getHTML()),
    onUpdate: ({ editor }) => setHtml(editor.getHTML()),
  });

  const empty = editor?.isEmpty ?? defaultValue === "";

  return (
    <div className="overflow-hidden rounded-lg border border-input bg-background shadow-xs focus-within:border-brand focus-within:ring-3 focus-within:ring-brand/20">
      {editor ? <Toolbar editor={editor} /> : <div className="h-11 border-b bg-muted/40" />}
      <div className="relative">
        {empty ? (
          <p className="pointer-events-none absolute left-3.5 top-3 text-sm text-muted-foreground">{placeholder}</p>
        ) : null}
        <EditorContent editor={editor} />
      </div>
      <input type="hidden" name={name} value={html.length > RICH_TEXT_LIMIT * 2 ? html.slice(0, RICH_TEXT_LIMIT * 2) : html} />
    </div>
  );
}
