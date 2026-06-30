export type AgentRankId =
  | "recruta"
  | "analista"
  | "investigador"
  | "detetive"
  | "arquivista"
  | "mestre";

export type AgentRank = {
  id: AgentRankId;
  title: string;
  minCases: number;
  stamp: string;
};

export type AchievementCategory =
  | "Casos"
  | "Eficiência"
  | "Evidências"
  | "Categorias"
  | "Arquivo";

export type AchievementId =
  | "primeiro_caso"
  | "sequencia_inicial"
  | "arquivo_robusto"
  | "investigacao_cirurgica"
  | "sem_ajuda"
  | "cacador_de_pistas"
  | "especialista_confirmacoes"
  | "cetico_profissional"
  | "teoria_aberta"
  | "multiverso"
  | "arquivista_local";

export type AchievementStatus = "locked" | "unlocked";

export type Achievement = {
  id: AchievementId;
  title: string;
  description: string;
  category: AchievementCategory;
  status: AchievementStatus;
  progress: number;
  goal: number;
};

export type AchievementProgress = {
  current: number;
  goal: number;
  percent: number;
};

export type PlayerProgression = {
  rank: AgentRank;
  nextRank: AgentRank | null;
  progressToNext: AchievementProgress | null;
  achievements: Achievement[];
  unlockedCount: number;
  totalCount: number;
};
