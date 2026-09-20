import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ShieldCheck, Heart, Sparkles } from 'lucide-react';

interface AboutModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const AboutModal: React.FC<AboutModalProps> = ({ open, onOpenChange }) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        data-testid="about-modal-content"
        className="max-w-md rounded-2xl p-6 bg-white border border-slate-200 shadow-2xl"
      >
        <DialogHeader>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center text-xl font-bold">
              ℹ️
            </div>
            <div>
              <DialogTitle className="text-xl font-heading font-extrabold text-slate-800">
                Tentang Langkah Siaga v2
              </DialogTitle>
              <DialogDescription className="text-xs text-slate-500">
                Media Pembelajaran Mitigasi Bencana Interaktif
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="flex flex-col gap-3 my-2 text-xs text-slate-600 leading-relaxed">
          <p>
            <b>Langkah Siaga v2</b> dirancang sebagai platform visual interaktif berbasis pemrograman blok logika visual seperti Scratch untuk mengajarkan kesiapsiagaan menghadapi bencana alam di Indonesia secara ramah anak, siswa, dan keluarga.
          </p>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex flex-col gap-1.5">
            <div className="font-bold text-slate-800 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Standar Acuan Edukasi:
            </div>
            <ul className="list-disc list-inside space-y-0.5 text-[11px] text-slate-600">
              <li>Badan Nasional Penanggulangan Bencana (BNPB)</li>
              <li>Badan Meteorologi, Klimatologi, dan Geofisika (BMKG)</li>
              <li>Palang Merah Indonesia (PMI)</li>
            </ul>
          </div>

          <p className="text-[11px] text-slate-500">
            Dibuat untuk mencerdaskan literasi bencana dan membangun generasi tanggap, tangguh, dan selamat saat bencana terjadi.
          </p>
        </div>

        <div className="flex justify-end pt-2">
          <Button
            type="button"
            onClick={() => onOpenChange(false)}
            className="bg-slate-800 hover:bg-slate-900 text-white font-bold rounded-xl text-xs px-4"
          >
            Tutup
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
