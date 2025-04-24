import { forwardRef, useEffect, useState } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $getSelection, $isRangeSelection, FORMAT_TEXT_COMMAND } from "lexical";
import {
  INSERT_UNORDERED_LIST_COMMAND,
  REMOVE_LIST_COMMAND,
  $isListNode,
} from "@lexical/list";
import { IconButton } from "./IconButton";

export type FloatingMenuCoords = { x: number; y: number } | undefined;

type FloatingMenuState = {
  isBold: boolean;
  isCode: boolean;
  isItalic: boolean;
  isStrikethrough: boolean;
  isUnderline: boolean;
  isList: boolean;
};

type FloatingMenuProps = {
  editor: ReturnType<typeof useLexicalComposerContext>[0];
  coords: FloatingMenuCoords;
};

export const FloatingMenu = forwardRef<HTMLDivElement, FloatingMenuProps>(
  function FloatingMenu(props, ref) {
    const { editor, coords } = props;

    const shouldShow = coords !== undefined;

    const [state, setState] = useState<FloatingMenuState>({
      isBold: false,
      isCode: false,
      isItalic: false,
      isStrikethrough: false,
      isUnderline: false,
      isList: false,
    });

    useEffect(() => {
      const unregisterListener = editor.registerUpdateListener(
        ({ editorState }) => {
          editorState.read(() => {
            const selection = $getSelection();
            if (!$isRangeSelection(selection)) return;

            const anchorNode = selection.anchor.getNode();
            const topLevel = anchorNode.getTopLevelElementOrThrow();

            setState({
              isBold: selection.hasFormat("bold"),
              isCode: selection.hasFormat("code"),
              isItalic: selection.hasFormat("italic"),
              isStrikethrough: selection.hasFormat("strikethrough"),
              isUnderline: selection.hasFormat("underline"),
              isList: $isListNode(topLevel),
            });
          });
        }
      );
      return unregisterListener;
    }, [editor]);

    const toggleList = () => {
      editor.update(() => {
        const selection = $getSelection();
        if (!$isRangeSelection(selection)) return;

        const anchorNode = selection.anchor.getNode();
        const parent = anchorNode.getTopLevelElementOrThrow();

        if ($isListNode(parent)) {
          editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
        } else {
          editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
        }
      });
    };

    return (
      <div
        ref={ref}
        className="z-[9999] fixed bg-slate-100 border border-slate-300 rounded-md p-1 flex gap-1 cursor-pointer"
        aria-hidden={!shouldShow}
        style={{
          position: "absolute",
          top: coords?.y,
          left: coords?.x,
          visibility: shouldShow ? "visible" : "hidden",
          pointerEvents: shouldShow ? "auto" : "none",
          opacity: shouldShow ? 1 : 0,
        }}
      >
        <IconButton
          icon="bold"
          aria-label="Bold"
          active={state.isBold}
          onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold")}
        />
        <IconButton
          icon="italic"
          aria-label="Italic"
          active={state.isItalic}
          onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic")}
        />
        <IconButton
          icon="underline"
          aria-label="Underline"
          active={state.isUnderline}
          onClick={() =>
            editor.dispatchCommand(FORMAT_TEXT_COMMAND, "underline")
          }
        />
        <IconButton
          icon="list"
          aria-label="Bulleted List"
          active={state.isList}
          onClick={toggleList}
        />
      </div>
    );
  }
);
