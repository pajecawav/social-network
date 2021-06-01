import clsx from "clsx";
import { FC, SVGProps } from "react";
import { Link, LinkProps } from "react-router-dom";

type NavigationLinkProps = LinkProps & {
    className?: string;
    icon?: FC<SVGProps<SVGSVGElement>>;
    text: string;
    isBigIcon?: boolean;
};

export const NavigationLink = ({
    className,
    icon: Icon,
    text,
    isBigIcon = false,
    ...props
}: NavigationLinkProps) => (
    <Link
        className={clsx(
            "flex items-center px-1 py-2 gap-2 hover:bg-primary-600 hover:bg-opacity-40 rounded transition-colors duration-100",
            className
        )}
        {...props}
    >
        {Icon && (
            <Icon className="stroke-current stroke-1 text-secondary w-7 h-7 md:w-5 md:h-5" />
        )}
        <div className="text-xl md:text-base">{text}</div>
    </Link>
);
