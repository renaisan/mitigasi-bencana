import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ShieldAlert, Waves, CloudRain, Flame } from 'lucide-react';

interface GuideModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const GuideModal: React.FC<GuideModalProps> = ({ open, onOpenChange }) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        data-testid="guide-modal-content"
        className="max-w-2xl rounded-2xl p-6 bg-white border border-slate-200 shadow-2xl max-h-[85vh] overflow-y-auto"
      >
        <DialogHeader>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center text-xl">
              ❓
            </div>
            <div>
              <DialogTitle className="text-xl font-heading font-extrabold text-slate-800">
                Panduan Edukasi Mitigasi Bencana
              </DialogTitle>
              <DialogDescription className="text-xs text-slate-500">
                Standar kesiapsiagaan keselamatan berdasarkan BNPB dan BMKG
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <Tabs defaultValue="gempa" className="mt-3">
          <TabsList className="grid grid-cols-4 bg-slate-100 p-1 rounded-xl">
            <TabsTrigger value="gempa" className="rounded-lg font-bold text-xs">
              🏠 Gempa
            </TabsTrigger>
            <TabsTrigger value="tsunami" className="rounded-lg font-bold text-xs">
              🌊 Tsunami
            </TabsTrigger>
            <TabsTrigger value="banjir" className="rounded-lg font-bold text-xs">
              🌧️ Banjir
            </TabsTrigger>
            <TabsTrigger value="kebakaran" className="rounded-lg font-bold text-xs">
              🔥 Kebakaran
            </TabsTrigger>
          </TabsList>

          {/* TAB 1: GEMPA */}
          <TabsContent value="gempa" className="flex flex-col gap-3 pt-3">
            <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-100">
              <h4 className="font-bold text-sm text-blue-900 flex items-center gap-2">
                <span>🛡️</span> Prinsip Utama: Drop, Cover, Hold On!
              </h4>
              <p className="text-xs text-blue-800 mt-1 leading-relaxed">
                Ketika guncangan terjadi, jangan langsung lari ke pintu. Mayoritas korban cedera disebabkan tertimpa pecahan kaca, lampu plafon, atau lemari yang roboh.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <b className="text-blue-600 block mb-1">1. Drop (Merunduk)</b>
                Merendahkan tubuh ke lantai untuk menjaga keseimbangan dan tidak terpental.
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <b className="text-rose-600 block mb-1">2. Cover (Lindungi)</b>
                Lindungi kepala dan leher di bawah meja kokoh atau lindungi dengan bantal/tas.
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <b className="text-emerald-600 block mb-1">3. Hold On (Pegang)</b>
                Berpegangan erat pada kaki meja hingga guncangan gempa selesai.
              </div>
            </div>
          </TabsContent>

          {/* TAB 2: TSUNAMI */}
          <TabsContent value="tsunami" className="flex flex-col gap-3 pt-3">
            <div className="p-3.5 rounded-xl bg-cyan-50 border border-cyan-100">
              <h4 className="font-bold text-sm text-cyan-900 flex items-center gap-2">
                <span>🌊</span> Rumus 20-20-20
              </h4>
              <p className="text-xs text-cyan-800 mt-1 leading-relaxed">
                Jika merasakan <b>gempa selama 20 detik</b> atau lebih di tepi pantai, kita memiliki waktu sekitar <b>20 menit</b> untuk lari menuju <b>ketinggian minimal 20 meter</b> (bukit atau bangunan bertingkat kokoh).
              </p>
            </div>
            <div className="p-3 bg-rose-50 rounded-xl border border-rose-200 text-xs text-rose-800">
              <b>⚠️ Perhatian Khusus:</b> Jika air laut surut tiba-tiba hingga dasar pantai terlihat, DILARANG mendekat untuk mengambil ikan. Itu pertanda gelombang raksasa akan datang dalam hitungan menit!
            </div>
          </TabsContent>

          {/* TAB 3: BANJIR */}
          <TabsContent value="banjir" className="flex flex-col gap-3 pt-3">
            <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-100">
              <h4 className="font-bold text-sm text-amber-900 flex items-center gap-2">
                <span>⚡</span> Bahaya Listrik & Arus Deras
              </h4>
              <p className="text-xs text-amber-800 mt-1 leading-relaxed">
                Matikan sakelar MCB listrik utama segera sebelum air banjir merendam stopkontak. Jangan biarkan anak-anak bermain di air banjir karena arus bawah dan bahaya sengatan listrik sangat tinggi.
              </p>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700">
              <b>📦 Tas Siaga Bencana:</b> Siapkan dokumen penting (ijazah, sertifikat) dalam kantong plastik kedap air, senter cadangan, obat-obatan, dan pakaian ganti.
            </div>
          </TabsContent>

          {/* TAB 4: KEBAKARAN */}
          <TabsContent value="kebakaran" className="flex flex-col gap-3 pt-3">
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-100">
              <h4 className="font-bold text-sm text-rose-900 flex items-center gap-2">
                <span>🔥</span> Merayap di Bawah Asap & Jangan Gunakan Lift!
              </h4>
              <p className="text-xs text-rose-800 mt-1 leading-relaxed">
                Asap panas beracun naik ke langit-langit. Merayaplah setinggi 30 cm dari lantai menggunakan kain basah menutupi hidung dan mulut. Gunakan selalu <b>tangga darurat</b> menuju pintu keluar.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
