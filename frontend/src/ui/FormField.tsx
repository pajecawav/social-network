import { forwardRef } from "react";
import { Input, InputProps } from "./Input";
import { Label } from "./Label";

type FormFieldProps = InputProps & {
    id: string;
    label: string;
};

export const FormField = forwardRef<HTMLInputElement, FormFieldProps>(
    ({ id, label, ...props }, ref) => {
        return (
            <>
                <Label className="self-center" text={label} htmlFor={id} />
                <Input
                    id={id}
                    {...props}
                    className={"w-full sm:min-w-[15rem] sm:flex-grow"}
                    ref={ref}
                />
            </>
        );
    }
);
