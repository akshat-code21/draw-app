"use client";

import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { authClient } from "@/app/lib/auth-client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function SignUp() {
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const { signUp } = authClient;

    return (
        <div className="flex justify-center items-center h-screen">
            <Card className="min-w-lg z-50 rounded-md rounded-t-none">
                <CardHeader>
                    <CardTitle className="text-lg md:text-xl">Sign Up</CardTitle>
                    <CardDescription className="text-xs md:text-sm">
                        Enter your information to create an account
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4">
                        <div className="grid gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="full-name">Full name</Label>
                                <Input
                                    id="full-name"
                                    placeholder="John Doe"
                                    required
                                    onChange={(e) => {
                                        setFullName(e.target.value);
                                    }}
                                    value={fullName}
                                />
                            </div>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="m@example.com"
                                required
                                onChange={(e) => {
                                    setEmail(e.target.value);
                                }}
                                value={email}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                autoComplete="new-password"
                                placeholder="Password"
                            />
                        </div>
                        <Button
                            type="submit"
                            className="w-full"
                            disabled={loading}
                            onClick={async () => {
                                await signUp.email({
                                    email,
                                    password,
                                    name: fullName,
                                    callbackURL: "/dashboard",
                                    fetchOptions: {
                                        onResponse: () => {
                                            setLoading(false);
                                        },
                                        onRequest: () => {
                                            setLoading(true);
                                        },
                                        onError: (ctx) => {
                                            toast.error(ctx.error.message);
                                        },
                                        onSuccess: async () => {
                                            router.push("/dashboard");
                                        },
                                    },
                                });
                            }}
                        >
                            {loading ? (
                                <Loader2 size={16} className="animate-spin" />
                            ) : (
                                "Create an account"
                            )}
                        </Button>
                    </div>
                </CardContent>
                <CardFooter>
                    <div className="flex justify-center w-full border-t py-4">
                        <p className="flex items-center gap-2 text-center text-sm text-neutral-500">
                            Already a user? <Link href="/signin" className="text-orange-400">Sign in</Link>
                        </p>
                    </div>
                </CardFooter>
            </Card>
        </div>
    );
}