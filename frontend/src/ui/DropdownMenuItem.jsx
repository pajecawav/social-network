export function DropdownMenuItem({ icon: Icon, text, ...props }) {
    return (
        <div
            className="flex items-center gap-1 px-2 py-1 cursor-pointer transition-colors duration-100 hover:bg-primary-600"
            {...props}
        >
            {Icon && <Icon className="h-5" />}
            <div>{text}</div>
        </div>
    );
}
