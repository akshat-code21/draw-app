import { HTMLInputTypeAttribute, ChangeEvent } from "react"

interface TextInputProps {
    type: HTMLInputTypeAttribute;
    placeholder: string;
    value?: string;
    onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
}

export default function TextInput({ placeholder, type, value, onChange }: TextInputProps) {
    return (
        <input 
            type={type} 
            placeholder={placeholder} 
            value={value}
            onChange={onChange}
            className="w-full text-black border-2 rounded-sm border-black p-2" 
        />
    )
}