import React, { useState } from 'react';
import { Logo, Globe, Layout, User, MessageCircle, Shield, Star, Award, } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HomepageNavItem {
  label: string;
  href: string;
  active?: boolean;
}

const navItems: HomepageNavItem[] = [
  { label: 'Skenario', href: '#' },
  { label: 'Panduan', href: '#' },
  { label: 'Kuis & Sertifikat', href: '#' },
  { label: 'Profil', href: '#' },
  { label: 'Masuk', href: '#' },
];

export default function Homepage({ onStartSimulation }: { onStartSimulation: () => void }) {
  return (
    <>
      {/* Header Homepage - menyambung dengan header simulator */}
      <header className="sticky top-0 z-50 flex items-center justify-between gap-4 px-4 sm:px-6 py-3 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
        {/* Brand Logo & Title */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#2F6FED] text-white flex items-center justify-center text-xl font-bold">
            LANGKAH
          </div>
          <div>
            <h1 className="font-heading font-extrabold text-base sm:text-xl tracking-tight bg-gradient-to-r from-[#2F6FED] via-[#1B4FBE] to-[#1B4FBE] bg-clip-text text-transparent">
              LANGKAH SIAGA
            </h1>
            <p className="text-[10px] sm:text-xs text-slate-500 font-semibold leading-none hidden sm:block">
              Media Pembelajaran Mitigasi Bencana Interaktif
            </p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex items-center gap-1.5 sm:gap-2">
          {navItems.map((item, index) => (
            <button
              key={index}
              type="button"
              className={`font-medium text-slate-600 hover:text-[#1A1E2E] transition-colors sm:inline-flex rounded-xl px-3 py-1.5 text-xs ${
                item.active ? 'bg-[#F0F3FA] text-[#2F6FED]' : ''
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="max-w-5xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Kiri: Headline & Tombol */}
            <div>
              <p className="text-sm sm:text-base font-medium text-slate-500 mb-4 uppercase tracking-wider">
                SIAP SIAGA BAGIAN PERTAMA
              </p>
              <h2 className="font-heading font-extrabold text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6">
                SIAP HADAPI BENCANA.<br />
                MULAI BELAJAR DI SINI.
              </h2>
              <p className="text-slate-600 text-lg sm:text-xl max-w-md line-height-relaxed mb-8">
                Langkah Siaga adalah media pembelajaran mitigasi bencana interaktif yang
                membimbing Anda melalui simulasi realista dalam menghadapi bencana alam.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 mb-6">
                <button
                  type="button"
                  className="primary-btn flex items-center gap-2"
                  onClick={() => {
                    console.log('Mulai Simulasi clicked');
                    onStartSimulation();
                  }}>
                  <span>Mulai Simulasi</span>
                </button>
                <button
                  type="button"
                  className="secondary-btn flex items-center gap-2">
                  <span>Lihat Skenario</span>
                </button>
              </div>
            </div>

            {/* Kanan: Ilustrasi karakter */}
            <div className="relative">
              <div className="absolute -top-6 -right-6 text-slate-200/30 text-4xl">
                <Star className="animate-spin w-12 h-12" />
              </div>
              <div className="bg-white rounded-2xl border border-slate-200 p-8 sm:p-10 shadow-lg shadow-slate-500/10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#2F6FED] to-[#1B4FBE] flex items-center justify-center text-white font-bold text-lg">
                    🏫
                  </div>
                  <div>
                    <h3 className="font-heading font-bold text-xl text-[#1A1E2E]">Langkah Siaga</h3>
                    <p className="text-slate-500 text-sm">Media Pembelajaran Mitigasi Bencana</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#F0F3FA] border border-slate-200 flex items-center justify-center text-[#2F6FED] font-semibold text-sm">
                      5
                    </div>
                    <div>
                      <p className="font-medium text-[#1A1E2E]">Skenario Tersedia</p>
                      <p className="text-slate-400 text-xs">Berbagai bencana</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#F0F3FA] border border-slate-200 flex items-center justify-center text-[#2F6FED] font-semibold text-sm">
                      ⏱️
                    </div>
                    <div>
                      <p className="font-medium text-[#1A1E2E]">Interaktif</p>
                      <p className="text-slate-400 text-xs">Seret dan klik</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#F0F3FA] border border-slate-200 flex items-center justify-center text-[#2F6FED] font-semibold text-sm">
                      ✅
                    </div>
                    <div>
                      <p className="font-medium text-[#1A1E2E]">Sertifikat</p>
                      <p className="text-slate-400 text-xs">Dapat setelah selesai</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section Skenario Menu */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="section-heading centered mb-12">
            <h2 className="font-heading font-extrabold text-3xl sm:text-4xl">
              Pilih Skenario Bencana
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {/* Skenario 1: Gempa di Rumah */}
            <a
              href="#"
              className="group block rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hover transition-all duration-300 hover:border-[#2F6FED] hover:shadow-lg"
            >
              <div className="relative h-64 flex flex-col justify-end p-5">
                <div className="absolute top-3 left-3 w-12 h-12 rounded-xl bg-gradient-to-br from-[#2F6FED] to-[#1B4FBE] flex items-center justify-center text-white text-sm font-bold]">
                  🏠
                </div>
                <h3 className="font-heading font-bold text-lg text-[#1A1E2E] group-hover:text-[#2F6FED] transition-colors">
                  Gempa di Rumah
                </h3>
                <p className="text-sm text-slate-400 mt-1">Level: Pemula</p>
              </div>
              <div className="absolute top-3 right-3 flex items-center gap-2 bg-[#F0F3FA] rounded-full px-2.5 py-0.5 text-xs">
                <span className="text-[#6B7185]">Pemula</span>
              </div>
            </a>

            {/* Skenario 2: Gempa di Sekolah */}
            <a
              href="#"
              className="group block rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hover transition-all duration-300 hover:border-[#2F6FED] hover:shadow-lg"
            >
              <div className="relative h-64 flex flex-col justify-end p-5">
                <div className="absolute top-3 left-3 w-12 h-12 rounded-xl bg-gradient-to-br from-[#2F6FED] to-[#1B4FBE] flex items-center justify-center text-white text-sm font-bold]">
                  🏫
                </div>
                <h3 className="font-heading font-bold text-lg text-[#1A1E2E] group-hover:text-[#2F6FED] transition-colors">
                  Gempa di Sekolah
                </h3>
                <p className="text-sm text-slate-400 mt-1">Level: Menengah</p>
              </div>
              <div className="absolute top-3 right-3 flex items-center gap-2 bg-[#F0F3FA] rounded-full px-2.5 py-0.5 text-xs">
                <span className="text-[#6B7185]">Menengah</span>
              </div>
            </a>

            {/* Skenario 3: Gempa di Pesisir & Tsunami */}
            <a
              href="#"
              className="group block rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hover transition-all duration-300 hover:border-[#2F6FED] hover:shadow-lg"
            >
              <div className="relative h-64 flex flex-col justify-end p-5">
                <div className="absolute top-3 left-3 w-12 h-12 rounded-xl bg-gradient-to-br from-[#2F6FED] to-[#1B4FBE] flex items-center justify-center text-white text-sm font-bold]">
                  🌊
                </div>
                <h3 className="font-heading font-bold text-lg text-[#1A1E2E] group-hover:text-[#2F6FED] transition-colors">
                  Gempa di Pesisir
                </h3>
                <p className="text-sm text-slate-400 mt-1">Level: Lanjutan</p>
              </div>
              <div className="absolute top-3 right-3 flex items-center gap-2 bg-[#F0F3FA] rounded-full px-2.5 py-0.5 text-xs">
                <span className="text-[#6B7185]">Lanjutan</span>
              </div>
            </a>

            {/* Skenario 4: Banjir Pemukiman */}
            <a
              href="#"
              className="group block rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hover transition-all duration-300 hover:border-[#2F6FED] hover:shadow-lg"
            >
              <div className="relative h-64 flex flex-col justify-end p-5">
                <div className="absolute top-3 left-3 w-12 h-12 rounded-xl bg-gradient-to-br from-[#2F6FED] to-[#1B4FBE] flex items-center justify-center text-white text-sm font-bold]">
                  🌧️
                </div>
                <h3 className="font-heading font-bold text-lg text-[#1A1E2E] group-hover:text-[#2F6FED] transition-colors">
                  Banjir Pemukiman
                </h3>
                <p className="text-sm text-slate-400 mt-1">Level: Menengah</p>
              </div>
              <div className="absolute top-3 right-3 flex items-center gap-2 bg-[#F0F3FA] rounded-full px-2.5 py-0.5 text-xs">
                <span className="text-[#6B7185]">Menengah</span>
              </div>
            </a>

            {/* Skenario 5: Kebakaran Gedung */}
            <a
              href="#"
              className="group block rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hover transition-all duration-300 hover:border-[#2F6FED] hover:shadow-lg"
            >
              <div className="relative h-64 flex flex-col justify-end p-5">
                <div className="absolute top-3 left-3 w-12 h-12 rounded-xl bg-gradient-to-br from-[#FF8A00] to-[#D66E00] flex items-center justify-center text-white text-sm font-bold]">
                  🔥
                </div>
                <h3 className="font-heading font-bold text-lg text-[#1A1E2E] group-hover:text-[#FF8A00] transition-colors">
                  Kebakaran Gedung
                </h3>
                <p className="text-sm text-slate-400 mt-1">Level: Lanjutan</p>
              </div>
              <div className="absolute top-3 right-3 flex items-center gap-2 bg-[#F0F3FA] rounded-full px-2.5 py-0.5 text-xs">
                <span className="text-[#6B7185]">Lanjutan</span>
              </div>
            </a>
          </div>
        </div>
      </section>

      {/* Section Fitur */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16 bg-white rounded-2xl border border-slate-200 shadow-sm">
        <div className="max-w-6xl mx-auto">
          <div className="section-heading centered mb-12">
            <h2 className="font-heading font-extrabold text-3xl sm:text-4xl">
              Fitur Utama
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {/* Fitur 1: Simulasi Interaktif */}
            <div className="group flex flex-col items-start rounded-xl border border-slate-200 p-5 transition-all duration-300 hover:border-[#2F6FED] hover:shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-[#E8F0FF] flex items-center justify-center mb-3">
                <svg className="w-6 h-6 text-[#2F6FED]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M12 2L2 7l10 5 10-5-10-5z" />
                  <path d="M2 7l10 5 10-5" />
                </svg>
              </div>
              <h4 className="font-heading font-bold text-sm text-[#1A1E2E] mb-1">Simulasi Interaktif</h4>
              <p className="text-slate-500 text-xs">Latih keterampilan mitigasi bencana dalam lingkungan virtual</p>
            </div>

            {/* Fitur 2: Susun Blok Tindakan */}
            <div className="group flex flex-col items-start rounded-xl border border-slate-200 p-5 transition-all duration-300 hover:border-[#2F6FED] hover:shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-[#E8F0FF] flex items-center justify-center mb-3">
                <svg className="w-6 h-6 text-[#2F6FED]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                  <path d="M9 12l2 2 4-4" />
                </svg>
              </div>
              <h4 className="font-heading font-bold text-sm text-[#1A1E2E] mb-1">Susun Blok Tindakan</h4>
              <p className="text-slate-500 text-xs">Seret blok ke slot urutan mitigasi yang benar</p>
            </div>

            {/* Fitur 3: Panduan Mitigasi */}
            <div className="group flex flex-col items-start rounded-xl border border-slate-200 p-5 transition-all duration-300 hover:border-[#2F6FED] hover:shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-[#E8F0FF] flex items-center justify-center mb-3">
                <svg className="w-6 h-6 text-[#2F6FED]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M12 2L2 7l10 5 10-5-10-5z" />
                  <path d="M2 7l10 5 10-5" />
                </svg>
              </div>
              <h4 className="font-heading font-bold text-sm text-[#1A1E2E] mb-1">Panduan Mitigasi</h4>
              <p className="text-slate-500 text-xs">Panduan langkah-langkah sebelum, selama, dan sesudah bencana</p>
            </div>

            {/* Fitur 4: Kuis & Sertifikat */}
            <div className="group flex flex-col items-start rounded-xl border border-slate-200 p-5 transition-all duration-300 hover:border-[#2F6FED] hover:shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-[#FFF4E0] flex items-center justify-center mb-3">
                <svg className="w-6 h-6 text-[#FF8A00]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M8 14s1.5 2 4 2 4-2 4-2" />
                  <line x1="9" y1="9" x2="9.01" y2="9" />
                  <line x1="15" y1="9" x2="15.01" y2="9" />
                  <line x1="8" y1="14" x2="8.01" y2="14" />
                  <line x1="12" y1="15" x2="12.01" y2="15" />
                </svg>
              </div>
              <h4 className="font-heading font-bold text-sm text-[#1A1E2E] mb-1">Kuis & Sertifikat</h4>
              <p className="text-slate-500 text-xs">Uji pengetahuan dan dapat sertifikat partisipasi</p>
            </div>
          </div>
        </div>
      </section>

      {/* Section Cara Bermain */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="section-heading centered mb-12">
            <h2 className="font-heading font-extrabold text-3xl sm:text-4xl">
              Cara Bermain
            </h2>
          </div>

          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#F0F3FA] border border-[#2F6FED] flex items-center justify-center flex-shrink-0">
                <span className="font-heading font-bold text-[#2F6FED]">01</span>
              </div>
              <div>
                <h4 className="font-heading font-bold text-[#1A1E2E]">Pilih Skenario</h4>
                <p className="text-slate-500 text-sm">Pilih salah satu dari 5 skenario bencana yang tersedia</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#F0F3FA] border border-[#2F6FED] flex items-center justify-center flex-shrink-0">
                <span className="font-heading font-bold text-[#2F6FED]">02</span>
              </div>
              <div>
                <h4 className="font-heading font-bold text-[#1A1E2E]">Susun Langkah</h4>
                <p className="text-slate-500 text-sm">Seret dan tempatkan blok tindakan ke urutan yang benar</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#F0F3FA] border border-[#E14B4B] flex items-center justify-center flex-shrink-0">
                <span className="font-heading font-bold text-[#E14B4B]">03</span>
              </div>
              <div>
                <h4 className="font-heading font-bold text-[#1A1E2E]">Periksa Jawaban</h4>
                <p className="text-slate-500 text-sm">Tombol Periksa untuk memvalidasi urutan mitigasi</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#F0F3FA] border border-[#17A868] flex items-center justify-center flex-shrink-0">
                <span className="font-heading font-bold text-[#17A868]">04</span>
              </div>
              <div>
                <h4 className="font-heading font-bold text-[#1A1E2E]">Jalankan Simulasi</h4>
                <p className="text-slate-500 text-sm">Jika urutan benar, jalankan simulasi animasi</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#FFF4E0] border border-[#FF8A00] flex items-center justify-center flex-shrink-0">
                <span className="font-heading font-bold text-[#FF8A00]">05</span>
              </div>
              <div>
                <h4 className="font-heading font-bold text-[#1A1E2E]">Dapatkan Hasil</h4>
                <p className="text-slate-500 text-sm">Dapatkan sertifikat dan kuis setelah simulasi</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Favorit / Progress Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16 bg-white rounded-2xl border border-slate-200 shadow-sm">
        <div className="max-w-6xl mx-auto">
          <div className="section-heading centered mb-12">
            <h2 className="font-heading font-extrabold text-3xl sm:text-4xl">
              Favorit Saya
            </h2>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {/* Favorit card 1 */}
            <div className="group relative rounded-2xl border border-slate-200 bg-[#F0F3FA] p-4 hover:border-[#2F6FED] transition-colors">
              <div className="absolute top-2 right-2 w-8 h-8 rounded-full bg-[#2F6FED] text-white flex items-center justify-center text-sm font-bold">🏠</div>
              <div>
                <p className="font-medium text-[#1A1E2E]">Gempa di Rumah</p>
                <p className="text-slate-500 text-xs">5 langkah mitigasi</p>
              </div>
            </div>

            {/* Favorit card 2 */}
            <div className="group relative rounded-2xl border border-slate-200 bg-[#F0F3FA] p-4 hover:border-[#2F6FED] transition-colors">
              <div className="absolute top-2 right-2 w-8 h-8 rounded-full bg-[#2F6FED] text-white flex items-center justify-center text-sm font-bold">📊</div>
              <div>
                <p className="font-medium text-[#1A1E2E]">Kuis Gempa di Rumah</p>
                <p className="text-slate-500 text-xs">Skor: 100%</p>
              </div>
            </div>

            {/* Favorit card 3 */}
            <div className="group relative rounded-2xl border border-slate-200 bg-[#F0F3FA] p-4 hover:border-[#2F6FED] transition-colors">
              <div className="absolute top-2 right-2 w-8 h-8 rounded-full bg-[#17A868] text-white flex items-center justify-center text-sm font-bold">✅</div>
              <div>
                <p className="font-medium text-[#1A1E2E]">Sertifikat</p>
                <p className="text-slate-500 text-xs">Telah didapat</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 py-8 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-5">
            {/* Kiri: Brand & Deskripsi */}
            <div>
              <div className="w-10 h-10 rounded-xl bg-[#2F6FED] text-white flex items-center justify-center text-xl font-bold mb-3">LANGKAH</div>
              <h4 className="font-heading font-bold text-lg text-[#1A1E2E] mb-2">LANGKAH SIAGA</h4>
              <p className="text-slate-500 text-sm">
                Media Pembelajaran Mitigasi Bencana Interaktif
              </p>
            </div>

            {/* Nav links */}
            <div>
              <h5 className="font-heading font-semibold text-sm text-[#1A1E2E] mb-3">Navigasi</h5>
              <ul className="space-y-2 text-slate-600 text-sm">
                <li><a href="#" className="hover:text-[#2F6FED] transition-colors">Skenario</a></li>
                <li><a href="#" className="hover:text-[#2F6FED] transition-colors">Panduan</a></li>
                <li><a href="#" className="hover:text-[#2F6FED] transition-colors">Kuis & Sertifikat</a></li>
                <li><a href="#" className="hover:text-[#2F6FED] transition-colors">Profil</a></li>
              </ul>
            </div>

            {/* Fitur links */}
            <div>
              <h5 className="font-heading font-semibold text-sm text-[#1A1E2E] mb-3">Fitur</h5>
              <ul className="space-y-2 text-slate-600 text-sm">
                <li><a href="#" className="hover:text-[#2F6FED] transition-colors">Simulasi Interaktif</a></li>
                <li><a href="#" className="hover:text-[#2F6FED] transition-colors">Panduan Mitigasi</a></li>
                <li><a href="#" className="hover:text-[#2F6FED] transition-colors">Kuis & Sertifikat</a></li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h5 className="font-heading font-semibold text-sm text-[#1A1E2E] mb-3">Contact</h5>
              <p className="text-slate-600 text-xs">
                <span className="font-medium">Email:</span> support@langkahsiaga.example
              </p>
              <p className="text-slate-600 text-xs mt-1">
                <span className="font-medium">Phone:</span> +62 812-3456-7890
              </p>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-slate-200 text-center">
            <p className="text-slate-500 text-xs">
              2024 LANGKAH SIAGA — Media Pembelajaran Mitigasi Bencana Interaktif
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}