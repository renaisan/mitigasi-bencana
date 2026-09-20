import React from 'react';
import type { MitigationItem } from '@/types/scenario';
import { soundEngine } from '@/lib/audio';
import { X } from 'lucide-react';

interface PuzzleBlockProps {
  item: MitigationItem;
  color?: string;
  isPlaced?: boolean;
  isSelected?: boolean;
  isCorrect?: boolean;
  isWrong?: boolean;
  isPlaying?: boolean;
  isJustPlaced?: boolean;
  onClick?: () => void;
  onRemove?: () => void;
  onDragStart?: (e: React.DragEvent<HTMLDivElement>) => void;
  onDragEnd?: (e: React.DragEvent<HTMLDivElement>) => void;
}

export const PuzzleBlock: React.FC<PuzzleBlockProps> = ({
  item,
  color = '#2F6FED',
  isPlaced = false,
  isSelected = false,
  isCorrect = false,
  isWrong = false,
  isPlaying = false,
  isJustPlaced = false,
  onClick,
  onRemove,
  onDragStart,
  onDragEnd,
}) => {
  const handleDragStartInternal = (e: React.DragEvent<HTMLDivElement>) => {
    soundEngine.playPop();
    e.dataTransfer.setData('text/plain', item.id);
    e.dataTransfer.effectAllowed = 'move';
    if (onDragStart) onDragStart(e);
  };

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    soundEngine.playPop();
    if (onClick) onClick();
  };

  const handleRemoveClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    soundEngine.playPop();
    if (onRemove) onRemove();
  };

  return (
    <div
      id={`card-${item.id}`}
      data-testid={`puzzle-block-${item.id}`}
      draggable
      onDragStart={handleDragStartInternal}
      onDragEnd={onDragEnd}
      onClick={handleClick}
      className={`scratch-block group relative flex items-center justify-between gap-2.5 p-2.5 sm:p-3 transition-all ${
        isSelected ? 'selected' : ''
      } ${isCorrect ? 'correct' : ''} ${isWrong ? 'wrong' : ''} ${
        isPlaying ? 'playing' : ''
      } ${isJustPlaced ? 'just-placed' : ''}`}
      style={{
        borderLeftColor: color,
        ['--block-color' as string]: color,
      }}
    >
      <div className="flex items-center gap-2.5 flex-1 min-w-0">
        {/* Puzzle Icon Tile */}
        <div
          className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center text-white shrink-0 shadow-sm text-sm group-hover:rotate-6 group-active:scale-95 transition-transform"
          style={{
            backgroundColor: color,
          }}
        >
          🧩
        </div>

        {/* Text description */}
        <p className="text-xs sm:text-sm font-bold text-slate-800 leading-snug break-words">
          {item.text}
        </p>
      </div>

      {/* Remove button if placed in a slot */}
      {isPlaced && onRemove && (
        <button
          type="button"
          data-testid={`remove-block-${item.id}`}
          onClick={handleRemoveClick}
          title="Kembalikan ke palet"
          className="opacity-60 hover:opacity-100 hover:bg-slate-100 text-slate-500 hover:text-rose-600 p-1 rounded-md transition-all shrink-0"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
};
