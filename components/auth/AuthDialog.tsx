'use client';

import { useState, useEffect } from "react";
import { signIn } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { signUp } from "@/lib/auth-client";

interface AuthDialogProps {
    mode?: "signin" | "signup";
    children?: React.ReactNode;
}

export function AuthDialog({ mode = "signin", children }: AuthDialogProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<"signin" | "signup">(mode);
    const router = useRouter();
    const searchParams = useSearchParams();

    useEffect(() => {
        const authParam = searchParams.get("auth");
        if (authParam === mode) {
            setIsOpen(true);
            // Optional: Cleanup URL? Maybe not needed for now, allows refresh to stay open.
        }
    }, [searchParams, mode]);

    // Sign In State
    const [signInEmail, setSignInEmail] = useState("");
    const [signInPassword, setSignInPassword] = useState("");
    const [isSignInLoading, setIsSignInLoading] = useState(false);

    // Sign Up State
    const [signUpEmail, setSignUpEmail] = useState("");
    const [signUpPassword, setSignUpPassword] = useState("");
    const [signUpName, setSignUpName] = useState("");
    const [signUpUsername, setSignUpUsername] = useState("");
    const [isSignUpLoading, setIsSignUpLoading] = useState(false);


    const handleSignIn = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSignInLoading(true);
        await signIn.email({
            email: signInEmail,
            password: signInPassword,
            fetchOptions: {
                onSuccess: () => {
                    setIsOpen(false);
                    router.push(`/${signInEmail.split('@')[0]}`); // Fallback redirect if not username aware immediately, or just refresh
                    router.refresh();
                },
                onError: (ctx: any) => {
                    alert(ctx.error.message);
                    setIsSignInLoading(false);
                }
            }
        });
    };

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSignUpLoading(true);
        await signUp.email({
            email: signUpEmail,
            password: signUpPassword,
            name: signUpName,
            username: signUpUsername,
            image: "",
            fetchOptions: {
                onSuccess: () => {
                    setIsOpen(false);
                    router.push(`/${signUpUsername}`);
                    router.refresh();
                },
                onError: (ctx: any) => {
                    alert(ctx.error.message);
                    setIsSignUpLoading(false);
                }
            }
        } as any);
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] bg-background/80 backdrop-blur-xl border-border/50">
                <DialogHeader>
                    <DialogTitle>Welcome to Kita</DialogTitle>
                    <DialogDescription>
                        Create your corner of the internet today.
                    </DialogDescription>
                </DialogHeader>

                <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="signin">Sign In</TabsTrigger>
                        <TabsTrigger value="signup">Sign Up</TabsTrigger>
                    </TabsList>

                    <TabsContent value="signin">
                        <form onSubmit={handleSignIn} className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label htmlFor="si-email">Email</Label>
                                <Input id="si-email" type="email" value={signInEmail} onChange={e => setSignInEmail(e.target.value)} required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="si-password">Password</Label>
                                <Input id="si-password" type="password" value={signInPassword} onChange={e => setSignInPassword(e.target.value)} required />
                            </div>
                            <Button type="submit" className="w-full" disabled={isSignInLoading}>
                                {isSignInLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Sign In"}
                            </Button>
                        </form>
                    </TabsContent>

                    <TabsContent value="signup">
                        <form onSubmit={handleSignUp} className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label htmlFor="su-name">Name</Label>
                                <Input id="su-name" value={signUpName} onChange={e => setSignUpName(e.target.value)} required placeholder="John Doe" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="su-username">Username</Label>
                                <Input id="su-username" value={signUpUsername} onChange={e => setSignUpUsername(e.target.value)} required placeholder="john" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="su-email">Email</Label>
                                <Input id="su-email" type="email" value={signUpEmail} onChange={e => setSignUpEmail(e.target.value)} required placeholder="john@example.com" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="su-password">Password</Label>
                                <Input id="su-password" type="password" value={signUpPassword} onChange={e => setSignUpPassword(e.target.value)} required />
                            </div>
                            <Button type="submit" className="w-full" disabled={isSignUpLoading}>
                                {isSignUpLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Sign Up"}
                            </Button>
                        </form>
                    </TabsContent>
                </Tabs>
            </DialogContent>
        </Dialog>
    );
}
