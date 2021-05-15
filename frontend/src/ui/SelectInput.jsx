import { ChevronDownIcon } from "@heroicons/react/outline";
import clsx from "clsx";
import { useState } from "react";
import { Dropdown } from "../components/Dropdown";
import { DropdownMenuItem } from "./DropdownMenuItem";

export function SelectInput({
    selectedValue,
    options,
    onOptionSelected,
    className,
}) {
    const [isOpen, setIsOpen] = useState(false);

    const currentName = options.find(
        ({ name, value }) => value === selectedValue
    ).name;

    return (
        <div className={clsx("relative", className)}>
            <div
                className={clsx(
                    "flex w-full px-2 py-1 border-2 bg-primary-700 transition-colors duration-100 border-primary-600 rounded outline-none appearance-none font-sm text-primary-200",
                    isOpen && "border-secondary"
                )}
                onClick={() => setIsOpen(true)}
            >
                <span>{currentName}</span>
                <ChevronDownIcon className="h-5 ml-auto self-center text-primary-500" />
            </div>
            <Dropdown
                className="w-full mt-1 py-2 border-2 rounded-md shadow-md bg-primary-700 border-primary-600"
                isOpen={isOpen}
                onRequestClose={() => setIsOpen(false)}
            >
                {options.map(({ name, value }) => (
                    <DropdownMenuItem
                        text={name}
                        onClick={() => {
                            setIsOpen(false);
                            onOptionSelected(value);
                        }}
                        key={value}
                    />
                ))}
            </Dropdown>
        </div>
    );
}
