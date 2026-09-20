import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import type { QuizResult } from '@/types/scenario';
import { Printer, X } from 'lucide-react';

interface CertificateModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  result: QuizResult | null;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({
  open,
  onOpenChange,
  result,
}) => {
  if (!result) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        data-testid="certificate-modal-content"
        className="max-w-2xl rounded-2xl p-6 bg-white border border-slate-200 shadow-2xl max-h-[90vh] overflow-y-auto"
      >
        <DialogHeader className="sr-only">
          <DialogTitle>Sertifikat Tanggap Bencana</DialogTitle>
        </DialogHeader>

        {/* Certificate Canvas */}
        <div
          id="printable-certificate"
          className="relative p-6 sm:p-8 rounded-2xl border-4 border-amber-500/80 bg-gradient-to-b from-[#FFFDF9] via-[#FAF6EE] to-[#FFFDF9] text-center shadow-lg overflow-hidden flex flex-col items-center"
        >
          {/* Decorative Corner Ornaments */}
          <div className="absolute top-2 left-2 text-amber-500/40 text-xl font-serif">
            ✦
          </div>
          <div className="absolute top-2 right-2 text-amber-500/40 text-xl font-serif">
            ✦
          </div>
          <div className="absolute bottom-2 left-2 text-amber-500/40 text-xl font-serif">
            ✦
          </div>
          <div className="absolute bottom-2 right-2 text-amber-500/40 text-xl font-serif">
            ✦
          </div>

          {/* Ribbon Header */}
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 text-white flex items-center justify-center text-2xl shadow-md shadow-amber-500/30 mb-3">
            🏆
          </div>

          <span className="text-[10px] tracking-widest font-extrabold uppercase text-amber-700 bg-amber-100 px-3 py-1 rounded-full mb-1">
            SERTIFIKAT KELULUSAN
          </span>

          <h2 className="text-xl sm:text-2xl font-heading font-extrabold text-slate-800 tracking-tight">
            Kesiapsiagaan & Tanggap Bencana
          </h2>

          <p className="text-xs text-slate-500 mt-2">Diberikan dengan bangga kepada:</p>

          <div className="my-3 py-1.5 px-6 border-b-2 border-slate-800 inline-block min-w-[240px]">
            <h3 className="text-lg sm:text-2xl font-heading font-extrabold text-blue-700">
              {result.user_name}
            </h3>
          </div>

          <p className="text-xs text-slate-600 max-w-md leading-relaxed my-2">
            Telah berhasil menyelesaikan simulasi urutan mitigasi bencana interaktif dan lulus ujian pemahaman dengan skor kelulusan{' '}
            <b className="text-slate-800">{result.percentage}%</b> pada platform <b>Langkah Siaga v2</b>.
          </p>

          <div className="flex items-center justify-between w-full max-w-sm mt-4 pt-3 border-t border-slate-200/80 text-[11px] text-slate-500">
            <div className="text-left">
              <span className="block font-semibold">ID Sertifikat:</span>
              <span className="font-mono text-slate-700 font-bold">
                {result.certificate_id || 'CERT-LS-OFFICIAL'}
              </span>
            </div>
            <div className="text-right">
              <span className="block font-semibold">Tanggal Terbit:</span>
              <span className="text-slate-700 font-bold">{result.date_issued}</span>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center justify-between pt-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onOpenChange(false)}
            className="rounded-xl text-xs font-semibold"
          >
            <X className="w-3.5 h-3.5 mr-1" />
            Tutup
          </Button>

          <Button
            type="button"
            data-testid="print-certificate-button"
            size="sm"
            onClick={handlePrint}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs px-4"
          >
            <Printer className="w-3.5 h-3.5 mr-1.5" />
            Cetak / Simpan PDF
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
