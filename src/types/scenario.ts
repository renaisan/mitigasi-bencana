export type MitigationPose =
  | 'idle'
  | 'prepare'
  | 'duck'
  | 'cover'
  | 'hold'
  | 'crawl'
  | 'alert'
  | 'walk'
  | 'climb'
  | 'gather'
  | 'celebrate';

export type MitigationMood = 'normal' | 'scared';

export interface MitigationItem {
  id: string;
  text: string;
  note: string;
  pose: MitigationPose;
  mood: MitigationMood;
  quake?: boolean;
  tsunami?: boolean;
  flood?: boolean;
  fire?: boolean;
  moveX?: number;
  moveY?: number;
  color?: string;
}

export interface DisasterPhase {
  key: string; // sebelum | saat | sesudah
  label: string; // Pra-Bencana | Darurat | Pemulihan
  color: string;
  tint: string;
  icon: string;
  items: MitigationItem[];
}

export interface DisasterScenario {
  id: string;
  title: string;
  icon: string;
  scene: 'rumah' | 'sekolah' | 'pesisir' | 'banjir' | 'kebakaran';
  difficulty: string;
  description: string;
  phases: DisasterPhase[];
}

export interface ItemValidationResult {
  item_id: string;
  is_correct_position: boolean;
  is_correct_phase: boolean;
  expected_index: number;
  actual_index?: number | null;
  expected_phase: string;
}

export interface ExplanationItem {
  step_number: number;
  title: string;
  note: string;
  phase_label: string;
  phase_color: string;
}

export interface ValidationResponse {
  is_valid: boolean;
  all_filled: boolean;
  score_percentage: number;
  correct_count: number;
  total_count: number;
  results: ItemValidationResult[];
  explanations: ExplanationItem[];
  feedback_message: string;
}

export interface QuizQuestion {
  id: string;
  scenario_id: string;
  question: string;
  options: string[];
  correct_index: number;
  explanation: string;
  phase: string;
}

export interface QuizDetailedFeedback {
  question_id: string;
  question: string;
  user_answer: string;
  correct_answer: string;
  is_correct: string;
  explanation: string;
}

export interface QuizResult {
  user_name: string;
  score: int_or_number;
  total: int_or_number;
  percentage: number;
  passed: boolean;
  certificate_id?: string | null;
  date_issued: string;
  detailed_feedback: QuizDetailedFeedback[];
}

type int_or_number = number;
