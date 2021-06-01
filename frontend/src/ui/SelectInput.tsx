import { ChevronDownIcon } from "@heroicons/react/outline";
import clsx from "clsx";
import { useState } from "react";
import { Dropdown } from "../components/Dropdown";
import { DropdownMenuItem } from "./DropdownMenuItem";

type Option = { name: string; value: string | null };

type SelectInputProps = {
    selectedValue: string | null;
    options: Option[];
    onOptionSelected: (option: string | null) => void;
    className?: string;
};

export const SelectInput = ({
    selectedValue,
    options,
    onOptionSelected,
    className,
}: SelectInputProps) => {
    const [isOpen, setIsOpen] = useState(false);

    const currentName = options.find(
        ({ value }) => value === selectedValue
    )!.name;

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
                <ChevronDownIcon className="self-center h-5 ml-auto text-primary-500" />
            </div>
            <Dropdown
                className="w-full py-2 mt-1 border-2 rounded-md shadow-md bg-primary-700 border-primary-600"
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
};
