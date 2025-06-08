"use client"

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { authClient } from "@/app/lib/auth-client";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function SignIn() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const { signIn } = authClient;

    return (
        <div className="flex justify-center items-center h-screen">
            <Card className="min-w-lg">
                <CardHeader>
                    <CardTitle className="text-lg md:text-xl">Sign In</CardTitle>
                    <CardDescription className="text-xs md:text-sm">
                        Enter your email below to login to your account
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4">
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
                            <div className="flex items-center">
                                <Label htmlFor="password">Password</Label>

                            </div>

                            <Input
                                id="password"
                                type="password"
                                placeholder="password"
                                autoComplete="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        <Button
                            type="submit"
                            className="w-full"
                            disabled={loading}
                            onClick={async () => {
                                await signIn.email(
                                    {
                                        email,
                                        password
                                    },
                                    {
                                        onRequest: (ctx) => {
                                            setLoading(true);
                                        },
                                        onResponse: (ctx) => {
                                            setLoading(false);
                                        },
                                        onSuccess: (ctx) => {
                                            router.push("/dashboard");
                                        }
                                    },
                                );
                            }}
                        >
                            {loading ? (
                                <Loader2 size={16} className="animate-spin" />
                            ) : (
                                <p> Login </p>
                            )}
                        </Button>
                    </div>
                </CardContent>
                <CardFooter>
                    <div className="flex justify-center w-full border-t py-4">
                        <p className="flex items-center gap-2 text-center text-sm text-neutral-500">
                            New here?{" "}
                            <Link
                                href="/signup"
                                className="underline"
                                target="_blank"
                            >
                                <span className="text-orange-400">Sign up</span>
                            </Link>
                        </p>
                    </div>
                </CardFooter>
            </Card>
        </div>
    );
}