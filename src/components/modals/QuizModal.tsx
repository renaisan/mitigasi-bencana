import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { soundEngine } from '@/lib/audio';
import { triggerConfetti } from '@/lib/confetti';
import { apiPost } from '@/lib/api';
import type { QuizQuestion, QuizResult } from '@/types/scenario';
import { Award, CheckCircle, XCircle, ArrowRight, RotateCcw } from 'lucide-react';

interface QuizModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  questions: QuizQuestion[];
  onCertificateEarned: (result: QuizResult) => void;
}

export const QuizModal: React.FC<QuizModalProps> = ({
  open,
  onOpenChange,
  questions,
  onCertificateEarned,
}) => {
  const [userName, setUserName] = useState('');
  const [currentIdx, setCurrentIdx] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, number>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [quizResult, setQuizResult] = useState<QuizResult | null>(null);

  const currentQ = questions[currentIdx];
  const selectedAnswer = currentQ ? userAnswers[currentQ.id] : undefined;

  const handleSelectOption = (optIdx: number) => {
    if (!currentQ) return;
    soundEngine.playPop();
    setUserAnswers((prev) => ({
      ...prev,
      [currentQ.id]: optIdx,
    }));
  };

  const handleNext = () => {
    soundEngine.playSnap();
    if (currentIdx < questions.length - 1) {
      setCurrentIdx((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIdx > 0) {
      setCurrentIdx((prev) => prev - 1);
    }
  };

  const handleSubmitQuiz = async () => {
    if (!userName.trim()) {
      alert('Silakan masukkan nama Anda untuk mencetak sertifikat!');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await apiPost<QuizResult>('/scenarios/quiz/submit', {
        user_name: userName.trim(),
        answers: userAnswers,
      });

      setQuizResult(res);

      if (res.passed) {
        soundEngine.playSuccessFanfare();
        triggerConfetti();
      } else {
        soundEngine.playErrorBuzzer();
      }
    } catch {
      // Fallback local evaluation if backend offline
      let score = 0;
      questions.forEach((q) => {
        if (userAnswers[q.id] === q.correct_index) {
          score += 1;
        }
      });
      const pct = Math.round((score / questions.length) * 100);
      const passed = pct >= 60;
      const fakeResult: QuizResult = {
        user_name: userName || 'Sahabat Siaga',
        score,
        total: questions.length,
        percentage: pct,
        passed,
        certificate_id: passed ? `CERT-LS-${Math.floor(Math.random() * 900000 + 100000)}` : null,
        date_issued: new Date().toISOString().split('T')[0],
        detailed_feedback: questions.map((q) => ({
          question_id: q.id,
          question: q.question,
          user_answer: userAnswers[q.id] !== undefined ? q.options[userAnswers[q.id]] : 'Tidak dijawab',
          correct_answer: q.options[q.correct_index],
          is_correct: userAnswers[q.id] === q.correct_index ? 'true' : 'false',
          explanation: q.explanation,
        })),
      };
      setQuizResult(fakeResult);
      if (passed) {
        soundEngine.playSuccessFanfare();
        triggerConfetti();
      } else {
        soundEngine.playErrorBuzzer();
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetQuiz = () => {
    setCurrentIdx(0);
    setUserAnswers({});
    setQuizResult(null);
  };

  const answeredCount = Object.keys(userAnswers).length;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        data-testid="quiz-modal-content"
        className="max-w-xl rounded-2xl p-6 bg-white border border-slate-200 shadow-2xl max-h-[90vh] overflow-y-auto"
      >
        <DialogHeader>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center text-xl font-bold">
              🎓
            </div>
            <div>
              <DialogTitle className="text-xl font-heading font-extrabold text-slate-800">
                Kuis Tanggap Bencana
              </DialogTitle>
              <DialogDescription className="text-xs text-slate-500">
                Uji pemahaman mitigasi dan dapatkan Sertifikat Resmi Siaga!
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {!quizResult ? (
          <div className="flex flex-col gap-4 my-2">
            {/* User name input */}
            <div className="flex flex-col gap-1.5 bg-slate-50 p-3 rounded-xl border border-slate-200">
              <label className="text-xs font-bold text-slate-700">
                Nama Lengkap Anda (Untuk Sertifikat):
              </label>
              <Input
                data-testid="quiz-username-input"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="Contoh: Budi Santoso"
                className="bg-white rounded-xl text-sm"
              />
            </div>

            {/* Quiz Progress */}
            <div className="flex items-center justify-between text-xs font-bold text-slate-500">
              <span>
                Pertanyaan <b className="text-blue-600">{currentIdx + 1}</b> dari{' '}
                {questions.length}
              </span>
              <span className="bg-slate-100 px-2 py-0.5 rounded-md">
                Terjawab: {answeredCount}/{questions.length}
              </span>
            </div>

            {/* Question Card */}
            {currentQ && (
              <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-100 flex flex-col gap-3">
                <span className="text-[10px] font-extrabold tracking-wider uppercase text-blue-600 bg-white/80 self-start px-2 py-0.5 rounded-md">
                  Fase {currentQ.phase}
                </span>
                <p className="text-sm font-bold text-slate-800 leading-snug">
                  {currentQ.question}
                </p>

                {/* Options */}
                <div className="flex flex-col gap-2 mt-1">
                  {currentQ.options.map((opt, optIdx) => {
                    const isPicked = selectedAnswer === optIdx;
                    return (
                      <button
                        key={optIdx}
                        type="button"
                        data-testid={`quiz-option-${optIdx}`}
                        onClick={() => handleSelectOption(optIdx)}
                        className={`text-left text-xs p-3 rounded-xl border transition-all flex items-start gap-2.5 ${
                          isPicked
                            ? 'bg-blue-600 text-white font-bold border-blue-600 shadow-sm'
                            : 'bg-white text-slate-700 hover:bg-slate-50 border-slate-200 font-medium'
                        }`}
                      >
                        <span
                          className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5 ${
                            isPicked
                              ? 'bg-white text-blue-600'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {String.fromCharCode(65 + optIdx)}
                        </span>
                        <span className="leading-snug flex-1">{opt}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Nav buttons */}
            <div className="flex items-center justify-between pt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handlePrev}
                disabled={currentIdx === 0}
                className="rounded-xl text-xs font-bold"
              >
                Sebelumnya
              </Button>

              {currentIdx < questions.length - 1 ? (
                <Button
                  type="button"
                  data-testid="quiz-next-button"
                  size="sm"
                  onClick={handleNext}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs"
                >
                  Berikutnya
                  <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </Button>
              ) : (
                <Button
                  type="button"
                  data-testid="quiz-submit-button"
                  size="sm"
                  onClick={handleSubmitQuiz}
                  disabled={isSubmitting || answeredCount === 0}
                  className="bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-bold rounded-xl text-xs shadow-md shadow-emerald-500/20"
                >
                  {isSubmitting ? 'Memproses...' : 'Selesai & Nilai Kuis'}
                </Button>
              )}
            </div>
          </div>
        ) : (
          /* Quiz Results View */
          <div className="flex flex-col gap-4 my-2 text-center">
            <div
              className={`p-6 rounded-2xl flex flex-col items-center gap-2 ${
                quizResult.passed
                  ? 'bg-emerald-50 border border-emerald-200 text-emerald-950'
                  : 'bg-rose-50 border border-rose-200 text-rose-950'
              }`}
            >
              <span className="text-4xl">{quizResult.passed ? '🏆' : '📚'}</span>
              <h3 className="text-xl font-heading font-extrabold">
                {quizResult.passed ? 'Selamat, Anda Lulus!' : 'Perlu Latihan Lagi'}
              </h3>
              <p className="text-xs max-w-sm text-slate-600">
                {quizResult.user_name}, skor Anda adalah{' '}
                <b className="text-slate-900 font-extrabold text-base">
                  {quizResult.score} / {quizResult.total} ({quizResult.percentage}%)
                </b>
              </p>

              {quizResult.passed && (
                <Button
                  type="button"
                  data-testid="view-certificate-button"
                  onClick={() => {
                    onCertificateEarned(quizResult);
                  }}
                  className="mt-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-extrabold rounded-xl px-5 shadow-lg shadow-amber-500/30"
                >
                  <Award className="w-4 h-4 mr-2" />
                  Lihat Sertifikat Kelulusan
                </Button>
              )}
            </div>

            {/* Detailed answers review */}
            <div className="flex flex-col gap-2 text-left max-h-[220px] overflow-y-auto pr-1">
              <h4 className="text-xs font-bold text-slate-700">Pembahasan Jawaban:</h4>
              {quizResult.detailed_feedback.map((fb, i) => (
                <div
                  key={i}
                  className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs flex flex-col gap-1"
                >
                  <div className="flex items-center justify-between font-bold text-slate-800">
                    <span>
                      {i + 1}. {fb.question}
                    </span>
                    {fb.is_correct === 'true' ? (
                      <span className="text-emerald-600 flex items-center gap-1 shrink-0 text-[11px]">
                        <CheckCircle className="w-3.5 h-3.5" /> Benar
                      </span>
                    ) : (
                      <span className="text-rose-600 flex items-center gap-1 shrink-0 text-[11px]">
                        <XCircle className="w-3.5 h-3.5" /> Salah
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500">{fb.explanation}</p>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between pt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleResetQuiz}
                className="rounded-xl text-xs font-bold"
              >
                <RotateCcw className="w-3.5 h-3.5 mr-1" />
                Ulangi Kuis
              </Button>

              <Button
                type="button"
                onClick={() => onOpenChange(false)}
                className="bg-slate-800 hover:bg-slate-900 text-white font-bold rounded-xl text-xs px-4"
              >
                Tutup
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
