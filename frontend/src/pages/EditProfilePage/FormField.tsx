import { forwardRef } from "react";
import { Input, InputProps } from "../../ui/Input";
import { Label } from "./Label";

type FormFieldProps = InputProps & {
    id: string;
    label: string;
};

export const FormField = forwardRef<HTMLInputElement, FormFieldProps>(
    ({ id, label, ...props }, ref) => {
        return (
            <>
                <Label text={label} htmlFor={id} />
                <Input
                    id={id}
                    {...props}
                    className={"w-full sm:w-60 sm:flex-grow"}
                    ref={ref}
                />
            </>
        );
    }
);
