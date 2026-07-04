// lib/types.ts
// Единый контракт данных между модулями M0–M10.
// ВАЖНО: каждый модуль принимает и отдаёт только эти типы — это то,
// что делает модули независимыми и заменяемыми (см. архитектуру v2.1, п.7).

export type ThoughtType =
  | "observation"   // наблюдение
  | "mistake"       // ошибка
  | "story"         // история
  | "myth"          // миф
  | "question"      // вопрос
  | "situation";    // ситуация

export type ContentForm =
  | "story"
  | "observation"
  | "dialogue"
  | "mistake"
  | "myth"
  | "reflection"
  | "situation";

export type TargetEffect =
  | "recognize_self"     // узнать себя
  | "calm_down"          // успокоиться
  | "reflect"             // задуматься
  | "change_perspective"  // изменить взгляд
  | "want_to_dig_deeper"; // захотеть разобраться глубже

export type MaterialType =
  | "reels"
  | "carousel"
  | "story_1"
  | "story_2"
  | "story_3"
  | "tg_post"
  | "live_topic"
  | "comment_ideas"
  | "titles_descriptions";

// ---------- M0 — Стратег проекта ----------

export type M0Verdict = "pass" | "suggest_angle" | "suggest_alternative";

export interface M0Input {
  thoughtRaw: string;
  // контекст, который M0 читает, чтобы судить редакторски (см. 6.1/6.2)
  recentMaterialsSummary: string[]; // короткие саммари последних N материалов
  growthMapGaps: GrowthMapStage[];   // этапы карты, давно не освещённые
}

export interface M0Output {
  verdict: M0Verdict;
  reasoning: string;          // почему принято такое решение — редакторская реплика
  suggestedAngle?: string;    // если suggest_angle
  suggestedAlternative?: {    // если suggest_alternative
    thought: string;
    growthStageId: string;
  };
}

// ---------- M1 — Анализ мысли ----------

export interface M1Output {
  thoughtRefined: string;
  thoughtType: ThoughtType;
}

// ---------- M2 — Проверка повторов ----------

export interface M2Output {
  isDuplicate: boolean;
  similarMaterialIds: string[];
  newAngleFound: boolean;
}

// ---------- M3 — Этап карты роста ----------

export interface GrowthMapStage {
  id: string;
  order: number;
  name: string;
  description: string;
}

export interface M3Output {
  growthStageId: string;
}

// ---------- M4 — Цель воздействия ----------

export interface M4Output {
  targetEffect: TargetEffect;
}

// ---------- M5 — Форма раскрытия ----------

export interface M5Output {
  form: ContentForm;
}

// ---------- M6 — База знаний (стиль) ----------
// НАПОЛНЕНИЕ ЖДЁТ документы: "База знаний" (получен, базовый стиль есть),
// "Контроль качества" (документ 7, не получен) — уточнит автопроверку.

export interface M6Output {
  styleRules: string[];       // разговорные обороты, запрещённые фразы
  brandVoiceNotes: string[];
}

// ---------- M7 — Контентный движок ----------
// СТАТУС: STUB. Ждём документ 5 "Контентный движок" — правила трансформации
// мысли в комплект материалов. Текущая реализация — временный fallback,
// использующий только базу знаний из документов 1–3.

export interface M7Output {
  materials: Array<{ type: MaterialType; content: string }>;
}

// ---------- M8 — Проверка качества ----------
// СТАТУС: STUB. Ждём документ 7 "Контроль качества" — конкретные
// автоматические критерии. Сейчас — общая проверка по правилам из
// документа 1 (нет банальностей, нет канцелярита, одна мысль).

export interface M8Output {
  passed: boolean;
  feedback?: string;
}

// ---------- M9 — Связывание материалов ----------

export interface M9Output {
  connections: Array<{
    toMaterialId: string;
    meaning: string;
  }>;
}

// ---------- Проект целиком ----------

export interface Project {
  id: string;
  thoughtRaw: string;
  thoughtRefined: string;
  thoughtType: ThoughtType;
  growthStageId: string;
  brandMeaningId?: string; // заделка под 6.3, пусто в v1
  targetEffect: TargetEffect;
  form: ContentForm;
  status: "draft" | "approved" | "published";
  createdAt: string;
}

// ---------- Ответ пайплайна фронтенду ----------

export type PipelineResult =
  | { kind: "editorial_response"; verdict: M0Verdict; output: M0Output }
  | { kind: "project_created"; project: Project; materials: M7Output["materials"] };

// ---------- SSE-события статус-экрана ----------

export type PipelineStage =
  | "m0_strategist"
  | "m1_analyze"
  | "m2_duplicates"
  | "m3_growth_stage"
  | "m4_target_effect"
  | "m5_form"
  | "m6_knowledge_base"
  | "m7_content_engine"
  | "m8_quality_check"
  | "m9_connections"
  | "m10_storage"
  | "done";

export interface PipelineProgressEvent {
  stage: PipelineStage;
  label: string; // текст для UI ("оцениваю мысль…", "собираю материалы…")
}
