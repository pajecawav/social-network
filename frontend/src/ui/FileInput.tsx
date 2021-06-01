import { UploadIcon } from "@heroicons/react/outline";
import clsx from "clsx";
import React from "react";

type FileInputProps = {
    placeholderText?: string;
    file?: File | null;
    maxSizeMB: number;
    onFileSelected: (file: File) => void;
    onError: (error: string) => void;
    className?: string;
};

export const FileInput = ({
    placeholderText = "Choose a file or drag it here",
    file,
    maxSizeMB,
    onFileSelected,
    onError,
    className,
}: FileInputProps) => {
    return (
        <div
            className={clsx(
                "flex relative w-full border-2 border-dashed border-primary-500",
                className
            )}
        >
            <div className="flex flex-col gap-3 px-12 m-auto text-xl text-primary-400">
                {file ? (
                    <div className="max-w-full text-center">
                        <div>Selected file </div>
                        <div className="break-all text-secondary-500">
                            {file.name}
                        </div>
                    </div>
                ) : (
                    <>
                        <UploadIcon className="w-10 h-10 mx-auto" />
                        <h1 className="text-center">{placeholderText}</h1>
                    </>
                )}
            </div>
            <input
                className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
                type="file"
                accept="image/jpeg"
                onChange={(event) => {
                    const file = event.target.files![0];
                    onFileSelected(file);
                    if (file.size > maxSizeMB * 1024 * 1024) {
                        onError(`File is too big (max size ${maxSizeMB}Mb)`);
                    }
                }}
            />
        </div>
    );
};
