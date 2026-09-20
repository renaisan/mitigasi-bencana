from datetime import datetime
from pydantic import BaseModel, Field
from typing import List, Dict, Optional


class MitigationItem(BaseModel):
    id: str
    text: str
    note: str
    pose: str
    mood: str
    quake: bool = False
    tsunami: bool = False
    flood: bool = False
    fire: bool = False
    moveX: int = 0
    moveY: int = 0
    color: Optional[str] = None


class DisasterPhase(BaseModel):
    key: str
    label: str
    color: str
    tint: str
    icon: str
    items: List[MitigationItem]


class DisasterScenario(BaseModel):
    id: str
    title: str
    icon: str
    scene: str
    difficulty: str
    description: str
    phases: List[DisasterPhase]


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


class ValidationRequest(BaseModel):
    scenario_id: str
    ordered_items: List[str]
    placed_items: Dict[str, str]


class ValidationResponse(BaseModel):
    is_valid: bool
    all_filled: bool
    score_percentage: float
    correct_count: int
    total_count: int
    results: List[ItemValidationResult]
    explanations: List[ExplanationItem]
    feedback_message: str


class ExplanationItem(BaseModel):
    step_number: int
    title: str
    note: str
    phase_label: str
    phase_color: str


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
    answers: Dict[str, int]


class QuizResult(BaseModel):
    user_name: str
    score: int
    total: int
    percentage: float
    passed: bool
    certificate_id: Optional[str] = None
    date_issued: str
    created_at: datetime = Field(default_factory=datetime.utcnow)