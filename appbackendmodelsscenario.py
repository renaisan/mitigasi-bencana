from pydantic import BaseModel, Field
from typing import List, Optional, Dict
import uuid


class MitigationItem(BaseModel):
    id: str
    text: str
    note: str
    pose: str = "idle"  # idle, prepare, duck, cover, hold, crawl, alert, walk, climb, gather, celebrate
    mood: str = "normal"  # normal, scared
    quake: bool = False
    tsunami: bool = False
    flood: bool = False
    fire: bool = False
    move_x: float = Field(default=0.0, alias="moveX")
    move_y: float = Field(default=0.0, alias="moveY")

    class Config:
        populate_by_name = True


class DisasterPhase(BaseModel):
    key: str  # sebelum, saat, sesudah
    label: str  # Pra-Bencana, Darurat, Pemulihan
    color: str
    tint: str
    icon: str
    items: List[MitigationItem]


class DisasterScenario(BaseModel):
    id: str
    title: str
    icon: str
    scene: str  # rumah, sekolah, pesisir, banjir, kebakaran
    difficulty: str = "Pemula"  # Pemula, Menengah, Lanjutan
    description: str
    phases: List[DisasterPhase]


class ValidationRequest(BaseModel):
    scenario_id: str
    placed_items: Dict[str, str]  # item_id -> phase_key
    ordered_items: List[str]  # list of item_ids in order of slot position


class ItemValidationResult(BaseModel):
    item_id: str
    is_correct_position: bool
    is_correct_phase: bool
    expected_index: int
    actual_index: Optional[int] = None
    expected_phase: str


class ExplanationItem(BaseModel):
    step_number: int
    title: str
    note: str
    phase_label: str
    phase_color: str


class ValidationResponse(BaseModel):
    is_valid: bool
    all_filled: bool
    score_percentage: float
    correct_count: int
    total_count: int
    results: List[ItemValidationResult]
    explanations: List[ExplanationItem]
    feedback_message: str


class QuizQuestion(BaseModel):
    id: str
    scenario_id: str
    question: str
    options: List[str]
    correct_index: int
    explanation: str
    phase: str


class QuizSubmission(BaseModel):
    user_name: str
    answers: Dict[str, int]  # question_id -> selected_index
class QuizResult(BaseModel):
    user_name: str
    score: int
    total: int
    percentage: float
    passed: bool
    certificate_id: Optional[str] = None
    date_issued: str
    detailed_feedback: List[Dict[str, str]]