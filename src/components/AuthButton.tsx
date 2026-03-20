import { useState, useEffect } from 'react';
import { auth, signInWithGoogle, logout } from '../firebase';
import { User } from 'firebase/auth';
import { LogIn, LogOut, User as UserIcon } from 'lucide-react';

export default function AuthButton() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  if (loading) return <div className="w-8 h-8 rounded-full bg-slate-200 animate-pulse" />;

  if (user) {
    return (
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 border border-slate-200">
          {user.photoURL ? (
            <img src={user.photoURL} alt={user.displayName || ''} className="w-6 h-6 rounded-full" referrerPolicy="no-referrer" />
          ) : (
            <UserIcon className="w-4 h-4 text-slate-500" />
          )}
          <span className="text-sm font-medium text-slate-700 hidden sm:inline">{user.displayName}</span>
        </div>
        <button
          onClick={logout}
          className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
          title="Sign Out"
        >
          <LogOut className="w-5 h-5" />
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={signInWithGoogle}
      className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-all font-medium shadow-sm hover:shadow-md active:scale-95"
    >
      <LogIn className="w-4 h-4" />
      <span>Sign In</span>
    </button>
  );
}

import { onAuthStateChanged } from 'firebase/auth';
