"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $getRoot, TextNode } from "lexical";
import { ToolbarPlugin } from "@/components/ToolbarPlugin/ToolbarPlugin";
import { useEffectOnce } from "react-use";
import { $generateHtmlFromNodes, $generateNodesFromDOM } from "@lexical/html";
import { ListNode, ListItemNode } from "@lexical/list";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { EditorThemeClasses } from "lexical";

const theme: EditorThemeClasses = {
  text: {
    bold: "font-semibold",
    italic: "italic",
    underline: "underline",
  },
  list: {
    ul: "list-disc list-inside",
  },
};
interface EditMessageModalProps {
  open: boolean;
  onClose: () => void;
  initialMessage: string;
  onSave: (newMessage: string) => void;
  leadName?: string;
}

export function OnChangeHtmlPlugin({
  onChange,
}: {
  onChange: (html: string) => void;
}) {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        const htmlString = $generateHtmlFromNodes(editor, null);
        onChange(htmlString);
      });
    });
  }, [editor, onChange]);

  return null;
}

function InitialContentPlugin({ content }: { content: string }) {
  const [editor] = useLexicalComposerContext();

  useEffectOnce(() => {
    editor.update(() => {
      const parser = new DOMParser();
      const dom = parser.parseFromString(content, "text/html");

      const nodes = $generateNodesFromDOM(editor, dom);

      const root = $getRoot();
      root.clear();
      root.append(...nodes);
    });
  });

  return null;
}

export const EditMessageModal = ({
  open,
  onClose,
  initialMessage,
  onSave,
  leadName,
}: EditMessageModalProps) => {
  const [message, setMessage] = useState(initialMessage);

  const editorConfig = {
    namespace: "MessageEditor",
    theme,
    onError(error: Error) {
      console.error("Lexical error:", error);
    },
    nodes: [HeadingNode, QuoteNode, ListNode, ListItemNode, TextNode],
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            Edit message {leadName ? `for ${leadName}` : ""}
          </DialogTitle>
        </DialogHeader>

        <LexicalComposer initialConfig={editorConfig}>
          <InitialContentPlugin content={initialMessage} />
          <ToolbarPlugin />
          <ListPlugin />
          <RichTextPlugin
            contentEditable={
              <ContentEditable className="min-h-96 border p-4 rounded-md outline-none" />
            }
            ErrorBoundary={LexicalErrorBoundary}
          />
          <HistoryPlugin />
          <AutoFocusPlugin />
          <OnChangeHtmlPlugin onChange={setMessage} />
        </LexicalComposer>

        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={() => {
              onSave(message);
              onClose();
            }}
          >
            Save
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
