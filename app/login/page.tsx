'use client';

import { useState } from "react";
import { signIn, signUp } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { registerWithInvite } from "@/actions/invite";
import { toast } from "sonner";
import Link from "next/link";
import { motion } from "framer-motion";

export default function LoginPage() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<"signin" | "signup">("signin");

    // Sign In State
    const [signInEmail, setSignInEmail] = useState("");
    const [signInPassword, setSignInPassword] = useState("");
    const [isSignInLoading, setIsSignInLoading] = useState(false);

    // Sign Up State
    const [signUpEmail, setSignUpEmail] = useState("");
    const [signUpPassword, setSignUpPassword] = useState("");
    const [signUpName, setSignUpName] = useState("");
    const [signUpUsername, setSignUpUsername] = useState("");
    const [inviteCode, setInviteCode] = useState("");
    const [isSignUpLoading, setIsSignUpLoading] = useState(false);

    const enableInvite = process.env.NEXT_PUBLIC_ENABLE_INVITE_SYSTEM === 'true';

    const handleSignIn = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSignInLoading(true);
        await signIn.email({
            email: signInEmail,
            password: signInPassword,
            fetchOptions: {
                onSuccess: () => {
                    toast.success("Welcome back!");
                    router.push(`/${signInEmail.split('@')[0]}`);
                    router.refresh();
                },
                onError: (ctx: any) => {
                    toast.error(ctx.error.message || "Failed to sign in");
                    setIsSignInLoading(false);
                }
            }
        });
    };

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSignUpLoading(true);

        try {
            if (enableInvite) {
                if (!inviteCode) {
                    toast.error("Invite code is required.");
                    setIsSignUpLoading(false);
                    return;
                }

                const res = await registerWithInvite({
                    name: signUpName,
                    username: signUpUsername,
                    email: signUpEmail,
                    password: signUpPassword,
                    inviteCode
                });

                if (!res.success) {
                    toast.error(res.error || "Registration failed");
                    setIsSignUpLoading(false);
                    return;
                }

                toast.success("Account created successfully!");

                await signIn.email({
                    email: signUpEmail,
                    password: signUpPassword,
                    fetchOptions: {
                        onSuccess: () => {
                            router.push(`/${signUpUsername}`);
                            router.refresh();
                        },
                        onError: (ctx: any) => {
                            toast.error("Registration successful, but sign-in failed. Please sign in manually.");
                            setIsSignUpLoading(false);
                            setActiveTab("signin");
                        }
                    }
                });
            } else {
                await signUp.email({
                    email: signUpEmail,
                    password: signUpPassword,
                    name: signUpName,
                    username: signUpUsername,
                    image: "",
                    fetchOptions: {
                        onSuccess: () => {
                            toast.success("Welcome to Kita!");
                            router.push(`/${signUpUsername}`);
                            router.refresh();
                        },
                        onError: (ctx: any) => {
                            toast.error(ctx.error.message || "Failed to sign up");
                            setIsSignUpLoading(false);
                        }
                    }
                } as any);
            }
        } catch (error: any) {
            toast.error(error.message || "Something went wrong.");
            setIsSignUpLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background flex flex-col">
            {/* Header */}
            <header className="w-full p-6">
                <Link href="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
                    <ArrowLeft className="w-4 h-4" />
                    <span className="text-sm font-medium">Back to home</span>
                </Link>
            </header>

            {/* Main Content */}
            <main className="flex-1 flex items-center justify-center px-4 py-12">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="w-full max-w-[420px]"
                >
                    {/* Logo */}
                    <div className="flex items-center justify-center gap-2 mb-8">
                        <div className="w-10 h-10 bg-primary/20 text-primary border border-primary/20 rounded-xl flex items-center justify-center">
                            <div className="w-4 h-4 bg-current rounded-sm" />
                        </div>
                        <span className="font-bold text-2xl tracking-tight">Kita</span>
                    </div>

                    {/* Title */}
                    <div className="text-center mb-8">
                        <h1 className="text-2xl font-bold mb-2">Welcome to Kita</h1>
                        <p className="text-muted-foreground text-sm">
                            Create your corner of the internet today.
                        </p>
                    </div>

                    {/* Tabs */}
                    <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="w-full">
                        <TabsList className="grid w-full grid-cols-2 mb-6">
                            <TabsTrigger value="signin">Sign In</TabsTrigger>
                            <TabsTrigger value="signup">Sign Up</TabsTrigger>
                        </TabsList>

                        <TabsContent value="signin">
                            <form onSubmit={handleSignIn} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="si-email">Email</Label>
                                    <Input
                                        id="si-email"
                                        type="email"
                                        value={signInEmail}
                                        onChange={e => setSignInEmail(e.target.value)}
                                        required
                                        placeholder="you@example.com"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="si-password">Password</Label>
                                    <Input
                                        id="si-password"
                                        type="password"
                                        value={signInPassword}
                                        onChange={e => setSignInPassword(e.target.value)}
                                        required
                                    />
                                </div>
                                <Button type="submit" className="w-full" disabled={isSignInLoading}>
                                    {isSignInLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Sign In"}
                                </Button>
                            </form>
                        </TabsContent>

                        <TabsContent value="signup">
                            <form onSubmit={handleSignUp} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="su-name">Name</Label>
                                    <Input
                                        id="su-name"
                                        value={signUpName}
                                        onChange={e => setSignUpName(e.target.value)}
                                        required
                                        placeholder="John Doe"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="su-username">Username</Label>
                                    <Input
                                        id="su-username"
                                        value={signUpUsername}
                                        onChange={e => setSignUpUsername(e.target.value)}
                                        required
                                        placeholder="john"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="su-email">Email</Label>
                                    <Input
                                        id="su-email"
                                        type="email"
                                        value={signUpEmail}
                                        onChange={e => setSignUpEmail(e.target.value)}
                                        required
                                        placeholder="john@example.com"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="su-password">Password</Label>
                                    <Input
                                        id="su-password"
                                        type="password"
                                        value={signUpPassword}
                                        onChange={e => setSignUpPassword(e.target.value)}
                                        required
                                    />
                                </div>

                                {enableInvite && (
                                    <div className="space-y-2">
                                        <Label htmlFor="su-invite">Invite Code</Label>
                                        <Input
                                            id="su-invite"
                                            value={inviteCode}
                                            onChange={e => setInviteCode(e.target.value)}
                                            required
                                            placeholder="Enter your invite code"
                                            className="border-primary/20 focus:border-primary"
                                        />
                                        <p className="text-[10px] text-muted-foreground">Registration is currently invite-only.</p>
                                    </div>
                                )}

                                <Button type="submit" className="w-full" disabled={isSignUpLoading}>
                                    {isSignUpLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Sign Up"}
                                </Button>
                            </form>
                        </TabsContent>
                    </Tabs>
                </motion.div>
            </main>
        </div>
    );
}
