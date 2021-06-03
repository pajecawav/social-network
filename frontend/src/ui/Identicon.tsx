import { memo } from "react";
import { randomSequence } from "../utils";

const RECT_SIZE = 100;
const MIN_COLOR_COMPONENT_VALUE = 100;
const MAX_COLOR_COMPONENT_VALUE = 200;

export type IdenticonProps = Omit<
    React.SVGProps<SVGSVGElement>,
    "width" | "height"
> & {
    width: number;
    height: number;
    seed: number;
};

export const Identicon = memo(
    ({ width, height, seed, ...props }: IdenticonProps) => {
        const half = Math.floor(width / 2);
        const seq = randomSequence(seed);

        const colorArr = [];
        for (let i = 0; i < 3; i++) {
            colorArr.push(
                Math.max(
                    Math.min(seq.next().value % 256, MAX_COLOR_COMPONENT_VALUE),
                    MIN_COLOR_COMPONENT_VALUE
                )
            );
        }
        const color = `rgb(${colorArr.join(",")})`;

        const renderCell = (x: number, y: number) => (
            <rect
                x={x * RECT_SIZE}
                y={y * RECT_SIZE}
                // HACK: increase width/height to get rid of gaps between rects
                // caused by subpixel rendering
                width={RECT_SIZE * 1.05}
                height={RECT_SIZE * 1.05}
                key={y * width + x}
            />
        );

        const rects = [];
        for (let x = 0; x < half + 1; x++) {
            for (let y = 0; y < height; y++) {
                const value = seq.next().value;
                if (value % 2 === 0) {
                    rects.push(renderCell(x, y));
                    if (x < half || width % 2 === 0) {
                        rects.push(renderCell(width - x - 1, y));
                    }
                }
            }
        }

        return (
            <svg
                width={RECT_SIZE * width}
                height={RECT_SIZE * height}
                xmlns="http://www.w3.org/2000/svg"
                fill={color}
                stroke="none"
                strokeWidth="0"
                viewBox={`0 0 ${RECT_SIZE * width} ${RECT_SIZE * height}`}
                {...props}
            >
                {rects}
            </svg>
        );
    }
);
