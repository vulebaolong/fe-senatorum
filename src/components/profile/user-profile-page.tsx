import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  User, 
  MapPin, 
  Calendar, 
  Globe, 
  Mail,
  Users,
  Home,
  MessageCircle,
  Settings,
  Edit,
  MoreHorizontal,
  UserPlus,
  Shield,
  Clock,
  Heart,
  Share,
  Bookmark
} from 'lucide-react';

export default function UserProfilePage() {
  const [isFollowing, setIsFollowing] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  // Mock data
  const userData = {
    name: "Alex Thompson",
    username: "@alexthompson",
    bio: "Full-stack developer passionate about creating amazing user experiences. Building the future one line of code at a time.",
    location: "San Francisco, CA",
    website: "alexthompson.dev",
    joinedDate: "March 2023",
    avatar: null,
    coverImage: null,
    isVerified: true,
    stats: {
      followers: 1248,
      following: 342,
      chapters: 8,
      houses: 3
    }
  };

  const recentActivity = [
    {
      type: "chapter_join",
      title: "Joined React Developers chapter",
      time: "2 hours ago",
      icon: Users
    },
    {
      type: "post_like",
      title: "Liked a post in UI/UX Design House",
      time: "5 hours ago",
      icon: Heart
    },
    {
      type: "house_follow",
      title: "Started following TechCorp House",
      time: "1 day ago",
      icon: Home
    },
    {
      type: "comment",
      title: "Commented on 'Best practices for React hooks'",
      time: "2 days ago",
      icon: MessageCircle
    }
  ];

  const userChapters = [
    { name: "React Developers", members: "12.5K", role: "Member" },
    { name: "UI/UX Designers", members: "8.3K", role: "Moderator" },
    { name: "Startup Founders", members: "5.2K", role: "Admin" },
    { name: "Tech Entrepreneurs", members: "15.1K", role: "Member" }
  ];

  const userHouses = [
    { name: "Alex's Tech Blog", type: "Personal", followers: "892" },
    { name: "Code Academy Pro", type: "Business", followers: "2.1K" },
    { name: "Dev Community Hub", type: "Community", followers: "4.5K" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50">
      {/* Header */}
      <div className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold text-slate-900">Profile</h1>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Share className="w-4 h-4 mr-2" />
                Share
              </Button>
              <Button variant="outline" size="sm">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Profile Header */}
        <Card className="border-0 shadow-sm bg-white/70 backdrop-blur-sm mb-8">
          <CardContent className="p-0">
            {/* Cover Image */}
            <div className="h-48 bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 rounded-t-lg relative">
              <div className="absolute inset-0 bg-black/20 rounded-t-lg"></div>
            </div>
            
            {/* Profile Info */}
            <div className="px-6 pb-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4 -mt-16 relative z-10">
                {/* Avatar */}
                <div className="w-32 h-32 bg-white rounded-full border-4 border-white shadow-lg flex items-center justify-center">
                  <User className="w-16 h-16 text-slate-400" />
                </div>
                
                {/* Actions */}
                <div className="flex gap-2 sm:ml-auto">
                  <Button 
                    variant={isFollowing ? "outline" : "default"}
                    onClick={() => setIsFollowing(!isFollowing)}
                    className="gap-2"
                  >
                    <UserPlus className="w-4 h-4" />
                    {isFollowing ? 'Following' : 'Follow'}
                  </Button>
                  <Button variant="outline" size="sm">
                    <MessageCircle className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Settings className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              
              {/* User Details */}
              <div className="mt-4">
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-bold text-slate-900">{userData.name}</h1>
                  {userData.isVerified && (
                    <Shield className="w-5 h-5 text-blue-500" />
                  )}
                </div>
                <p className="text-slate-600 mt-1">{userData.username}</p>
                <p className="text-slate-700 mt-3 max-w-2xl">{userData.bio}</p>
                
                {/* Meta Info */}
                <div className="flex flex-wrap gap-4 mt-4 text-sm text-slate-600">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {userData.location}
                  </div>
                  <div className="flex items-center gap-1">
                    <Globe className="w-4 h-4" />
                    <a href="#" className="text-blue-600 hover:underline">{userData.website}</a>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    Joined {userData.joinedDate}
                  </div>
                </div>
                
                {/* Stats */}
                <div className="flex gap-6 mt-4">
                  <div>
                    <span className="font-semibold text-slate-900">{userData.stats.followers.toLocaleString()}</span>
                    <span className="text-slate-600 ml-1">Followers</span>
                  </div>
                  <div>
                    <span className="font-semibold text-slate-900">{userData.stats.following}</span>
                    <span className="text-slate-600 ml-1">Following</span>
                  </div>
                  <div>
                    <span className="font-semibold text-slate-900">{userData.stats.chapters}</span>
                    <span className="text-slate-600 ml-1">Chapters</span>
                  </div>
                  <div>
                    <span className="font-semibold text-slate-900">{userData.stats.houses}</span>
                    <span className="text-slate-600 ml-1">Houses</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-white/70 backdrop-blur-sm">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="chapters">Chapters</TabsTrigger>
            <TabsTrigger value="houses">Houses</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Recent Activity */}
              <div className="lg:col-span-2">
                <Card className="border-0 shadow-sm bg-white/70 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Clock className="w-5 h-5 text-purple-500" />
                      Recent Activity
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {recentActivity.map((activity, index) => (
                      <div key={index} className="flex items-start gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors">
                        <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <activity.icon className="w-4 h-4 text-purple-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-slate-900 font-medium">{activity.title}</p>
                          <p className="text-slate-500 text-sm">{activity.time}</p>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>

              {/* Quick Stats */}
              <div className="space-y-6">
                <Card className="border-0 shadow-sm bg-white/70 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-lg">Quick Stats</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-slate-600">Total Posts</span>
                      <span className="font-semibold">247</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Comments</span>
                      <span className="font-semibold">1,832</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Likes Received</span>
                      <span className="font-semibold">5,921</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Profile Views</span>
                      <span className="font-semibold">12,345</span>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-sm bg-gradient-to-br from-purple-50 to-pink-50">
                  <CardHeader>
                    <CardTitle className="text-lg">Achievements</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Badge variant="secondary" className="w-full justify-start bg-purple-100 text-purple-700">
                      🏆 Community Builder
                    </Badge>
                    <Badge variant="secondary" className="w-full justify-start bg-blue-100 text-blue-700">
                      ⭐ Verified User
                    </Badge>
                    <Badge variant="secondary" className="w-full justify-start bg-green-100 text-green-700">
                      🎯 Early Adopter
                    </Badge>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Chapters Tab */}
          <TabsContent value="chapters">
            <Card className="border-0 shadow-sm bg-white/70 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-purple-500" />
                  Chapters ({userChapters.length})
                </CardTitle>
                <CardDescription>Communities Alex is part of</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {userChapters.map((chapter, index) => (
                    <div key={index} className="p-4 border border-slate-200 rounded-lg hover:border-purple-300 transition-colors">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-slate-900">{chapter.name}</h3>
                          <p className="text-sm text-slate-600">{chapter.members} members</p>
                        </div>
                        <Badge variant={chapter.role === 'Admin' ? 'default' : 'secondary'} className="text-xs">
                          {chapter.role}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Houses Tab */}
          <TabsContent value="houses">
            <Card className="border-0 shadow-sm bg-white/70 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Home className="w-5 h-5 text-purple-500" />
                  Houses ({userHouses.length})
                </CardTitle>
                <CardDescription>Official pages Alex manages</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {userHouses.map((house, index) => (
                    <div key={index} className="p-4 border border-slate-200 rounded-lg hover:border-purple-300 transition-colors">
                      <div className="flex items-start gap-3">
                        <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                          <Home className="w-6 h-6 text-purple-600" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-slate-900">{house.name}</h3>
                          <p className="text-sm text-slate-600">{house.type} House</p>
                          <p className="text-sm text-slate-500">{house.followers} followers</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Activity Tab */}
          <TabsContent value="activity">
            <Card className="border-0 shadow-sm bg-white/70 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-purple-500" />
                  Activity History
                </CardTitle>
                <CardDescription>Complete activity timeline</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.concat(recentActivity).map((activity, index) => (
                    <div key={index} className="flex items-start gap-4 p-4 border border-slate-200 rounded-lg">
                      <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <activity.icon className="w-5 h-5 text-purple-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-slate-900 font-medium">{activity.title}</p>
                        <p className="text-slate-500 text-sm mt-1">{activity.time}</p>
                      </div>
                      <Button variant="ghost" size="sm">
                        <Bookmark className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}