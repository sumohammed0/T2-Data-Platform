import React, { useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { Sparkles } from 'lucide-react';

const Home = () => {
  const controls = useAnimation();
  
  useEffect(() => {
    controls.start({
      background: [
        'linear-gradient(45deg, #4f46e5, #3b82f6)',
        'linear-gradient(45deg, #3b82f6, #06b6d4)',
        'linear-gradient(45deg, #06b6d4, #4f46e5)'
      ],
      transition: {
        duration: 10,
        repeat: Infinity,
        repeatType: "reverse"
      }
    });
  }, [controls]);

  return (
    <motion.div 
      className="relative min-h-screen w-full overflow-hidden"
      animate={controls}
    >
      {/* Background gradient blobs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[10%] left-[15%] w-[500px] h-[500px] bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob" />
        <div className="absolute top-[40%] right-[25%] w-[450px] h-[450px] bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000" />
        <div className="absolute bottom-[20%] left-[35%] w-[600px] h-[600px] bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000" />
        <div className="absolute top-[60%] right-[5%] w-[400px] h-[400px] bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-6000" />
        <div className="absolute bottom-[10%] left-[5%] w-[550px] h-[550px] bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-8000" />
      </div>

      {/* Main content */}
      <div className="relative flex flex-col items-center justify-center min-h-screen text-center p-4">
        <motion.div
          className="max-w-4xl mx-auto relative"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            className="relative inline-block"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <motion.h1 
              className="text-6xl md:text-7xl font-bold mb-6 text-white"
            >
              <span className="inline-block">
                <Sparkles className="inline-block mr-4 mb-2" size={48} />
              </span>
              Sophisticated Data Ingestion & More
            </motion.h1>
            
            <motion.div
              className="absolute -inset-x-6 -inset-y-4 bg-white opacity-10 blur-xl rounded-xl"
              animate={{
                scale: [1, 1.1, 1],
                opacity: [0.1, 0.15, 0.1],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                repeatType: "reverse",
              }}
            />
          </motion.div>

          <motion.p 
            className="text-2xl md:text-3xl text-white font-light mt-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            Team 2
          </motion.p>
        </motion.div>
        
        <motion.div 
          className="mt-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
        >
          <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
            <motion.button 
              whileHover={{ scale: 1.05, backgroundColor: '#fff', color: '#4f46e5' }}
              whileTap={{ scale: 0.95 }}
              className="group px-8 py-3 bg-transparent border-2 border-white text-white rounded-lg font-semibold relative overflow-hidden"
            >
              <motion.div
                className="absolute inset-0 bg-white"
                initial={{ x: '-100%' }}
                whileHover={{ x: 0 }}
                transition={{ type: "tween", duration: 0.3 }}
                style={{ zIndex: -1 }}
              />
              <span className="relative z-10 group-hover:text-indigo-600">Get Started</span>
            </motion.button>
            
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-3 bg-white/10 backdrop-blur-sm border-2 border-white/30 text-white rounded-lg font-semibold hover:bg-white/20 transition-colors"
            >
              Learn More
            </motion.button>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

// Enhanced blob animation with more random movement
const style = document.createElement('style');
style.textContent = `
  @keyframes blob {
    0% { transform: translate(0px, 0px) scale(1); }
    20% { transform: translate(80px, -120px) scale(1.2); }
    40% { transform: translate(-60px, 80px) scale(0.9); }
    60% { transform: translate(120px, 40px) scale(1.1); }
    80% { transform: translate(-40px, -80px) scale(0.95); }
    100% { transform: translate(0px, 0px) scale(1); }
  }
  .animate-blob {
    animation: blob 20s infinite cubic-bezier(0.4, 0.0, 0.2, 1);
  }
  .animation-delay-2000 {
    animation-delay: 2s;
  }
  .animation-delay-4000 {
    animation-delay: 4s;
  }
  .animation-delay-6000 {
    animation-delay: 6s;
  }
  .animation-delay-8000 {
    animation-delay: 8s;
  }
`;
document.head.appendChild(style);

export default Home;