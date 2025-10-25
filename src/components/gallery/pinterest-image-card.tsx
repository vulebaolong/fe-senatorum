// import React, { useState } from 'react';
// import { Card } from '@/components/ui/card';
// import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
// import { Heart, MessageSquare, Share2, Bookmark, MoreVertical, Eye } from 'lucide-react';

// const PinterestImageCard = () => {
//   return (
//     <div className="w-full bg-gray-50 min-h-screen p-4">
//       <div className="max-w-6xl mx-auto">
//         <h2 className="text-2xl font-semibold text-gray-900 mb-6">Image Gallery</h2>
        
//         {/* Masonry Grid - 2 columns on mobile, 2-4 on larger screens */}
//         <div className="columns-2 sm:columns-2 lg:columns-3 xl:columns-4 gap-3 sm:gap-4 space-y-3 sm:space-y-4">
//           <ImageCard 
//             image="/api/placeholder/300/400"
//             title="Mountain Sunset"
//             author="Sarah Chen"
//             authorAvatar="/api/placeholder/32/32"
//             likes={124}
//             comments={15}
//             views={2340}
//           />
          
//           <ImageCard 
//             image="/api/placeholder/300/500"
//             title="Modern Architecture"
//             author="Mike Wilson"
//             authorAvatar="/api/placeholder/32/32"
//             likes={89}
//             comments={8}
//             views={1890}
//           />
          
//           <ImageCard 
//             image="/api/placeholder/300/350"
//             title="Street Photography"
//             author="Emma Stone"
//             authorAvatar="/api/placeholder/32/32"
//             likes={256}
//             comments={32}
//             views={4521}
//           />
          
//           <ImageCard 
//             image="/api/placeholder/300/450"
//             title="Minimalist Design"
//             author="Tu Anh Le"
//             authorAvatar="/api/placeholder/32/32"
//             likes={178}
//             comments={21}
//             views={3102}
//           />
          
//           <ImageCard 
//             image="/api/placeholder/300/380"
//             title="Nature's Beauty"
//             author="John Doe"
//             authorAvatar="/api/placeholder/32/32"
//             likes={341}
//             comments={45}
//             views={5678}
//           />
          
//           <ImageCard 
//             image="/api/placeholder/300/420"
//             title="Urban Life"
//             author="Lisa Park"
//             authorAvatar="/api/placeholder/32/32"
//             likes={92}
//             comments={12}
//             views={1654}
//           />
//         </div>
//       </div>
//     </div>
//   );
// };

// const ImageCard = ({ image, title, author, authorAvatar, likes, comments, views }) => {
//   const [isHovered, setIsHovered] = useState(false);
//   const [isLiked, setIsLiked] = useState(false);
//   const [isSaved, setIsSaved] = useState(false);
//   const [likeCount, setLikeCount] = useState(likes);

//   const handleLike = (e) => {
//     e.stopPropagation();
//     setIsLiked(!isLiked);
//     setLikeCount(isLiked ? likeCount - 1 : likeCount + 1);
//   };

//   const handleSave = (e) => {
//     e.stopPropagation();
//     setIsSaved(!isSaved);
//   };

//   return (
//     <Card 
//       className="relative overflow-hidden rounded-xl sm:rounded-2xl cursor-pointer group break-inside-avoid mb-3 sm:mb-4"
//       onMouseEnter={() => setIsHovered(true)}
//       onMouseLeave={() => setIsHovered(false)}
//       onClick={() => console.log('Navigate to image detail')}
//     >
//       {/* Image */}
//       <img 
//         src={image} 
//         alt={title}
//         className="w-full h-auto object-cover"
//       />

//       {/* Hover Overlay - Desktop only */}
//       <div 
//         className={`absolute inset-0 bg-black transition-opacity duration-300 ${
//           isHovered ? 'bg-opacity-40' : 'bg-opacity-0 pointer-events-none'
//         }`}
//       >
//         {/* Top Actions */}
//         <div 
//           className={`absolute top-0 left-0 right-0 p-2 sm:p-3 flex items-center justify-between transition-all duration-300 ${
//             isHovered ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0'
//           }`}
//         >
//           {/* Author Info */}
//           <div className="flex items-center space-x-1.5 sm:space-x-2 bg-white/95 backdrop-blur-sm rounded-full pl-0.5 sm:pl-1 pr-2 sm:pr-3 py-0.5 sm:py-1 shadow-lg">
//             <Avatar className="w-5 h-5 sm:w-6 sm:h-6">
//               <AvatarImage src={authorAvatar} alt={author} />
//               <AvatarFallback className="bg-blue-500 text-white text-[10px] sm:text-xs">
//                 {author[0]}
//               </AvatarFallback>
//             </Avatar>
//             <span className="text-[10px] sm:text-xs font-medium text-gray-900 max-w-[80px] sm:max-w-none truncate">{author}</span>
//           </div>

//           {/* More Button */}
//           <button 
//             onClick={(e) => {
//               e.stopPropagation();
//               console.log('More options');
//             }}
//             className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center bg-white/95 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-colors"
//           >
//             <MoreVertical className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-700" />
//           </button>
//         </div>

//         {/* Bottom Actions */}
//         <div 
//           className={`absolute bottom-0 left-0 right-0 p-2 sm:p-4 transition-all duration-300 ${
//             isHovered ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
//           }`}
//         >
//           {/* Title */}
//           <h3 className="text-white font-semibold text-xs sm:text-base mb-2 sm:mb-3 line-clamp-2 drop-shadow-lg">
//             {title}
//           </h3>

//           {/* Action Buttons */}
//           <div className="flex items-center justify-between">
//             {/* Left Actions */}
//             <div className="flex items-center space-x-0.5 sm:space-x-1">
//               {/* Like */}
//               <button
//                 onClick={handleLike}
//                 className={`flex items-center space-x-1 sm:space-x-1.5 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full transition-all ${
//                   isLiked 
//                     ? 'bg-red-500 text-white' 
//                     : 'bg-white/95 backdrop-blur-sm text-gray-700 hover:bg-white'
//                 }`}
//               >
//                 <Heart className={`w-3 h-3 sm:w-4 sm:h-4 ${isLiked ? 'fill-current' : ''}`} />
//                 <span className="text-[10px] sm:text-sm font-medium">{likeCount}</span>
//               </button>

//               {/* Comment - Hidden on very small mobile */}
//               <button
//                 onClick={(e) => e.stopPropagation()}
//                 className="hidden xs:flex items-center space-x-1 sm:space-x-1.5 px-2 sm:px-3 py-1 sm:py-1.5 bg-white/95 backdrop-blur-sm rounded-full text-gray-700 hover:bg-white transition-colors"
//               >
//                 <MessageSquare className="w-3 h-3 sm:w-4 sm:h-4" />
//                 <span className="text-[10px] sm:text-sm font-medium">{comments}</span>
//               </button>

//               {/* Views - Hidden on mobile */}
//               <button
//                 onClick={(e) => e.stopPropagation()}
//                 className="hidden sm:flex items-center space-x-1.5 px-3 py-1.5 bg-white/95 backdrop-blur-sm rounded-full text-gray-700 hover:bg-white transition-colors"
//               >
//                 <Eye className="w-4 h-4" />
//                 <span className="text-sm font-medium">{views}</span>
//               </button>
//             </div>

//             {/* Right Actions */}
//             <div className="flex items-center space-x-0.5 sm:space-x-1">
//               {/* Share */}
//               <button
//                 onClick={(e) => {
//                   e.stopPropagation();
//                   console.log('Share');
//                 }}
//                 className="w-7 h-7 sm:w-9 sm:h-9 flex items-center justify-center bg-white/95 backdrop-blur-sm rounded-full text-gray-700 hover:bg-white transition-colors"
//               >
//                 <Share2 className="w-3 h-3 sm:w-4 sm:h-4" />
//               </button>

//               {/* Save */}
//               <button
//                 onClick={handleSave}
//                 className={`w-7 h-7 sm:w-9 sm:h-9 flex items-center justify-center rounded-full transition-all ${
//                   isSaved 
//                     ? 'bg-amber-500 text-white' 
//                     : 'bg-white/95 backdrop-blur-sm text-gray-700 hover:bg-white'
//                 }`}
//               >
//                 <Bookmark className={`w-3 h-3 sm:w-4 sm:h-4 ${isSaved ? 'fill-current' : ''}`} />
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </Card>
//   );
// };

// export default PinterestImageCard;