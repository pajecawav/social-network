import { memo } from "react";

const urlRegex =
    /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,10}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/g;

export const LinkifiedText = memo(({ text }) => {
    const matches = Array.from(text.matchAll(urlRegex));

    if (matches.length === 0) {
        return text;
    }

    const nodes = [];
    let textStartIndex = 0;
    matches.forEach((match, index) => {
        nodes.push(
            text.slice(textStartIndex, match.index),
            <a
                className="break-words text-secondary-500 hover:underline"
                href={match[0]}
                onClick={(event) => event.stopPropagation()}
                key={index}
            >
                {match[0]}
            </a>
        );
        textStartIndex = match.index + match[0].length;
    });

    return nodes;
});
