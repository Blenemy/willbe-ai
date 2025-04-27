"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { CodeNode } from "@lexical/code";
import { LinkNode } from "@lexical/link";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  $getRoot,
  TextNode,
  $isElementNode,
  $isDecoratorNode,
  $createParagraphNode,
} from "lexical";
import { $generateHtmlFromNodes, $generateNodesFromDOM } from "@lexical/html";
import { ListNode, ListItemNode } from "@lexical/list";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { EditorThemeClasses } from "lexical";
import { FloatingMenuPlugin } from "@/components/FloatingMenuPlugin/FloatingMenuPlugin";

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

  useEffect(() => {
    if (!content) return;

    editor.update(() => {
      const parser = new DOMParser();
      const safeContent = content.trim() || "<p></p>";
      const dom = parser.parseFromString(safeContent, "text/html");
      const nodes = $generateNodesFromDOM(editor, dom);

      const root = $getRoot();
      root.clear();

      for (const node of nodes) {
        if ($isElementNode(node) || $isDecoratorNode(node)) {
          root.append(node);
        } else {
          const paragraph = $createParagraphNode();
          paragraph.append(node);
          root.append(paragraph);
        }
      }
    });
  }, [content, editor]);

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
    nodes: [
      HeadingNode,
      QuoteNode,
      ListNode,
      ListItemNode,
      TextNode,
      HeadingNode,
      LinkNode,
      ListNode,
      ListItemNode,
      QuoteNode,
      CodeNode,
    ],
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            Edit message {leadName ? `for ${leadName}` : ""}
          </DialogTitle>
        </DialogHeader>

        <div className="relative">
          <LexicalComposer initialConfig={editorConfig}>
            <InitialContentPlugin content={initialMessage} />
            <ListPlugin />
            <RichTextPlugin
              contentEditable={
                <ContentEditable className="min-h-96 border p-4 rounded-md outline-none" />
              }
              ErrorBoundary={LexicalErrorBoundary}
            />
            <FloatingMenuPlugin />

            <OnChangeHtmlPlugin onChange={setMessage} />
          </LexicalComposer>
        </div>

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
