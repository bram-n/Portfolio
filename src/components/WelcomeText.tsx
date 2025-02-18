import { motion } from 'framer-motion';

interface WelcomeTextProps {
  isDispersing: boolean;
}

const WelcomeText: React.FC<WelcomeTextProps> = ({ isDispersing }) => {
  const mainText = "Hi I'm Bram!";
  const subText = "Welcome to My Portfolio";
  
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

  const subContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: mainText.length * 0.12 + 0.3,
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

  return (
    <motion.div 
      className="absolute w-full text-center top-[10%] z-10 select-none px-4"
      initial="hidden"
      animate={isDispersing ? "exit" : "visible"}
      variants={container}
    >
      <motion.h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold mb-2 leading-tight inline-block text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-cyan-300 to-teal-300 drop-shadow-[0_0_30px_rgba(34,211,238,0.3)]">
        {mainText.split("").map((char, index) => (
          <motion.span
            key={index}
            variants={letter}
          >
            {char}
          </motion.span>
        ))}
      </motion.h1>
      
      <motion.div
        variants={subContainer}
        className="mt-4 sm:mt-6 md:mt-8"
      >
        <motion.p className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-semibold text-cyan-200/90">
          {subText.split("").map((char, index) => (
            <motion.span
              key={index}
              variants={letter}
              className="inline-block"
              style={{ 
                marginRight: char === " " ? "0.3em" : "0.02em",
                letterSpacing: "0.02em"
              }}
            >
              {char}
            </motion.span>
          ))}
        </motion.p>
      </motion.div>
    </motion.div>
  );
};

export default WelcomeText; 