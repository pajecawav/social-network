import { memo, ReactElement } from "react";

const urlRegex =
    /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,10}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/g;

type LinkifiedTextProps = {
    text: string;
};

export const LinkifiedText = memo(({ text }: LinkifiedTextProps) => {
    const matches = Array.from(text.matchAll(urlRegex));

    if (matches.length === 0) {
        return <span>{text}</span>;
    }

    const nodes: ReactElement[] = [];
    let textStartIndex = 0;
    matches.forEach((match, index) => {
        nodes.push(
            <span>{text.slice(textStartIndex, match.index)}</span>,
            <a
                className="break-words text-secondary-500 hover:underline"
                href={match[0]}
                onClick={(event) => event.stopPropagation()}
                key={index}
            >
                {match[0]}
            </a>
        );
        textStartIndex = (match.index as number) + match[0].length;
    });

    return <>{nodes}</>;
});
