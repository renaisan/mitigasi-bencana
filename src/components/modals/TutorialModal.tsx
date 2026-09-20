import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Lightbulb, MousePointerClick, CheckCircle, Play } from 'lucide-react';

interface TutorialModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const TutorialModal: React.FC<TutorialModalProps> = ({ open, onOpenChange }) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        data-testid="tutorial-modal-content"
        className="max-w-lg rounded-2xl p-6 bg-white border border-slate-200 shadow-2xl"
      >
        <DialogHeader>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center text-xl">
              📘
            </div>
            <div>
              <DialogTitle className="text-xl font-heading font-extrabold text-slate-800">
                Cara Bermain Langkah Siaga
              </DialogTitle>
              <DialogDescription className="text-xs text-slate-500">
                Panduan singkat menyusun urutan mitigasi bencana interaktif
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="flex flex-col gap-3.5 my-2">
          {/* Step 1 */}
          <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
            <div className="w-7 h-7 rounded-lg bg-blue-500 text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
              1
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-slate-800">Pilih & Pasang Blok</h4>
              <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                <b>Seret (drag & drop)</b> atau <b>klik blok puzzle</b> pada palet sebelah kiri, lalu klik slot tujuan pada fase waktu yang sesuai.
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
            <div className="w-7 h-7 rounded-lg bg-amber-500 text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
              2
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-slate-800">Perhatikan 3 Fase Bencana</h4>
              <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                <span className="text-blue-600 font-semibold">Pra-Bencana (Biru)</span>: Kesiapsiagaan, <span className="text-rose-600 font-semibold">Darurat (Merah)</span>: Saat bencana terjadi, dan <span className="text-emerald-600 font-semibold">Pemulihan (Hijau)</span>: Pasca bencana.
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
            <div className="w-7 h-7 rounded-lg bg-emerald-500 text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
              3
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-slate-800">Periksa & Jalankan Simulasi</h4>
              <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                Klik tombol <b>✓ Periksa</b> untuk memvalidasi urutan. Bila sudah benar, tekan tombol <b>▶ Simulasi</b> untuk menyaksikan animasi karakter dan efek bencana!
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <Button
            type="button"
            data-testid="tutorial-close-button"
            onClick={() => onOpenChange(false)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl px-5"
          >
            Mengerti & Mulai!
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
