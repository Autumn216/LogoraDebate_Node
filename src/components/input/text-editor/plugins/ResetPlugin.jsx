import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useEffect } from "react";
import { useInput } from '@logora/debate.context.input_provider';
import { $getRoot, $createParagraphNode } from "lexical";

export const ResetPlugin = (props) => {
    const [editor] = useLexicalComposerContext();
    const { reset, setReset } = useInput();

    useEffect(() => {
        if (reset) {
            editor.update(() => {
                const root = $getRoot();
                root.clear();
                const p = $createParagraphNode();
                root.append(p);
                setReset(false);
            });
        }
    }, [reset]);

    return null;
}