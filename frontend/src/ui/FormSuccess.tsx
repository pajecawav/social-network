import clsx from "clsx";

type FormSuccessProps = {
    text: string;
    className?: string;
};

export const FormSuccess = ({ className, text }: FormSuccessProps) => (
    <div
        className={clsx(
            "bg-success text-primary-900 max-w-full p-2 rounded border-primary-700 border",
            className
        )}
    >
        {text}
    </div>
);
