import { useRouter } from "next/navigation";
import AuthPage from "../components/AuthPage";

export default function Signin() {
    // const router = useRouter();
    return <AuthPage isSignin={true}/>
}