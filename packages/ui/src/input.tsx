import { HTMLInputTypeAttribute } from "react"

export default function TextInput({placeholder,type}:{
    type : HTMLInputTypeAttribute,
    placeholder : string
}) {
    return (
        <input type={type} placeholder={placeholder} className="w-full text-black border-2 rounded-sm border-black p-2" />
    )
}