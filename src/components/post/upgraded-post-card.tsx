"use client";

import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Heart, Eye, MessageSquare, Bookmark, Share2 } from 'lucide-react';

const ResponsivePostCard = () => {
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [likeCount, setLikeCount] = useState(5);

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikeCount(isLiked ? likeCount - 1 : likeCount + 1);
  };

  return (
    <div className="w-full bg-gray-50 min-h-screen p-2 sm:p-4 md:p-6">
      {/* Facebook-style Feed Container */}
      <div className="max-w-2xl mx-auto">
        <Card className="w-full bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-200 overflow-hidden mb-4">
          {/* Header */}
          <div className="p-3 sm:p-4 pb-3">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <Avatar className="w-9 h-9 sm:w-11 sm:h-11">
                <AvatarImage src="/api/placeholder/44/44" alt="Tu Anh Le" />
                <AvatarFallback className="bg-blue-500 text-white text-xs sm:text-sm font-medium">
                  TL
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="font-semibold text-gray-900 text-sm sm:text-[15px]">Tu Anh Le</div>
                <div className="text-gray-500 text-[11px] sm:text-xs">4 days ago</div>
              </div>
            </div>
          </div>

          {/* Post Content */}
          <div className="px-3 sm:px-4 pb-3">
            <p className="text-gray-900 text-sm sm:text-[15px] leading-relaxed">
              Happy Birthday to the unstoppable Max Verstappen! 🏎️🔥
            </p>
          </div>

          {/* Post Image */}
          <div className="px-3 sm:px-4 pb-3">
            <div className="rounded-lg sm:rounded-xl overflow-hidden bg-gray-100">
              <img 
                src="/api/placeholder/600/350" 
                alt="Post content"
                className="w-full h-auto max-h-[400px] sm:max-h-[500px] object-cover"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="px-3 sm:px-4 py-2.5 sm:py-3 border-t border-gray-100">
            <div className="flex items-center justify-between">
              {/* Like */}
              <button 
                onClick={handleLike}
                className="flex items-center space-x-1.5 sm:space-x-2 group"
              >
                <div className={`flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full transition-colors ${
                  isLiked ? 'bg-red-50' : 'hover:bg-gray-100'
                }`}>
                  <Heart className={`w-[16px] h-[16px] sm:w-[18px] sm:h-[18px] transition-colors ${
                    isLiked ? 'fill-red-500 text-red-500' : 'text-gray-600'
                  }`} />
                </div>
                <span className={`text-xs sm:text-sm font-medium ${
                  isLiked ? 'text-red-500' : 'text-gray-600'
                }`}>
                  {likeCount}
                </span>
              </button>

              {/* Views */}
              <button className="flex items-center space-x-1.5 sm:space-x-2 group">
                <div className="flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full hover:bg-gray-100 transition-colors">
                  <Eye className="w-[16px] h-[16px] sm:w-[18px] sm:h-[18px] text-gray-600" />
                </div>
                <span className="text-xs sm:text-sm font-medium text-gray-600">0</span>
              </button>

              {/* Comments */}
              <button className="flex items-center space-x-1.5 sm:space-x-2 group">
                <div className="flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full hover:bg-gray-100 transition-colors">
                  <MessageSquare className="w-[16px] h-[16px] sm:w-[18px] sm:h-[18px] text-gray-600" />
                </div>
                <span className="text-xs sm:text-sm font-medium text-gray-600">0</span>
              </button>

              {/* Bookmark */}
              <button 
                onClick={() => setIsSaved(!isSaved)}
                className="group"
              >
                <div className={`flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full transition-colors ${
                  isSaved ? 'bg-amber-50' : 'hover:bg-gray-100'
                }`}>
                  <Bookmark className={`w-[16px] h-[16px] sm:w-[18px] sm:h-[18px] transition-colors ${
                    isSaved ? 'fill-amber-500 text-amber-500' : 'text-gray-600'
                  }`} />
                </div>
              </button>

              {/* Share */}
              <button className="group">
                <div className="flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full hover:bg-gray-100 transition-colors">
                  <Share2 className="w-[16px] h-[16px] sm:w-[18px] sm:h-[18px] text-gray-600" />
                </div>
              </button>
            </div>
          </div>
        </Card>

        {/* Demo: Additional Cards for Feed View */}
        <Card className="w-full bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-200 overflow-hidden mb-4">
          <div className="p-3 sm:p-4 pb-3">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <Avatar className="w-9 h-9 sm:w-11 sm:h-11">
                <AvatarImage src="/api/placeholder/44/44" alt="Sarah Chen" />
                <AvatarFallback className="bg-green-500 text-white text-xs sm:text-sm font-medium">
                  SC
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="font-semibold text-gray-900 text-sm sm:text-[15px]">Sarah Chen</div>
                <div className="text-gray-500 text-[11px] sm:text-xs">2 days ago</div>
              </div>
            </div>
          </div>

          <div className="px-3 sm:px-4 pb-3">
            <p className="text-gray-900 text-sm sm:text-[15px] leading-relaxed">
              Just finished an amazing workout session! Feeling energized and ready to take on the week 💪✨
            </p>
          </div>

          <div className="px-3 sm:px-4 pb-3">
            <div className="rounded-lg sm:rounded-xl overflow-hidden bg-gray-100">
              <img 
                src="/api/placeholder/600/350" 
                alt="Post content"
                className="w-full h-auto max-h-[400px] sm:max-h-[500px] object-cover"
              />
            </div>
          </div>

          <div className="px-3 sm:px-4 py-2.5 sm:py-3 border-t border-gray-100">
            <div className="flex items-center justify-between">
              <button className="flex items-center space-x-1.5 sm:space-x-2 group">
                <div className="flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full hover:bg-gray-100 transition-colors">
                  <Heart className="w-[16px] h-[16px] sm:w-[18px] sm:h-[18px] text-gray-600" />
                </div>
                <span className="text-xs sm:text-sm font-medium text-gray-600">12</span>
              </button>

              <button className="flex items-center space-x-1.5 sm:space-x-2 group">
                <div className="flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full hover:bg-gray-100 transition-colors">
                  <Eye className="w-[16px] h-[16px] sm:w-[18px] sm:h-[18px] text-gray-600" />
                </div>
                <span className="text-xs sm:text-sm font-medium text-gray-600">45</span>
              </button>

              <button className="flex items-center space-x-1.5 sm:space-x-2 group">
                <div className="flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full hover:bg-gray-100 transition-colors">
                  <MessageSquare className="w-[16px] h-[16px] sm:w-[18px] sm:h-[18px] text-gray-600" />
                </div>
                <span className="text-xs sm:text-sm font-medium text-gray-600">3</span>
              </button>

              <button className="group">
                <div className="flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full hover:bg-gray-100 transition-colors">
                  <Bookmark className="w-[16px] h-[16px] sm:w-[18px] sm:h-[18px] text-gray-600" />
                </div>
              </button>

              <button className="group">
                <div className="flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full hover:bg-gray-100 transition-colors">
                  <Share2 className="w-[16px] h-[16px] sm:w-[18px] sm:h-[18px] text-gray-600" />
                </div>
              </button>
            </div>
          </div>
        </Card>

        {/* Info Card for Responsive Demo */}
        <Card className="w-full bg-blue-50 border border-blue-200 rounded-xl sm:rounded-2xl p-4 text-center">
          <p className="text-sm text-blue-900 font-medium mb-2">📱 Responsive Design Demo</p>
          <p className="text-xs text-blue-700">
            <span className="sm:hidden">Mobile View: Optimized for touch</span>
            <span className="hidden sm:inline">Desktop View: Facebook-style feed</span>
          </p>
          <p className="text-xs text-blue-600 mt-2">
            Resize your browser to see the responsive behavior!
          </p>
        </Card>
      </div>
    </div>
  );
};

export default ResponsivePostCard;