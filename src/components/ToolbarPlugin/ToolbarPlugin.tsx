"use client";

import { FORMAT_TEXT_COMMAND, $getSelection, $isRangeSelection } from "lexical";
import {
  INSERT_UNORDERED_LIST_COMMAND,
  $isListNode,
  $removeList,
} from "@lexical/list";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { Button } from "@/components/ui/button";
import { useCallback } from "react";

export function ToolbarPlugin() {
  const [editor] = useLexicalComposerContext();

  const applyFormat = useCallback(
    (format: "bold" | "italic" | "underline") => {
      editor.dispatchCommand(FORMAT_TEXT_COMMAND, format);
    },
    [editor]
  );

  const toggleBulletList = useCallback(() => {
    editor.update(() => {
      const selection = $getSelection();
      if (!$isRangeSelection(selection)) return;

      const anchorNode = selection.anchor.getNode();
      const parent = anchorNode.getTopLevelElementOrThrow();

      if ($isListNode(parent)) {
        $removeList();
      } else {
        editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
      }
    });
  }, [editor]);

  return (
    <div className="flex gap-2 mb-2">
      <Button variant="outline" size="sm" onClick={() => applyFormat("bold")}>
        Bold
      </Button>
      <Button variant="outline" size="sm" onClick={() => applyFormat("italic")}>
        Italic
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => applyFormat("underline")}
      >
        Underline
      </Button>
      <Button variant="outline" size="sm" onClick={toggleBulletList}>
        Bulleted List
      </Button>
    </div>
  );
}
