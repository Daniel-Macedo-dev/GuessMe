import axios from "axios";

const API_URL = "http://localhost:8080/api/game"; 

export const askAI = async (question) => {
  try {
    const response = await axios.post(`${API_URL}/ask`, { question });
    return response.data;
  } catch (error) {
    console.error("Erro ao chamar a API:", error);
    return { text: "Erro ao conectar com o servidor." };
  }
};
