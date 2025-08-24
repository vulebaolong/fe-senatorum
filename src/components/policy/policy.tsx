"use client"

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  ArrowLeft,
  Shield,
  Calendar,
  Eye,
  Lock,
  Users,
  Globe,
  Settings,
  FileText,
  AlertTriangle,
  Info,
  Download,
  BookOpen,
  Database,
  Cookie,
  UserCheck,
  Trash2,
  Mail
} from 'lucide-react';

export default function Policy() {
  const [activeSection, setActiveSection] = useState('');

  const sections = [
    { id: 'introduction', title: '1. Introduction', icon: Info },
    { id: 'information', title: '2. Information We Collect', icon: Database },
    { id: 'usage', title: '3. How We Use Your Information', icon: Settings },
    { id: 'sharing', title: '4. How We Share Your Information', icon: Users },
    { id: 'retention', title: '5. Data Retention', icon: FileText },
    { id: 'rights', title: '6. Your Privacy Rights', icon: UserCheck },
    { id: 'cookies', title: '7. Cookies and Tracking Technologies', icon: Cookie },
    { id: 'security', title: '8. Data Security', icon: Lock },
    { id: 'transfers', title: '9. International Data Transfers', icon: Globe },
    { id: 'children', title: '10. Children\'s Privacy', icon: Shield },
    { id: 'changes', title: '11. Changes to This Privacy Policy', icon: AlertTriangle },
    { id: 'third-party', title: '12. Third-Party Services', icon: Eye },
    { id: 'compliance', title: '13. Compliance and Certifications', icon: Shield }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back
              </Button>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">S</span>
                </div>
                <span className="text-xl font-bold text-gray-900">Senatorum</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="gap-2">
                <Download className="w-4 h-4" />
                Download PDF
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg border border-gray-200 p-6 sticky top-24">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-green-500" />
                Table of Contents
              </h3>
              <nav className="space-y-1">
                {sections.map((section) => {
                  const IconComponent = section.icon;
                  return (
                    <a
                      key={section.id}
                      href={`#${section.id}`}
                      className={`
                        flex items-center gap-2 px-3 py-2 text-sm rounded-md transition-colors
                        ${activeSection === section.id 
                          ? 'bg-green-50 text-green-700 border-r-2 border-green-500' 
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                        }
                      `}
                      onClick={() => setActiveSection(section.id)}
                    >
                      <IconComponent className="w-4 h-4" />
                      <span className="truncate">{section.title}</span>
                    </a>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
              
              {/* Document Header */}
              <div className="border-b border-gray-200 p-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Shield className="w-8 h-8 text-white" />
                  </div>
                  <h1 className="text-4xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
                  <div className="flex items-center justify-center gap-6 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>Effective Date: August 21, 2025</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <FileText className="w-4 h-4" />
                      <span>Last Updated: August 21, 2025</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-8 prose prose-lg max-w-none">
                
                {/* Section 1 - Introduction */}
                <section id="introduction" className="mb-12">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                    <Info className="w-6 h-6 text-blue-500" />
                    1. INTRODUCTION
                  </h2>
                  <div className="text-gray-700 leading-relaxed space-y-4">
                    <p>
                      Welcome to Senatorum. This Privacy Policy explains how we collect, use, disclose, and safeguard your information 
                      when you use our social networking platform and related services (collectively, the "Service").
                    </p>
                    <p>
                      By using Senatorum, you consent to the data practices described in this Privacy Policy. If you do not agree 
                      with the practices described in this policy, please do not use our Service.
                    </p>
                  </div>
                </section>

                {/* Section 2 - Information We Collect */}
                <section id="information" className="mb-12">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                    <Database className="w-6 h-6 text-purple-500" />
                    2. INFORMATION WE COLLECT
                  </h2>
                  <div className="text-gray-700 leading-relaxed space-y-6">
                    
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">2.1 Information You Provide Directly</h3>
                      
                      <div className="space-y-4">
                        <div className="bg-blue-50 p-4 rounded-lg">
                          <h4 className="font-semibold text-blue-900 mb-2">Account Information:</h4>
                          <ul className="list-disc list-inside space-y-1 text-sm text-blue-800">
                            <li>Username and display name</li>
                            <li>Email address and phone number (optional)</li>
                            <li>Password (encrypted and stored securely)</li>
                            <li>Profile information (bio, profile picture, preferences)</li>
                            <li>Age verification information</li>
                          </ul>
                        </div>

                        <div className="bg-green-50 p-4 rounded-lg">
                          <h4 className="font-semibold text-green-900 mb-2">Content You Create:</h4>
                          <ul className="list-disc list-inside space-y-1 text-sm text-green-800">
                            <li>Posts, comments, and messages you send</li>
                            <li>Photos, videos, and other media you upload</li>
                            <li>Reactions, likes, and other interactions</li>
                            <li>Community and group participation</li>
                          </ul>
                        </div>

                        <div className="bg-purple-50 p-4 rounded-lg">
                          <h4 className="font-semibold text-purple-900 mb-2">Communications:</h4>
                          <ul className="list-disc list-inside space-y-1 text-sm text-purple-800">
                            <li>Messages you send to other users</li>
                            <li>Communications with our support team</li>
                            <li>Feedback and survey responses</li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">2.2 Information We Collect Automatically</h3>
                      
                      <div className="space-y-4">
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <h4 className="font-semibold text-gray-900 mb-2">Usage Information:</h4>
                          <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                            <li>Time spent on the Service and features used</li>
                            <li>Content you view, interact with, or share</li>
                            <li>Search queries and browsing patterns</li>
                            <li>Connection and interaction patterns with other users</li>
                          </ul>
                        </div>

                        <div className="bg-gray-50 p-4 rounded-lg">
                          <h4 className="font-semibold text-gray-900 mb-2">Device Information:</h4>
                          <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                            <li>Device type, operating system, and version</li>
                            <li>IP address and general location information</li>
                            <li>Browser type and version</li>
                            <li>Unique device identifiers</li>
                            <li>Network connection information</li>
                          </ul>
                        </div>

                        <div className="bg-gray-50 p-4 rounded-lg">
                          <h4 className="font-semibold text-gray-900 mb-2">Technical Data:</h4>
                          <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                            <li>Log files and server data</li>
                            <li>Cookies and similar tracking technologies</li>
                            <li>Crash reports and performance analytics</li>
                            <li>Security and fraud prevention data</li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">2.3 Information from Third Parties</h3>
                      <div className="space-y-3">
                        <div>
                          <h4 className="font-medium text-gray-900">Social Media Integration:</h4>
                          <ul className="list-disc list-inside space-y-1 text-sm">
                            <li>Information from social media accounts you choose to connect</li>
                            <li>Profile information from linked accounts (with your permission)</li>
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">Verification Services:</h4>
                          <ul className="list-disc list-inside space-y-1 text-sm">
                            <li>Age verification from third-party services</li>
                            <li>Identity verification for certain features</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Section 3 - How We Use Your Information */}
                <section id="usage" className="mb-12">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                    <Settings className="w-6 h-6 text-green-500" />
                    3. HOW WE USE YOUR INFORMATION
                  </h2>
                  <div className="text-gray-700 leading-relaxed space-y-6">
                    
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">3.1 Primary Uses</h3>
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">To Provide the Service:</h4>
                          <ul className="list-disc list-inside space-y-1 text-sm">
                            <li>Create and manage your account</li>
                            <li>Enable communication with other users</li>
                            <li>Display your content and profile to appropriate audiences</li>
                            <li>Provide customer support and respond to inquiries</li>
                          </ul>
                        </div>

                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">To Improve the Service:</h4>
                          <ul className="list-disc list-inside space-y-1 text-sm">
                            <li>Analyze usage patterns and optimize performance</li>
                            <li>Develop new features and functionality</li>
                            <li>Conduct research and analytics</li>
                            <li>Test and improve our algorithms</li>
                          </ul>
                        </div>

                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">Safety and Security:</h4>
                          <ul className="list-disc list-inside space-y-1 text-sm">
                            <li>Detect and prevent fraud, abuse, and harmful activities</li>
                            <li>Enforce our Terms of Service and Community Guidelines</li>
                            <li>Protect the rights and safety of users</li>
                            <li>Comply with legal obligations</li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">3.2 Communication Purposes</h3>
                      <div className="space-y-3">
                        <div>
                          <h4 className="font-medium text-gray-900">Service Communications:</h4>
                          <ul className="list-disc list-inside space-y-1 text-sm">
                            <li>Account notifications and updates</li>
                            <li>Security alerts and important notices</li>
                            <li>Changes to our policies or terms</li>
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">Optional Communications:</h4>
                          <ul className="list-disc list-inside space-y-1 text-sm">
                            <li>Product updates and new features (with your consent)</li>
                            <li>Community highlights and recommendations</li>
                            <li>Promotional content (you can opt-out anytime)</li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">3.3 Legal and Compliance</h3>
                      <ul className="list-disc list-inside space-y-1">
                        <li>Comply with applicable laws and regulations</li>
                        <li>Respond to legal requests and court orders</li>
                        <li>Protect our legal rights and interests</li>
                        <li>Cooperate with law enforcement when required</li>
                      </ul>
                    </div>
                  </div>
                </section>

                {/* Section 6 - Your Privacy Rights */}
                <section id="rights" className="mb-12">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                    <UserCheck className="w-6 h-6 text-blue-500" />
                    6. YOUR PRIVACY RIGHTS
                  </h2>
                  <div className="text-gray-700 leading-relaxed space-y-6">
                    
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">6.1 Access and Control</h3>
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">Account Management:</h4>
                          <ul className="list-disc list-inside space-y-1 text-sm">
                            <li>Access and update your account information</li>
                            <li>Download a copy of your data</li>
                            <li>Delete or deactivate your account</li>
                            <li>Control who can see your content</li>
                          </ul>
                        </div>

                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">Privacy Settings:</h4>
                          <ul className="list-disc list-inside space-y-1 text-sm">
                            <li>Adjust visibility of your profile and content</li>
                            <li>Control communication preferences</li>
                            <li>Manage third-party integrations</li>
                            <li>Set content filtering preferences</li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">6.2 Regional Rights</h3>
                      
                      <div className="space-y-4">
                        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                          <h4 className="font-semibold text-blue-900 mb-2">For EU Users (GDPR):</h4>
                          <ul className="list-disc list-inside space-y-1 text-sm text-blue-800">
                            <li>Right to access your personal data</li>
                            <li>Right to rectify inaccurate data</li>
                            <li>Right to erase your data ("right to be forgotten")</li>
                            <li>Right to restrict processing</li>
                            <li>Right to data portability</li>
                            <li>Right to object to processing</li>
                            <li>Right to withdraw consent</li>
                          </ul>
                        </div>

                        <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                          <h4 className="font-semibold text-yellow-900 mb-2">For California Users (CCPA):</h4>
                          <ul className="list-disc list-inside space-y-1 text-sm text-yellow-800">
                            <li>Right to know what personal information is collected</li>
                            <li>Right to delete personal information</li>
                            <li>Right to opt-out of sale of personal information</li>
                            <li>Right to non-discrimination for exercising rights</li>
                          </ul>
                        </div>

                        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                          <h4 className="font-semibold text-green-900 mb-2">For Vietnam Users:</h4>
                          <ul className="list-disc list-inside space-y-1 text-sm text-green-800">
                            <li>Rights under Vietnam's Personal Data Protection laws</li>
                            <li>Right to access and correct personal data</li>
                            <li>Right to withdraw consent</li>
                            <li>Right to request data deletion</li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">6.3 Exercising Your Rights</h3>
                      <p className="mb-3">To exercise your privacy rights:</p>
                      <ul className="list-disc list-inside space-y-1">
                        <li>Use privacy controls in your account settings</li>
                        <li>Contact our support team</li>
                        <li>Submit requests through our privacy portal</li>
                        <li>Email our Data Protection Officer</li>
                      </ul>
                      <p className="mt-3 text-sm bg-gray-100 p-3 rounded">
                        We will respond to verified requests within 30 days.
                      </p>
                    </div>
                  </div>
                </section>

                {/* Section 8 - Data Security */}
                <section id="security" className="mb-12">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                    <Lock className="w-6 h-6 text-red-500" />
                    8. DATA SECURITY
                  </h2>
                  <div className="text-gray-700 leading-relaxed space-y-6">
                    
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">8.1 Security Measures</h3>
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">Technical Safeguards:</h4>
                          <ul className="list-disc list-inside space-y-1 text-sm">
                            <li>Encryption of data in transit and at rest</li>
                            <li>Secure authentication systems</li>
                            <li>Regular security assessments and updates</li>
                            <li>Access controls and monitoring</li>
                          </ul>
                        </div>

                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">Organizational Measures:</h4>
                          <ul className="list-disc list-inside space-y-1 text-sm">
                            <li>Employee training on data protection</li>
                            <li>Limited access on need-to-know basis</li>
                            <li>Regular security audits</li>
                            <li>Incident response procedures</li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">8.2 Your Security Responsibilities</h3>
                      <ul className="list-disc list-inside space-y-1">
                        <li>Use strong, unique passwords</li>
                        <li>Enable two-factor authentication</li>
                        <li>Keep your device and apps updated</li>
                        <li>Report suspicious activities promptly</li>
                      </ul>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">8.3 Data Breaches</h3>
                      <p className="mb-3">In the event of a data breach:</p>
                      <ul className="list-disc list-inside space-y-1">
                        <li>We will investigate and contain the incident</li>
                        <li>Affected users will be notified within 72 hours</li>
                        <li>Relevant authorities will be informed as required</li>
                        <li>We will provide support and guidance to affected users</li>
                      </ul>
                    </div>
                  </div>
                </section>

                {/* Section 10 - Children's Privacy */}
                <section id="children" className="mb-12">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                    <Shield className="w-6 h-6 text-orange-500" />
                    10. CHILDREN'S PRIVACY
                  </h2>
                  
                  <div className="bg-orange-50 border-l-4 border-orange-400 p-4 mb-6">
                    <div className="flex">
                      <AlertTriangle className="w-5 h-5 text-orange-400 mr-3 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="text-orange-800 font-medium">Important Notice</h4>
                        <p className="text-orange-700 text-sm mt-1">
                          We take children's privacy seriously and comply with applicable laws regarding minors.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="text-gray-700 leading-relaxed space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">10.1 Age Requirements</h3>
                      <ul className="list-disc list-inside space-y-1">
                        <li>Users must be at least 13 years old</li>
                        <li>Users between 13-15 in the EU must have parental consent</li>
                        <li>We do not knowingly collect data from children under 13</li>
                      </ul>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">10.2 Parental Rights</h3>
                      <p className="mb-3">Parents or guardians may:</p>
                      <ul className="list-disc list-inside space-y-1">
                        <li>Request access to their child's information</li>
                        <li>Request deletion of their child's account</li>
                        <li>Contact us about their child's privacy</li>
                      </ul>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">10.3 If We Learn of Underage Users</h3>
                      <p className="mb-3">If we discover that a user under 13 has provided personal information:</p>
                      <ul className="list-disc list-inside space-y-1">
                        <li>We will delete the account and associated data</li>
                        <li>We will not use or disclose the information</li>
                        <li>We will take steps to prevent future underage registrations</li>
                      </ul>
                    </div>
                  </div>
                </section>

                {/* Contact Section */}
                <section className="mb-8">
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-6">
                    <div className="text-center">
                      <Mail className="w-12 h-12 text-green-600 mx-auto mb-4" />
                      <h3 className="text-xl font-bold text-gray-900 mb-3">Questions or Concerns?</h3>
                      <p className="text-gray-700 mb-4">
                        If you have questions about this Privacy Policy or our privacy practices, please contact our support team 
                        through the Service or review our Terms of Service for additional information.
                      </p>
                      <p className="text-sm text-gray-600">
                        This Privacy Policy was last updated on August 21, 2025. Please review this policy regularly for any updates.
                      </p>
                    </div>
                  </div>
                </section>

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}