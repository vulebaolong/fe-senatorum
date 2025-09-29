// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { Button } from "@/components/ui/button";
// import { ChevronDown, Globe, Hash, Image, Lock, Smile, Users, X } from "lucide-react";
// import { useRef, useState } from "react";

// const FacebookStyleCreatePost = () => {
//     const [isModalOpen, setIsModalOpen] = useState(false);
//     const [postText, setPostText] = useState("");
//     const [selectedImage, setSelectedImage] = useState<string | null>(null);
//     const [privacy, setPrivacy] = useState("public");
//     const [showPrivacyMenu, setShowPrivacyMenu] = useState(false);
//     const [hashtags, setHashtags] = useState([]);
//     const fileInputRef = useRef(null);

//     const handleImageSelect = (e: any) => {
//         const file = e.target.files[0];
//         if (file) {
//             const imageUrl = URL.createObjectURL(file);
//             setSelectedImage(imageUrl);
//         }
//     };

//     const handleImageRemove = () => {
//         setSelectedImage(null);
//         if (fileInputRef.current) {
//             fileInputRef.current.value = "";
//         }
//     };

//     const handleHashtagAdd = (tag: any) => {
//         if (tag && !hashtags.includes(tag)) {
//             setHashtags([...hashtags, tag]);
//         }
//     };

//     const handleHashtagRemove = (tagToRemove) => {
//         setHashtags(hashtags.filter((tag) => tag !== tagToRemove));
//     };

//     const handlePost = () => {
//         if (postText.trim() || selectedImage) {
//             console.log("Creating post:", { postText, selectedImage, hashtags, privacy });
//             // Reset form and close modal
//             setPostText("");
//             setSelectedImage(null);
//             setHashtags([]);
//             setPrivacy("public");
//             setIsModalOpen(false);
//         }
//     };

//     const closeModal = () => {
//         setIsModalOpen(false);
//         setShowPrivacyMenu(false);
//     };

//     const privacyOptions = [
//         { value: "public", icon: Globe, label: "Public", description: "Anyone can see this post" },
//         { value: "friends", icon: Users, label: "Friends", description: "Only your friends can see this" },
//         { value: "private", icon: Lock, label: "Only me", description: "Only you can see this post" },
//     ];

//     const currentPrivacy = privacyOptions.find((option) => option.value === privacy);
//     const suggestedHashtags = ["Tech", "Automotive", "Sports", "Gaming", "Business", "Travel"];

//     return (
//         <div className="w-full max-w-4xl mx-auto">
//             {/* Facebook-style Search Bar / Create Post Trigger */}
//             <div
//                 className="bg-white rounded-full border border-gray-300 shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer"
//                 onClick={() => setIsModalOpen(true)}
//             >
//                 <div className="flex items-center px-4 py-3">
//                     <Avatar className="w-10 h-10 mr-3">
//                         <AvatarImage src="/api/placeholder/40/40" alt="Tu Anh Le" />
//                         <AvatarFallback className="bg-blue-500 text-white text-sm font-medium">TL</AvatarFallback>
//                     </Avatar>
//                     <div className="flex-1 text-gray-500 text-sm bg-gray-100 rounded-full px-4 py-2 hover:bg-gray-200 transition-colors">
//                         What's on your mind, Tu Anh?
//                     </div>
//                 </div>
//             </div>

//             {/* Modal Overlay */}
//             {isModalOpen && (
//                 <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//                     <div className="bg-white rounded-lg w-full max-w-lg max-h-[90vh] overflow-y-auto">
//                         {/* Modal Header */}
//                         <div className="sticky top-0 bg-white p-4 pb-3 border-b border-gray-100 rounded-t-lg">
//                             <div className="flex items-center justify-between">
//                                 <h2 className="text-lg font-semibold text-gray-900">Create Quick Post</h2>
//                                 <div className="flex items-center space-x-3">
//                                     <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-sm">
//                                         <span className="mr-1">⚡</span>
//                                         Quick Post
//                                     </div>
//                                     <Button onClick={closeModal} size="sm" className="h-8 w-8 p-0 bg-gray-100 hover:bg-gray-200 text-gray-600">
//                                         <X className="w-4 h-4" />
//                                     </Button>
//                                 </div>
//                             </div>
//                         </div>

//                         {/* Modal Content */}
//                         <div className="p-4">
//                             {/* User Info & Privacy */}
//                             <div className="flex items-center justify-between mb-4">
//                                 <div className="flex items-center space-x-3">
//                                     <Avatar className="w-10 h-10">
//                                         <AvatarImage src="/api/placeholder/40/40" alt="Tu Anh Le" />
//                                         <AvatarFallback className="bg-blue-500 text-white text-sm font-medium">TL</AvatarFallback>
//                                     </Avatar>
//                                     <div>
//                                         <div className="font-semibold text-gray-900 text-sm">Tu Anh Le</div>
//                                         <div className="text-gray-500 text-xs">Posting now</div>
//                                     </div>
//                                 </div>

//                                 {/* Privacy Selector */}
//                                 <div className="relative">
//                                     <Button
//                                         variant="ghost"
//                                         size="sm"
//                                         onClick={() => setShowPrivacyMenu(!showPrivacyMenu)}
//                                         className="flex items-center space-x-1 text-xs text-gray-600 hover:text-gray-800 hover:bg-gray-100 px-2 py-1 h-8"
//                                     >
//                                         <currentPrivacy.icon className="w-3 h-3" />
//                                         <span>{currentPrivacy.label}</span>
//                                         <ChevronDown className="w-3 h-3" />
//                                     </Button>

//                                     {showPrivacyMenu && (
//                                         <div className="absolute top-full right-0 mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
//                                             {privacyOptions.map((option) => (
//                                                 <button
//                                                     key={option.value}
//                                                     onClick={() => {
//                                                         setPrivacy(option.value);
//                                                         setShowPrivacyMenu(false);
//                                                     }}
//                                                     className="w-full px-3 py-2 text-left hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg"
//                                                 >
//                                                     <div className="flex items-center space-x-2">
//                                                         <option.icon className="w-4 h-4 text-gray-500" />
//                                                         <div>
//                                                             <div className="text-sm font-medium text-gray-900">{option.label}</div>
//                                                             <div className="text-xs text-gray-500">{option.description}</div>
//                                                         </div>
//                                                     </div>
//                                                 </button>
//                                             ))}
//                                         </div>
//                                     )}
//                                 </div>
//                             </div>

//                             {/* Post Content Input */}
//                             <div className="mb-4">
//                                 <textarea
//                                     value={postText}
//                                     onChange={(e) => setPostText(e.target.value)}
//                                     placeholder="What's on your mind?"
//                                     className="w-full text-sm placeholder-gray-500 outline-none resize-none min-h-[100px] max-h-60 leading-relaxed"
//                                     onInput={(e) => {
//                                         e.target.style.height = "auto";
//                                         e.target.style.height = e.target.scrollHeight + "px";
//                                     }}
//                                     autoFocus
//                                 />
//                             </div>

//                             {/* Selected Image Preview */}
//                             {selectedImage && (
//                                 <div className="mb-4 relative">
//                                     <div className="rounded-lg overflow-hidden border border-gray-200">
//                                         <img src={selectedImage} alt="Selected" className="w-full h-auto object-cover max-h-80" />
//                                         <Button
//                                             onClick={handleImageRemove}
//                                             size="sm"
//                                             className="absolute top-2 right-2 h-6 w-6 p-0 bg-black bg-opacity-50 hover:bg-opacity-70 text-white rounded-full"
//                                         >
//                                             <X className="w-3 h-3" />
//                                         </Button>
//                                     </div>
//                                 </div>
//                             )}

//                             {/* Hashtags */}
//                             {hashtags.length > 0 && (
//                                 <div className="mb-4">
//                                     <div className="flex flex-wrap gap-2">
//                                         {hashtags.map((tag, index) => (
//                                             <span
//                                                 key={index}
//                                                 className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-50 text-blue-600"
//                                             >
//                                                 #{tag}
//                                                 <Button
//                                                     onClick={() => handleHashtagRemove(tag)}
//                                                     size="sm"
//                                                     className="ml-1 h-3 w-3 p-0 hover:bg-blue-100 text-blue-400 hover:text-blue-600"
//                                                 >
//                                                     <X className="w-2 h-2" />
//                                                 </Button>
//                                             </span>
//                                         ))}
//                                     </div>
//                                 </div>
//                             )}

//                             {/* Suggested Hashtags */}
//                             {hashtags.length < 3 && (
//                                 <div className="mb-4">
//                                     <div className="text-xs text-gray-500 mb-2">Suggested hashtags:</div>
//                                     <div className="flex flex-wrap gap-1">
//                                         {suggestedHashtags
//                                             .filter((tag) => !hashtags.includes(tag))
//                                             .slice(0, 4)
//                                             .map((tag) => (
//                                                 <button
//                                                     key={tag}
//                                                     onClick={() => handleHashtagAdd(tag)}
//                                                     className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-600 hover:bg-gray-200 cursor-pointer"
//                                                 >
//                                                     #{tag}
//                                                 </button>
//                                             ))}
//                                     </div>
//                                 </div>
//                             )}
//                         </div>

//                         {/* Modal Footer */}
//                         <div className="sticky bottom-0 bg-white px-4 py-3 border-t border-gray-100 rounded-b-lg">
//                             <div className="flex items-center justify-between">
//                                 {/* Media Options */}
//                                 <div className="flex items-center space-x-2">
//                                     <Button
//                                         variant="ghost"
//                                         size="sm"
//                                         onClick={() => fileInputRef.current?.click()}
//                                         className="flex items-center space-x-1 text-gray-600 hover:text-green-600 hover:bg-green-50 p-2 rounded-lg"
//                                     >
//                                         <Image className="w-4 h-4" />
//                                         <span className="text-xs">Photo</span>
//                                     </Button>

//                                     <Button
//                                         variant="ghost"
//                                         size="sm"
//                                         className="flex items-center space-x-1 text-gray-600 hover:text-yellow-600 hover:bg-yellow-50 p-2 rounded-lg"
//                                     >
//                                         <Smile className="w-4 h-4" />
//                                         <span className="text-xs">Emoji</span>
//                                     </Button>

//                                     <Button
//                                         variant="ghost"
//                                         size="sm"
//                                         className="flex items-center space-x-1 text-gray-600 hover:text-blue-600 hover:bg-blue-50 p-2 rounded-lg"
//                                     >
//                                         <Hash className="w-4 h-4" />
//                                         <span className="text-xs">Tags</span>
//                                     </Button>
//                                 </div>

//                                 {/* Post Button */}
//                                 <Button
//                                     onClick={handlePost}
//                                     disabled={!postText.trim() && !selectedImage}
//                                     className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-8 py-2 text-sm font-medium rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
//                                 >
//                                     Post
//                                 </Button>
//                             </div>
//                         </div>

//                         {/* Hidden File Input */}
//                         <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageSelect} className="hidden" />
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default FacebookStyleCreatePost;
