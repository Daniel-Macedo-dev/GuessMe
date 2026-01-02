export type CharacterData = {
  nome: string;
  obra: string;
  imagem: string;
};

export type AIResponse = {
  answer: string;
  success: boolean;
  character: CharacterData | null;
};
