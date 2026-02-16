
import { GoogleGenAI, Type } from "@google/genai";
import { QuestionParams, SlideParams, LessonPlanParams } from "../types";

const SYSTEM_INSTRUCTION = `
Aja como um mestre escolar brasileiro, um mago da pedagogia. 
Você é especialista em BNCC e metodologias de ensino.
Sua tarefa é criar materiais didáticos precisos, eficientes e engajadores.
Sempre siga os códigos de habilidade fornecidos e valide suas escolhas com a base técnica da BNCC.
`;

export const suggestBnccSkills = async (grade: string, discipline: string, subject: string, availableSkills: string[]) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const prompt = `
    Com base no Ano: ${grade}, Disciplina: ${discipline} e Assunto: "${subject}".
    Dentre estas habilidades da BNCC:
    ${availableSkills.join('\n')}
    
    Quais são as 2 ou 3 mais pertinentes? Retorne APENAS os códigos/textos exatos das habilidades selecionadas, um por linha.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: { systemInstruction: SYSTEM_INSTRUCTION }
    });
    return response.text?.split('\n').map(s => s.trim()).filter(s => s.length > 0) || [];
  } catch (error) {
    console.error("Error suggesting skills:", error);
    return [];
  }
};

export const generateQuestions = async (params: QuestionParams) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const textPart = {
    text: `
      Crie ${params.count} questões para o nível: ${params.grade}.
      Disciplina: ${params.discipline}.
      Assunto: "${params.subject}".
      Contexto Pedagógico: ${params.context}.
      Habilidades BNCC selecionadas: ${params.bnccSkills.join(', ')}.
      Detalhes Adicionais da BNCC solicitados pelo professor: ${params.bnccManualDetails || 'Nenhum'}.
      Idioma: ${params.language}.
      Outros detalhes: ${params.additionalDetails}.
      
      ${params.fileData ? 'Utilize o conteúdo do arquivo anexo como base extra para as questões.' : ''}

      ESTRUTURA DA RESPOSTA:
      1. Cabeçalho Escolar Completo.
      2. Enunciados claros e objetivos, contextualizados.
      3. Para questões de múltipla escolha, use 5 alternativas (A a E).
      4. Gabarito detalhado e comentado ao final.
    `
  };

  const contents: any[] = [textPart];
  if (params.fileData) {
    contents.unshift({
      inlineData: {
        data: params.fileData.data,
        mimeType: params.fileData.mimeType
      }
    });
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: { parts: contents },
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        tools: params.webSearch ? [{ googleSearch: {} }] : undefined,
      },
    });
    
    let text = response.text || "";
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    if (params.webSearch && groundingChunks && Array.isArray(groundingChunks)) {
      const links = groundingChunks
        .filter(chunk => chunk.web)
        .map(chunk => `\n- [${chunk.web!.title}](${chunk.web!.uri})`)
        .join('');
      
      if (links) {
        text += `\n\n### Fontes de Pesquisa (Validação Pedagógica):\n${links}`;
      }
    }
    
    return text;
  } catch (error) {
    console.error("Error generating questions:", error);
    throw error;
  }
};

export const generateSlidesOutline = async (params: SlideParams) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const textPart = {
    text: `
      Crie uma apresentação de slides COMPLETA e PRONTA PARA USO com exatamente ${params.count} slides.
      Assunto: "${params.subject}".
      Disciplina: ${params.discipline}.
      Série/Ano: ${params.grade}.
      Contexto da Turma: ${params.context}.
      Duração estimada da aula: ${params.duration}.
      Idioma: ${params.language}.
      Habilidades BNCC: ${params.bnccSkills.join(', ')}.
      Detalhes adicionais: ${params.additionalDetails}.
      
      ${params.fileData ? 'Utilize o conteúdo do arquivo anexo como base de informação principal para os slides.' : ''}

      IMPORTANTE: Formate cada slide separado por "--- SLIDE [NÚMERO] ---".
      Cada slide deve ter um "TÍTULO: [Texto]" e "CONTEÚDO: [Tópicos detalhados]".
    `
  };

  const contents: any[] = [textPart];
  if (params.fileData) {
    contents.unshift({
      inlineData: {
        data: params.fileData.data,
        mimeType: params.fileData.mimeType
      }
    });
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: { parts: contents },
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        tools: params.webSearch ? [{ googleSearch: {} }] : undefined,
      }
    });
    
    let text = response.text || "";
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    if (params.webSearch && groundingChunks && Array.isArray(groundingChunks)) {
      const links = groundingChunks
        .filter(chunk => chunk.web)
        .map(chunk => `\n- [${chunk.web!.title}](${chunk.web!.uri})`)
        .join('');
      
      if (links) {
        text += `\n\n### Fontes de Pesquisa Consultadas:\n${links}`;
      }
    }
    
    return text;
  } catch (error) {
    console.error("Error generating slides:", error);
    throw error;
  }
};

export const generateLessonPlan = async (params: LessonPlanParams) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const prompt = `
    Crie um Plano de Aula estruturado para o período: ${params.period}.
    Ano de escolaridade: ${params.grade}.
    Disciplina: ${params.discipline}.
    Planejamento Multidisciplinar: ${params.multidisciplinary ? 'Sim (integre com outras áreas)' : 'Não (foco exclusivo na disciplina)'}.
    Dias da semana: ${params.days.join(', ')}.
    Habilidades BNCC: ${params.bnccSkills.join(', ')}.
    Detalhes Adicionais: ${params.additionalDetails || 'Nenhum'}.

    ESTRUTURA DO PLANO:
    1. Objetivos Gerais e Específicos.
    2. Sequência Didática detalhada por aula/dia.
    3. Metodologias e Recursos Necessários.
    4. Avaliação e Critérios.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: { systemInstruction: SYSTEM_INSTRUCTION }
    });
    return response.text || "Erro ao gerar plano de aula.";
  } catch (error) {
    console.error("Error generating lesson plan:", error);
    throw error;
  }
};

export const generateThematicImage = async (subject: string, discipline: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const prompt = `Uma ilustração didática e elegante para um slide escolar sobre o tema: "${subject}" da disciplina de ${discipline}. Estilo limpo, acadêmico, sem textos confusos, cores suaves.`;
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: [{ parts: [{ text: prompt }] }],
      config: {
        imageConfig: {
          aspectRatio: "16:9"
        }
      }
    });

    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
      }
    }
    return null;
  } catch (error) {
    console.error("Error generating image:", error);
    return null;
  }
};
