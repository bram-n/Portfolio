import { motion } from 'framer-motion';
import { FocusCards } from './ui/focus-cards';

interface ProjectsSectionProps {
  projectSections: {
    title: string;
    pattern: 'v-shape' | 'diagonal';
    cards: {
      title: string;
      src: string;
      description: string;
    }[];
  }[];
}

export const ProjectsSection = ({ projectSections }: ProjectsSectionProps) => {
  return (
    <motion.section 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="w-full py-24 md:py-32"
    >
      <div className="w-full max-w-[1800px] mx-auto px-6 sm:px-8">
        <div className="space-y-8 mb-20">
          <div className="inline-block">
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-sm font-mono text-cyan-400 mb-4 block"
            >
              Portfolio
            </motion.span>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-5xl sm:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-cyan-300 to-teal-300 drop-shadow-[0_0_30px_rgba(34,211,238,0.3)]"
            >
              Featured Projects
            </motion.h2>
          </div>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl sm:text-2xl text-gray-400/90 max-w-3xl font-light"
          >
            Here are some of my recent works and ongoing projects
          </motion.p>
        </div>
        <FocusCards sections={projectSections} />
      </div>
    </motion.section>
  );
}; 