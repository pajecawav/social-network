import clsx from "clsx";
import { KeyboardEvent, useRef } from "react";
import TextareaAutosize, {
    TextareaAutosizeProps,
} from "react-textarea-autosize";

export type TextareaProps = TextareaAutosizeProps;

export const Textarea = ({ className, ...props }: TextareaProps) => {
    const ref = useRef<HTMLTextAreaElement | null>(null);

    const handleKeyUp = (event: KeyboardEvent) => {
        if (ref.current && event.ctrlKey && event.key === "Enter") {
            ref.current.form?.dispatchEvent(
                new Event("submit", {
                    bubbles: true,
                    cancelable: true,
                })
            );
        }
    };

    return (
        <TextareaAutosize
            className={clsx(
                "px-2 py-1 transition-colors duration-100 border-2 rounded outline-none appearance-none resize-none bg-primary-700 placeholder-primary-400 border-primary-600 font-sm text-primary-200 focus:border-secondary",
                className
            )}
            {...props}
            onKeyUp={handleKeyUp}
            ref={ref}
        />
    );
};
