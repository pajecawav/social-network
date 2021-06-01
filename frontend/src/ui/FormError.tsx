import clsx from "clsx";

type FormErrorProps = {
    text: string;
    className?: string;
};

export const FormError = ({ className, text }: FormErrorProps) => (
    <div
        className={clsx(
            "max-w-full p-2 rounded text-primary-600 bg-error border border-primary-400",
            className
        )}
    >
        {text}
    </div>
);
