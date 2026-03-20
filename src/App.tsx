import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, query, orderBy, onSnapshot, doc, getDoc, where } from 'firebase/firestore';
import { auth, db, handleFirestoreError, OperationType } from './firebase';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import AppCard from './components/AppCard';
import AppForm from './components/AppForm';
import { Rocket, Search, Filter, Loader2, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Error Boundary Component
function ErrorDisplay({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center p-8 bg-rose-50 border border-rose-100 rounded-2xl text-rose-600">
      <AlertCircle className="w-12 h-12 mb-4" />
      <h3 className="text-lg font-bold mb-2">Something went wrong</h3>
      <p className="text-sm text-center max-w-md">{message}</p>
    </div>
  );
}

function ExplorePage() {
  const [apps, setApps] = useState<any[]>([]);
  const [userLikes, setUserLikes] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const q = query(collection(db, 'apps'), orderBy('createdAt', 'desc'));
    const unsubscribeApps = onSnapshot(q, (snapshot) => {
      const appsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setApps(appsData);
      setLoading(false);
    }, (err) => {
      handleFirestoreError(err, OperationType.LIST, 'apps');
      setError(err.message);
      setLoading(false);
    });

    let unsubscribeLikes = () => {};
    if (auth.currentUser) {
      const likesQ = query(collection(db, 'likes'), where('userId', '==', auth.currentUser.uid));
      unsubscribeLikes = onSnapshot(likesQ, (snapshot) => {
        const likedAppIds = new Set(snapshot.docs.map(doc => doc.data().appId));
        setUserLikes(likedAppIds);
      });
    }

    return () => {
      unsubscribeApps();
      unsubscribeLikes();
    };
  }, [auth.currentUser]);

  const filteredApps = apps.filter(app => 
    app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.tags?.some((t: string) => t.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 mb-2">Explore Apps</h2>
          <p className="text-slate-500">Discover the latest creations from the vibe coding community.</p>
        </div>
        <div className="relative max-w-md w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search apps, tags, or creators..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none bg-white shadow-sm"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mb-4" />
          <p className="text-slate-500 font-medium">Loading amazing apps...</p>
        </div>
      ) : error ? (
        <ErrorDisplay message={error} />
      ) : filteredApps.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode="popLayout">
            {filteredApps.map(app => (
              <AppCard 
                key={app.id} 
                app={app} 
                isLiked={userLikes.has(app.id)} 
              />
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <div className="text-center py-20 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
          <Rocket className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-slate-900 mb-2">No apps found</h3>
          <p className="text-slate-500 mb-8">Be the first to submit a vibe-coded app in this category!</p>
          <Link to="/submit" className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all">
            Submit App
          </Link>
        </div>
      )}
    </div>
  );
}

function HomePage() {
  return (
    <>
      <Hero />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <div className="flex items-center justify-between mb-12">
          <h2 className="text-3xl font-bold text-slate-900">Featured Apps</h2>
          <Link to="/explore" className="text-indigo-600 font-bold hover:underline">View All</Link>
        </div>
        <ExplorePage />
      </div>
    </>
  );
}

export default function App() {
  const [isAuthReady, setIsAuthReady] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, () => {
      setIsAuthReady(true);
    });
    return unsubscribe;
  }, []);

  if (!isAuthReady) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="w-12 h-12 text-indigo-600 animate-spin" />
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-slate-50 font-sans selection:bg-indigo-100 selection:text-indigo-900">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/explore" element={<ExplorePage />} />
            <Route path="/submit" element={<div className="py-12 px-4"><AppForm /></div>} />
          </Routes>
        </main>
        <footer className="bg-white border-t border-slate-200 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="flex items-center justify-center gap-2 mb-6">
              <div className="p-1.5 bg-indigo-600 rounded-lg">
                <Rocket className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-bold text-slate-900">Vibe Store</span>
            </div>
            <p className="text-slate-500 text-sm mb-8 max-w-md mx-auto">
              The premier destination for discovering and sharing apps built with the power of vibes and AI.
            </p>
            <div className="flex justify-center gap-8 text-sm font-medium text-slate-400">
              <a href="#" className="hover:text-indigo-600 transition-colors">Twitter</a>
              <a href="#" className="hover:text-indigo-600 transition-colors">GitHub</a>
              <a href="#" className="hover:text-indigo-600 transition-colors">Discord</a>
            </div>
            <div className="mt-12 pt-8 border-t border-slate-100 text-xs text-slate-400">
              © 2026 Vibe Store. Built with Natural Language.
            </div>
          </div>
        </footer>
      </div>
    </Router>
  );
}
