import React from 'react';
import { Editor, Point, Range } from 'slate';
import { ElementType } from 'slate-plugins/common/constants/formats';
import { Plugin, RenderElementProps } from 'slate-react';
import { CheckListItemElement } from './CheckListItemElement';

export const withChecklist = (editor: Editor) => {
  const { exec } = editor;

  editor.exec = command => {
    const { selection } = editor;

    if (
      command.type === 'delete_backward' &&
      selection &&
      Range.isCollapsed(selection)
    ) {
      const [match] = Editor.nodes(editor, {
        match: { type: ElementType.CHECK_LIST_ITEM },
      });

      if (match) {
        const [, path] = match;
        const start = Editor.start(editor, path);

        if (Point.equals(selection.anchor, start)) {
          Editor.setNodes(
            editor,
            { type: ElementType.PARAGRAPH },
            { match: { type: ElementType.CHECK_LIST_ITEM } }
          );
          return;
        }
      }
    }

    exec(command);
  };

  return editor;
};

export const renderElementCheckList = (props: RenderElementProps) => {
  const { element } = props;

  if (element.type === ElementType.CHECK_LIST_ITEM) {
    return <CheckListItemElement {...props} />;
  }
};

export const CheckListPlugin = (): Plugin => ({
  editor: withChecklist,
  renderElement: renderElementCheckList,
});
