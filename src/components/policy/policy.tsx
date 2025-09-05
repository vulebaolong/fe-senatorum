"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Card } from "../ui/card";
import { Button } from "@/components/ui/button";
import ThemeToggleV2 from "../theme-toggle/theme-toggle-v2";
import { Logo } from "../logo/Logo";
import type { LucideIcon } from "lucide-react";
import {
    AlertTriangle,
    ArrowLeft,
    BookOpen,
    Calendar,
    Cookie,
    Database,
    Eye,
    FileText,
    Globe,
    Info,
    Lock,
    Mail,
    Settings,
    Shield,
    UserCheck,
    Users,
    Menu,
    X,
} from "lucide-react";

type TocItem = { id: string; title: string; icon: LucideIcon };

export default function Policy() {
    const router = useRouter();
    const [activeSection, setActiveSection] = useState("");
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const sections: TocItem[] = useMemo(
        () => [
            { id: "introduction", title: "1. Introduction", icon: Info },
            { id: "information", title: "2. Information We Collect", icon: Database },
            { id: "usage", title: "3. How We Use Your Information", icon: Settings },
            { id: "sharing", title: "4. How We Share Your Information", icon: Users },
            { id: "retention", title: "5. Data Retention", icon: FileText },
            { id: "rights", title: "6. Your Privacy Rights", icon: UserCheck },
            { id: "cookies", title: "7. Cookies and Tracking Technologies", icon: Cookie },
            { id: "security", title: "8. Data Security", icon: Lock },
            { id: "transfers", title: "9. International Data Transfers", icon: Globe },
            { id: "children", title: "10. Children's Privacy", icon: Shield },
            { id: "changes", title: "11. Changes to This Privacy Policy", icon: AlertTriangle },
            { id: "third-party", title: "12. Third-Party Services", icon: Eye },
            { id: "compliance", title: "13. Compliance and Certifications", icon: Shield },
        ],
        []
    );

    const handleSectionClick = (sectionId: string) => {
        document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth", block: "start" });
        history.replaceState(null, "", `#${sectionId}`);
        setIsSidebarOpen(false);
    };

    // Scroll-spy: highlight mục đang ở viewport
    useEffect(() => {
        const ids = sections.map((s) => s.id);
        const observers: IntersectionObserver[] = [];

        ids.forEach((id) => {
            const el = document.getElementById(id);
            if (!el) return;

            const obs = new IntersectionObserver(
                (entries) => {
                    entries.forEach((entry) => {
                        if (entry.isIntersecting) setActiveSection(id);
                    });
                },
                { rootMargin: "-40% 0px -50% 0px", threshold: 0.1 }
            );
            obs.observe(el);
            observers.push(obs);
        });

        return () => observers.forEach((o) => o.disconnect());
    }, [sections]);

    // Điều hướng đến hash khi load lần đầu
    useEffect(() => {
        const { hash } = window.location;
        if (hash) {
            const id = hash.replace("#", "");
            const el = document.getElementById(id);
            if (el) {
                setTimeout(() => {
                    el.scrollIntoView({ behavior: "instant", block: "start" as ScrollLogicalPosition });
                    setActiveSection(id);
                }, 0);
            }
        }
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Header */}
            <header className="shadow-sm border-b sticky top-0 z-50 bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-14 sm:h-16">
                        <div className="flex items-center gap-2 sm:gap-4">
                            <Button onClick={() => router.back()} variant="ghost" size="sm" className="gap-1 sm:gap-2 text-xs sm:text-sm">
                                <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4" />
                                <span className="hidden xs:inline">Back</span>
                            </Button>
                            <div className="flex items-center gap-1 sm:gap-2">
                                <Logo />
                                <span className="text-lg sm:text-xl font-bold">Senatorum</span>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            {/* Mobile menu button */}
                            <Button variant="ghost" size="sm" className="lg:hidden" onClick={() => setIsSidebarOpen((v) => !v)}>
                                {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                            </Button>
                            <ThemeToggleV2 className="gap-1 sm:gap-2" />
                        </div>
                    </div>
                </div>
            </header>

            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setIsSidebarOpen(false)} />}

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8 h-[100vh] overflow-y-auto">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
                    {/* Sidebar */}
                    <div
                        className={cn(
                            "lg:col-span-1",
                            "fixed inset-y-0 left-0 z-40 w-80 transform transition-transform duration-300 ease-in-out lg:relative lg:transform-none lg:w-auto",
                            isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
                        )}
                    >
                        <Card className="h-full lg:h-fit lg:sticky lg:top-20 rounded-lg border bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 overflow-y-auto">
                            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                                <h3 className="font-semibold flex items-center gap-2 text-gray-900 dark:text-gray-100">
                                    <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-foreground/70" />
                                    <span className="text-sm sm:text-base">Table of Contents</span>
                                </h3>
                            </div>

                            <nav className="space-y-1 p-2">
                                {sections.map(({ id, title, icon: Icon }) => {
                                    const isActive = activeSection === id;
                                    return (
                                        <button
                                            key={id}
                                            className={cn(
                                                "w-full flex items-center gap-2 px-3 py-2.5 text-sm rounded-md transition-colors text-left",
                                                isActive
                                                    ? "bg-green-50 text-green-700 border-r-2 border-green-500 dark:bg-green-900/20 dark:text-green-300 dark:border-green-600"
                                                    : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/60"
                                            )}
                                            onClick={() => handleSectionClick(id)}
                                            aria-current={isActive ? "page" : undefined}
                                        >
                                            <Icon className="w-4 h-4 flex-shrink-0" />
                                            <span className="truncate text-xs sm:text-sm">{title}</span>
                                        </button>
                                    );
                                })}
                            </nav>
                        </Card>
                    </div>

                    {/* Main Content */}
                    <div className="lg:col-span-3">
                        <Card className="shadow-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                            {/* Document Header */}
                            <div className="border-b border-gray-200 dark:border-gray-700 p-4 sm:p-6 lg:p-8">
                                <div className="text-center">
                                    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                                        <Shield className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                                    </div>
                                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4 text-gray-900 dark:text-gray-100">
                                        Privacy Policy
                                    </h1>
                                    <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                                        <div className="flex items-center gap-1">
                                            <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                                            <span>Effective Date: August 21, 2025</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <FileText className="w-3 h-3 sm:w-4 sm:h-4" />
                                            <span>Last Updated: August 21, 2025</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-4 sm:p-6 lg:p-8">
                                {/* 1. Introduction */}
                                <section id="introduction" className="mb-8 sm:mb-12">
                                    <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 flex items-center gap-2 sm:gap-3 text-gray-900 dark:text-gray-100">
                                        <Info className="w-5 h-5 sm:w-6 sm:h-6 text-blue-500" />
                                        <span className="text-base sm:text-2xl">1. INTRODUCTION</span>
                                    </h2>
                                    <div className="text-gray-700 dark:text-gray-300 leading-relaxed space-y-3 sm:space-y-4 text-sm sm:text-base">
                                        <p>
                                            Welcome to Senatorum. This Privacy Policy explains how we collect, use, disclose, and safeguard your
                                            information when you use our social networking platform and related services (collectively, the
                                            “Service”).
                                        </p>
                                        <p>
                                            By using Senatorum, you consent to the data practices described in this Privacy Policy. If you do not
                                            agree with the practices described in this policy, please do not use our Service.
                                        </p>
                                    </div>
                                </section>

                                {/* 2. Information We Collect */}
                                <section id="information" className="mb-8 sm:mb-12">
                                    <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 flex items-center gap-2 sm:gap-3 text-gray-900 dark:text-gray-100">
                                        <Database className="w-5 h-5 sm:w-6 sm:h-6 text-purple-500 dark:text-purple-400" />
                                        <span className="text-base sm:text-2xl">2. INFORMATION WE COLLECT</span>
                                    </h2>

                                    <div className="leading-relaxed space-y-4 sm:space-y-6 text-gray-700 dark:text-gray-300 text-sm sm:text-base">
                                        {/* 2.1 */}
                                        <div>
                                            <h3 className="text-base sm:text-lg font-semibold mb-2 sm:mb-3 text-gray-900 dark:text-gray-100">
                                                2.1 Information You Provide Directly
                                            </h3>

                                            <div className="space-y-3 sm:space-y-4">
                                                {/* BLUE box */}
                                                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 p-3 sm:p-4 rounded-lg">
                                                    <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2 text-sm sm:text-base">
                                                        Account Information:
                                                    </h4>
                                                    <ul className="list-disc list-inside space-y-1 text-xs sm:text-sm text-blue-800 dark:text-blue-200">
                                                        <li>Username and display name</li>
                                                        <li>Email address and phone number (optional)</li>
                                                        <li>Password (encrypted and stored securely)</li>
                                                        <li>Profile information (bio, profile picture, preferences)</li>
                                                        <li>Age verification information</li>
                                                    </ul>
                                                </div>

                                                {/* GREEN box */}
                                                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 p-3 sm:p-4 rounded-lg">
                                                    <h4 className="font-semibold text-green-900 dark:text-green-100 mb-2 text-sm sm:text-base">
                                                        Content You Create:
                                                    </h4>
                                                    <ul className="list-disc list-inside space-y-1 text-xs sm:text-sm text-green-800 dark:text-green-200">
                                                        <li>Posts, comments, and messages you send</li>
                                                        <li>Photos, videos, and other media you upload</li>
                                                        <li>Reactions, likes, and other interactions</li>
                                                        <li>Community and group participation</li>
                                                    </ul>
                                                </div>

                                                {/* PURPLE box */}
                                                <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 p-3 sm:p-4 rounded-lg">
                                                    <h4 className="font-semibold text-purple-900 dark:text-purple-100 mb-2 text-sm sm:text-base">
                                                        Communications:
                                                    </h4>
                                                    <ul className="list-disc list-inside space-y-1 text-xs sm:text-sm text-purple-800 dark:text-purple-200">
                                                        <li>Messages you send to other users</li>
                                                        <li>Communications with our support team</li>
                                                        <li>Feedback and survey responses</li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>

                                        {/* 2.2 */}
                                        <div>
                                            <h3 className="text-base sm:text-lg font-semibold mb-2 sm:mb-3 text-gray-900 dark:text-gray-100">
                                                2.2 Information We Collect Automatically
                                            </h3>

                                            <div className="space-y-3 sm:space-y-4">
                                                <div className="bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700 p-3 sm:p-4 rounded-lg">
                                                    <h4 className="font-semibold mb-2 text-gray-900 dark:text-gray-100 text-sm sm:text-base">
                                                        Usage Information:
                                                    </h4>
                                                    <ul className="list-disc list-inside space-y-1 text-xs sm:text-sm text-gray-700 dark:text-gray-300">
                                                        <li>Time spent on the Service and features used</li>
                                                        <li>Content you view, interact with, or share</li>
                                                        <li>Search queries and browsing patterns</li>
                                                        <li>Connection and interaction patterns with other users</li>
                                                    </ul>
                                                </div>

                                                <div className="bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700 p-3 sm:p-4 rounded-lg">
                                                    <h4 className="font-semibold mb-2 text-gray-900 dark:text-gray-100 text-sm sm:text-base">
                                                        Device Information:
                                                    </h4>
                                                    <ul className="list-disc list-inside space-y-1 text-xs sm:text-sm text-gray-700 dark:text-gray-300">
                                                        <li>Device type, operating system, and version</li>
                                                        <li>IP address and general location information</li>
                                                        <li>Browser type and version</li>
                                                        <li>Unique device identifiers</li>
                                                        <li>Network connection information</li>
                                                    </ul>
                                                </div>

                                                <div className="bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700 p-3 sm:p-4 rounded-lg">
                                                    <h4 className="font-semibold mb-2 text-gray-900 dark:text-gray-100 text-sm sm:text-base">
                                                        Technical Data:
                                                    </h4>
                                                    <ul className="list-disc list-inside space-y-1 text-xs sm:text-sm text-gray-700 dark:text-gray-300">
                                                        <li>Log files and server data</li>
                                                        <li>Cookies and similar tracking technologies</li>
                                                        <li>Crash reports and performance analytics</li>
                                                        <li>Security and fraud prevention data</li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </section>

                                {/* 3. How We Use */}
                                <section id="usage" className="mb-8 sm:mb-12">
                                    <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 flex items-center gap-2 sm:gap-3 text-gray-900 dark:text-gray-100">
                                        <Settings className="w-5 h-5 sm:w-6 sm:h-6 text-green-500 dark:text-green-400" />
                                        <span className="text-base sm:text-2xl">3. HOW WE USE YOUR INFORMATION</span>
                                    </h2>

                                    <div className="leading-relaxed space-y-4 sm:space-y-6 text-gray-700 dark:text-gray-300 text-sm sm:text-base">
                                        <div>
                                            <h3 className="text-base sm:text-lg font-semibold mb-2 sm:mb-3 text-gray-900 dark:text-gray-100">
                                                3.1 Primary Uses
                                            </h3>

                                            <div className="space-y-3 sm:space-y-4">
                                                <div>
                                                    <h4 className="font-medium mb-2 text-gray-900 dark:text-gray-100 text-sm sm:text-base">
                                                        To Provide the Service:
                                                    </h4>
                                                    <ul className="list-disc list-inside space-y-1 text-xs sm:text-sm">
                                                        <li>Create and manage your account</li>
                                                        <li>Enable communication with other users</li>
                                                        <li>Display your content and profile to appropriate audiences</li>
                                                        <li>Provide customer support and respond to inquiries</li>
                                                    </ul>
                                                </div>

                                                <div>
                                                    <h4 className="font-medium mb-2 text-gray-900 dark:text-gray-100 text-sm sm:text-base">
                                                        To Improve the Service:
                                                    </h4>
                                                    <ul className="list-disc list-inside space-y-1 text-xs sm:text-sm">
                                                        <li>Analyze usage patterns and optimize performance</li>
                                                        <li>Develop new features and functionality</li>
                                                        <li>Conduct research and analytics</li>
                                                        <li>Test and improve our algorithms</li>
                                                    </ul>
                                                </div>

                                                <div>
                                                    <h4 className="font-medium mb-2 text-gray-900 dark:text-gray-100 text-sm sm:text-base">
                                                        Safety and Security:
                                                    </h4>
                                                    <ul className="list-disc list-inside space-y-1 text-xs sm:text-sm">
                                                        <li>Detect and prevent fraud, abuse, and harmful activities</li>
                                                        <li>Enforce our Terms of Service and Community Guidelines</li>
                                                        <li>Protect the rights and safety of users</li>
                                                        <li>Comply with legal obligations</li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>

                                        <div>
                                            <h3 className="text-base sm:text-lg font-semibold mb-2 sm:mb-3 text-gray-900 dark:text-gray-100">
                                                3.2 Communication Purposes
                                            </h3>

                                            <div className="space-y-3">
                                                <div>
                                                    <h4 className="font-medium text-gray-900 dark:text-gray-100 text-sm sm:text-base">
                                                        Service Communications:
                                                    </h4>
                                                    <ul className="list-disc list-inside space-y-1 text-xs sm:text-sm">
                                                        <li>Account notifications and updates</li>
                                                        <li>Security alerts and important notices</li>
                                                        <li>Changes to our policies or terms</li>
                                                    </ul>
                                                </div>

                                                <div>
                                                    <h4 className="font-medium text-gray-900 dark:text-gray-100 text-sm sm:text-base">
                                                        Optional Communications:
                                                    </h4>
                                                    <ul className="list-disc list-inside space-y-1 text-xs sm:text-sm">
                                                        <li>Product updates and new features (with your consent)</li>
                                                        <li>Community highlights and recommendations</li>
                                                        <li>Promotional content (you can opt-out anytime)</li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>

                                        <div>
                                            <h3 className="text-base sm:text-lg font-semibold mb-2 sm:mb-3 text-gray-900 dark:text-gray-100">
                                                3.3 Legal and Compliance
                                            </h3>
                                            <ul className="list-disc list-inside space-y-1 text-xs sm:text-sm">
                                                <li>Comply with applicable laws and regulations</li>
                                                <li>Respond to legal requests and court orders</li>
                                                <li>Protect our legal rights and interests</li>
                                                <li>Cooperate with law enforcement when required</li>
                                            </ul>
                                        </div>
                                    </div>
                                </section>

                                {/* 4. Share */}
                                <section id="sharing" className="mb-8 sm:mb-12">
                                    <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 flex items-center gap-2 sm:gap-3 text-gray-900 dark:text-gray-100">
                                        <Users className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-500 dark:text-indigo-400" />
                                        <span className="text-base sm:text-2xl">4. HOW WE SHARE YOUR INFORMATION</span>
                                    </h2>

                                    <div className="leading-relaxed space-y-4 sm:space-y-6 text-gray-700 dark:text-gray-300 text-sm sm:text-base">
                                        <div>
                                            <h3 className="text-base sm:text-lg font-semibold mb-2 sm:mb-3 text-gray-900 dark:text-gray-100">
                                                4.1 With Other Users
                                            </h3>
                                            <ul className="list-disc list-inside space-y-1 text-xs sm:text-sm">
                                                <li>Your public profile information and posts</li>
                                                <li>Messages you send to other users</li>
                                                <li>Activity in public communities and groups</li>
                                                <li>Content you choose to share publicly</li>
                                            </ul>
                                        </div>

                                        <div>
                                            <h3 className="text-base sm:text-lg font-semibold mb-2 sm:mb-3 text-gray-900 dark:text-gray-100">
                                                4.2 With Service Providers
                                            </h3>
                                            <ul className="list-disc list-inside space-y-1 text-xs sm:text-sm">
                                                <li>Cloud hosting and storage services</li>
                                                <li>Analytics and performance monitoring</li>
                                                <li>Customer support platforms</li>
                                                <li>Payment processing (if applicable)</li>
                                            </ul>
                                        </div>

                                        <div>
                                            <h3 className="text-base sm:text-lg font-semibold mb-2 sm:mb-3 text-gray-900 dark:text-gray-100">
                                                4.3 Legal Requirements
                                            </h3>
                                            <ul className="list-disc list-inside space-y-1 text-xs sm:text-sm">
                                                <li>When required by law or legal process</li>
                                                <li>To protect our rights and the rights of others</li>
                                                <li>To prevent fraud or illegal activities</li>
                                                <li>In connection with law enforcement requests</li>
                                            </ul>
                                        </div>
                                    </div>
                                </section>

                                {/* 5. Retention */}
                                <section id="retention" className="mb-8 sm:mb-12">
                                    <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 flex items-center gap-2 sm:gap-3 text-gray-900 dark:text-gray-100">
                                        <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-cyan-500 dark:text-cyan-400" />
                                        <span className="text-base sm:text-2xl">5. DATA RETENTION</span>
                                    </h2>

                                    <div className="leading-relaxed space-y-4 sm:space-y-6 text-gray-700 dark:text-gray-300 text-sm sm:text-base">
                                        <div>
                                            <h3 className="text-base sm:text-lg font-semibold mb-2 sm:mb-3 text-gray-900 dark:text-gray-100">
                                                5.1 Retention Periods
                                            </h3>
                                            <ul className="list-disc list-inside space-y-1 text-xs sm:text-sm">
                                                <li>Account data: Until you delete your account</li>
                                                <li>Content: As long as your account is active</li>
                                                <li>Messages: Retained according to your settings</li>
                                                <li>Analytics data: Aggregated and anonymized after 2 years</li>
                                            </ul>
                                        </div>

                                        <div>
                                            <h3 className="text-base sm:text-lg font-semibold mb-2 sm:mb-3 text-gray-900 dark:text-gray-100">
                                                5.2 Account Deletion
                                            </h3>
                                            <p className="mb-3 text-xs sm:text-sm">When you delete your account:</p>
                                            <ul className="list-disc list-inside space-y-1 text-xs sm:text-sm">
                                                <li>Your profile and content are removed within 30 days</li>
                                                <li>Backup copies may persist for up to 90 days</li>
                                                <li>Some information may be retained for legal compliance</li>
                                                <li>Anonymous usage data may be retained for analytics</li>
                                            </ul>
                                        </div>
                                    </div>
                                </section>

                                {/* 6. Rights */}
                                <section id="rights" className="mb-8 sm:mb-12">
                                    <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 flex items-center gap-2 sm:gap-3 text-gray-900 dark:text-gray-100">
                                        <UserCheck className="w-5 h-5 sm:w-6 sm:h-6 text-blue-500 dark:text-blue-400" />
                                        <span className="text-base sm:text-2xl">6. YOUR PRIVACY RIGHTS</span>
                                    </h2>

                                    <div className="leading-relaxed space-y-4 sm:space-y-6 text-gray-700 dark:text-gray-300 text-sm sm:text-base">
                                        {/* 6.1 */}
                                        <div>
                                            <h3 className="text-base sm:text-lg font-semibold mb-2 sm:mb-3 text-gray-900 dark:text-gray-100">
                                                6.1 Access and Control
                                            </h3>

                                            <div className="space-y-3 sm:space-y-4">
                                                <div>
                                                    <h4 className="font-medium mb-2 text-gray-900 dark:text-gray-100 text-sm sm:text-base">
                                                        Account Management:
                                                    </h4>
                                                    <ul className="list-disc list-inside space-y-1 text-xs sm:text-sm">
                                                        <li>Access and update your account information</li>
                                                        <li>Download a copy of your data</li>
                                                        <li>Delete or deactivate your account</li>
                                                        <li>Control who can see your content</li>
                                                    </ul>
                                                </div>

                                                <div>
                                                    <h4 className="font-medium mb-2 text-gray-900 dark:text-gray-100 text-sm sm:text-base">
                                                        Privacy Settings:
                                                    </h4>
                                                    <ul className="list-disc list-inside space-y-1 text-xs sm:text-sm">
                                                        <li>Adjust visibility of your profile and content</li>
                                                        <li>Control communication preferences</li>
                                                        <li>Manage third-party integrations</li>
                                                        <li>Set content filtering preferences</li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>

                                        {/* 6.2 */}
                                        <div>
                                            <h3 className="text-base sm:text-lg font-semibold mb-2 sm:mb-3 text-gray-900 dark:text-gray-100">
                                                6.2 Regional Rights
                                            </h3>

                                            <div className="space-y-3 sm:space-y-4">
                                                {/* BLUE */}
                                                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 p-3 sm:p-4 rounded-lg">
                                                    <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2 text-sm sm:text-base">
                                                        For EU Users (GDPR):
                                                    </h4>
                                                    <ul className="list-disc list-inside space-y-1 text-xs sm:text-sm text-blue-800 dark:text-blue-200">
                                                        <li>Right to access your personal data</li>
                                                        <li>Right to rectify inaccurate data</li>
                                                        <li>Right to erase your data (“right to be forgotten”)</li>
                                                        <li>Right to restrict processing</li>
                                                        <li>Right to data portability</li>
                                                        <li>Right to object to processing</li>
                                                        <li>Right to withdraw consent</li>
                                                    </ul>
                                                </div>

                                                {/* YELLOW */}
                                                <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 p-3 sm:p-4 rounded-lg">
                                                    <h4 className="font-semibold text-yellow-900 dark:text-yellow-100 mb-2 text-sm sm:text-base">
                                                        For California Users (CCPA):
                                                    </h4>
                                                    <ul className="list-disc list-inside space-y-1 text-xs sm:text-sm text-yellow-800 dark:text-yellow-200">
                                                        <li>Right to know what personal information is collected</li>
                                                        <li>Right to delete personal information</li>
                                                        <li>Right to opt-out of sale of personal information</li>
                                                        <li>Right to non-discrimination for exercising rights</li>
                                                    </ul>
                                                </div>

                                                {/* GREEN */}
                                                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 p-3 sm:p-4 rounded-lg">
                                                    <h4 className="font-semibold text-green-900 dark:text-green-100 mb-2 text-sm sm:text-base">
                                                        For Vietnam Users:
                                                    </h4>
                                                    <ul className="list-disc list-inside space-y-1 text-xs sm:text-sm text-green-800 dark:text-green-200">
                                                        <li>Rights under Vietnam's Personal Data Protection laws</li>
                                                        <li>Right to access and correct personal data</li>
                                                        <li>Right to withdraw consent</li>
                                                        <li>Right to request data deletion</li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>

                                        {/* 6.3 */}
                                        <div>
                                            <h3 className="text-base sm:text-lg font-semibold mb-2 sm:mb-3 text-gray-900 dark:text-gray-100">
                                                6.3 Exercising Your Rights
                                            </h3>
                                            <p className="mb-3 text-xs sm:text-sm">To exercise your privacy rights:</p>
                                            <ul className="list-disc list-inside space-y-1 text-xs sm:text-sm">
                                                <li>Use privacy controls in your account settings</li>
                                                <li>Contact our support team</li>
                                                <li>Submit requests through our privacy portal</li>
                                                <li>Email our Data Protection Officer</li>
                                            </ul>
                                            <p className="mt-3 text-xs sm:text-sm bg-gray-100 dark:bg-gray-800/60 text-gray-700 dark:text-gray-200 p-3 rounded border border-gray-200 dark:border-gray-700">
                                                We will respond to verified requests within 30 days.
                                            </p>
                                        </div>

                                        {/* 6.4 */}
                                        <div>
                                            <h3 className="text-base sm:text-lg font-semibold mb-2 sm:mb-3 text-gray-900 dark:text-gray-100">
                                                6.4 Data Subject Requests
                                            </h3>

                                            <div className="bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700 p-3 sm:p-4 rounded-lg mb-4">
                                                <h4 className="font-semibold mb-2 text-gray-900 dark:text-gray-100 text-sm sm:text-base">
                                                    How to Submit Requests:
                                                </h4>
                                                <ul className="list-disc list-inside space-y-1 text-xs sm:text-sm text-gray-700 dark:text-gray-300">
                                                    <li>Log into your account and use the privacy settings</li>
                                                    <li>Email our Data Protection Officer at privacy@senatorum.com</li>
                                                    <li>Use our online privacy request form</li>
                                                    <li>Contact customer support through the app</li>
                                                </ul>
                                            </div>

                                            <div className="space-y-3">
                                                <div>
                                                    <h4 className="font-medium text-gray-900 dark:text-gray-100 text-sm sm:text-base">
                                                        Verification Process:
                                                    </h4>
                                                    <ul className="list-disc list-inside space-y-1 text-xs sm:text-sm">
                                                        <li>We verify your identity before processing requests</li>
                                                        <li>May require additional documentation for security</li>
                                                        <li>Requests from authorized agents require proper authorization</li>
                                                    </ul>
                                                </div>

                                                <div>
                                                    <h4 className="font-medium text-gray-900 dark:text-gray-100 text-sm sm:text-base">
                                                        Response Timeframes:
                                                    </h4>
                                                    <ul className="list-disc list-inside space-y-1 text-xs sm:text-sm">
                                                        <li>Most requests completed within 30 days</li>
                                                        <li>Complex requests may take up to 60 days</li>
                                                        <li>We&apos;ll notify you if additional time is needed</li>
                                                        <li>No fees for reasonable requests</li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>

                                        {/* 6.5 */}
                                        <div>
                                            <h3 className="text-base sm:text-lg font-semibold mb-2 sm:mb-3 text-gray-900 dark:text-gray-100">
                                                6.5 Limitations and Exceptions
                                            </h3>
                                            <p className="mb-3 text-xs sm:text-sm">We may be unable to fulfill certain requests when:</p>
                                            <ul className="list-disc list-inside space-y-1 text-xs sm:text-sm">
                                                <li>Required to retain data by law or regulation</li>
                                                <li>Data is necessary for legal claims or defenses</li>
                                                <li>Information is needed for security or fraud prevention</li>
                                                <li>Deleting data would harm the rights of other users</li>
                                                <li>Request is manifestly unfounded or excessive</li>
                                            </ul>
                                        </div>

                                        {/* 6.6 */}
                                        <div>
                                            <h3 className="text-base sm:text-lg font-semibold mb-2 sm:mb-3 text-gray-900 dark:text-gray-100">
                                                6.6 Contact Information for Privacy Matters
                                            </h3>

                                            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 p-3 sm:p-4 rounded-lg">
                                                <div className="space-y-2">
                                                    <div>
                                                        <h4 className="font-medium text-blue-900 dark:text-blue-100 text-sm sm:text-base">
                                                            Data Protection Officer:
                                                        </h4>
                                                        <p className="text-xs sm:text-sm text-blue-800 dark:text-blue-200">
                                                            Email: privacy@senatorum.com
                                                            <br />
                                                            Response time: Within 5 business days
                                                        </p>
                                                    </div>

                                                    <div>
                                                        <h4 className="font-medium text-blue-900 dark:text-blue-100 text-sm sm:text-base">
                                                            Regional Privacy Representatives:
                                                        </h4>
                                                        <ul className="list-disc list-inside space-y-1 text-xs sm:text-sm text-blue-800 dark:text-blue-200">
                                                            <li>EU Representative: eu-privacy@senatorum.com</li>
                                                            <li>California Privacy Rights: ccpa@senatorum.com</li>
                                                            <li>Vietnam Data Protection: vn-privacy@senatorum.com</li>
                                                        </ul>
                                                    </div>

                                                    <div>
                                                        <h4 className="font-medium text-blue-900 dark:text-blue-100 text-sm sm:text-base">
                                                            Supervisory Authorities:
                                                        </h4>
                                                        <p className="text-xs sm:text-sm text-blue-800 dark:text-blue-200">
                                                            EU users have the right to lodge complaints with their local data protection authority.
                                                            California users can contact the California Attorney General&apos;s office.
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </section>

                                {/* 7. Cookies */}
                                <section id="cookies" className="mb-8 sm:mb-12">
                                    <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 flex items-center gap-2 sm:gap-3 text-gray-900 dark:text-gray-100">
                                        <Cookie className="w-5 h-5 sm:w-6 sm:h-6 text-amber-500 dark:text-amber-400" />
                                        <span className="text-base sm:text-2xl">7. COOKIES AND TRACKING TECHNOLOGIES</span>
                                    </h2>

                                    <div className="leading-relaxed space-y-4 sm:space-y-6 text-gray-700 dark:text-gray-300 text-sm sm:text-base">
                                        <div>
                                            <h3 className="text-base sm:text-lg font-semibold mb-2 sm:mb-3 text-gray-900 dark:text-gray-100">
                                                7.1 Types of Cookies We Use
                                            </h3>

                                            <div className="space-y-3 sm:space-y-4">
                                                <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 p-3 sm:p-4 rounded-lg">
                                                    <h4 className="font-semibold text-amber-900 dark:text-amber-100 mb-2 text-sm sm:text-base">
                                                        Essential Cookies:
                                                    </h4>
                                                    <ul className="list-disc list-inside space-y-1 text-xs sm:text-sm text-amber-800 dark:text-amber-200">
                                                        <li>Authentication and security</li>
                                                        <li>Remember your preferences</li>
                                                        <li>Enable basic functionality</li>
                                                        <li>Prevent fraud and abuse</li>
                                                    </ul>
                                                </div>

                                                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 p-3 sm:p-4 rounded-lg">
                                                    <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2 text-sm sm:text-base">
                                                        Analytics Cookies:
                                                    </h4>
                                                    <ul className="list-disc list-inside space-y-1 text-xs sm:text-sm text-blue-800 dark:text-blue-200">
                                                        <li>Understand how you use our Service</li>
                                                        <li>Measure performance and usage</li>
                                                        <li>Improve user experience</li>
                                                        <li>Generate usage statistics</li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>

                                        <div>
                                            <h3 className="text-base sm:text-lg font-semibold mb-2 sm:mb-3 text-gray-900 dark:text-gray-100">
                                                7.2 Managing Cookies
                                            </h3>
                                            <ul className="list-disc list-inside space-y-1 text-xs sm:text-sm">
                                                <li>Use your browser settings to control cookies</li>
                                                <li>Adjust preferences in your account settings</li>
                                                <li>Clear cookies and browsing data</li>
                                                <li>Opt-out of analytics tracking</li>
                                            </ul>
                                        </div>
                                    </div>
                                </section>

                                {/* 8. Security */}
                                <section id="security" className="mb-8 sm:mb-12">
                                    <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 flex items-center gap-2 sm:gap-3 text-gray-900 dark:text-gray-100">
                                        <Lock className="w-5 h-5 sm:w-6 sm:h-6 text-red-500 dark:text-red-400" />
                                        <span className="text-base sm:text-2xl">8. DATA SECURITY</span>
                                    </h2>

                                    <div className="leading-relaxed space-y-4 sm:space-y-6 text-gray-700 dark:text-gray-300 text-sm sm:text-base">
                                        <div>
                                            <h3 className="text-base sm:text-lg font-semibold mb-2 sm:mb-3 text-gray-900 dark:text-gray-100">
                                                8.1 Security Measures
                                            </h3>

                                            <div className="space-y-3 sm:space-y-4">
                                                <div>
                                                    <h4 className="font-medium mb-2 text-gray-900 dark:text-gray-100 text-sm sm:text-base">
                                                        Technical Safeguards:
                                                    </h4>
                                                    <ul className="list-disc list-inside space-y-1 text-xs sm:text-sm">
                                                        <li>Encryption of data in transit and at rest</li>
                                                        <li>Secure authentication systems</li>
                                                        <li>Regular security assessments and updates</li>
                                                        <li>Access controls and monitoring</li>
                                                    </ul>
                                                </div>

                                                <div>
                                                    <h4 className="font-medium mb-2 text-gray-900 dark:text-gray-100 text-sm sm:text-base">
                                                        Organizational Measures:
                                                    </h4>
                                                    <ul className="list-disc list-inside space-y-1 text-xs sm:text-sm">
                                                        <li>Employee training on data protection</li>
                                                        <li>Limited access on need-to-know basis</li>
                                                        <li>Regular security audits</li>
                                                        <li>Incident response procedures</li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>

                                        <div>
                                            <h3 className="text-base sm:text-lg font-semibold mb-2 sm:mb-3 text-gray-900 dark:text-gray-100">
                                                8.2 Your Security Responsibilities
                                            </h3>
                                            <ul className="list-disc list-inside space-y-1 text-xs sm:text-sm">
                                                <li>Use strong, unique passwords</li>
                                                <li>Enable two-factor authentication</li>
                                                <li>Keep your device and apps updated</li>
                                                <li>Report suspicious activities promptly</li>
                                            </ul>
                                        </div>

                                        <div>
                                            <h3 className="text-base sm:text-lg font-semibold mb-2 sm:mb-3 text-gray-900 dark:text-gray-100">
                                                8.3 Data Breaches
                                            </h3>
                                            <p className="mb-3 text-xs sm:text-sm">In the event of a data breach:</p>
                                            <ul className="list-disc list-inside space-y-1 text-xs sm:text-sm">
                                                <li>We will investigate and contain the incident</li>
                                                <li>Affected users will be notified within 72 hours</li>
                                                <li>Relevant authorities will be informed as required</li>
                                                <li>We will provide support and guidance to affected users</li>
                                            </ul>
                                        </div>
                                    </div>
                                </section>

                                {/* 9. Transfers */}
                                <section id="transfers" className="mb-8 sm:mb-12">
                                    <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 flex items-center gap-2 sm:gap-3 text-gray-900 dark:text-gray-100">
                                        <Globe className="w-5 h-5 sm:w-6 sm:h-6 text-teal-500 dark:text-teal-400" />
                                        <span className="text-base sm:text-2xl">9. INTERNATIONAL DATA TRANSFERS</span>
                                    </h2>

                                    <div className="leading-relaxed space-y-4 sm:space-y-6 text-gray-700 dark:text-gray-300 text-sm sm:text-base">
                                        <div>
                                            <h3 className="text-base sm:text-lg font-semibold mb-2 sm:mb-3 text-gray-900 dark:text-gray-100">
                                                9.1 Data Processing Locations
                                            </h3>
                                            <ul className="list-disc list-inside space-y-1 text-xs sm:text-sm">
                                                <li>Primary servers located in secure data centers</li>
                                                <li>Backup and disaster recovery in multiple regions</li>
                                                <li>Third-party services may process data internationally</li>
                                                <li>All transfers comply with applicable privacy laws</li>
                                            </ul>
                                        </div>

                                        <div>
                                            <h3 className="text-base sm:text-lg font-semibold mb-2 sm:mb-3 text-gray-900 dark:text-gray-100">
                                                9.2 Safeguards for International Transfers
                                            </h3>
                                            <ul className="list-disc list-inside space-y-1 text-xs sm:text-sm">
                                                <li>Standard Contractual Clauses (SCCs)</li>
                                                <li>Adequacy decisions where applicable</li>
                                                <li>Binding Corporate Rules for group companies</li>
                                                <li>Appropriate technical and organizational measures</li>
                                            </ul>
                                        </div>
                                    </div>
                                </section>

                                {/* 10. Children */}
                                <section id="children" className="mb-8 sm:mb-12">
                                    <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 flex items-center gap-2 sm:gap-3 text-gray-900 dark:text-gray-100">
                                        <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-orange-500 dark:text-orange-400" />
                                        <span className="text-base sm:text-2xl">10. CHILDREN&apos;S PRIVACY</span>
                                    </h2>

                                    <div className="bg-orange-50 dark:bg-orange-900/20 border-l-4 border-orange-400 dark:border-orange-600 p-3 sm:p-4 mb-4 sm:mb-6 rounded">
                                        <div className="flex">
                                            <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 text-orange-400 dark:text-orange-300 mr-2 sm:mr-3 flex-shrink-0 mt-0.5" />
                                            <div>
                                                <h4 className="text-orange-800 dark:text-orange-100 font-medium text-sm sm:text-base">
                                                    Important Notice
                                                </h4>
                                                <p className="text-orange-700 dark:text-orange-200 text-xs sm:text-sm mt-1">
                                                    We take children&apos;s privacy seriously and comply with applicable laws regarding minors.
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="leading-relaxed space-y-4 sm:space-y-6 text-gray-700 dark:text-gray-300 text-sm sm:text-base">
                                        <div>
                                            <h3 className="text-base sm:text-lg font-semibold mb-2 sm:mb-3 text-gray-900 dark:text-gray-100">
                                                10.1 Age Requirements
                                            </h3>
                                            <ul className="list-disc list-inside space-y-1 text-xs sm:text-sm">
                                                <li>Users must be at least 13 years old</li>
                                                <li>Users between 13-15 in the EU must have parental consent</li>
                                                <li>We do not knowingly collect data from children under 13</li>
                                            </ul>
                                        </div>

                                        <div>
                                            <h3 className="text-base sm:text-lg font-semibold mb-2 sm:mb-3 text-gray-900 dark:text-gray-100">
                                                10.2 Parental Rights
                                            </h3>
                                            <p className="mb-3 text-xs sm:text-sm">Parents or guardians may:</p>
                                            <ul className="list-disc list-inside space-y-1 text-xs sm:text-sm">
                                                <li>Request access to their child&apos;s information</li>
                                                <li>Request deletion of their child&apos;s account</li>
                                                <li>Contact us about their child&apos;s privacy</li>
                                            </ul>
                                        </div>

                                        <div>
                                            <h3 className="text-base sm:text-lg font-semibold mb-2 sm:mb-3 text-gray-900 dark:text-gray-100">
                                                10.3 If We Learn of Underage Users
                                            </h3>
                                            <p className="mb-3 text-xs sm:text-sm">
                                                If we discover that a user under 13 has provided personal information:
                                            </p>
                                            <ul className="list-disc list-inside space-y-1 text-xs sm:text-sm">
                                                <li>We will delete the account and associated data</li>
                                                <li>We will not use or disclose the information</li>
                                                <li>We will take steps to prevent future underage registrations</li>
                                            </ul>
                                        </div>
                                    </div>
                                </section>

                                {/* 11. Changes */}
                                <section id="changes" className="mb-8 sm:mb-12">
                                    <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 flex items-center gap-2 sm:gap-3 text-gray-900 dark:text-gray-100">
                                        <AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-500 dark:text-yellow-400" />
                                        <span className="text-base sm:text-2xl">11. CHANGES TO THIS PRIVACY POLICY</span>
                                    </h2>

                                    <div className="leading-relaxed space-y-4 sm:space-y-6 text-gray-700 dark:text-gray-300 text-sm sm:text-base">
                                        <div>
                                            <h3 className="text-base sm:text-lg font-semibold mb-2 sm:mb-3 text-gray-900 dark:text-gray-100">
                                                11.1 How We Notify You
                                            </h3>
                                            <ul className="list-disc list-inside space-y-1 text-xs sm:text-sm">
                                                <li>Email notification to your registered address</li>
                                                <li>In-app notifications and announcements</li>
                                                <li>Updates posted on our website</li>
                                                <li>Prominent notice in the Service</li>
                                            </ul>
                                        </div>

                                        <div>
                                            <h3 className="text-base sm:text-lg font-semibold mb-2 sm:mb-3 text-gray-900 dark:text-gray-100">
                                                11.2 Your Options
                                            </h3>
                                            <ul className="list-disc list-inside space-y-1 text-xs sm:text-sm">
                                                <li>Review changes before they take effect</li>
                                                <li>Contact us with questions or concerns</li>
                                                <li>Discontinue use if you disagree with changes</li>
                                                <li>Download your data before deletion</li>
                                            </ul>
                                        </div>
                                    </div>
                                </section>

                                {/* 12. Third-Party */}
                                <section id="third-party" className="mb-8 sm:mb-12">
                                    <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 flex items-center gap-2 sm:gap-3 text-gray-900 dark:text-gray-100">
                                        <Eye className="w-5 h-5 sm:w-6 sm:h-6 text-purple-500 dark:text-purple-400" />
                                        <span className="text-base sm:text-2xl">12. THIRD-PARTY SERVICES</span>
                                    </h2>

                                    <div className="leading-relaxed space-y-4 sm:space-y-6 text-gray-700 dark:text-gray-300 text-sm sm:text-base">
                                        <div>
                                            <h3 className="text-base sm:text-lg font-semibold mb-2 sm:mb-3 text-gray-900 dark:text-gray-100">
                                                12.1 Third-Party Integrations
                                            </h3>
                                            <ul className="list-disc list-inside space-y-1 text-xs sm:text-sm">
                                                <li>Social media login options</li>
                                                <li>External content embedding</li>
                                                <li>Analytics and measurement tools</li>
                                                <li>Customer support platforms</li>
                                            </ul>
                                        </div>

                                        <div>
                                            <h3 className="text-base sm:text-lg font-semibold mb-2 sm:mb-3 text-gray-900 dark:text-gray-100">
                                                12.2 Your Responsibility
                                            </h3>
                                            <ul className="list-disc list-inside space-y-1 text-xs sm:text-sm">
                                                <li>Review third-party privacy policies</li>
                                                <li>Understand data sharing implications</li>
                                                <li>Manage permissions and settings</li>
                                                <li>Contact third parties directly for their services</li>
                                            </ul>
                                        </div>
                                    </div>
                                </section>

                                {/* 13. Compliance */}
                                <section id="compliance" className="mb-8 sm:mb-12">
                                    <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 flex items-center gap-2 sm:gap-3 text-gray-900 dark:text-gray-100">
                                        <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-green-500 dark:text-green-400" />
                                        <span className="text-base sm:text-2xl">13. COMPLIANCE AND CERTIFICATIONS</span>
                                    </h2>

                                    <div className="leading-relaxed space-y-4 sm:space-y-6 text-gray-700 dark:text-gray-300 text-sm sm:text-base">
                                        <div>
                                            <h3 className="text-base sm:text-lg font-semibold mb-2 sm:mb-3 text-gray-900 dark:text-gray-100">
                                                13.1 Regulatory Compliance
                                            </h3>
                                            <ul className="list-disc list-inside space-y-1 text-xs sm:text-sm">
                                                <li>GDPR (General Data Protection Regulation)</li>
                                                <li>CCPA (California Consumer Privacy Act)</li>
                                                <li>Vietnam Personal Data Protection Laws</li>
                                                <li>Other applicable regional privacy laws</li>
                                            </ul>
                                        </div>

                                        <div>
                                            <h3 className="text-base sm:text-lg font-semibold mb-2 sm:mb-3 text-gray-900 dark:text-gray-100">
                                                13.2 Security Standards
                                            </h3>
                                            <ul className="list-disc list-inside space-y-1 text-xs sm:text-sm">
                                                <li>Industry-standard encryption protocols</li>
                                                <li>Regular security audits and assessments</li>
                                                <li>Compliance with data protection frameworks</li>
                                                <li>Continuous monitoring and improvement</li>
                                            </ul>
                                        </div>
                                    </div>
                                </section>

                                {/* Contact Section */}
                                <section className="mb-6 sm:mb-8">
                                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 sm:p-6">
                                        <div className="text-center">
                                            <Mail className="w-10 h-10 sm:w-12 sm:h-12 text-green-600 dark:text-green-400 mx-auto mb-3 sm:mb-4" />
                                            <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3 text-gray-900 dark:text-gray-100">
                                                Questions or Concerns?
                                            </h3>
                                            <p className="mb-3 sm:mb-4 text-gray-700 dark:text-gray-300 text-sm sm:text-base">
                                                If you have questions about this Privacy Policy or our privacy practices, please contact our support
                                                team through the Service or review our Terms of Service for additional information.
                                            </p>
                                            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                                                This Privacy Policy was last updated on August 21, 2025. Please review this policy regularly for any
                                                updates.
                                            </p>
                                        </div>
                                    </div>
                                </section>
                            </div>
                        </Card>
                    </div>
                </div>
            </main>
        </div>
    );
}
