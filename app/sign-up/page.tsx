'use client';

import { useState } from "react";
import { signUp } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function SignUp() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        console.log("Attempting sign up with:", { email, name, username });

        await signUp.email({
            email,
            password,
            name,
            // @ts-ignore - better-auth types might not reflect additional fields immediately
            username,
        }, {
            onSuccess: async (ctx) => {
                console.log("Sign up success", ctx);
                // If we have a username and it wasn't saved (likely), we might want to update it here.
                // For now, redirect.
                router.push("/");
            },
            onError: (ctx) => {
                console.error("Sign up error context:", ctx);
                const msg = ctx.error?.message || ctx.error?.statusText || "An unknown error occurred";
                alert(`Sign up failed: ${msg}`);
                setIsLoading(false);
            }
        });
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-stone-100 p-4">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle>Sign Up</CardTitle>
                    <CardDescription>Create your account to start building.</CardDescription>
                </CardHeader>
                <form onSubmit={handleSignUp}>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Name</Label>
                            <Input
                                id="name"
                                type="text"
                                placeholder="Your Name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="username">Username</Label>
                            <Input
                                id="username"
                                type="text"
                                placeholder="username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="name@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                    </CardContent>
                    <CardFooter className="flex flex-col gap-4">
                        <Button type="submit" className="w-full" disabled={isLoading}>
                            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Sign Up"}
                        </Button>
                        <p className="text-sm text-center text-stone-500">
                            Already have an account? <a href="/sign-in" className="underline text-stone-900">Sign In</a>
                        </p>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
}
