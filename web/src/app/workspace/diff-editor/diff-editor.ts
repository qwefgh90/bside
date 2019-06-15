import * as monacoNameSpace from 'monaco-editor';

export interface DiffEditor {
    setContent(original: monacoNameSpace.editor.ITextModel, changes: monacoNameSpace.editor.ITextModel)
}
