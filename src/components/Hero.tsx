import { motion } from 'motion/react';
import { Rocket, Sparkles, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Hero() {
  return (
    <div className="relative overflow-hidden bg-white pt-16 pb-32">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-[30%] left-[20%] w-[70%] h-[70%] bg-indigo-50 rounded-full blur-3xl opacity-50" />
        <div className="absolute -bottom-[20%] right-[10%] w-[60%] h-[60%] bg-violet-50 rounded-full blur-3xl opacity-50" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 text-indigo-600 text-sm font-semibold mb-6 border border-indigo-100">
            <Sparkles className="w-4 h-4" />
            The Future of App Development
          </span>
          <h1 className="text-5xl sm:text-7xl font-extrabold text-slate-900 tracking-tight mb-8">
            The Marketplace for <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-600">
              Vibe Coded Apps
            </span>
          </h1>
          <p className="max-w-2xl mx-auto text-xl text-slate-600 mb-10 leading-relaxed">
            Discover, showcase, and share apps built with natural language. 
            Join a community of creators turning vibes into production-ready software.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/explore"
              className="w-full sm:w-auto px-8 py-4 bg-indigo-600 text-white rounded-2xl font-bold text-lg hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/20 active:scale-95"
            >
              Explore Apps
            </Link>
            <Link
              to="/submit"
              className="w-full sm:w-auto px-8 py-4 bg-white text-slate-900 border-2 border-slate-200 rounded-2xl font-bold text-lg hover:border-indigo-600 hover:text-indigo-600 transition-all active:scale-95"
            >
              Submit Your Idea
            </Link>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="mt-20 grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-4xl mx-auto"
        >
          <div className="p-6 rounded-2xl bg-white border border-slate-100 shadow-sm">
            <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600 mx-auto mb-4">
              <Rocket className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 mb-2">Fast Launch</h3>
            <p className="text-sm text-slate-500">Go from idea to live app in minutes with vibe coding.</p>
          </div>
          <div className="p-6 rounded-2xl bg-white border border-slate-100 shadow-sm">
            <div className="w-12 h-12 bg-violet-100 rounded-xl flex items-center justify-center text-violet-600 mx-auto mb-4">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 mb-2">AI Powered</h3>
            <p className="text-sm text-slate-500">Leverage the latest Gemini models to build anything.</p>
          </div>
          <div className="p-6 rounded-2xl bg-white border border-slate-100 shadow-sm">
            <div className="w-12 h-12 bg-fuchsia-100 rounded-xl flex items-center justify-center text-fuchsia-600 mx-auto mb-4">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 mb-2">Community</h3>
            <p className="text-sm text-slate-500">Share your creations and get feedback from others.</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
