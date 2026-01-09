
import React, { useState, useEffect } from 'react';
import SecurityShield from './components/SecurityShield';
import PostCard from './components/PostCard';
import { User, Post } from './types';
import { moderateContent, generateSmartCaption } from './services/geminiService';
import { postToX } from './services/twitterService';
import { shieldImage, shieldText } from './services/shieldingService';

const MOCK_CURRENT_USER: User = {
  id: 'me',
  name: 'Elena Vance',
  username: 'elenavance',
  avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&h=150&q=80',
  isVerified: true
};

const INITIAL_POSTS: Post[] = [
  {
    id: '1',
    author: {
      id: '2',
      name: 'Sarah Chen',
      username: 'sarahcodes',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&h=150&q=80',
      isVerified: true
    },
    content: "Just migrated my X feed to TwitterS. The peace of mind knowing my photos aren't being scraped is everything. 🛡️✨",
    image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80',
    timestamp: '2h',
    likes: 42,
    isShielded: true,
    comments: []
  },
  {
    id: '2',
    author: {
      id: '3',
      name: 'Maya Rodriguez',
      username: 'mayar',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80',
      isVerified: false
    },
    content: "Testing out the anti-Grok filters. It feels so much lighter here without the bot chatter. Truly a safe haven for my thoughts.",
    timestamp: '4h',
    likes: 89,
    isShielded: true,
    comments: []
  }
];

const App: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>(INITIAL_POSTS);
  const [newPostText, setNewPostText] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isPosting, setIsPosting] = useState(false);
  const [isXConnected, setIsXConnected] = useState(false);
  const [isGeneratingCaption, setIsGeneratingCaption] = useState(false);

  const handleConnectX = () => {
    setIsXConnected(true);
  };

  const handleImageSelect = () => {
    // Simulated image picker
    setSelectedImage('https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80');
  };

  const handleCreatePost = async () => {
    if (!newPostText.trim()) return;
    
    setIsPosting(true);
    
    // 1. Safety First: Moderate with Gemini
    const moderation = await moderateContent(newPostText);

    if (!moderation.isSafe) {
      alert(moderation.reason || "Safety check failed. Restricted keywords detected.");
      setIsPosting(false);
      return;
    }

    try {
      // 2. APPLY GLOBAL SHIELDING (Protects content even in official X app)
      let finalContent = shieldText(newPostText);
      let finalImage = selectedImage;
      
      if (selectedImage) {
        finalImage = await shieldImage(selectedImage, MOCK_CURRENT_USER.username);
      }

      // 3. Post to X (Simulated)
      if (isXConnected) {
        await postToX(finalContent, "MOCK_TWEET_TOKEN");
      }

      const newPost: Post = {
        id: Math.random().toString(36).substr(2, 9),
        author: MOCK_CURRENT_USER,
        content: newPostText,
        image: finalImage || undefined,
        timestamp: 'Just now',
        likes: 0,
        isShielded: true,
        comments: []
      };

      setPosts([newPost, ...posts]);
      setNewPostText('');
      setSelectedImage(null);
    } catch (err) {
      alert("Encryption error or sync failure. Please try again.");
    } finally {
      setIsPosting(false);
    }
  };

  const handleMagicCaption = async () => {
    if (!newPostText.trim()) return;
    setIsGeneratingCaption(true);
    const caption = await generateSmartCaption(newPostText);
    setNewPostText(caption);
    setIsGeneratingCaption(false);
  };

  return (
    <SecurityShield>
      <div className="max-w-6xl mx-auto flex gap-8 px-4 py-8 h-screen overflow-hidden">
        
        {/* Sidebar */}
        <nav className="w-64 hidden lg:flex flex-col gap-8 sticky top-0">
          <div className="flex items-center gap-3 px-4">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <i className="fas fa-feather-pointed text-white text-xl"></i>
            </div>
            <h1 className="text-2xl font-black tracking-tighter text-white uppercase">TwitterS</h1>
          </div>

          <div className="space-y-2">
            <button className="flex items-center gap-4 w-full px-4 py-3 rounded-2xl bg-indigo-600 text-white font-semibold">
              <i className="fas fa-house text-lg w-6"></i> Feed
            </button>
            <button className="flex items-center gap-4 w-full px-4 py-3 rounded-2xl text-slate-400 hover:bg-slate-800 hover:text-white transition-all">
              <i className="fas fa-shield-halved text-lg w-6 text-rose-500"></i> Safety Center
            </button>
            <button className="flex items-center gap-4 w-full px-4 py-3 rounded-2xl text-slate-400 hover:bg-slate-800 hover:text-white transition-all">
              <i className="fab fa-x-twitter text-lg w-6 text-slate-100"></i> X Archive
            </button>
          </div>

          {!isXConnected ? (
            <button 
              onClick={handleConnectX}
              className="mt-4 bg-slate-100 hover:bg-white text-black font-bold py-4 rounded-3xl transition-all flex items-center justify-center gap-2"
            >
              <i className="fab fa-x-twitter"></i>
              Connect to X
            </button>
          ) : (
            <div className="mt-4 bg-teal-500/10 border border-teal-500/20 px-4 py-3 rounded-2xl flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-teal-400 animate-pulse"></div>
              <span className="text-xs font-bold text-teal-400">SYNCED TO X</span>
            </div>
          )}

          <div className="mt-auto p-4 bg-slate-900/50 border border-slate-800 rounded-3xl">
            <div className="flex items-center gap-3">
              <img src={MOCK_CURRENT_USER.avatar} alt="" className="w-10 h-10 rounded-full border border-indigo-500/30 object-cover" />
              <div className="flex-1 overflow-hidden">
                <p className="font-bold text-sm truncate text-white">{MOCK_CURRENT_USER.name}</p>
                <p className="text-xs text-slate-500 truncate">@{MOCK_CURRENT_USER.username}</p>
              </div>
            </div>
          </div>
        </nav>

        {/* Main Feed */}
        <main className="flex-1 overflow-y-auto no-scrollbar pb-24">
          <div className="max-w-xl mx-auto">
            {/* Create Post Card */}
            <div className="bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-3xl p-6 mb-8 shadow-xl">
              <div className="flex gap-4">
                <img src={MOCK_CURRENT_USER.avatar} alt="" className="w-12 h-12 rounded-full object-cover" />
                <div className="flex-1">
                  <textarea
                    placeholder="I wanna share"
                    className="w-full bg-transparent border-none text-lg text-slate-200 placeholder:text-slate-600 resize-none focus:ring-0 min-h-[100px]"
                    value={newPostText}
                    onChange={(e) => setNewPostText(e.target.value)}
                  />
                  
                  {selectedImage && (
                    <div className="relative mb-4">
                      <img src={selectedImage} className="rounded-2xl max-h-60 w-full object-cover opacity-50" alt="Preview" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="bg-indigo-600 text-white text-[10px] font-bold px-3 py-1 rounded-full flex items-center gap-2">
                          <i className="fas fa-lock"></i> PROTECTION WILL BE BAKED IN
                        </span>
                      </div>
                      <button onClick={() => setSelectedImage(null)} className="absolute top-2 right-2 bg-black/50 w-8 h-8 rounded-full flex items-center justify-center">
                        <i className="fas fa-times text-white"></i>
                      </button>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                    <div className="flex gap-2">
                      <button 
                        onClick={handleImageSelect}
                        className="hover:bg-slate-800 text-slate-400 p-2 rounded-xl transition-all"
                      >
                        <i className="far fa-image text-lg"></i>
                      </button>
                      <button 
                        onClick={handleMagicCaption}
                        disabled={isGeneratingCaption}
                        className="bg-slate-800 hover:bg-slate-700 text-indigo-400 px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2"
                      >
                        <i className={`fas fa-wand-magic-sparkles ${isGeneratingCaption ? 'animate-spin' : ''}`}></i>
                        AI POLISH
                      </button>
                    </div>
                    <div className="flex items-center gap-4">
                      <button 
                        onClick={handleCreatePost}
                        disabled={isPosting || !newPostText.trim()}
                        className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold px-8 py-2.5 rounded-full transition-all shadow-lg shadow-indigo-600/20"
                      >
                        {isPosting ? <i className="fas fa-circle-notch fa-spin mr-2"></i> : null}
                        {isPosting ? 'SHIELDING...' : 'SECURE POST'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Posts */}
            {posts.map(post => (
              <PostCard key={post.id} post={post} currentUser={MOCK_CURRENT_USER} />
            ))}
          </div>
        </main>

        {/* Right Sidebar */}
        <aside className="w-80 hidden xl:flex flex-col gap-6 sticky top-0 overflow-y-auto no-scrollbar">
          <div className="bg-indigo-600 rounded-3xl p-6 text-white overflow-hidden relative">
            <i className="fas fa-shield-heart absolute -right-4 -bottom-4 text-white/10 text-9xl"></i>
            <h3 className="font-bold text-xl mb-2 relative z-10">TwitterS Privacy</h3>
            <p className="text-indigo-100 text-sm mb-4 relative z-10">
              TwitterS bakes watermarks and noise filters directly into your files so they remain protected even on the X app.
            </p>
            <div className="flex flex-col gap-2 relative z-10">
              <div className="flex items-center gap-2 text-xs font-bold bg-white/20 backdrop-blur-md px-3 py-2 rounded-xl">
                <i className="fas fa-ban"></i> GROK-PROOF COMMENTS
              </div>
              <div className="flex items-center gap-2 text-xs font-bold bg-white/20 backdrop-blur-md px-3 py-2 rounded-xl">
                <i className="fas fa-fingerprint"></i> FORENSIC WATERMARKING
              </div>
            </div>
          </div>

          <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-5">
            <h3 className="font-bold text-white mb-4">Safety Engine Active</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-teal-500/20 flex items-center justify-center text-teal-400">
                  <i className="fas fa-shield-check"></i>
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-300">Image Encryption</p>
                  <p className="text-[10px] text-slate-500 uppercase">Always On</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-rose-500/20 flex items-center justify-center text-rose-400">
                  <i className="fas fa-user-lock"></i>
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-300">Grok Monitor</p>
                  <p className="text-[10px] text-slate-500 uppercase">Blocking API active</p>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </SecurityShield>
  );
};

export default App;