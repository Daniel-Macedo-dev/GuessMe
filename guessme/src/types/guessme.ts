export type ApiCharacterData = {
  name: string;
  work: string;
  image: string;
};

export type AIResponse = {
  answer: string;
  success: boolean;
  character: ApiCharacterData | null;
};

export type WinnerData = {
  nome: string;
  obra: string;
  imagem: string;
};
