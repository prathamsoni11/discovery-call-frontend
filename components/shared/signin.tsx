"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

import Axios from 'axios'

export default function Signin() {
    const [email, setEmail] = useState("admin@consultadd.com");
    const [password, setPassword] = useState("Admin@123");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();


    const httpClient = Axios.create({
        baseURL: process.env.NEXT_PUBLIC_BASE_URL!,
        headers: {
            'X-Requested-With': 'XMLHttpRequest',
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        withCredentials: true,
        // xsrfCookieName: 'XSRF-TOKEN',
        // withXSRFToken: true,
    })


    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        if (!email || !password) {
            setError("Please enter both email and password");
            setIsLoading(false);
            return;
        }

        try {
            const response = await httpClient.post(
                `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/login`,
                { email, password },
                { withCredentials: true, headers: { "Content-Type": "application/json" } },
            );

            console.log("Login successful:", response.data);
            router.push("/");
        } catch (err: any) {
            setError(err.response?.data?.message || err.message || "Login failed");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center  from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-2xl mb-4 shadow-lg">
                        <span className="text-primary-foreground font-bold text-2xl">
                            C
                        </span>
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                        Consultadd
                    </h1>
                    <p className="text-muted-foreground mt-2">Discovery Platform</p>
                </div>

                <Card className="shadow-xl border-0">
                    <CardHeader className="space-y-1 pb-4">
                        <CardTitle className="text-2xl font-bold text-center">
                            Welcome Back
                        </CardTitle>
                        <CardDescription className="text-center">
                            Sign in to access your dashboard
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleLogin} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email">Email Address</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="name@consultadd.com"
                                    disabled={isLoading}
                                    className="h-11"
                                />
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="password">Password</Label>
                                </div>
                                <Input
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Enter your password"
                                    disabled={isLoading}
                                    className="h-11"
                                />
                            </div>

                            {error && (
                                <Alert variant="destructive">
                                    <AlertDescription>{error}</AlertDescription>
                                </Alert>
                            )}

                            <Button
                                type="submit"
                                className="w-full h-11"
                                disabled={isLoading}
                            >
                                {isLoading ? "Signing in..." : "Sign In"}
                            </Button>
                        </form>

                        <div className="mt-6 text-center text-sm text-muted-foreground">
                            <p>Use any email and password to login</p>
                        </div>
                    </CardContent>
                </Card>

                <p className="text-center text-sm text-muted-foreground mt-8">
                    © 2024 Consultadd. All rights reserved.
                </p>
            </div>
        </div>
    );
}
