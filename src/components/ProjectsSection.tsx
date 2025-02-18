import { motion } from 'framer-motion';
import { CardComponent } from './ui/focus-cards';
import { useState } from 'react';

interface ProjectsSectionProps {
  projectSections: {
    title: string;
    pattern: 'v-shape' | 'diagonal';
    cards: {
      title: string;
      src: string;
      description: string;
      githubLink?: string;
    }[];
  }[];
}

export const ProjectsSection = ({ projectSections }: ProjectsSectionProps) => {
  const allCards = projectSections.flatMap(section => section.cards);
  const [hovered, setHovered] = useState<number | null>(null);

  const handleCardClick = (githubLink?: string) => {
    if (githubLink) {
      window.open(githubLink, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <motion.section 
      id="projects"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="w-full pt-16 md:pt-8 pb-24 md:pb-32"
    >
      <div className="w-full max-w-[1800px] mx-auto px-4 sm:px-6 md:px-8">
        <div className="space-y-6 mb-8">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-sm font-mono text-cyan-400 mb-2 block"
          >
            Portfolio
          </motion.span>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold bg-clip-text text-transparent 
                       bg-gradient-to-r from-cyan-400 via-cyan-300 to-teal-300 
                       drop-shadow-[0_0_30px_rgba(34,211,238,0.3)]
                       leading-tight py-8"
          >
            Featured Projects
          </motion.h2>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-8 md:gap-12">
          {allCards.map((card, index) => (
            <CardComponent
              key={card.title}
              card={card}
              index={index}
              hovered={hovered}
              setHovered={setHovered}
              onClick={() => handleCardClick(card.githubLink)}
            />
          ))}
        </div>
      </div>
    </motion.section>
  );
}; 