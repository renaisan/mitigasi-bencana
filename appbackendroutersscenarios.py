from fastapi import APIRouter, HTTPException
from typing import List, Dict
import uuid
from datetime import datetime, timezone
from lib.db import db
from lib.dates import today_iso
from models.scenario import (
    DisasterScenario,
    DisasterPhase,
    MitigationItem,
    ValidationRequest,
    ValidationResponse,
    ItemValidationResult,
    ExplanationItem,
    QuizQuestion,
    QuizSubmission,
    QuizResult,
)

router = APIRouter(prefix="/scenarios", tags=["scenarios"])

# Comprehensive disaster scenarios dataset following BNPB/BMKG Indonesian disaster mitigation guidelines
SCENARIOS_DATA: Dict[str, DisasterScenario] = {
    "rumah": DisasterScenario(
        id="rumah",
        title="Gempa di Rumah",
        icon="🏠",
        scene="rumah",
        difficulty="Pemula",
        description="Pelajari langkah perlindungan 'Drop, Cover, Hold On' saat guncangan hebat terjadi di rumah tinggal.",
        phases=[
            DisasterPhase(
                key="sebelum",
                label="Pra-Bencana",
                color="#2F6FED",
                tint="#E8F0FF",
                icon="🧭",
                items=[
                    MitigationItem(
                        id="r1",
                        text="Kenali jalur keluar tercepat dan titik kumpul keluarga",
                        note="Kesiapan jalur evakuasi dibangun sebelum gempa terjadi agar tidak panik.",
                        pose="idle",
                        mood="normal",
                        moveX=0,
                        moveY=0,
                    ),
                    MitigationItem(
                        id="r2",
                        text="Amankan lemari dan rak berat ke dinding",
                        note="Mengurangi risiko benda berat roboh dan menimpa penghuni saat guncangan.",
                        pose="prepare",
                        mood="normal",
                        moveX=15,
                        moveY=0,
                    ),
                ],
            ),
            DisasterPhase(
                key="saat",
                label="Darurat",
                color="#E14B4B",
                tint="#FDEAEA",
                icon="⚡",
                items=[
                    MitigationItem(
                        id="r3",
                        text="Merunduk ke tangan dan lutut (Drop)",
                        note="Posisi rendah menjaga keseimbangan agar tidak mudah terjatuh saat guncangan.",
                        pose="duck",
                        mood="scared",
                        quake=True,
                        moveX=0,
                        moveY=0,
                    ),
                    MitigationItem(
                        id="r4",
                        text="Lindungi kepala dan leher di bawah meja kokoh (Cover)",
                        note="Kepala dan leher terlindungi aman dari pecahan kaca atau plafon jatuh.",
                        pose="cover",
                        mood="scared",
                        quake=True,
                        moveX=-20,
                        moveY=0,
                    ),
                    MitigationItem(
                        id="r5",
                        text="Berpegangan pada kaki meja sampai guncangan berhenti (Hold On)",
                        note="Menjaga posisi pelindung tetap stabil sampai gempa utama benar-benar reda.",
                        pose="hold",
                        mood="scared",
                        quake=True,
                        moveX=-20,
                        moveY=0,
                    ),
                ],
            ),
            DisasterPhase(
                key="sesudah",
                label="Pemulihan",
                color="#17A868",
                tint="#E2F8EE",
                icon="✅",
                items=[
                    MitigationItem(
                        id="r6",
                        text="Periksa diri dan anggota keluarga dari luka",
                        note="Pertolongan pertama diberikan segera pada cedera ringan sebelum bergerak keluar.",
                        pose="alert",
                        mood="normal",
                        moveX=0,
                        moveY=0,
                    ),
                    MitigationItem(
                        id="r7",
                        text="Keluar lewat jalur evakuasi, matikan gas & kompor",
                        note="Mencegah bahaya korsleting dan kebakaran ikutan pasca gempa bumi.",
                        pose="walk",
                        mood="normal",
                        moveX=-38,
                        moveY=2,
                    ),
                    MitigationItem(
                        id="r8",
                        text="Menuju titik kumpul di lapangan terbuka di luar bangunan",
                        note="Jauhkan diri dari kabel listrik tegangan tinggi, tiang rapuh, dan dinding retak.",
                        pose="gather",
                        mood="normal",
                        moveX=-74,
                        moveY=-10,
                    ),
                ],
            ),
        ],
    ),
    "sekolah": DisasterScenario(
        id="sekolah",
        title="Gempa di Sekolah",
        icon="🏫",
        scene="sekolah",
        difficulty="Menengah",
        description="Evakuasi tertib dari ruang kelas sekolah menuju lapangan upacara terbuka tanpa desak-desakan.",
        phases=[
            DisasterPhase(
                key="sebelum",
                label="Pra-Bencana",
                color="#2F6FED",
                tint="#E8F0FF",
                icon="🧭",
                items=[
                    MitigationItem(
                        id="s1",
                        text="Hafalkan denah jalur evakuasi dari ruang kelas",
                        note="Semua siswa wajib mengetahui pintu darurat dan rute terdekat ke lapangan.",
                        pose="idle",
                        mood="normal",
                        moveX=0,
                        moveY=0,
                    ),
                    MitigationItem(
                        id="s2",
                        text="Ikuti simulasi gempa sekolah secara rutin dan tertib",
                        note="Latihan berkala membentuk memori otot dan respon cepat tanpa kepanikan liar.",
                        pose="prepare",
                        mood="normal",
                        moveX=10,
                        moveY=0,
                    ),
                ],
            ),
            DisasterPhase(
                key="saat",
                label="Darurat",
                color="#E14B4B",
                tint="#FDEAEA",
                icon="⚡",
                items=[
                    MitigationItem(
                        id="s3",
                        text="Merunduk dan berlindung di bawah meja kelas",
                        note="Meja kayu/besi kokoh kelas menahan pecahan lampu neon dan serpihan plafon.",
                        pose="duck",
                        mood="scared",
                        quake=True,
                        moveX=-15,
                        moveY=0,
                    ),
                    MitigationItem(
                        id="s4",
                        text="Lindungi kepala dengan tas ransel atau buku tebal",
                        note="Tas sekolah berfungsi sebagai perisai tambahan untuk tempurung kepala.",
                        pose="cover",
                        mood="scared",
                        quake=True,
                        moveX=-15,
                        moveY=0,
                    ),
                    MitigationItem(
                        id="s5",
                        text="Tetap di tempat dan jangan berhamburan ke pintu",
                        note="Pintu keluar adalah titik paling rawan terjadinya desak-desakan fatal.",
                        pose="hold",
                        mood="scared",
                        quake=True,
                        moveX=-15,
                        moveY=0,
                    ),
                ],
            ),
            DisasterPhase(
                key="sesudah",
                label="Pemulihan",
                color="#17A868",
                tint="#E2F8EE",
                icon="✅",
                items=[
                    MitigationItem(
                        id="s6",
                        text="Baris rapi keluar menuju lapangan terbuka sekolah",
                        note="Berjalan cepat tetapi tidak berlari atau saling dorong di koridor dan tangga.",
                        pose="walk",
                        mood="normal",
                        moveX=58,
                        moveY=18,
                    ),
                    MitigationItem(
                        id="s7",
                        text="Tunggu presensi dan instruksi keselamatan dari guru",
                        note="Guru dan tim PMR/Pramuka memastikan seluruh siswa terdata lengkap di titik kumpul.",
                        pose="gather",
                        mood="normal",
                        moveX=58,
                        moveY=18,
                    ),
                    MitigationItem(
                        id="s8",
                        text="Jangan kembali ke kelas sebelum dinyatakan aman oleh otoritas",
                        note="Bangunan sekolah berpotensi mengalami retak struktur berbahaya saat gempa susulan.",
                        pose="alert",
                        mood="normal",
                        moveX=58,
                        moveY=18,
                    ),
                ],
            ),
        ],
    ),
    "pesisir": DisasterScenario(
        id="pesisir",
        title="Gempa di Pesisir & Tsunami",
        icon="🌊",
        scene="pesisir",
        difficulty="Lanjutan",
        description="Kenali rumus 20-20-20: Gempa terasa 20 detik, punya 20 menit evakuasi, menuju ketinggian 20 meter.",
        phases=[
            DisasterPhase(
                key="sebelum",
                label="Pra-Bencana",
                color="#2F6FED",
                tint="#E8F0FF",
                icon="🧭",
                items=[
                    MitigationItem(
                        id="p1",
                        text="Kenali jalur evakuasi dan rambu tsunami menuju bukit/TES",
                        note="Tempat Evakuasi Sementara (TES) di perbukitan harus diketahui jalurnya sebelumnya.",
                        pose="idle",
                        mood="normal",
                        moveX=0,
                        moveY=0,
                    ),
                    MitigationItem(
                        id="p2",
                        text="Pelajari rumus 20-20-20 dan tanda alami tsunami pesisir",
                        note="Gempa 20 detik atau lebih di tepi pantai adalah peringatan awal tsunami mandiri.",
                        pose="alert",
                        mood="normal",
                        moveX=0,
                        moveY=0,
                    ),
                ],
            ),
            DisasterPhase(
                key="saat",
                label="Darurat",
                color="#E14B4B",
                tint="#FDEAEA",
                icon="⚡",
                items=[
                    MitigationItem(
                        id="p3",
                        text="Merunduk di area terbuka, jauhi tebing pantai dan pohon kelapa",
                        note="Mencegah tertimpa pohon tumbang atau tebing pasir yang longsor saat guncangan.",
                        pose="cover",
                        mood="scared",
                        quake=True,
                        moveX=0,
                        moveY=0,
                    ),
                    MitigationItem(
                        id="p4",
                        text="Waspadai air laut surut tiba-tiba dan bau belerang/garam menyengat",
                        note="Surutnya air laut secara drastis merupakan pertanda gelombang tsunami sedang mengumpul.",
                        pose="alert",
                        mood="scared",
                        moveX=0,
                        moveY=0,
                    ),
                ],
            ),
            DisasterPhase(
                key="sesudah",
                label="Pemulihan",
                color="#17A868",
                tint="#E2F8EE",
                icon="✅",
                items=[
                    MitigationItem(
                        id="p5",
                        text="Segera berlari ke tempat tinggi (ketinggian >20 meter) dengan jalan kaki",
                        note="Gunakan jalan kaki/sepeda karena jalan raya sering macet total oleh kendaraan bermotor.",
                        pose="climb",
                        mood="scared",
                        tsunami=True,
                        moveX=66,
                        moveY=-72,
                    ),
                    MitigationItem(
                        id="p6",
                        text="Dilarang keras turun ke pantai untuk menonton gelombang atau mengambil ikan",
                        note="Banyak korban tsunami terjadi karena warga penasaran melihat dasar laut yang mengering.",
                        pose="alert",
                        mood="scared",
                        moveX=66,
                        moveY=-72,
                    ),
                    MitigationItem(
                        id="p7",
                        text="Tetap berada di bukit evakuasi sampai BMKG mencabut peringatan tsunami",
                        note="Gelombang tsunami datang berulang kali dalam beberapa jam, bukan hanya satu hempasan.",
                        pose="gather",
                        mood="normal",
                        moveX=66,
                        moveY=-80,
                    ),
                ],
            ),
        ],
    ),
    "banjir": DisasterScenario(
        id="banjir",
        title="Banjir Pemukiman",
        icon="🌧️",
        scene="banjir",
        difficulty="Menengah",
        description="Langkah cepat menghadapi luapan air banjir: amankan kelistrikan, dokumen penting, dan evakuasi mandiri.",
        phases=[
            DisasterPhase(
                key="sebelum",
                label="Pra-Bencana",
                color="#2F6FED",
                tint="#E8F0FF",
                icon="🧭",
                items=[
                    MitigationItem(
                        id="b1",
                        text="Simpan surat berharga dan ijazah dalam kantong kedap air",
                        note="Melindungi aset dokumen penting dari kerusakan rendaman air kotor.",
                        pose="prepare",
                        mood="normal",
                        moveX=0,
                        moveY=0,
                    ),
                    MitigationItem(
                        id="b2",
                        text="Ketahui posisi sakelar MCB listrik utama dan posko evakuasi",
                        note="Memudahkan pemutusan arus seketika sebelum genangan air masuk ke rumah.",
                        pose="idle",
                        mood="normal",
                        moveX=10,
                        moveY=0,
                    ),
                ],
            ),
            DisasterPhase(
                key="saat",
                label="Darurat",
                color="#E14B4B",
                tint="#FDEAEA",
                icon="⚡",
                items=[
                    MitigationItem(
                        id="b3",
                        text="Segera matikan MCB meteran listrik dan tutup kran gas",
                        note="Mencegah sengatan arus listrik mematikan (electrocution) di air banjir.",
                        pose="prepare",
                        mood="scared",
                        flood=True,
                        moveX=15,
                        moveY=0,
                    ),
                    MitigationItem(
                        id="b4",
                        text="Pindahkan lansia, anak-anak, dan tas siaga ke lantai atas",
                        note="Prioritaskan kelompok rentan ke tempat yang lebih tinggi dan kering.",
                        pose="climb",
                        mood="scared",
                        flood=True,
                        moveX=30,
                        moveY=-25,
                    ),
                    MitigationItem(
                        id="b5",
                        text="Jangan berenang atau berjalan melintasi arus banjir yang deras",
                        note="Arus setinggi 15 cm sudah mampu merobohkan orang dewasa dan menyembunyikan lubang got.",
                        pose="alert",
                        mood="scared",
                        flood=True,
                        moveX=30,
                        moveY=-25,
                    ),
                ],
            ),
            DisasterPhase(
                key="sesudah",
                label="Pemulihan",
                color="#17A868",
                tint="#E2F8EE",
                icon="✅",
                items=[
                    MitigationItem(
                        id="b6",
                        text="Evakuasi menggunakan perahu karet SAR ke posko pengungsian",
                        note="Tim evakuasi resmi memiliki perlengkapan pelampung dan jalur aman melintasi genangan.",
                        pose="walk",
                        mood="normal",
                        moveX=-30,
                        moveY=0,
                    ),
                    MitigationItem(
                        id="b7",
                        text="Cek instalasi listrik oleh teknisi berwenang sebelum dinyalakan kembali",
                        note="Stopkontak basah berlumpur berisiko korsleting fatal saat daya listrik dihidupkan.",
                        pose="gather",
                        mood="normal",
                        moveX=-60,
                        moveY=0,
                    ),
                ],
            ),
        ],
    ),
    "kebakaran": DisasterScenario(
        id="kebakaran",
        title="Kebakaran Gedung Bertingkat",
        icon="🔥",
        scene="kebakaran",
        difficulty="Lanjutan",
        description="Menyelamatkan diri dari kepulan asap beracun dan kobaran api di gedung bertingkat tanpa menggunakan lift.",
        phases=[
            DisasterPhase(
                key="sebelum",
                label="Pra-Bencana",
                color="#2F6FED",
                tint="#E8F0FF",
                icon="🧭",
                items=[
                    MitigationItem(
                        id="k1",
                        text="Perhatikan lokasi pintu tangga darurat (Exit) dan tombol alarm",
                        note="Setiap lantai gedung memiliki jalur darurat yang tahan api dan bebas asap.",
                        pose="idle",
                        mood="normal",
                        moveX=0,
                        moveY=0,
                    ),
                    MitigationItem(
                        id="k2",
                        text="Ketahui cara dasar penggunaan alat pemadam api ringan (APAR)",
                        note="Rumus PASS: Tarik Pin, Arahkan Nozzle, Remas Tuas, Ratakan Sapuan.",
                        pose="prepare",
                        mood="normal",
                        moveX=10,
                        moveY=0,
                    ),
                ],
            ),
            DisasterPhase(
                key="saat",
                label="Darurat",
                color="#E14B4B",
                tint="#FDEAEA",
                icon="⚡",
                items=[
                    MitigationItem(
                        id="k3",
                        text="Bunyikan tombol alarm kebakaran terdekat dan teriakkan bahaya",
                        note="Memberi peringatan dini kepada seluruh penghuni gedung agar segera evakuasi.",
                        pose="alert",
                        mood="scared",
                        fire=True,
                        moveX=15,
                        moveY=0,
                    ),
                    MitigationItem(
                        id="k4",
                        text="Merayap rendah di bawah asap tebal dengan kain basah menutupi hidung",
                        note="Udara bersih kaya oksigen berada 30-60 cm dari lantai; asap beracun naik ke atas.",
                        pose="duck",
                        mood="scared",
                        fire=True,
                        moveX=-25,
                        moveY=10,
                    ),
                    MitigationItem(
                        id="k5",
                        text="Gunakan tangga darurat, JANGAN sekali-kali menggunakan lift / elevator",
                        note="Lift dapat macet seketika akibat kabel terbakar atau pemutusan daya listrik darurat.",
                        pose="walk",
                        mood="scared",
                        fire=True,
                        moveX=-50,
                        moveY=15,
                    ),
                ],
            ),
            DisasterPhase(
                key="sesudah",
                label="Pemulihan",
                color="#17A868",
                tint="#E2F8EE",
                icon="✅",
                items=[
                    MitigationItem(
                        id="k6",
                        text="Menuju titik kumpul luar gedung dan melapor ke petugas keselamatan",
                        note="Memastikan data headcount penghuni lantai telah dievakuasi lengkap.",
                        pose="gather",
                        mood="normal",
                        moveX=-70,
                        moveY=0,
                    ),
                    MitigationItem(
                        id="k7",
                        text="Beri jalan bebas bagi mobil pemadam kebakaran dan tim paramedis",
                        note="Akses hidran dan area manuver armada pemadam tidak boleh terhalang warga.",
                        pose="alert",
                        mood="normal",
                        moveX=-80,
                        moveY=0,
                    ),
                ],
            ),
        ],
    ),
}

QUIZ_QUESTIONS_DATA: List[QuizQuestion] = [
    QuizQuestion(
        id="q1",
        scenario_id="rumah",
        question="Saat terjadi gempa bumi hebat di dalam rumah, apa tindakan perlindungan diri yang paling tepat?",
        options=[
            "Langsung berlari kencang menuju pintu keluar tanpa perlindungan",
            "Drop (Merunduk), Cover (Lindungi kepala bawah meja), Hold On (Berpegangan)",
            "Berdiri di dekat jendela kaca besar untuk melihat situasi",
            "Menaiki kasur dan menarik selimut tebal menutupi seluruh tubuh",
        ],
        correct_index=1,
        explanation="Prinsip 'Drop, Cover, Hold On' melindungi organ vital kepala dan leher dari bahaya pecahan kaca atau benda jatuh.",
        phase="Darurat",
    ),
    QuizQuestion(
        id="q2",
        scenario_id="pesisir",
        question="Apa arti rumus kesiapsiagaan '20-20-20' pada mitigasi bencana tsunami pesisir?",
        options=[
            "Gempa terasa 20 detik, evakuasi dalam 20 menit, menuju ketinggian minimal 20 meter",
            "Beli 20 kantong pasir, tunggu 20 menit, berenang 20 meter ke tengah laut",
            "Hitung 20 sirine, bawa 20 barang bawaan, tunggu bantuan 20 jam",
            "Berlari 20 km/jam selama 20 menit bersama 20 orang tetangga",
        ],
        correct_index=0,
        explanation="Rumus 20-20-20 adalah panduan BNPB/BMKG untuk evakuasi mandiri cepat di kawasan pantai rawan tsunami.",
        phase="Darurat",
    ),
    QuizQuestion(
        id="q3",
        scenario_id="kebakaran",
        question="Mengapa kita DILARANG menggunakan lift saat terjadi kebakaran di gedung bertingkat?",
        options=[
            "Karena lift bergerak terlalu lambat dibandingkan berlari di koridor",
            "Karena lift berisiko macet di tengah lantai akibat kabel terbakar atau listrik terputus",
            "Karena pintu lift akan menolak membuka jika mendeteksi asap tipis",
            "Karena lift hanya dikhususkan untuk membawa barang perabotan penting",
        ],
        correct_index=1,
        explanation="Pemutusan daya listrik otomatis dan risiko poros lift menjadi cerobong asap beracun membuat lift sangat mematikan saat kebakaran.",
        phase="Darurat",
    ),
    QuizQuestion(
        id="q4",
        scenario_id="banjir",
        question="Langkah pertama yang WAJIB dilakukan saat air banjir mulai menggenangi lantai rumah adalah...",
        options=[
            "Memompa air keluar rumah menggunakan selang penyiram tanaman",
            "Mematikan sakelar MCB listrik utama dan menutup kran gas kompor",
            "Membuka semua pintu dan jendela agar aliran air mengalir deras",
            "Mengisi ember dengan air banjir untuk cadangan mandi",
        ],
        correct_index=1,
        explanation="Mematikan MCB listrik mencegah bahaya tersetrum (electrocution) yang sangat mematikan di media air banjir.",
        phase="Darurat",
    ),
    QuizQuestion(
        id="q5",
        scenario_id="sekolah",
        question="Setelah guncangan gempa bumi di sekolah berhenti, apa yang harus dilakukan siswa?",
        options=[
            "Berebut lari paling depan menuju pintu gerbang sekolah",
            "Kembali masuk ke kelas untuk mengambil mainan yang tertinggal",
            "Baris tertib melindungi kepala menuju titik kumpul lapangan dan tunggu presensi guru",
            "Bersembunyi di dalam kamar mandi sekolah sampai dijemput orang tua",
        ],
        correct_index=2,
        explanation="Evakuasi tertib ke lapangan terbuka mencegah korban akibat desak-desakan dan memudahkan absensi keselamatan.",
        phase="Pemulihan",
    ),
]


@router.get("", response_model=List[DisasterScenario])
async def get_all_scenarios():
    """Returns list of all available disaster scenarios."""
    return list(SCENARIOS_DATA.values())


@router.get("/{scenario_id}", response_model=DisasterScenario)
async def get_scenario_by_id(scenario_id: str):
    """Returns single disaster scenario by ID."""
    if scenario_id not in SCENARIOS_DATA:
        raise HTTPException(status_code=404, detail=f"Skenario '{scenario_id}' tidak ditemukan")
    return SCENARIOS_DATA[scenario_id]


@router.post("/validate", response_model=ValidationResponse)
async def validate_sequence(req: ValidationRequest):
    """Validates user's puzzle block sequence against the correct chronological order."""
    if req.scenario_id not in SCENARIOS_DATA:
        raise HTTPException(status_code=404, detail=f"Skenario '{req.scenario_id}' tidak ditemukan")

    sc = SCENARIOS_DATA[req.scenario_id]
    all_expected_items: List[MitigationItem] = []
    item_phase_map: Dict[str, DisasterPhase] = {}

    for phase in sc.phases:
        for it in phase.items:
            all_expected_items.append(it)
            item_phase_map[it.id] = phase

    total_count = len(all_expected_items)
    ordered_items = req.ordered_items
    placed_items = req.placed_items
    filled_count = len([x for x in ordered_items if x])

    results: List[ItemValidationResult] = []
    correct_count = 0
    all_filled = filled_count == total_count

    for idx, expected_item in enumerate(all_expected_items):
        actual_id = ordered_items[idx] if idx < len(ordered_items) else None
        expected_phase = item_phase_map[expected_item.id].key

        is_correct_pos = actual_id == expected_item.id
        is_correct_ph = False

        if actual_id:
            actual_phase = placed_items.get(actual_id, "")
            is_correct_ph = actual_phase == expected_phase

        if is_correct_pos:
            correct_count += 1

        results.append(
            ItemValidationResult(
                item_id=expected_item.id,
                is_correct_position=is_correct_pos,
                is_correct_phase=is_correct_ph,
                expected_index=idx,
                actual_index=ordered_items.index(expected_item.id) if expected_item.id in ordered_items else None,
                expected_phase=expected_phase,
            )
        )

    score_pct = round((correct_count / total_count) * 100, 1) if total_count > 0 else 0.0
    is_valid = correct_count == total_count

    # Build explanations
    explanations: List[ExplanationItem] = []
    for step_num, item in enumerate(all_expected_items, 1):
        phase_info = item_phase_map[item.id]
        explanations.append(
            ExplanationItem(
                step_number=step_num,
                title=item.text,
                note=item.note,
                phase_label=phase_info.label,
                phase_color=phase_info.color,
            )
        )

    # Feedback message in Indonesian
    if is_valid:
        feedback_message = "Luar Biasa! Urutan mitigasi tepat sempurna. Tekan ▶ untuk menjalankan simulasi animasi!"
    elif not all_filled:
        feedback_message = f"Masih ada {total_count - filled_count} slot kosong. Pasang semua blok puzzle terlebih dahulu."
    else:
        feedback_message = f"Urutan belum tepat ({correct_count}/{total_count} benar). Periksa kembali blok dengan highlight merah."

    # Save run record in background/DB asynchronously
    try:
        await db.simulation_runs.insert_one(
            {
                "id": str(uuid.uuid4()),
                "scenario_id": req.scenario_id,
                "is_valid": is_valid,
                "score_percentage": score_pct,
                "timestamp": datetime.now(timezone.utc),
            }
        )
    except Exception:
        pass

    return ValidationResponse(
        is_valid=is_valid,
        all_filled=all_filled,
        score_percentage=score_pct,
        correct_count=correct_count,
        total_count=total_count,
        results=results,
        explanations=explanations,
        feedback_message=feedback_message,
    )


@router.get("/quiz/questions", response_model=List[QuizQuestion])
async def get_quiz_questions():
    """Returns list of disaster mitigation quiz questions."""
    return QUIZ_QUESTIONS_DATA


@router.post("/quiz/submit", response_model=QuizResult)
async def submit_quiz(sub: QuizSubmission):
    """Evaluates quiz submission and generates completion certificate."""
    user_name = sub.user_name.strip() or "Sahabat Siaga"
    score = 0
    total = len(QUIZ_QUESTIONS_DATA)
    feedback_list: List[Dict[str, str]] = []

    for q in QUIZ_QUESTIONS_DATA:
        user_answer = sub.answers.get(q.id)
        is_correct = user_answer == q.correct_index
        if is_correct:
            score += 1

        selected_text = q.options[user_answer] if user_answer is not None and user_answer < len(q.options) else "Tidak dijawab"
        correct_text = q.options[q.correct_index]

        feedback_list.append(
            {
                "question_id": q.id,
                "question": q.question,
                "user_answer": selected_text,
                "correct_answer": correct_text,
                "is_correct": "true" if is_correct else "false",
                "explanation": q.explanation,
            }
        )

    pct = round((score / total) * 100, 1) if total > 0 else 0.0
    passed = pct >= 60.0
    cert_id = f"CERT-LS-{uuid.uuid4().hex[:8].upper()}" if passed else None
    date_str = today_iso()

    result = QuizResult(
        user_name=user_name,
        score=score,
        total=total,
        percentage=pct,
        passed=passed,
        certificate_id=cert_id,
        date_issued=date_str,
        detailed_feedback=feedback_list,
    )

    try:
        await db.quiz_results.insert_one(
            {
                "id": str(uuid.uuid4()),
                "user_name": user_name,
                "score": score,
                "total": total,
                "percentage": pct,
                "passed": passed,
                "certificate_id": cert_id,
                "date_issued": date_str,
                "created_at": datetime.now(timezone.utc),
            }
        )
    except Exception:
        pass

    return result