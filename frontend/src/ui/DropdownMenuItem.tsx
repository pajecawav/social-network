import clsx from "clsx";
import { DetailedHTMLProps, FC, HTMLAttributes, SVGProps } from "react";

type DropdownMenuItemProps = DetailedHTMLProps<
    HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
> & {
    className?: string;
    icon?: FC<SVGProps<SVGSVGElement>>;
    text: string;
};

export const DropdownMenuItem = ({
    className,
    icon: Icon,
    text,
    ...props
}: DropdownMenuItemProps) => (
    <div
        className={clsx(
            "flex items-center gap-1 px-2 py-1 cursor-pointer transition-colors duration-100 hover:bg-primary-600",
            className
        )}
        {...props}
    >
        {Icon && <Icon className="h-5" />}
        <div>{text}</div>
    </div>
);
