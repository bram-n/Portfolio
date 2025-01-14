import { motion } from 'framer-motion';

interface WelcomeTextProps {
  isDispersing: boolean;
}

const WelcomeText: React.FC<WelcomeTextProps> = ({ isDispersing }) => {
  const text = "Hi I'm Bram!";
  
  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.3,
      },
    },
    exit: {
      opacity: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  const letter = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
    },
  };

  return (
    <motion.div 
      className="absolute w-full text-center top-[10%] z-10 select-none"
      initial="hidden"
      animate={isDispersing ? "exit" : "visible"}
      variants={container}
    >
      <motion.h1 className="text-7xl font-extrabold mb-2 leading-tight inline-block text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-cyan-300 to-teal-300 drop-shadow-[0_0_30px_rgba(34,211,238,0.3)]">
        {text.split("").map((char, index) => (
          <motion.span
            key={index}
            variants={letter}
          >
            {char}
          </motion.span>
        ))}
      </motion.h1>
    </motion.div>
  );
};

export default WelcomeText; 