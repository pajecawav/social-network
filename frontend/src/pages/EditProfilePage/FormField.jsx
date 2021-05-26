import { Input } from "../../ui/Input";
import { Label } from "./Label";

export function FormField({ id, label, ...props }) {
    return (
        <>
            <Label text={label} htmlFor={id} />
            <Input
                id={id}
                {...props}
                className={"w-full sm:w-60 sm:flex-grow"}
            />
        </>
    );
}
