import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Heart, ExternalLink, Tag } from 'lucide-react';
import { db, auth, handleFirestoreError, OperationType } from '../firebase';
import { doc, setDoc, deleteDoc, updateDoc, increment } from 'firebase/firestore';

interface AppCardProps {
  key?: any;
  app: {
    id: string;
    name: string;
    description: string;
    authorName: string;
    authorPhoto?: string;
    imageUrl?: string;
    appUrl?: string;
    tags?: string[];
    likesCount: number;
    authorId: string;
  };
  isLiked: boolean;
  onLikeToggle?: () => void;
}

export default function AppCard({ app, isLiked, onLikeToggle }: AppCardProps) {
  const [isLiking, setIsLiking] = useState(false);

  const handleLike = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!auth.currentUser || isLiking) return;

    setIsLiking(true);
    const likeId = `${auth.currentUser.uid}_${app.id}`;
    const likeRef = doc(db, 'likes', likeId);
    const appRef = doc(db, 'apps', app.id);

    try {
      if (isLiked) {
        await deleteDoc(likeRef);
        await updateDoc(appRef, { likesCount: increment(-1) });
      } else {
        await setDoc(likeRef, {
          userId: auth.currentUser.uid,
          appId: app.id,
          createdAt: new Date()
        });
        await updateDoc(appRef, { likesCount: increment(1) });
      }
      onLikeToggle?.();
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `likes/${likeId}`);
    } finally {
      setIsLiking(false);
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="group bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-xl hover:shadow-indigo-500/10 transition-all duration-300 flex flex-col h-full"
    >
      <div className="relative aspect-video overflow-hidden bg-slate-100">
        {app.imageUrl ? (
          <img
            src={app.imageUrl}
            alt={app.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-400">
            <Tag className="w-12 h-12 opacity-20" />
          </div>
        )}
        <div className="absolute top-3 right-3">
          <button
            onClick={handleLike}
            disabled={!auth.currentUser || isLiking}
            className={`p-2 rounded-full backdrop-blur-md transition-all ${
              isLiked 
                ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/30' 
                : 'bg-white/80 text-slate-600 hover:bg-white hover:text-rose-500'
            } disabled:opacity-50`}
          >
            <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
          </button>
        </div>
      </div>

      <div className="p-5 flex flex-col flex-grow">
        <div className="flex items-center gap-2 mb-3">
          {app.authorPhoto ? (
            <img src={app.authorPhoto} alt={app.authorName} className="w-5 h-5 rounded-full" referrerPolicy="no-referrer" />
          ) : (
            <div className="w-5 h-5 rounded-full bg-indigo-100 flex items-center justify-center text-[10px] font-bold text-indigo-600">
              {app.authorName[0]}
            </div>
          )}
          <span className="text-xs font-medium text-slate-500">{app.authorName}</span>
        </div>

        <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors">
          {app.name}
        </h3>
        <p className="text-sm text-slate-600 line-clamp-2 mb-4 flex-grow">
          {app.description}
        </p>

        <div className="flex flex-wrap gap-2 mb-4">
          {app.tags?.slice(0, 3).map(tag => (
            <span key={tag} className="text-[10px] font-semibold uppercase tracking-wider px-2 py-1 bg-slate-100 text-slate-500 rounded-md">
              {tag}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-slate-100 mt-auto">
          <div className="flex items-center gap-1 text-slate-500 text-sm font-medium">
            <Heart className={`w-4 h-4 ${app.likesCount > 0 ? 'fill-rose-500 text-rose-500' : ''}`} />
            <span>{app.likesCount}</span>
          </div>
          {app.appUrl && (
            <a
              href={app.appUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-sm font-bold text-indigo-600 hover:text-indigo-700 transition-colors"
            >
              <span>View App</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
}
