
import React, { useState } from 'react';
import { Post, User } from '../types';
import ShieldedImage from './ShieldedImage';
import { moderateContent } from '../services/geminiService';

interface PostCardProps {
  post: Post;
  currentUser: User;
}

const PostCard: React.FC<PostCardProps> = ({ post, currentUser }) => {
  const [commentText, setCommentText] = useState('');
  const [isModerating, setIsModerating] = useState(false);
  const [localComments, setLocalComments] = useState(post.comments);
  const [liked, setLiked] = useState(false);

  const handlePostComment = async () => {
    if (!commentText.trim()) return;

    setIsModerating(true);
    const moderation = await moderateContent(commentText);

    if (!moderation.isSafe) {
      alert(moderation.reason || "Your comment was flagged for safety. Please revise.");
      setIsModerating(false);
      return;
    }

    const newComment = {
      id: Math.random().toString(36).substr(2, 9),
      author: currentUser,
      text: commentText,
      timestamp: 'Just now'
    };

    setLocalComments([newComment, ...localComments]);
    setCommentText('');
    setIsModerating(false);
  };

  return (
    <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-5 mb-6 hover:border-indigo-500/30 transition-all duration-300">
      <div className="flex gap-4">
        <img 
          src={post.author.avatar} 
          alt={post.author.name} 
          className="w-12 h-12 rounded-full border-2 border-indigo-500/20 pointer-events-none"
        />
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <div>
              <span className="font-bold text-slate-100 mr-1">{post.author.name}</span>
              {post.author.isVerified && <i className="fas fa-certificate text-indigo-400 text-xs mr-2"></i>}
              <span className="text-slate-500 text-sm">@{post.author.username} · {post.timestamp}</span>
            </div>
            <button className="text-slate-600 hover:text-white transition-colors">
              <i className="fas fa-ellipsis-h"></i>
            </button>
          </div>
          
          <p className="mt-3 text-slate-200 leading-relaxed select-none">
            {post.content}
          </p>

          {post.image && (
            <div className="mt-4">
              <ShieldedImage src={post.image} alt="Shielded Post Content" />
            </div>
          )}

          <div className="flex items-center justify-between mt-6 px-1">
            <button 
              onClick={() => setLiked(!liked)}
              className={`flex items-center gap-2 group transition-colors ${liked ? 'text-rose-500' : 'text-slate-500 hover:text-rose-400'}`}
            >
              <i className={`${liked ? 'fas' : 'far'} fa-heart text-lg group-active:scale-125 transition-transform`}></i>
              <span className="text-sm font-medium">{post.likes + (liked ? 1 : 0)}</span>
            </button>
            <button className="flex items-center gap-2 text-slate-500 hover:text-indigo-400 transition-colors">
              <i className="far fa-comment text-lg"></i>
              <span className="text-sm font-medium">{localComments.length}</span>
            </button>
            <button className="flex items-center gap-2 text-slate-500 hover:text-teal-400 transition-colors">
              <i className="far fa-paper-plane text-lg"></i>
            </button>
            <div className="flex items-center gap-2 text-slate-500">
              <i className="fas fa-shield-virus text-indigo-500/50"></i>
            </div>
          </div>

          {/* Comment Section */}
          <div className="mt-6 pt-6 border-t border-slate-800">
            <div className="flex gap-3 mb-4">
              <input
                type="text"
                placeholder="Write a supportive comment..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                disabled={isModerating}
                className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-indigo-500 transition-colors disabled:opacity-50"
              />
              <button 
                onClick={handlePostComment}
                disabled={isModerating || !commentText.trim()}
                className="bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-700 px-4 py-2 rounded-xl text-sm font-bold transition-all"
              >
                {isModerating ? <i className="fas fa-circle-notch fa-spin"></i> : 'Reply'}
              </button>
            </div>

            <div className="space-y-4 max-h-60 overflow-y-auto pr-2">
              {localComments.map((comment) => (
                <div key={comment.id} className="flex gap-3">
                  <img src={comment.author.avatar} alt="" className="w-8 h-8 rounded-full pointer-events-none" />
                  <div className="bg-slate-800/40 rounded-2xl px-4 py-2 flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-slate-300">@{comment.author.username}</span>
                      <span className="text-[10px] text-slate-500">{comment.timestamp}</span>
                    </div>
                    <p className="text-sm text-slate-300 select-none">{comment.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostCard;
