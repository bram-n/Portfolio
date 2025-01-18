"use client";
import Image from "next/image";
import React, { useState } from "react";
import { cn } from "../../lib/utils";

export const Card = React.memo(
  ({
    card,
    index,
    hovered,
    setHovered,
    style,
    pattern,
  }: {
    card: any;
    index: number;
    hovered: number | null;
    setHovered: React.Dispatch<React.SetStateAction<number | null>>;
    style?: React.CSSProperties;
    pattern: 'v-shape' | 'diagonal';
  }) => (
    <div
      onMouseEnter={() => setHovered(index)}
      onMouseLeave={() => setHovered(null)}
      className={cn(
        "absolute bg-gray-100 dark:bg-neutral-900 overflow-hidden h-[400px] w-[600px] transition-all duration-500 ease-out rounded-xl group cursor-pointer",
        hovered !== null && hovered !== index && "opacity-60 scale-95",
        "hover:scale-105"
      )}
      style={{
        ...style,
        zIndex: hovered === index ? 50 : index,
      }}
    >
      <Image
        src={card.src}
        alt={card.title}
        fill
        className="object-cover absolute inset-0"
      />
      <div
        className={cn(
          "absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent flex flex-col justify-end p-8 transition-opacity duration-300",
          "opacity-0 group-hover:opacity-100"
        )}
      >
        <h3 className="text-2xl font-bold text-white mb-3">{card.title}</h3>
        <p className="text-gray-200 text-lg">{card.description}</p>
      </div>
    </div>
  )
);

Card.displayName = "Card";

type Card = {
  title: string;
  src: string;
  description: string;
};

type ProjectSection = {
  title: string;
  cards: Card[];
  pattern: 'v-shape' | 'diagonal';
};

const getCardPosition = (index: number, pattern: 'v-shape' | 'diagonal', isReversed: boolean = false) => {
  if (pattern === 'v-shape') {
    switch (index) {
      case 0: // Top left
        return {
          left: '0',
          top: '0',
        };
      case 1: // Top right
        return {
          right: '0',
          top: '0',
        };
      case 2: // Bottom middle
        return {
          left: '50%',
          top: '200px',
          transform: 'translateX(-50%)',
        };
      default:
        return {};
    }
  } else { // diagonal pattern
    const offset = isReversed ? -1 : 1;
    return {
      left: `${index * 200 * offset}px`,
      top: `${index * 100}px`,
    };
  }
};

export function FocusCards({ sections }: { sections: ProjectSection[] }) {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <div className="space-y-[400px]">
      {sections.map((section, sectionIndex) => (
        <div key={section.title} className="relative">
          <h2 className="text-5xl font-bold text-white mb-16">{section.title}</h2>
          <div className="relative h-[600px]">
            {section.cards.map((card, index) => (
              <Card
                key={card.title}
                card={card}
                index={index}
                hovered={hovered}
                setHovered={setHovered}
                pattern={section.pattern}
                style={getCardPosition(index, section.pattern, sectionIndex === 1)}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
} 