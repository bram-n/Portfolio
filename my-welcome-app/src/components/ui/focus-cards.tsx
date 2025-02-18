"use client";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import { cn } from "../../lib/utils";

export const CardComponent = React.memo(
  ({
    card,
    index,
    hovered,
    setHovered,
    style,
    onClick,
  }: {
    card: any;
    index: number;
    hovered: number | null;
    setHovered: React.Dispatch<React.SetStateAction<number | null>>;
    style?: React.CSSProperties;
    onClick?: () => void;
  }) => (
    <div
      onMouseEnter={() => setHovered(index)}
      onMouseLeave={() => setHovered(null)}
      onClick={onClick}
      className={cn(
        "relative bg-gray-100 dark:bg-neutral-900 overflow-hidden transition-all duration-500 ease-out rounded-xl group cursor-pointer",
        "h-[300px] w-full",
        "md:h-[400px]",
        hovered !== null && hovered !== index ? "opacity-40 scale-95" : "",
        hovered === index && "scale-105 z-50",
        "hover:scale-105"
      )}
      style={{
        ...style,
      }}
      role="button"
      tabIndex={0}
    >
      <Image
        src={card.src}
        alt={card.title}
        fill
        className="object-cover absolute inset-0"
      />
      <div
        className={cn(
          "absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent flex flex-col justify-end p-4 md:p-8 transition-opacity duration-300",
          "opacity-0 group-hover:opacity-100"
        )}
      >
        <h3 className="text-xl md:text-2xl font-bold text-white mb-2 md:mb-3">{card.title}</h3>
        <p className="text-base md:text-lg text-gray-200">{card.description}</p>
        {card.githubLink && (
          <div className="mt-4">
            <span className="text-cyan-400 text-sm">Click to view on GitHub →</span>
          </div>
        )}
      </div>
    </div>
  )
);

CardComponent.displayName = "CardComponent";

type Card = {
  title: string;
  src: string;
  description: string;
  githubLink?: string;
};

type ProjectSection = {
  title: string;
  cards: Card[];
  pattern: 'v-shape' | 'diagonal';
};

const getCardPosition = (index: number, pattern: 'v-shape' | 'diagonal', isReversed: boolean = false) => {
  const cardWidth = 600;
  const cardHeight = 400;
  const spacing = window.innerWidth <= 1200 ? 8 : 40;
  const breakpoint = window.innerWidth <= 1200;

  if (pattern === 'v-shape') {
    if (breakpoint) {
      return {
        position: 'relative' as const,
        left: '50%',
        transform: 'translateX(-50%)',
        top: `${index * (cardHeight + spacing)}px`,
        width: window.innerWidth <= 768 ? '100%' : '80%',
        maxWidth: `${cardWidth}px`,
        margin: '0 auto',
      };
    } else {
      switch (index) {
        case 0:
          return {
            left: '0',
            top: '0',
          };
        case 1:
          return {
            right: '0',
            top: '0',
          };
        case 2:
          return {
            left: '50%',
            top: '200px',
            transform: 'translateX(-50%)',
          };
        default:
          return {};
      }
    }
  } else {
    if (breakpoint) {
      return {
        position: 'relative' as const,
        left: '50%',
        transform: 'translateX(-50%)',
        top: `${index * (cardHeight + spacing)}px`,
        width: window.innerWidth <= 768 ? '100%' : '80%',
        maxWidth: `${cardWidth}px`,
        margin: '0 auto',
      };
    } else {
      const offset = isReversed ? -1 : 1;
      return {
        left: `${index * 200 * offset}px`,
        top: `${index * 100}px`,
      };
    }
  }
};

interface FocusCardsProps {
  sections: {
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

export const FocusCards = ({ sections }: FocusCardsProps) => {
  const [hovered, setHovered] = useState<number | null>(null);
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 0);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleCardClick = (githubLink?: string) => {
    if (githubLink) {
      window.open(githubLink, '_blank', 'noopener,noreferrer');
    }
  };

  const getSectionHeight = (cardCount: number) => {
    const spacing = windowWidth <= 1200 ? 8 : 40;
    if (windowWidth <= 1200) {
      return cardCount * (400 + spacing) - spacing;
    }
    return 600;
  };

  return (
    <div className="space-y-16 md:space-y-32 px-4 sm:px-6 md:px-8">
      {sections.map((section) => (
        <div key={section.title} className="relative">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 md:mb-8">{section.title}</h2>
          <div className="relative" style={{ height: `${getSectionHeight(section.cards.length)}px` }}>
            {section.cards.map((card, index) => (
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
      ))}
    </div>
  );
}; 