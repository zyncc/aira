"use client";

import { EditorContent, EditorContext, useEditor } from "@tiptap/react";
import * as React from "react";

// --- Tiptap Core Extensions ---
import { Highlight } from "@tiptap/extension-highlight";
import { Image } from "@tiptap/extension-image";
import { TaskItem, TaskList } from "@tiptap/extension-list";
import { TextAlign } from "@tiptap/extension-text-align";
import { Typography } from "@tiptap/extension-typography";
import { Selection } from "@tiptap/extensions";
import { StarterKit } from "@tiptap/starter-kit";

// --- UI Primitives ---
import { Button } from "@/components/tiptap/tiptap-ui-primitive/button";
import {
  Toolbar,
  ToolbarGroup,
  ToolbarSeparator,
} from "@/components/tiptap/tiptap-ui-primitive/toolbar";

// --- Tiptap Node ---
import "@/components/tiptap/tiptap-node/blockquote-node/blockquote-node.scss";
import "@/components/tiptap/tiptap-node/code-block-node/code-block-node.scss";
import "@/components/tiptap/tiptap-node/heading-node/heading-node.scss";
import { HorizontalRule } from "@/components/tiptap/tiptap-node/horizontal-rule-node/horizontal-rule-node-extension";
import "@/components/tiptap/tiptap-node/horizontal-rule-node/horizontal-rule-node.scss";
import "@/components/tiptap/tiptap-node/image-node/image-node.scss";
import "@/components/tiptap/tiptap-node/list-node/list-node.scss";
import "@/components/tiptap/tiptap-node/paragraph-node/paragraph-node.scss";

// --- Tiptap UI ---
import { BlockquoteButton } from "@/components/tiptap/tiptap-ui/blockquote-button";
import { CodeBlockButton } from "@/components/tiptap/tiptap-ui/code-block-button";
import {
  ColorHighlightPopover,
  ColorHighlightPopoverButton,
  ColorHighlightPopoverContent,
} from "@/components/tiptap/tiptap-ui/color-highlight-popover";
import { HeadingDropdownMenu } from "@/components/tiptap/tiptap-ui/heading-dropdown-menu";
import {
  LinkButton,
  LinkContent,
  LinkPopover,
} from "@/components/tiptap/tiptap-ui/link-popover";
import { ListDropdownMenu } from "@/components/tiptap/tiptap-ui/list-dropdown-menu";
import { MarkButton } from "@/components/tiptap/tiptap-ui/mark-button";
import { TextAlignButton } from "@/components/tiptap/tiptap-ui/text-align-button";
import { UndoRedoButton } from "@/components/tiptap/tiptap-ui/undo-redo-button";

// --- Icons ---
import { ArrowLeftIcon } from "@/components/tiptap/tiptap-icons/arrow-left-icon";
import { HighlighterIcon } from "@/components/tiptap/tiptap-icons/highlighter-icon";
import { LinkIcon } from "@/components/tiptap/tiptap-icons/link-icon";

// --- Hooks ---
import { useCursorVisibility } from "@/hooks/use-cursor-visibility";
import { useIsMobile } from "@/hooks/use-mobile";
import { useScrolling } from "@/hooks/use-scrolling";
import { useWindowSize } from "@/hooks/use-window-size";

// --- Components ---

// --- Lib ---

// --- Styles ---
import "@/components/tiptap/simple/simple-editor.scss";

const MainToolbarContent = ({
  onHighlighterClick,
  onLinkClick,
  isMobile,
}: {
  onHighlighterClick: () => void;
  onLinkClick: () => void;
  isMobile: boolean;
}) => {
  return (
    <>
      <ToolbarGroup>
        <UndoRedoButton action="undo" />
        <UndoRedoButton action="redo" />
      </ToolbarGroup>

      <ToolbarSeparator />

      <ToolbarGroup>
        <HeadingDropdownMenu levels={[1, 2, 3, 4]} portal={isMobile} />
        <ListDropdownMenu
          types={["bulletList", "orderedList", "taskList"]}
          portal={isMobile}
        />
        <BlockquoteButton />
        <CodeBlockButton />
      </ToolbarGroup>

      <ToolbarSeparator />

      <ToolbarGroup>
        <MarkButton type="bold" />
        <MarkButton type="italic" />
        <MarkButton type="strike" />
        <MarkButton type="code" />
        <MarkButton type="underline" />
        {!isMobile ? (
          <ColorHighlightPopover />
        ) : (
          <ColorHighlightPopoverButton onClick={onHighlighterClick} />
        )}
        {!isMobile ? <LinkPopover /> : <LinkButton onClick={onLinkClick} />}
      </ToolbarGroup>

      <ToolbarSeparator />

      <ToolbarGroup>
        <MarkButton type="superscript" />
        <MarkButton type="subscript" />
      </ToolbarGroup>

      <ToolbarSeparator />

      <ToolbarGroup>
        <TextAlignButton align="left" />
        <TextAlignButton align="center" />
        <TextAlignButton align="right" />
        <TextAlignButton align="justify" />
      </ToolbarGroup>
      {isMobile && <ToolbarSeparator />}
    </>
  );
};

const MobileToolbarContent = ({
  type,
  onBack,
}: {
  type: "highlighter" | "link";
  onBack: () => void;
}) => (
  <>
    <ToolbarGroup>
      <Button data-style="ghost" onClick={onBack}>
        <ArrowLeftIcon className="tiptap-button-icon" />
        {type === "highlighter" ? (
          <HighlighterIcon className="tiptap-button-icon" />
        ) : (
          <LinkIcon className="tiptap-button-icon" />
        )}
      </Button>
    </ToolbarGroup>

    <ToolbarSeparator />

    {type === "highlighter" ? <ColorHighlightPopoverContent /> : <LinkContent />}
  </>
);

export function SimpleEditor({
  description,
  setDescription,
}: {
  description: string;
  setDescription: React.Dispatch<React.SetStateAction<string>>;
}) {
  const isMobile = useIsMobile();
  const windowSize = useWindowSize();
  const [mobileView, setMobileView] = React.useState<"main" | "highlighter" | "link">(
    "main",
  );
  const toolbarRef = React.useRef<HTMLDivElement>(null);

  const editor = useEditor({
    immediatelyRender: false,
    shouldRerenderOnTransaction: true,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      setDescription(html);
    },
    editorProps: {
      attributes: {
        autocomplete: "off",
        spellcheck: "off",
        autocorrect: "off",
        autocapitalize: "off",
        "aria-label": "Main content area, start typing to enter text.",
        class: "simple-editor prose prose-neutral text-foreground marker:text-foreground",
      },
    },
    extensions: [
      StarterKit.configure({
        horizontalRule: false,
        link: {
          openOnClick: false,
          enableClickSelection: true,
        },
      }),
      HorizontalRule,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      TaskList,
      TaskItem.configure({ nested: true }),
      Highlight.configure({ multicolor: true }),
      Image,
      Typography,
      Selection,
    ],
    content: description,
  });

  const isScrolling = useScrolling();
  const rect = useCursorVisibility({
    editor,
    overlayHeight: toolbarRef.current?.getBoundingClientRect().height ?? 0,
  });

  React.useEffect(() => {
    if (!isMobile && mobileView !== "main") {
      setMobileView("main");
    }
  }, [isMobile, mobileView]);

  return (
    <div className="simple-editor-wrapper overflow-auto">
      <EditorContext.Provider value={{ editor }}>
        <Toolbar
          ref={toolbarRef}
          style={{
            border: "none",
            ...(isScrolling && isMobile
              ? { opacity: 0, transition: "opacity 0.1s ease-in-out" }
              : {}),
            ...(isMobile
              ? {
                  bottom: `calc(100% - ${windowSize.height - rect.y}px)`,
                }
              : {}),
          }}
        >
          {mobileView === "main" ? (
            <MainToolbarContent
              onHighlighterClick={() => setMobileView("highlighter")}
              onLinkClick={() => setMobileView("link")}
              isMobile={isMobile}
            />
          ) : (
            <MobileToolbarContent
              type={mobileView === "highlighter" ? "highlighter" : "link"}
              onBack={() => setMobileView("main")}
            />
          )}
        </Toolbar>

        <EditorContent
          editor={editor}
          role="presentation"
          className="simple-editor-content"
        />
      </EditorContext.Provider>
    </div>
  );
}
