"use client"
import TextInput from "@repo/ui/input"
import Button from "@repo/ui/button"
export default function AuthPage({ isSignin, onClick }: {
    isSignin: boolean,
    onClick?: () => void
}) {
    return <div className="w-full h-screen flex justify-center items-center ">
        <div className="p-2 m-2 bg-white rounded flex flex-col items-center justify-center gap-4 ">
            <TextInput placeholder="Enter username" type="text" />
            <TextInput placeholder="Enter password" type="password" />
            {!isSignin && <TextInput placeholder="Enter name" type="text"/>}
            <Button className="border border-black rounded-md px-4 py-1 cursor-pointer bg-blue-600 text-white" onClick={()=>onClick}>{isSignin ? "Signin" : "Signup"}</Button>
        </div>
    </div>
}