"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { AlertTriangle, ArrowLeft, BookOpen, Calendar, Eye, FileText, Info, LucideIcon, Menu, Scale, Shield, Users, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { Logo } from "../logo/Logo";
import ThemeToggleV2 from "../theme-toggle/theme-toggle-v2";
import { Card } from "../ui/card";
import { TITLE } from "@/constant/app.constant";

type TocItem = { id: string; title: string; icon: LucideIcon };

export default function TermOfService() {
    const router = useRouter();
    const [activeSection, setActiveSection] = useState("");
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const sections: TocItem[] = useMemo(() => {
        return [
            { id: "acceptance", title: "1. Acceptance of Terms", icon: FileText },
            { id: "description", title: "2. Description of Service", icon: Info },
            { id: "eligibility", title: "3. Eligibility", icon: Users },
            { id: "prohibited", title: "4. Prohibited Content and Conduct", icon: AlertTriangle },
            { id: "moderation", title: "5. Content Moderation", icon: Shield },
            { id: "content", title: "6. User Content", icon: BookOpen },
            { id: "privacy", title: "7. Privacy", icon: Eye },
            { id: "termination", title: "8. Account Termination", icon: AlertTriangle },
            { id: "ip", title: "9. Intellectual Property", icon: Scale },
            { id: "disclaimers", title: "10. Disclaimers and Limitations", icon: Info },
            { id: "disputes", title: "11. Dispute Resolution", icon: Scale },
            { id: "general", title: "12. General Provisions", icon: FileText },
            { id: "compliance", title: "13. Compliance and Cooperation", icon: Shield },
            { id: "additional", title: "14. Additional Terms", icon: Info },
        ];
    }, []);

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
        <div className="min-h-screen">
            {/* Header */}
            <header className="shadow-sm border-b sticky top-0 z-50 bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-[var(--header-height)]">
                        <div className="flex items-center gap-2 sm:gap-4">
                            <Button onClick={() => router.back()} variant="ghost" size="sm" className="gap-1 sm:gap-2 text-xs sm:text-sm">
                                <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4" />
                                <span className="hidden xs:inline">Back</span>
                            </Button>
                            <div className="flex items-center gap-1 sm:gap-2">
                                <Logo />
                                <span className="text-lg sm:text-xl font-bold">{TITLE}</span>
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

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8 overflow-y-auto h-[calc(100dvh-var(--header-height))]">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
                    {/* Sidebar */}
                    <div
                        className={cn(
                            "lg:col-span-1",
                            "fixed lg:top-0 inset-y-2 left-2 z-50 w-80 transform transition-transform duration-300 ease-in-out lg:relative lg:transform-none lg:w-auto",
                            isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
                        )}
                    >
                        <Card className="h-full lg:h-fit lg:sticky lg:top-0 rounded-lg border bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 overflow-y-auto py-0">
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
                        <Card className="shadow-sm bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
                            {/* Document Header */}
                            <div className="border-b border-gray-200 dark:border-gray-800 p-4 sm:p-6 lg:p-8">
                                <div className="text-center">
                                    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <Scale className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                                    </div>
                                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4 text-gray-900 dark:text-gray-100">
                                        Terms of Service
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
                                {/* Section 1 */}
                                <section id="acceptance" className="mb-8 sm:mb-12">
                                    <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-3">
                                        <FileText className="w-6 h-6 text-blue-500 dark:text-blue-400" />
                                        1. ACCEPTANCE OF TERMS
                                    </h2>
                                    <div className="text-gray-700 dark:text-gray-300 leading-relaxed space-y-4">
                                        <p>
                                            By accessing or using {TITLE} (the "Service"), you agree to be bound by these Terms of Service
                                            ("Terms"). If you do not agree to these Terms, do not use the Service.
                                        </p>
                                        <p>
                                            These Terms apply to all users of the Service, including without limitation users who are visitors,
                                            browsers, vendors, customers, merchants, and/or contributors of content.
                                        </p>
                                    </div>
                                </section>

                                {/* Section 2 */}
                                <section id="description" className="mb-8 sm:mb-12">
                                    <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-3">
                                        <Info className="w-6 h-6 text-blue-500 dark:text-blue-400" />
                                        2. DESCRIPTION OF SERVICE
                                    </h2>
                                    <div className="text-gray-700 dark:text-gray-300 leading-relaxed">
                                        <p>
                                            {TITLE} is a social networking platform that provides users with tools to connect, communicate, and
                                            share content in a positive, constructive environment. Our Service includes messaging, content sharing,
                                            community features, and related functionalities.
                                        </p>
                                    </div>
                                </section>

                                {/* Section 3 */}
                                <section id="eligibility" className="mb-8 sm:mb-12">
                                    <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-3">
                                        <Users className="w-6 h-6 text-blue-500 dark:text-blue-400" />
                                        3. ELIGIBILITY
                                    </h2>
                                    <div className="text-gray-700 dark:text-gray-300 leading-relaxed space-y-6">
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">3.1 Age Requirements</h3>
                                            <ul className="list-disc list-inside space-y-2">
                                                <li>You must be at least 13 years old to use the Service</li>
                                                <li>Users under 18 must have parental consent</li>
                                                <li>Users under 16 in the EU must have explicit parental consent</li>
                                            </ul>
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">3.2 Account Requirements</h3>
                                            <ul className="list-disc list-inside space-y-2">
                                                <li>You must provide accurate and complete information</li>
                                                <li>You are responsible for maintaining account security</li>
                                                <li>One person or entity may not maintain more than one account</li>
                                                <li>You must not impersonate others or provide false identity information</li>
                                            </ul>
                                        </div>
                                    </div>
                                </section>

                                {/* Section 4 - Prohibited Content */}
                                <section id="prohibited" className="mb-8 sm:mb-12">
                                    <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-3">
                                        <AlertTriangle className="w-6 h-6 text-red-500 dark:text-red-400" />
                                        4. PROHIBITED CONTENT AND CONDUCT
                                    </h2>

                                    <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-400 dark:border-red-600 p-4 mb-6 rounded">
                                        <div className="flex">
                                            <AlertTriangle className="w-5 h-5 text-red-400 dark:text-red-300 mr-3 flex-shrink-0 mt-0.5" />
                                            <div>
                                                <h4 className="text-red-800 dark:text-red-100 font-medium">Important Notice</h4>
                                                <p className="text-red-700 dark:text-red-200 text-sm mt-1">
                                                    Violation of these content policies may result in content removal, account suspension, or
                                                    permanent ban.
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="text-gray-700 dark:text-gray-300 leading-relaxed space-y-6">
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">4.1 Content Restrictions</h3>
                                            <p className="mb-4">You may not post, upload, or share content that:</p>

                                            <div className="space-y-6">
                                                <div className="bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700 p-4 rounded-lg">
                                                    <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Political Content:</h4>
                                                    <ul className="list-disc list-inside space-y-1 text-sm">
                                                        <li>Political campaigns, propaganda, or endorsements</li>
                                                        <li>Content promoting or opposing political parties, candidates, or movements</li>
                                                        <li>Political activism or calls for political action</li>
                                                        <li>Government criticism intended to incite unrest</li>
                                                    </ul>
                                                </div>

                                                <div className="bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700 p-4 rounded-lg">
                                                    <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Religious Content:</h4>
                                                    <ul className="list-disc list-inside space-y-1 text-sm">
                                                        <li>Religious proselytizing or conversion attempts</li>
                                                        <li>Content promoting or opposing specific religions or beliefs</li>
                                                        <li>Religious hate speech or discrimination</li>
                                                        <li>Missionary or evangelical activities</li>
                                                    </ul>
                                                </div>

                                                <div className="bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700 p-4 rounded-lg">
                                                    <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">War and Conflict Content:</h4>
                                                    <ul className="list-disc list-inside space-y-1 text-sm">
                                                        <li>Graphic war imagery, videos, or violent content depicting conflicts</li>
                                                        <li>Content promoting violence or hatred toward any nation, ethnic group, or people</li>
                                                        <li>Current war discussions that advocate for specific sides or incite divisiveness</li>
                                                        <li>Misinformation or conspiracy theories about ongoing or historical conflicts</li>
                                                        <li>Content glorifying war, violence, or military aggression</li>
                                                        <li>Personal attacks or hate speech related to conflicts</li>
                                                    </ul>

                                                    <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded">
                                                        <p className="text-sm text-blue-800 dark:text-blue-200">
                                                            <strong>Educational Exception:</strong> Educational and historical content about conflicts
                                                            may be permitted when clearly marked as educational, sourced from credible sources,
                                                            presented without graphic imagery, and includes appropriate content warnings.
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700 p-4 rounded-lg">
                                                    <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                                                        General Prohibited Content:
                                                    </h4>
                                                    <ul className="list-disc list-inside space-y-1 text-sm">
                                                        <li>Illegal activities or content</li>
                                                        <li>Harassment, bullying, or threats</li>
                                                        <li>Hate speech based on protected characteristics</li>
                                                        <li>Sexually explicit or pornographic material</li>
                                                        <li>Violence, gore, or graphic content</li>
                                                        <li>Misinformation or deliberately false information</li>
                                                        <li>Spam, scams, or fraudulent content</li>
                                                        <li>Content that violates intellectual property rights</li>
                                                        <li>Personal information of others without consent</li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>

                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">4.2 Prohibited Conduct</h3>
                                            <p className="mb-3">You may not:</p>
                                            <ul className="list-disc list-inside space-y-1">
                                                <li>Harass, threaten, or intimidate other users</li>
                                                <li>Create fake accounts or impersonate others</li>
                                                <li>Attempt to hack, compromise, or gain unauthorized access to the Service</li>
                                                <li>Use automated tools (bots, scrapers) without permission</li>
                                                <li>Interfere with the proper functioning of the Service</li>
                                                <li>Violate any applicable laws or regulations</li>
                                                <li>Engage in commercial activities without authorization</li>
                                                <li>Attempt to circumvent content restrictions or security measures</li>
                                            </ul>
                                        </div>
                                    </div>
                                </section>

                                {/* Section 5 - Content Moderation */}
                                <section id="moderation" className="mb-8 sm:mb-12">
                                    <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-3">
                                        <Shield className="w-6 h-6 text-green-500 dark:text-green-400" />
                                        5. CONTENT MODERATION
                                    </h2>
                                    <div className="text-gray-700 dark:text-gray-300 leading-relaxed space-y-6">
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">5.1 Our Rights</h3>
                                            <p className="mb-3">We reserve the right to:</p>
                                            <ul className="list-disc list-inside space-y-1">
                                                <li>Review, modify, or remove any content at our discretion</li>
                                                <li>Suspend or terminate accounts for violations</li>
                                                <li>Use automated and manual moderation tools</li>
                                                <li>Preserve content for legal compliance</li>
                                            </ul>
                                        </div>

                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
                                                5.2 Reporting and Review System
                                            </h3>
                                            <p className="mb-3">
                                                Users can report violations through our in-app reporting system. We will review reports promptly and
                                                take appropriate action.
                                            </p>

                                            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                                                <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">Content Review Process:</h4>
                                                <ul className="list-disc list-inside space-y-1 text-sm text-blue-800 dark:text-blue-200">
                                                    <li>Automated systems screen for obvious violations</li>
                                                    <li>Reported content receives human review within 24-48 hours</li>
                                                    <li>Educational and historical content receives specialized review</li>
                                                    <li>Context and intent are considered in moderation decisions</li>
                                                </ul>
                                            </div>
                                        </div>

                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">5.3 Appeals Process</h3>
                                            <p>
                                                If your content is removed or account restricted, you may appeal through our support system within 30
                                                days.
                                            </p>
                                        </div>
                                    </div>
                                </section>

                                {/* Section 6 - User Content */}
                                <section id="content" className="mb-8 sm:mb-12">
                                    <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-3">
                                        <BookOpen className="w-6 h-6 text-blue-500 dark:text-blue-400" />
                                        6. USER CONTENT
                                    </h2>
                                    <div className="text-gray-700 dark:text-gray-300 leading-relaxed space-y-6">
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">6.1 Ownership</h3>
                                            <p>You retain ownership of content you create and post on the Service.</p>
                                        </div>

                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">6.2 License to Us</h3>
                                            <p>
                                                By posting content, you grant us a worldwide, non-exclusive, royalty-free license to use, display,
                                                reproduce, modify, and distribute your content in connection with the Service.
                                            </p>
                                        </div>

                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">6.3 Responsibility</h3>
                                            <p>You are solely responsible for your content and the consequences of posting it.</p>
                                        </div>
                                    </div>
                                </section>

                                {/* Section 7 - Privacy */}
                                <section id="privacy" className="mb-8 sm:mb-12">
                                    <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-3">
                                        <Eye className="w-6 h-6 text-blue-500 dark:text-blue-400" />
                                        7. PRIVACY
                                    </h2>
                                    <div className="text-gray-700 dark:text-gray-300 leading-relaxed">
                                        <p>
                                            Your privacy is important to us. Please review our Privacy Policy, which explains how we collect, use, and
                                            protect your information.
                                        </p>
                                    </div>
                                </section>

                                {/* Section 8 - Account Termination */}
                                <section id="termination" className="mb-8 sm:mb-12">
                                    <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-3">
                                        <AlertTriangle className="w-6 h-6 text-orange-500 dark:text-orange-400" />
                                        8. ACCOUNT TERMINATION
                                    </h2>
                                    <div className="text-gray-700 dark:text-gray-300 leading-relaxed space-y-6">
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">8.1 Termination by You</h3>
                                            <p>You may delete your account at any time through account settings.</p>
                                        </div>

                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">8.2 Termination by Us</h3>
                                            <p className="mb-3">We may suspend or terminate your account immediately for:</p>
                                            <ul className="list-disc list-inside space-y-1">
                                                <li>Violation of these Terms</li>
                                                <li>Illegal activity</li>
                                                <li>Harm to other users or the Service</li>
                                                <li>Extended inactivity</li>
                                            </ul>
                                        </div>

                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">8.3 Effect of Termination</h3>
                                            <p className="mb-3">Upon termination:</p>
                                            <ul className="list-disc list-inside space-y-1">
                                                <li>Your access to the Service will cease</li>
                                                <li>Your content may be deleted (unless required for legal compliance)</li>
                                                <li>These Terms will remain in effect for relevant provisions</li>
                                            </ul>
                                        </div>
                                    </div>
                                </section>

                                <section id="ip" className="mb-8 sm:mb-12">
                                    <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-3">
                                        <Scale className="w-6 h-6 text-purple-500 dark:text-purple-400" />
                                        9. INTELLECTUAL PROPERTY
                                    </h2>
                                    <div className="text-gray-700 dark:text-gray-300 leading-relaxed space-y-6">
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">9.1 Our Rights</h3>
                                            <p>
                                                The Service, including its design, features, and underlying technology, is owned by us and protected
                                                by intellectual property laws.
                                            </p>
                                        </div>

                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
                                                9.2 Respect for Others' Rights
                                            </h3>
                                            <p>
                                                You must respect the intellectual property rights of others. We will respond to valid DMCA takedown
                                                notices.
                                            </p>
                                        </div>

                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">9.3 Trademark Policy</h3>
                                            <p>You may not use our trademarks, logos, or branding without written permission.</p>
                                        </div>
                                    </div>
                                </section>

                                {/* Section 10 - Disclaimers and Limitations */}
                                <section id="disclaimers" className="mb-8 sm:mb-12">
                                    <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-3">
                                        <Info className="w-6 h-6 text-yellow-500 dark:text-yellow-400" />
                                        10. DISCLAIMERS AND LIMITATIONS
                                    </h2>
                                    <div className="text-gray-700 dark:text-gray-300 leading-relaxed space-y-6">
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">10.1 Service Availability</h3>
                                            <ul className="list-disc list-inside space-y-1">
                                                <li>The Service is provided "as is" and "as available"</li>
                                                <li>We do not guarantee uninterrupted or error-free service</li>
                                                <li>We may modify or discontinue features at any time</li>
                                            </ul>
                                        </div>

                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
                                                10.2 Limitation of Liability
                                            </h3>
                                            <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg border border-yellow-200 dark:border-yellow-800">
                                                <p className="font-semibold text-yellow-800 dark:text-yellow-100 mb-2">
                                                    TO THE MAXIMUM EXTENT PERMITTED BY LAW:
                                                </p>
                                                <ul className="list-disc list-inside space-y-1 text-yellow-800 dark:text-yellow-200">
                                                    <li>WE ARE NOT LIABLE FOR ANY INDIRECT, INCIDENTAL, OR CONSEQUENTIAL DAMAGES</li>
                                                    <li>OUR TOTAL LIABILITY SHALL NOT EXCEED THE AMOUNT YOU PAID US IN THE PAST 12 MONTHS</li>
                                                    <li>WE ARE NOT RESPONSIBLE FOR USER CONTENT OR CONDUCT</li>
                                                </ul>
                                            </div>
                                        </div>

                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">10.3 Indemnification</h3>
                                            <p>
                                                You agree to indemnify and hold us harmless from any claims, damages, or expenses arising from your
                                                use of the Service or violation of these Terms.
                                            </p>
                                        </div>
                                    </div>
                                </section>

                                {/* Section 11 - Dispute Resolution */}
                                <section id="disputes" className="mb-8 sm:mb-12">
                                    <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-3">
                                        <Scale className="w-6 h-6 text-red-500 dark:text-red-400" />
                                        11. DISPUTE RESOLUTION
                                    </h2>
                                    <div className="text-gray-700 dark:text-gray-300 leading-relaxed space-y-6">
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">11.1 Governing Law</h3>
                                            <p>
                                                These Terms are governed by the laws of [JURISDICTION], without regard to conflict of law principles.
                                            </p>
                                        </div>

                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
                                                11.2 Dispute Resolution Process
                                            </h3>
                                            <ol className="list-decimal list-inside space-y-2">
                                                <li>
                                                    <strong>Direct Resolution:</strong> Contact our support team first
                                                </li>
                                                <li>
                                                    <strong>Mediation:</strong> If unresolved, disputes will be submitted to mediation
                                                </li>
                                                <li>
                                                    <strong>Arbitration:</strong> Final disputes will be resolved through binding arbitration
                                                </li>
                                                <li>
                                                    <strong>Class Action Waiver:</strong> You waive the right to participate in class actions
                                                </li>
                                            </ol>
                                        </div>

                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">11.3 Jurisdiction</h3>
                                            <p>For matters not subject to arbitration, courts in [JURISDICTION] shall have exclusive jurisdiction.</p>
                                        </div>
                                    </div>
                                </section>

                                {/* Section 12 - General Provisions */}
                                <section id="general" className="mb-8 sm:mb-12">
                                    <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-3">
                                        <FileText className="w-6 h-6 text-blue-500 dark:text-blue-400" />
                                        12. GENERAL PROVISIONS
                                    </h2>
                                    <div className="text-gray-700 dark:text-gray-300 leading-relaxed space-y-6">
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">12.1 Updates to Terms</h3>
                                            <ul className="list-disc list-inside space-y-1">
                                                <li>We may update these Terms at any time</li>
                                                <li>Material changes will be notified 30 days in advance</li>
                                                <li>Continued use after changes constitutes acceptance</li>
                                            </ul>
                                        </div>

                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">12.2 Severability</h3>
                                            <p>If any provision is found invalid, the remaining provisions remain in effect.</p>
                                        </div>

                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">12.3 Entire Agreement</h3>
                                            <p>These Terms, together with our Privacy Policy, constitute the entire agreement between you and us.</p>
                                        </div>

                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">12.4 Assignment</h3>
                                            <p>We may assign these Terms; you may not assign your rights without our consent.</p>
                                        </div>

                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">12.5 Waiver</h3>
                                            <p>Our failure to enforce any provision does not constitute a waiver.</p>
                                        </div>
                                    </div>
                                </section>

                                {/* Section 13 - Compliance and Cooperation */}
                                <section id="compliance" className="mb-8 sm:mb-12">
                                    <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-3">
                                        <Shield className="w-6 h-6 text-blue-500 dark:text-blue-400" />
                                        13. COMPLIANCE AND COOPERATION
                                    </h2>
                                    <div className="text-gray-700 dark:text-gray-300 leading-relaxed space-y-6">
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">13.1 Legal Compliance</h3>
                                            <p>You agree to comply with all applicable laws and regulations when using the Service.</p>
                                        </div>

                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
                                                13.2 Government Cooperation
                                            </h3>
                                            <p>We may cooperate with law enforcement and government agencies as required by law.</p>
                                        </div>

                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">13.3 Data Requests</h3>
                                            <p>
                                                We may provide user information to authorities when legally required or to protect our rights and
                                                users' safety.
                                            </p>
                                        </div>
                                    </div>
                                </section>

                                {/* Section 14 - Additional Terms */}
                                <section id="additional" className="mb-8 sm:mb-12">
                                    <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-3">
                                        <Info className="w-6 h-6 text-green-500 dark:text-green-400" />
                                        14. ADDITIONAL TERMS
                                    </h2>
                                    <div className="text-gray-700 dark:text-gray-300 leading-relaxed space-y-6">
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">14.1 Beta Features</h3>
                                            <p>Some features may be in beta testing and provided without warranty.</p>
                                        </div>

                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">14.2 Third-Party Services</h3>
                                            <p>We are not responsible for third-party services or content linked from our Service.</p>
                                        </div>

                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">14.3 Export Controls</h3>
                                            <p>You may not use the Service if prohibited by export control laws.</p>
                                        </div>
                                    </div>
                                </section>

                                {/* Final Agreement */}
                                <section className="mb-6 sm:mb-8">
                                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
                                        <div className="text-center">
                                            <Scale className="w-12 h-12 text-blue-600 dark:text-blue-400 mx-auto mb-4" />
                                            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3">Agreement Acknowledgment</h3>
                                            <p className="text-gray-700 dark:text-gray-300 mb-4">
                                                By using {TITLE}, you acknowledge that you have read, understood, and agree to be bound by these
                                                Terms of Service.
                                            </p>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                                This document was last updated on August 21, 2025. Please check regularly for updates.
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
