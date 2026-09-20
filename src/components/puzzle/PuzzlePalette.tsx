import React from 'react';
import type { MitigationItem } from '@/types/scenario';
import { PuzzleBlock } from './PuzzleBlock';
import { RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PuzzlePaletteProps {
  unplacedItems: (MitigationItem & { color: string })[];
  selectedCardId: string | null;
  onCardClick: (id: string) => void;
  onResetAll?: () => void;
  onPaletteDrop?: (e: React.DragEvent<HTMLDivElement>) => void;
}

export const PuzzlePalette: React.FC<PuzzlePaletteProps> = ({
  unplacedItems,
  selectedCardId,
  onCardClick,
  onResetAll,
  onPaletteDrop,
}) => {
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  return (
    <div
      id="palette"
      data-testid="puzzle-palette-container"
      onDragOver={handleDragOver}
      onDrop={onPaletteDrop}
      className="flex flex-col gap-3 bg-[#F6F8FC] p-3.5 sm:p-4 rounded-2xl border border-slate-200 shadow-xs min-h-[220px]"
    >
      <div className="flex items-center justify-between gap-2 pb-2 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <h3 className="font-heading font-extrabold text-sm sm:text-base text-slate-800">
            Blok Tindakan
          </h3>
          <span
            data-testid="palette-count-badge"
            className="bg-slate-800 text-white text-xs font-bold px-2.5 py-0.5 rounded-full"
          >
            {unplacedItems.length}
          </span>
        </div>

        {onResetAll && (
          <Button
            type="button"
            data-testid="reset-palette-button"
            variant="ghost"
            size="sm"
            onClick={onResetAll}
            className="h-7 text-xs text-slate-500 hover:text-slate-800 hover:bg-slate-200/70 rounded-lg px-2"
          >
            <RotateCcw className="w-3 h-3 mr-1" />
            Reset
          </Button>
        )}
      </div>

      {unplacedItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-6 text-center text-slate-400 text-xs sm:text-sm font-medium border-2 border-dashed border-slate-200 rounded-xl">
          <span className="text-2xl mb-1">✨</span>
          Semua blok telah dipasang ke slot!
          <span className="text-[11px] text-slate-400 mt-0.5">
            Tekan tombol <b>Periksa Urutan</b> untuk memeriksa.
          </span>
        </div>
      ) : (
        <div className="flex flex-col gap-2.5 overflow-y-auto max-h-[480px] pr-1 py-1">
          {unplacedItems.map((item) => (
            <PuzzleBlock
              key={item.id}
              item={item}
              color={item.color}
              isSelected={selectedCardId === item.id}
              onClick={() => onCardClick(item.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};
