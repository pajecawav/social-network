import { forwardRef } from "react";
import { Input } from "../../ui/Input";
import { Label } from "./Label";

export const FormField = forwardRef(({ id, label, ...props }, ref) => {
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
});
