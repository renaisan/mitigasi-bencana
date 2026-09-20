import React from 'react';
import type { DisasterPhase, MitigationItem } from '@/types/scenario';
import { PuzzleBlock } from './PuzzleBlock';
import { soundEngine } from '@/lib/audio';
import { CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CanvasSequenceProps {
  phases: DisasterPhase[];
  slotPlacements: Record<string, string | null>; // slotKey (phaseKey-slotIndex) -> itemId
  itemsMap: Record<string, MitigationItem & { color: string }>;
  validationStatus: Record<string, 'correct' | 'wrong' | null>; // itemId -> status
  playingItemId: string | null;
  selectedCardId: string | null;
  onSlotClick: (phaseKey: string, slotIndex: number) => void;
  onSlotDrop: (phaseKey: string, slotIndex: number, itemId: string) => void;
  onRemoveBlock: (itemId: string) => void;
  onCheckSequence: () => void;
  filledCount: number;
  totalCount: number;
  title: string;
}

export const CanvasSequence: React.FC<CanvasSequenceProps> = ({
  phases,
  slotPlacements,
  itemsMap,
  validationStatus,
  playingItemId,
  selectedCardId,
  onSlotClick,
  onSlotDrop,
  onRemoveBlock,
  onCheckSequence,
  filledCount,
  totalCount,
  title,
}) => {
  const [dragOverSlot, setDragOverSlot] = React.useState<string | null>(null);

  const handleDragOver = (e: React.DragEvent, slotKey: string) => {
    e.preventDefault();
    if (dragOverSlot !== slotKey) {
      setDragOverSlot(slotKey);
    }
  };

  const handleDragLeave = (slotKey: string) => {
    if (dragOverSlot === slotKey) {
      setDragOverSlot(null);
    }
  };

  const handleDrop = (
    e: React.DragEvent,
    phaseKey: string,
    slotIndex: number,
    slotKey: string
  ) => {
    e.preventDefault();
    setDragOverSlot(null);
    const itemId = e.dataTransfer.getData('text/plain');
    if (itemId) {
      soundEngine.playSnap();
      onSlotDrop(phaseKey, slotIndex, itemId);
    }
  };

  const progressPct = totalCount > 0 ? (filledCount / totalCount) * 100 : 0;

  return (
    <div
      id="canvas-sequence-container"
      data-testid="canvas-sequence-container"
      className="flex flex-col gap-4 bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm"
    >
      {/* Sequence Header & Progress */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div>
          <h2 className="font-heading font-extrabold text-base sm:text-lg text-slate-800">
            {title}
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Susun blok ke dalam slot fase yang sesuai urutan waktu kejadian.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-full text-xs font-bold text-slate-600">
            <span>Terisi</span>
            <b data-testid="sequence-filled-counter" className="text-amber-600 font-extrabold text-sm">
              {filledCount}
            </b>
            <span>/ {totalCount}</span>
          </div>

          <Button
            type="button"
            data-testid="check-sequence-main-button"
            onClick={onCheckSequence}
            className="rounded-xl font-bold bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white shadow-md shadow-emerald-500/20 text-xs sm:text-sm px-4"
          >
            <CheckCircle2 className="w-4 h-4 mr-1.5" />
            Periksa
          </Button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
        <div
          data-testid="sequence-progress-bar"
          className="h-full bg-gradient-to-r from-blue-500 via-amber-500 to-emerald-500 transition-all duration-500 rounded-full"
          style={{ width: `${progressPct}%` }}
        />
      </div>

      {/* Phase Groups and Slots */}
      <div className="flex flex-col gap-5 pt-1">
        {phases.map((phase) => (
          <div
            key={phase.key}
            data-testid={`phase-group-${phase.key}`}
            className="flex flex-col rounded-xl overflow-hidden border border-slate-200 shadow-xs"
          >
            {/* Phase Header Banner */}
            <div
              className="flex items-center gap-2 px-4 py-2.5 text-white font-heading font-extrabold text-xs sm:text-sm uppercase tracking-wider"
              style={{
                backgroundColor: phase.color,
              }}
            >
              <span className="text-base">{phase.icon}</span>
              <span>FASE {phase.label}</span>
            </div>

            {/* Slots Container */}
            <div className="p-3 sm:p-4 bg-slate-50/70 flex flex-col gap-2.5">
              {phase.items.map((_, idx) => {
                const slotKey = `${phase.key}-${idx}`;
                const placedItemId = slotPlacements[slotKey];
                const placedItem = placedItemId ? itemsMap[placedItemId] : null;
                const status = placedItemId ? validationStatus[placedItemId] : null;
                const isDragOver = dragOverSlot === slotKey;

                return (
                  <div
                    key={slotKey}
                    data-testid={`sequence-slot-${slotKey}`}
                    onDragOver={(e) => handleDragOver(e, slotKey)}
                    onDragLeave={() => handleDragLeave(slotKey)}
                    onDrop={(e) => handleDrop(e, phase.key, idx, slotKey)}
                    onClick={() => onSlotClick(phase.key, idx)}
                    className="relative pl-6 transition-all"
                  >
                    {/* Vertical Connecting Spine Line */}
                    <div
                      className="absolute left-2.5 top-0 bottom-0 w-0.5 bg-slate-200"
                      style={{
                        bottom: idx === phase.items.length - 1 ? '50%' : '0',
                        top: idx === 0 ? '50%' : '0',
                      }}
                    />

                    {/* Step Anchor Pin Dot */}
                    <div
                      className={`absolute left-1 top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full border-2 border-white shadow-xs transition-transform ${
                        placedItem ? 'scale-110' : 'scale-90'
                      }`}
                      style={{
                        backgroundColor: phase.color,
                      }}
                    />

                    {/* Slot Body: Placed Puzzle Block or Dashed Dropzone */}
                    {placedItem ? (
                      <PuzzleBlock
                        item={placedItem}
                        color={phase.color}
                        isPlaced
                        isCorrect={status === 'correct'}
                        isWrong={status === 'wrong'}
                        isPlaying={playingItemId === placedItem.id}
                        onRemove={() => onRemoveBlock(placedItem.id)}
                      />
                    ) : (
                      <div
                        className={`min-h-[48px] rounded-xl border-2 border-dashed flex items-center justify-center p-3 text-xs font-bold transition-all cursor-pointer select-none ${
                          isDragOver || selectedCardId
                            ? 'border-blue-400 bg-blue-50/80 text-blue-600 scale-[1.01]'
                            : 'border-slate-200 bg-white text-slate-400 hover:border-slate-300'
                        }`}
                      >
                        {isDragOver ? (
                          <span className="text-blue-600">Lepaskan blok di sini</span>
                        ) : selectedCardId ? (
                          <span className="text-blue-500">Klik untuk menaruh blok terpilih</span>
                        ) : (
                          <span>Tarik atau klik blok ke sini (Langkah {idx + 1})</span>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
