import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiGet, apiPost } from '@/lib/api';
import type {
  DisasterScenario,
  DisasterPhase,
  MitigationItem,
  MitigationPose,
  MitigationMood,
  ValidationResponse,
  QuizQuestion,
  QuizResult,
} from '@/types/scenario';
import { soundEngine } from '@/lib/audio';
import { triggerConfetti } from '@/lib/confetti';
import { PuzzlePalette } from '@/components/puzzle/PuzzlePalette';
import { CanvasSequence } from '@/components/puzzle/CanvasSequence';
import { SimulationStage } from '@/components/stage/SimulationStage';
import { TutorialModal } from '@/components/modals/TutorialModal';
import { GuideModal } from '@/components/modals/GuideModal';
import { QuizModal } from '@/components/modals/QuizModal';
import { CertificateModal } from '@/components/modals/CertificateModal';
import { AboutModal } from '@/components/modals/AboutModal';
import { MascotGuide } from '@/components/mascot/MascotGuide';
import {
  Volume2,
  VolumeX,
  BookOpen,
  HelpCircle,
  RotateCcw,
  Info,
  GraduationCap,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Award,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Homepage } from '@/pages/Homepage';

// Comprehensive local default scenarios to ensure static/offline resilience
const DEFAULT_SCENARIOS: DisasterScenario[] = [
  {
    id: 'rumah',
    title: 'Gempa di Rumah',
    icon: '🏠',
    scene: 'rumah',
    difficulty: 'Pemula',
    description: "Pelajari langkah perlindungan 'Drop, Cover, Hold On' saat guncangan hebat terjadi di rumah.",
    phases: [
      {
        key: 'sebelum',
        label: 'Pra-Bencana',
        color: '#2F6FED',
        tint: '#E8F0FF',
        icon: '🧭',
        items: [
          {
            id: 'r1',
            text: 'Kenali jalur keluar tercepat dan titik kumpul keluarga',
            note: 'Kesiapan jalur evakuasi dibangun sebelum gempa terjadi agar tidak panik.',
            pose: 'idle',
            mood: 'normal',
            moveX: 0,
            moveY: 0,
          },
          {
            id: 'r2',
            text: 'Amankan lemari dan rak berat ke dinding',
            note: 'Mengurangi risiko benda berat roboh dan menimpa penghuni saat guncangan.',
            pose: 'prepare',
            mood: 'normal',
            moveX: 15,
            moveY: 0,
          },
        ],
      },
      {
        key: 'saat',
        label: 'Darurat',
        color: '#E14B4B',
        tint: '#FDEAEA',
        icon: '⚡',
        items: [
          {
            id: 'r3',
            text: 'Merunduk ke tangan dan lutut (Drop)',
            note: 'Posisi rendah menjaga keseimbangan agar tidak mudah terjatuh saat guncangan.',
            pose: 'duck',
            mood: 'scared',
            quake: true,
            moveX: 0,
            moveY: 0,
          },
          {
            id: 'r4',
            text: 'Lindungi kepala dan leher di bawah meja kokoh (Cover)',
            note: 'Kepala dan leher terlindungi aman dari pecahan kaca atau plafon jatuh.',
            pose: 'cover',
            mood: 'scared',
            quake: true,
            moveX: -20,
            moveY: 0,
          },
          {
            id: 'r5',
            text: 'Berpegangan pada kaki meja sampai guncangan berhenti (Hold On)',
            note: 'Menjaga posisi pelindung tetap stabil sampai gempa utama benar-benar reda.',
            pose: 'hold',
            mood: 'scared',
            quake: true,
            moveX: -20,
            moveY: 0,
          },
        ],
      },
      {
        key: 'sesudah',
        label: 'Pemulihan',
        color: '#17A868',
        tint: '#E2F8EE',
        icon: '✅',
        items: [
          {
            id: 'r6',
            text: 'Periksa diri dan anggota keluarga dari luka',
            note: 'Pertolongan pertama diberikan segera pada cedera ringan sebelum bergerak keluar.',
            pose: 'alert',
            mood: 'normal',
            moveX: 0,
            moveY: 0,
          },
          {
            id: 'r7',
            text: 'Keluar lewat jalur evakuasi, matikan gas & kompor',
            note: 'Mencegah bahaya korsleting dan kebakaran ikutan pasca gempa bumi.',
            pose: 'walk',
            mood: 'normal',
            moveX: -38,
            moveY: 2,
          },
          {
            id: 'r8',
            text: 'Menuju titik kumpul di lapangan terbuka di luar bangunan',
            note: 'Jauhkan diri dari kabel listrik tegangan tinggi, tiang rapuh, dan dinding retak.',
            pose: 'gather',
            mood: 'normal',
            moveX: -74,
            moveY: -10,
          },
        ],
      },
    ],
  },
  {
    id: 'sekolah',
    title: 'Gempa di Sekolah',
    icon: '🏫',
    scene: 'sekolah',
    difficulty: 'Menengah',
    description: 'Evakuasi tertib dari ruang kelas sekolah menuju lapangan terbuka tanpa desak-desakan.',
    phases: [
      {
        key: 'sebelum',
        label: 'Pra-Bencana',
        color: '#2F6FED',
        tint: '#E8F0FF',
        icon: '🧭',
        items: [
          {
            id: 's1',
            text: 'Hafalkan denah jalur evakuasi dari ruang kelas',
            note: 'Semua siswa wajib mengetahui pintu darurat dan rute terdekat ke lapangan.',
            pose: 'idle',
            mood: 'normal',
            moveX: 0,
            moveY: 0,
          },
          {
            id: 's2',
            text: 'Ikuti simulasi gempa sekolah secara rutin dan tertib',
            note: 'Latihan berkala membentuk memori otot dan respon cepat tanpa kepanikan liar.',
            pose: 'prepare',
            mood: 'normal',
            moveX: 10,
            moveY: 0,
          },
        ],
      },
      {
        key: 'saat',
        label: 'Darurat',
        color: '#E14B4B',
        tint: '#FDEAEA',
        icon: '⚡',
        items: [
          {
            id: 's3',
            text: 'Merunduk dan berlindung di bawah meja kelas',
            note: 'Meja kayu/besi kokoh kelas menahan pecahan lampu neon dan serpihan plafon.',
            pose: 'duck',
            mood: 'scared',
            quake: true,
            moveX: -15,
            moveY: 0,
          },
          {
            id: 's4',
            text: 'Lindungi kepala dengan tas ransel atau buku tebal',
            note: 'Tas sekolah berfungsi sebagai perisai tambahan untuk tempurung kepala.',
            pose: 'cover',
            mood: 'scared',
            quake: true,
            moveX: -15,
            moveY: 0,
          },
          {
            id: 's5',
            text: 'Tetap di tempat dan jangan berhamburan ke pintu',
            note: 'Pintu keluar adalah titik paling rawan terjadinya desak-desakan fatal.',
            pose: 'hold',
            mood: 'scared',
            quake: true,
            moveX: -15,
            moveY: 0,
          },
        ],
      },
      {
        key: 'sesudah',
        label: 'Pemulihan',
        color: '#17A868',
        tint: '#E2F8EE',
        icon: '✅',
        items: [
          {
            id: 's6',
            text: 'Baris rapi keluar menuju lapangan terbuka sekolah',
            note: 'Berjalan cepat tetapi tidak berlari atau saling dorong di koridor dan tangga.',
            pose: 'walk',
            mood: 'normal',
            moveX: 58,
            moveY: 18,
          },
          {
            id: 's7',
            text: 'Tunggu presensi dan instruksi keselamatan dari guru',
            note: 'Guru dan tim PMR/Pramuka memastikan seluruh siswa terdata lengkap di titik kumpul.',
            pose: 'gather',
            mood: 'normal',
            moveX: 58,
            moveY: 18,
          },
          {
            id: 's8',
            text: 'Jangan kembali ke kelas sebelum dinyatakan aman oleh otoritas',
            note: 'Bangunan sekolah berpotensi mengalami retak struktur berbahaya saat gempa susulan.',
            pose: 'alert',
            mood: 'normal',
            moveX: 58,
            moveY: 18,
          },
        ],
      },
    ],
  },
  {
    id: 'pesisir',
    title: 'Gempa di Pesisir & Tsunami',
    icon: '🌊',
    scene: 'pesisir',
    difficulty: 'Lanjutan',
    description: 'Kenali rumus 20-20-20: Gempa 20 detik, 20 menit evakuasi, menuju ketinggian 20 meter.',
    phases: [
      {
        key: 'sebelum',
        label: 'Pra-Bencana',
        color: '#2F6FED',
        tint: '#E8F0FF',
        icon: '🧭',
        items: [
          {
            id: 'p1',
            text: 'Kenali jalur evakuasi dan rambu tsunami menuju bukit/TES',
            note: 'Tempat Evakuasi Sementara (TES) di perbukitan harus diketahui jalurnya sebelumnya.',
            pose: 'idle',
            mood: 'normal',
            moveX: 0,
            moveY: 0,
          },
          {
            id: 'p2',
            text: 'Pelajari rumus 20-20-20 dan tanda alami tsunami pesisir',
            note: 'Gempa 20 detik atau lebih di tepi pantai adalah peringatan awal tsunami mandiri.',
            pose: 'alert',
            mood: 'normal',
            moveX: 0,
            moveY: 0,
          },
        ],
      },
      {
        key: 'saat',
        label: 'Darurat',
        color: '#E14B4B',
        tint: '#FDEAEA',
        icon: '⚡',
        items: [
          {
            id: 'p3',
            text: 'Merunduk di area terbuka, jauhi tebing pantai dan pohon kelapa',
            note: 'Mencegah tertimpa pohon tumbang atau tebing pasir yang longsor saat guncangan.',
            pose: 'cover',
            mood: 'scared',
            quake: true,
            moveX: 0,
            moveY: 0,
          },
          {
            id: 'p4',
            text: 'Waspadai air laut surut tiba-tiba dan bau belerang/garam menyengat',
            note: 'Surutnya air laut secara drastis merupakan pertanda gelombang tsunami sedang mengumpul.',
            pose: 'alert',
            mood: 'scared',
            moveX: 0,
            moveY: 0,
          },
        ],
      },
      {
        key: 'sesudah',
        label: 'Pemulihan',
        color: '#17A868',
        tint: '#E2F8EE',
        icon: '✅',
        items: [
          {
            id: 'p5',
            text: 'Segera berlari ke tempat tinggi (ketinggian >20 meter) dengan jalan kaki',
            note: 'Gunakan jalan kaki/sepeda karena jalan raya sering macet total oleh kendaraan bermotor.',
            pose: 'climb',
            mood: 'scared',
            tsunami: true,
            moveX: 66,
            moveY: -72,
          },
          {
            id: 'p6',
            text: 'Dilarang keras turun ke pantai untuk menonton gelombang atau mengambil ikan',
            note: 'Banyak korban tsunami terjadi karena warga penasaran melihat dasar laut yang mengering.',
            pose: 'alert',
            mood: 'scared',
            moveX: 66,
            moveY: -72,
          },
          {
            id: 'p7',
            text: 'Tetap berada di bukit evakuasi sampai BMKG mencabut peringatan tsunami',
            note: 'Gelombang tsunami datang berulang kali dalam beberapa jam, bukan hanya satu hempasan.',
            pose: 'gather',
            mood: 'normal',
            moveX: 66,
            moveY: -80,
          },
        ],
      },
    ],
  },
  {
    id: 'banjir',
    title: 'Banjir Pemukiman',
    icon: '🌧️',
    scene: 'banjir',
    difficulty: 'Menengah',
    description: 'Langkah cepat menghadapi banjir: amankan kelistrikan, dokumen penting, dan evakuasi mandiri.',
    phases: [
      {
        key: 'sebelum',
        label: 'Pra-Bencana',
        color: '#2F6FED',
        tint: '#E8F0FF',
        icon: '🧭',
        items: [
          {
            id: 'b1',
            text: 'Simpan surat berharga dan ijazah dalam kantong kedap air',
            note: 'Melindungi aset dokumen penting dari kerusakan rendaman air kotor.',
            pose: 'prepare',
            mood: 'normal',
            moveX: 0,
            moveY: 0,
          },
          {
            id: 'b2',
            text: 'Ketahui posisi sakelar MCB listrik utama dan posko evakuasi',
            note: 'Memudahkan pemutusan arus seketika sebelum genangan air masuk ke rumah.',
            pose: 'idle',
            mood: 'normal',
            moveX: 10,
            moveY: 0,
          },
        ],
      },
      {
        key: 'saat',
        label: 'Darurat',
        color: '#E14B4B',
        tint: '#FDEAEA',
        icon: '⚡',
        items: [
          {
            id: 'b3',
            text: 'Segera matikan MCB meteran listrik dan tutup kran gas',
            note: 'Mencegah sengatan arus listrik mematikan (electrocution) di air banjir.',
            pose: 'prepare',
            mood: 'scared',
            flood: true,
            moveX: 15,
            moveY: 0,
          },
          {
            id: 'b4',
            text: 'Pindahkan lansia, anak-anak, dan tas siaga ke lantai atas',
            note: 'Prioritaskan kelompok rentan ke tempat yang lebih tinggi dan kering.',
            pose: 'climb',
            mood: 'scared',
            flood: true,
            moveX: 30,
            moveY: -25,
          },
          {
            id: 'b5',
            text: 'Jangan berenang atau berjalan melintasi arus banjir yang deras',
            note: 'Arus setinggi 15 cm sudah mampu merobohkan orang dewasa dan menyembunyikan lubang got.',
            pose: 'alert',
            mood: 'scared',
            flood: true,
            moveX: 30,
            moveY: -25,
          },
        ],
      },
      {
        key: 'sesudah',
        label: 'Pemulihan',
        color: '#17A868',
        tint: '#E2F8EE',
        icon: '✅',
        items: [
          {
            id: 'b6',
            text: 'Evakuasi menggunakan perahu karet SAR ke posko pengungsian',
            note: 'Tim evakuasi resmi memiliki perlengkapan pelampung dan jalur aman melintasi genangan.',
            pose: 'walk',
            mood: 'normal',
            moveX: -30,
            moveY: 0,
          },
          {
            id: 'b7',
            text: 'Cek instalasi listrik oleh teknisi berwenang sebelum dinyalakan kembali',
            note: 'Stopkontak basah berlumpur berisiko korsleting fatal saat daya listrik dihidupkan.',
            pose: 'gather',
            mood: 'normal',
            moveX: -60,
            moveY: 0,
          },
        ],
      },
    ],
  },
  {
    id: 'kebakaran',
    title: 'Kebakaran Gedung Bertingkat',
    icon: '🔥',
    scene: 'kebakaran',
    difficulty: 'Lanjutan',
    description: 'Menyelamatkan diri dari asap beracun di gedung bertingkat tanpa menggunakan lift.',
    phases: [
      {
        key: 'sebelum',
        label: 'Pra-Bencana',
        color: '#2F6FED',
        tint: '#E8F0FF',
        icon: '🧭',
        items: [
          {
            id: 'k1',
            text: 'Perhatikan lokasi pintu tangga darurat (Exit) dan tombol alarm',
            note: 'Setiap lantai gedung memiliki jalur darurat yang tahan api dan bebas asap.',
            pose: 'idle',
            mood: 'normal',
            moveX: 0,
            moveY: 0,
          },
          {
            id: 'k2',
            text: 'Ketahui cara dasar penggunaan alat pemadam api ringan (APAR)',
            note: 'Rumus PASS: Tarik Pin, Arahkan Nozzle, Remas Tuas, Ratakan Sapuan.',
            pose: 'prepare',
            mood: 'normal',
            moveX: 10,
            moveY: 0,
          },
        ],
      },
      {
        key: 'saat',
        label: 'Darurat',
        color: '#E14B4B',
        tint: '#FDEAEA',
        icon: '⚡',
        items: [
          {
            id: 'k3',
            text: 'Bunyikan tombol alarm kebakaran terdekat dan teriakkan bahaya',
            note: 'Memberi peringatan dini kepada seluruh penghuni gedung agar segera evakuasi.',
            pose: 'alert',
            mood: 'scared',
            fire: true,
            moveX: 15,
            moveY: 0,
          },
          {
            id: 'k4',
            text: 'Merayap rendah di bawah asap tebal dengan kain basah menutupi hidung',
            note: 'Udara bersih kaya oksigen berada 30-60 cm dari lantai; asap beracun naik ke atas.',
            pose: 'duck',
            mood: 'scared',
            fire: true,
            moveX: -25,
            moveY: 10,
          },
          {
            id: 'k5',
            text: 'Gunakan tangga darurat, JANGAN sekali-kali menggunakan lift / elevator',
            note: 'Lift dapat macet seketika akibat kabel terbakar atau pemutusan daya listrik darurat.',
            pose: 'walk',
            mood: 'scared',
            fire: true,
            moveX: -50,
            moveY: 15,
          },
        ],
      },
      {
        key: 'sesudah',
        label: 'Pemulihan',
        color: '#17A868',
        tint: '#E2F8EE',
        icon: '✅',
        items: [
          {
            id: 'k6',
            text: 'Menuju titik kumpul luar gedung dan melapor ke petugas keselamatan',
            note: 'Memastikan data headcount penghuni lantai telah dievakuasi lengkap.',
            pose: 'gather',
            mood: 'normal',
            moveX: -70,
            moveY: 0,
          },
          {
            id: 'k7',
            text: 'Beri jalan bebas bagi mobil pemadam kebakaran dan tim paramedis',
            note: 'Akses hidran dan area manuver armada pemadam tidak boleh terhalang warga.',
            pose: 'alert',
            mood: 'normal',
            moveX: -80,
            moveY: 0,
          },
        ],
      },
    ],
  },
];

export default function Home({ onBackToHomepage }: { onBackToHomepage?: () => void }) {
  // Query backend scenarios with fallback
  const { data: serverScenarios } = useQuery<DisasterScenario[]>({
    queryKey: ['scenarios'],
    queryFn: () => apiGet<DisasterScenario[]>('/scenarios'),
    staleTime: 60000,
  });

  const scenarios = serverScenarios && serverScenarios.length > 0 ? serverScenarios : DEFAULT_SCENARIOS;

  // Selected scenario state
  const [selectedScenarioId, setSelectedScenarioId] = useState<string>('rumah');
  const currentScenario = useMemo(() => {
    return scenarios.find((s) => s.id === selectedScenarioId) || scenarios[0] || DEFAULT_SCENARIOS[0];
  }, [scenarios, selectedScenarioId]);

  // Items lookup map with phase colors
  const itemsMap = useMemo(() => {
    const map: Record<string, MitigationItem & { color: string }> = {};
    currentScenario.phases.forEach((p) => {
      p.items.forEach((it) => {
        map[it.id] = { ...it, color: p.color };
      });
    });
    return map;
  }, [currentScenario]);

  // Total steps in current scenario
  const allItemsList = useMemo(() => {
    return currentScenario.phases.flatMap((p) => p.items);
  }, [currentScenario]);

  const totalStepsCount = allItemsList.length;

  // Slot placements: slotKey (`${phaseKey}-${slotIndex}`) -> itemId
  const [slotPlacements, setSlotPlacements] = useState<Record<string, string | null>>({});
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);

  // Validation state
  const [validationResponse, setValidationResponse] = useState<ValidationResponse | null>(null);
  const [validationStatus, setValidationStatus] = useState<Record<string, 'correct' | 'wrong' | null>>({});

  // Simulation playback state
  const [isSimulating, setIsSimulating] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [simStepIndex, setSimStepIndex] = useState(-1);
  const [simSpeed, setSimSpeed] = useState(1);
  const [showPhaseOverlay, setShowPhaseOverlay] = useState(false);
  const [overlayPhase, setOverlayPhase] = useState<DisasterPhase | null>(null);
  const simCancelRef = useRef(false);

  // Stage character pose and effects
  const [stagePose, setStagePose] = useState<MitigationPose>('idle');
  const [stageMood, setStageMood] = useState<MitigationMood>('normal');
  const [stageMoveX, setStageMoveX] = useState(0);
  const [stageMoveY, setStageMoveY] = useState(0);
  const [stageQuake, setStageQuake] = useState(false);
  const [stageTsunami, setStageTsunami] = useState(false);
  const [stageFlood, setStageFlood] = useState(false);
  const [stageFire, setStageFire] = useState(false);
  const [stageCaption, setStageCaption] = useState(
    'Susun blok puzzle dan tekan Periksa untuk menjalankan simulasi.'
  );

  // Mascot guidance message
  const [mascotMessage, setMascotMessage] = useState(
    'Halo Sahabat Siaga! Seret atau klik blok puzzle untuk menyusun urutan mitigasi yang benar.'
  );

  // Modals state
  const [showTutorial, setShowTutorial] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);
  const [showCertificate, setShowCertificate] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const [certificateData, setCertificateData] = useState<QuizResult | null>(null);
  const [isMuted, setIsMuted] = useState(false);

  // Reset state when changing scenario
  useEffect(() => {
    setSlotPlacements({});
    setSelectedCardId(null);
    setValidationResponse(null);
    setValidationStatus({});
    setIsSimulating(false);
    setIsCompleted(false);
    setSimStepIndex(-1);
    simCancelRef.current = true;
    setStagePose('idle');
    setStageMood('normal');
    setStageMoveX(0);
    setStageMoveY(0);
    setStageQuake(false);
    setStageTsunami(false);
    setStageFlood(false);
    setStageFire(false);
    setShowPhaseOverlay(false);
    setStageCaption('Susun blok puzzle dan tekan Periksa untuk menjalankan simulasi.');
    setMascotMessage(
      `Skenario: ${currentScenario.title}. Susun langkah dari Pra-Bencana, Darurat, hingga Pemulihan!`
    );
  }, [selectedScenarioId, currentScenario]);

  // Audio mute toggle
  const handleToggleMute = () => {
    const muted = soundEngine.toggleMute();
    setIsMuted(muted);
  };

  // Placed item IDs set
  const placedItemIds = useMemo(() => {
    const set = new Set<string>();
    Object.values(slotPlacements).forEach((id) => {
      if (id) set.add(id);
    });
    return set;
  }, [slotPlacements]);

  // Unplaced items for palette
  const unplacedItems = useMemo(() => {
    return allItemsList
      .filter((it) => !placedItemIds.has(it.id))
      .map((it) => ({
        ...it,
        color: itemsMap[it.id]?.color || '#2F6FED',
      }));
  }, [allItemsList, placedItemIds, itemsMap]);

  const filledCount = placedItemIds.size;

  // Handle clicking a card in palette
  const handleCardClick = (id: string) => {
    if (isSimulating) return;
    if (selectedCardId === id) {
      setSelectedCardId(null);
    } else {
      setSelectedCardId(id);
    }
  };

  // Handle slot click
  const handleSlotClick = (phaseKey: string, slotIndex: number) => {
    if (isSimulating) return;
    const slotKey = `${phaseKey}-${slotIndex}`;
    const currentPlaced = slotPlacements[slotKey];

    if (currentPlaced) {
      // Remove placed block on direct click if already placed
      handleRemoveBlock(currentPlaced);
      return;
    }

    if (selectedCardId) {
      // Place selected card into this slot
      soundEngine.playSnap();
      setSlotPlacements((prev) => {
        // Remove from any other slot first
        const next = { ...prev };
        Object.keys(next).forEach((k) => {
          if (next[k] === selectedCardId) next[k] = null;
        });
        next[slotKey] = selectedCardId;
        return next;
      });
      setSelectedCardId(null);
      setValidationResponse(null);
      setValidationStatus({});
    }
  };

  // Handle slot drop
  const handleSlotDrop = (phaseKey: string, slotIndex: number, itemId: string) => {
    if (isSimulating) return;
    const slotKey = `${phaseKey}-${slotIndex}`;
    setSlotPlacements((prev) => {
      const next = { ...prev };
      Object.keys(next).forEach((k) => {
        if (next[k] === itemId) next[k] = null;
      });
      next[slotKey] = itemId;
      return next;
    });
    setSelectedCardId(null);
    setValidationResponse(null);
    setValidationStatus({});
  };

  // Handle remove individual block from slot
  const handleRemoveBlock = (itemId: string) => {
    if (isSimulating) return;
    setSlotPlacements((prev) => {
      const next = { ...prev };
      Object.keys(next).forEach((k) => {
        if (next[k] === itemId) next[k] = null;
      });
      return next;
    });
    setValidationResponse(null);
    setValidationStatus({});
  };

  // Handle reset all blocks
  const handleResetAll = () => {
    if (isSimulating) return;
    soundEngine.playPop();
    setSlotPlacements({});
    setSelectedCardId(null);
    setValidationResponse(null);
    setValidationStatus({});
  };

  // Validate sequence
  const handleCheckSequence = async () => {
    if (isSimulating) return;

    // Ordered item IDs from slots
    const orderedItems: string[] = [];
    const placedItemsMap: Record<string, string> = {};

    currentScenario.phases.forEach((p) => {
      p.items.forEach((_, idx) => {
        const slotKey = `${p.key}-${idx}`;
        const placedId = slotPlacements[slotKey];
        if (placedId) {
          orderedItems.push(placedId);
          placedItemsMap[placedId] = p.key;
        } else {
          orderedItems.push('');
        }
      });
    });

    try {
      const res = await apiPost<ValidationResponse>('/scenarios/validate', {
        scenario_id: currentScenario.id,
        placed_items: placedItemsMap,
        ordered_items: orderedItems,
      });

      setValidationResponse(res);

      const statusMap: Record<string, 'correct' | 'wrong' | null> = {};
      res.results.forEach((r) => {
        if (r.actual_index !== null && r.actual_index !== undefined) {
          const placedAtId = orderedItems[r.expected_index];
          if (placedAtId) {
            statusMap[placedAtId] = placedAtId === r.item_id ? 'correct' : 'wrong';
          }
        }
      });
      setValidationStatus(statusMap);

      if (res.is_valid) {
        soundEngine.playSuccessFanfare();
        setMascotMessage('Hebat sekali! Urutan tindakan sudah tepat sempurna! Silakan tekan ▶ Simulasi.');
      } else if (!res.all_filled) {
        soundEngine.playErrorBuzzer();
        setMascotMessage('Masih ada slot yang kosong. Isi semua slot tindakan terlebih dahulu ya!');
      } else {
        soundEngine.playErrorBuzzer();
        setMascotMessage('Urutan belum pas. Periksa blok bergaris merah dan coba susun ulang.');
      }
    } catch {
      // Offline fallback validation
      let correctCount = 0;
      const statusMap: Record<string, 'correct' | 'wrong' | null> = {};

      allItemsList.forEach((expectedItem, idx) => {
        const actualId = orderedItems[idx];
        if (actualId === expectedItem.id) {
          correctCount += 1;
          statusMap[actualId] = 'correct';
        } else if (actualId) {
          statusMap[actualId] = 'wrong';
        }
      });

      const isValid = correctCount === totalStepsCount;
      const allFilled = orderedItems.filter(Boolean).length === totalStepsCount;

      const mockRes: ValidationResponse = {
        is_valid: isValid,
        all_filled: allFilled,
        score_percentage: Math.round((correctCount / totalStepsCount) * 100),
        correct_count: correctCount,
        total_count: totalStepsCount,
        results: [],
        explanations: allItemsList.map((it, i) => ({
          step_number: i + 1,
          title: it.text,
          note: it.note,
          phase_label: currentScenario.phases.find((p) => p.items.some((x) => x.id === it.id))?.label || 'Fase',
          phase_color: itemsMap[it.id]?.color || '#2F6FED',
        })),
        feedback_message: isValid
          ? 'Luar Biasa! Urutan mitigasi tepat sempurna. Tekan ▶ untuk menjalankan simulasi!'
          : !allFilled
          ? 'Masih ada slot kosong. Lengkapi semua blok puzzle terlebih dahulu.'
          : 'Urutan belum tepat. Blok yang bergaris merah perlu disusun ulang.',
      };

      setValidationResponse(mockRes);
      setValidationStatus(statusMap);

      if (isValid) {
        soundEngine.playSuccessFanfare();
      } else {
        soundEngine.playErrorBuzzer();
      }
    }
  };

  // Run full simulation
  const handlePlaySimulation = async () => {
    if (isSimulating || !validationResponse?.is_valid) return;

    setIsSimulating(true);
    setIsCompleted(false);
    simCancelRef.current = false;
    setSelectedCardId(null);

    let lastPhaseKey: string | null = null;
    const stepDuration = Math.max(1200, Math.floor(2400 / simSpeed));

    for (let i = 0; i < allItemsList.length; i++) {
      if (simCancelRef.current) break;

      const item = allItemsList[i];
      const itemPhase = currentScenario.phases.find((p) => p.items.some((x) => x.id === item.id));

      setSimStepIndex(i);

      // Trigger Phase overlay on new phase transition
      if (itemPhase && itemPhase.key !== lastPhaseKey) {
        lastPhaseKey = itemPhase.key;
        setOverlayPhase(itemPhase);
        setShowPhaseOverlay(true);
        soundEngine.playSnap();
        await new Promise((r) => setTimeout(r, Math.max(600, Math.floor(1100 / simSpeed))));
        setShowPhaseOverlay(false);
        await new Promise((r) => setTimeout(r, 200));
      }

      if (simCancelRef.current) break;

      // Update character pose, mood, and translation
      setStagePose(item.pose || 'idle');
      setStageMood(item.mood || 'normal');
      setStageMoveX(item.moveX || 0);
      setStageMoveY(item.moveY || 0);
      setStageQuake(Boolean(item.quake));
      setStageTsunami(Boolean(item.tsunami));
      setStageFlood(Boolean(item.flood));
      setStageFire(Boolean(item.fire));
      setStageCaption(item.text);

      // Play appropriate sound fx
      if (item.quake) {
        soundEngine.playRumble(1.8);
      } else if (item.tsunami || item.flood) {
        soundEngine.playSplash();
      } else if (item.fire) {
        soundEngine.playCrackle();
      } else if (item.pose === 'alert') {
        soundEngine.playSiren(1.4);
      } else {
        soundEngine.playSnap();
      }

      await new Promise((r) => setTimeout(r, stepDuration));
    }

    if (!simCancelRef.current) {
      // Simulation complete celebration
      setIsCompleted(true);
      setStagePose('celebrate');
      setStageMood('normal');
      setStageQuake(false);
      setStageTsunami(false);
      setStageCaption('Simulasi Selesai! Anda berhasil melakukan mitigasi bencana dengan aman! 🎉');
      soundEngine.playSuccessFanfare();
      triggerConfetti();
      setMascotMessage('Selamat! Kamu berhasil menyelesaikan simulasi mitigasi bencana ini dengan selamat! 🎉');
    }

    setIsSimulating(false);
  };

  // Stop simulation
  const handleStopSimulation = () => {
    simCancelRef.current = true;
    setIsSimulating(false);
    setIsCompleted(false);
    setSimStepIndex(-1);
    setStagePose('idle');
    setStageMood('normal');
    setStageMoveX(0);
    setStageMoveY(0);
    setStageQuake(false);
    setStageTsunami(false);
    setStageFlood(false);
    setStageFire(false);
    setShowPhaseOverlay(false);
    setStageCaption('Simulasi dihentikan. Tekan ▶ untuk mengulang kembali.');
  };

  // Current playing item ID for block highlighting
  const currentPlayingItemId =
    isSimulating && simStepIndex >= 0 && simStepIndex < allItemsList.length
      ? allItemsList[simStepIndex].id
      : null;

  return (
    <div className="min-h-screen bg-[#F0F3FA] flex flex-col text-slate-800">
      {/* Top Header Navigation */}
      <header className="sticky top-0 z-50 flex items-center justify-between gap-4 px-4 sm:px-6 py-3 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
        {/* Brand Logo & Title */}
        <div className="flex items-center gap-3">
          {onBackToHomepage ? (
            <button
              type="button"
              onClick={onBackToHomepage}
              className="p-2 rounded-lg text-slate-400 hover:text-slate-700 transition-colors"
              title="Kembali ke Halaman Utama"
            >
              <svg
                className="w-4 h-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path d="M15 18l-6-6l6-6" />
              </svg>
            </button>
          ) : (
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white flex items-center justify-center text-xl shadow-md shadow-blue-500/30">
              🗺️
            </div>
          )}
          <div>
            <h1 className="font-heading font-extrabold text-base sm:text-xl tracking-tight bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-900 bg-clip-text text-transparent">
              LANGKAH SIAGA
            </h1>
            <p className="text-[10px] sm:text-xs text-slate-500 font-semibold leading-none hidden sm:block">
              Media Pembelajaran Mitigasi Bencana Interaktif
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <nav className="flex items-center gap-1.5 sm:gap-2">
          {/* Mute Button */}
          <button
            type="button"
            data-testid="sound-toggle-button"
            onClick={handleToggleMute}
            className={`p-2 rounded-xl border text-xs font-bold transition-all flex items-center gap-1.5 ${
              isMuted
                ? 'bg-rose-50 border-rose-200 text-rose-600'
                : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
            }`}
            title={isMuted ? 'Aktifkan Suara' : 'Bisukan Suara'}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            <span className="hidden md:inline">{isMuted ? 'Mute' : 'Audio On'}</span>
          </button>

          {/* Tutorial Button */}
          <Button
            type="button"
            data-testid="nav-tutorial-button"
            variant="outline"
            size="sm"
            onClick={() => setShowTutorial(true)}
            className="rounded-xl border-slate-200 text-slate-700 hover:bg-slate-100 font-bold text-xs"
          >
            <BookOpen className="w-3.5 h-3.5 mr-1 text-blue-600" />
            <span className="hidden sm:inline">Tutorial</span>
          </Button>

          {/* Panduan Button */}
          <Button
            type="button"
            data-testid="nav-guide-button"
            variant="outline"
            size="sm"
            onClick={() => setShowGuide(true)}
            className="rounded-xl border-slate-200 text-slate-700 hover:bg-slate-100 font-bold text-xs"
          >
            <HelpCircle className="w-3.5 h-3.5 mr-1 text-amber-600" />
            <span className="hidden sm:inline">Panduan</span>
          </Button>

          {/* Kuis Siaga Button */}
          <Button
            type="button"
            data-testid="nav-quiz-button"
            size="sm"
            onClick={() => setShowQuiz(true)}
            className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold rounded-xl text-xs shadow-sm shadow-purple-500/20"
          >
            <GraduationCap className="w-3.5 h-3.5 mr-1" />
            <span>Kuis & Sertifikat</span>
          </Button>

          {/* Reset Button */}
          <Button
            type="button"
            data-testid="nav-reset-button"
            variant="ghost"
            size="sm"
            onClick={handleResetAll}
            className="rounded-xl text-slate-600 hover:bg-slate-100 font-bold text-xs"
            title="Mulai Baru Skenario"
          >
            <RotateCcw className="w-3.5 h-3.5 sm:mr-1" />
            <span className="hidden md:inline">Mulai Baru</span>
          </Button>

          {/* Tentang Button */}
          <Button
            type="button"
            data-testid="nav-about-button"
            variant="ghost"
            size="sm"
            onClick={() => setShowAbout(true)}
            className="rounded-xl text-slate-500 hover:bg-slate-100 font-bold text-xs px-2"
          >
            <Info className="w-4 h-4" />
          </Button>
        </nav>
      </header>

      {/* Scenario Selection Bar (5 scenarios) */}
      <section className="bg-white border-b border-slate-200 px-4 sm:px-6 py-2.5">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar max-w-7xl mx-auto">
          <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400 shrink-0 mr-1">
            Skenario:
          </span>
          {scenarios.map((sc) => {
            const isActive = sc.id === selectedScenarioId;
            return (
              <button
                key={sc.id}
                type="button"
                data-testid={`scenario-select-${sc.id}`}
                onClick={() => {
                  soundEngine.playPop();
                  setSelectedScenarioId(sc.id);
                }}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl border font-bold text-xs transition-all shrink-0 select-none ${
                  isActive
                    ? 'bg-blue-50 border-blue-600 text-blue-700 shadow-xs ring-1 ring-blue-600/20'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100 hover:border-slate-300'
                }`}
              >
                <span className="text-base">{sc.icon}</span>
                <span>{sc.title}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-md font-semibold ${
                    sc.difficulty === 'Pemula'
                      ? 'bg-emerald-100 text-emerald-700'
                      : sc.difficulty === 'Menengah'
                      ? 'bg-amber-100 text-amber-700'
                      : 'bg-rose-100 text-rose-700'
                  }`}
                >
                  {sc.difficulty}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Main Multi-Column Workbench */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left Column: Puzzle Palette (4 cols) */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          <PuzzlePalette
            unplacedItems={unplacedItems}
            selectedCardId={selectedCardId}
            onCardClick={handleCardClick}
            onResetAll={handleResetAll}
            onPaletteDrop={() => {
              if (selectedCardId) {
                handleRemoveBlock(selectedCardId);
                setSelectedCardId(null);
              }
            }}
          />

          {/* Helper Tips Card */}
          <div className="p-4 bg-gradient-to-br from-blue-50/70 to-indigo-50/70 border border-blue-100 rounded-2xl flex flex-col gap-2">
            <h4 className="font-heading font-bold text-xs text-blue-900 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              Petunjuk Belajar:
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Pasang semua blok dari fase <b>Pra-Bencana</b> (biru), lalu <b>Darurat</b> (merah), dan <b>Pemulihan</b> (hijau). Tekan <b>Periksa</b> untuk membuka tombol Simulasi!
            </p>
          </div>
        </div>

        {/* Center Column: Canvas Script Dropzone (4 cols) */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          <CanvasSequence
            title={`Urutan: ${currentScenario.title}`}
            phases={currentScenario.phases}
            slotPlacements={slotPlacements}
            itemsMap={itemsMap}
            validationStatus={validationStatus}
            playingItemId={currentPlayingItemId}
            selectedCardId={selectedCardId}
            onSlotClick={handleSlotClick}
            onSlotDrop={handleSlotDrop}
            onRemoveBlock={handleRemoveBlock}
            onCheckSequence={handleCheckSequence}
            filledCount={filledCount}
            totalCount={totalStepsCount}
          />
        </div>

        {/* Right Column: Simulation Stage & Explanations (4 cols) */}
        <div className="lg:col-span-4 flex flex-col gap-4 sticky top-20">
          {/* Stage Component */}
          <SimulationStage
            scene={currentScenario.scene}
            pose={stagePose}
            mood={stageMood}
            moveX={stageMoveX}
            moveY={stageMoveY}
            currentStep={simStepIndex + 1}
            totalSteps={totalStepsCount}
            captionText={stageCaption}
            isSimulating={isSimulating}
            isCompleted={isCompleted}
            phaseKey={overlayPhase?.key}
            phaseLabel={overlayPhase?.label}
            showOverlay={showPhaseOverlay}
            overlayIcon={overlayPhase?.icon}
            hasQuake={stageQuake}
            hasTsunami={stageTsunami}
            hasFlood={stageFlood}
            hasFire={stageFire}
            onPlay={handlePlaySimulation}
            onStop={handleStopSimulation}
            canPlay={Boolean(validationResponse?.is_valid)}
            speed={simSpeed}
            onSpeedChange={setSimSpeed}
          />

          {/* Validation Feedback Banner */}
          {validationResponse && (
            <div
              data-testid="validation-feedback-card"
              className={`p-4 rounded-2xl border flex items-start gap-3 transition-all animate-in fade-in slide-in-from-top-2 ${
                validationResponse.is_valid
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
                  : !validationResponse.all_filled
                  ? 'bg-amber-50 border-amber-200 text-amber-950'
                  : 'bg-rose-50 border-rose-200 text-rose-950'
              }`}
            >
              {validationResponse.is_valid ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              )}
              <div className="flex-1 text-xs">
                <b className="font-heading font-extrabold text-sm block mb-0.5">
                  {validationResponse.is_valid
                    ? 'Urutan Tepat Sempurna!'
                    : !validationResponse.all_filled
                    ? 'Belum Lengkap'
                    : 'Periksa Kembali Urutan'}
                </b>
                <p className="leading-snug">{validationResponse.feedback_message}</p>

                {validationResponse.is_valid && (
                  <Button
                    type="button"
                    data-testid="feedback-play-now-button"
                    size="sm"
                    onClick={handlePlaySimulation}
                    disabled={isSimulating}
                    className="mt-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs px-3"
                  >
                    ▶ Jalankan Simulasi Sekarang
                  </Button>
                )}
              </div>
            </div>
          )}

          {/* Educational Explanations Box (Kenapa urutan ini penting?) */}
          {validationResponse && (
            <div
              data-testid="explanation-list-card"
              className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col gap-2.5"
            >
              <h3 className="font-heading font-bold text-xs sm:text-sm text-slate-800 flex items-center gap-1.5">
                <span>💡</span> Kenapa urutan ini penting?
              </h3>
              <div className="flex flex-col gap-2 max-h-56 overflow-y-auto pr-1">
                {validationResponse.explanations.map((exp) => (
                  <div
                    key={exp.step_number}
                    className="flex items-start gap-2.5 text-xs text-slate-600 p-2 rounded-xl bg-slate-50 border border-slate-100"
                  >
                    <span
                      className="w-5 h-5 rounded-full text-white flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5"
                      style={{ backgroundColor: exp.phase_color }}
                    >
                      {exp.step_number}
                    </span>
                    <div className="flex-1 leading-snug">
                      <b className="text-slate-800 block">{exp.title}</b>
                      <span className="text-[11px] text-slate-500">{exp.note}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Floating Mascot Guide */}
      <MascotGuide
        message={mascotMessage}
        onOpenTutorial={() => setShowTutorial(true)}
      />

      {/* Modals */}
      <TutorialModal open={showTutorial} onOpenChange={setShowTutorial} />
      <GuideModal open={showGuide} onOpenChange={setShowGuide} />
      <QuizModal
        open={showQuiz}
        onOpenChange={setShowQuiz}
        questions={currentScenario ? [
          {
            id: 'q1',
            scenario_id: 'rumah',
            question: 'Saat gempa bumi mengguncang rumah, tindakan perlindungan tercepat yang wajib dilakukan adalah...',
            options: [
              'Lari secepatnya tanpa alas kaki keluar rumah',
              'Merunduk di bawah meja kokoh, lindungi kepala dan berpegangan (Drop, Cover, Hold On)',
              'Berdiri dekat jendela kaca agar mudah terlihat tetangga',
              'Menaiki lemari untuk mencari posisi aman',
            ],
            correct_index: 1,
            explanation: 'Drop, Cover, Hold On melindungi kepala dan leher dari reruntuhan dan pecahan kaca.',
            phase: 'Darurat',
          },
          {
            id: 'q2',
            scenario_id: 'pesisir',
            question: 'Berapa angka patokan pada rumus kesiapsiagaan bencana tsunami di pesisir pantai?',
            options: [
              'Rumus 20-20-20 (Gempa 20 detik, 20 menit evakuasi, ketinggian 20 meter)',
              'Rumus 10-10-10 (Lari 10 km dalam 10 menit)',
              'Rumus 5-5-5 (Tunggu 5 menit di pantai)',
              'Rumus 100-100 (Beli 100 pelampung)',
            ],
            correct_index: 0,
            explanation: 'Rumus 20-20-20 adalah panduan evakuasi mandiri cepat saat gempa kuat terasa di pantai.',
            phase: 'Darurat',
          },
          {
            id: 'q3',
            scenario_id: 'banjir',
            question: 'Langkah pertama yang harus dimatikan saat air banjir mulai masuk rumah adalah...',
            options: [
              'Kran air bersih',
              'Sakelar meteran listrik utama (MCB) dan tabung gas',
              'Pendingin ruangan (AC)',
              'Wi-Fi router',
            ],
            correct_index: 1,
            explanation: 'Mematikan MCB listrik mencegah sengatan arus listrik fatal yang merambat melalui air banjir.',
            phase: 'Darurat',
          },
          {
            id: 'q4',
            scenario_id: 'kebakaran',
            question: 'Mengapa kita harus merayap rendah saat terjebak asap kebakaran gedung bertingkat?',
            options: [
              'Karena udara bersih berada 30-60 cm dari lantai dan asap beracun naik ke atas',
              'Agar tidak terlihat oleh kobaran api',
              'Untuk menghemat energi kaki saat berjalan',
              'Karena lantai gedung lebih dingin',
            ],
            correct_index: 0,
            explanation: 'Asap panas beracun dan gas karbon monoksida naik ke atas; lapisan bawah lantai memiliki kadar oksigen lebih baik.',
            phase: 'Darurat',
          },
          {
            id: 'q5',
            scenario_id: 'sekolah',
            question: 'Setelah guncangan gempa di sekolah selesai, kemana siswa harus berkumpul?',
            options: [
              'Di kantin sekolah membeli makanan',
              'Di lapangan terbuka atau titik kumpul aman yang ditentukan pihak sekolah',
              'Di tempat parkir kendaraan bermotor',
              'Masuk kembali ke ruang kelas lantai 2',
            ],
            correct_index: 1,
            explanation: 'Lapangan terbuka jauh dari bahaya kaca jendela pecah atau dinding gedung retak.',
            phase: 'Pemulihan',
          },
        ] : []}
        onCertificateEarned={(result) => {
          setCertificateData(result);
          setShowQuiz(false);
          setShowCertificate(true);
        }}
      />
      <CertificateModal
        open={showCertificate}
        onOpenChange={setShowCertificate}
        result={certificateData}
      />
      <AboutModal open={showAbout} onOpenChange={setShowAbout} />
    </div>
  );
}
