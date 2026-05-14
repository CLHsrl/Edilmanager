'use server';

import { analyzeProjectBudget } from '@/lib/ai/budget-guardian';
import { generateSiteAISummary } from '@/lib/ai/site-summary';
import { suggestRfiAnswer } from '@/lib/ai/rfi-suggest';
import { analyzeSiteImage } from '@/lib/ai/vision-mock';

export async function getBudgetAnalysis(projectId: string) {
    try {
        const analysis = await analyzeProjectBudget(projectId);
        return { success: true, data: analysis };
    } catch (error) {
        console.error("Budget Analysis Error:", error);
        return { success: false, error: "Impossibile calcolare l'analisi del budget." };
    }
}

export async function getSiteSummary(projectId: string) {
    try {
        const summary = await generateSiteAISummary(projectId);
        return { success: true, data: summary };
    } catch (error) {
        console.error("Site Summary Error:", error);
        return { success: false, error: "Impossibile generare il riassunto AI." };
    }
}

export async function getRfiSuggestion(projectId: string, title: string, question: string) {
    try {
        const suggestion = await suggestRfiAnswer(projectId, title, question);
        return { success: true, data: suggestion };
    } catch (error) {
        console.error("RFI Suggestion Error:", error);
        return { success: false, error: "Impossibile generare il suggerimento RFI." };
    }
}

export async function getVisionAnalysis(imageUrl: string) {
    try {
        const analysis = await analyzeSiteImage(imageUrl);
        return { success: true, data: analysis };
    } catch (error) {
        console.error("Vision Analysis Error:", error);
        return { success: false, error: "Impossibile analizzare l'immagine." };
    }
}

export async function processSafetyConversation(messages: { role: string; content: string }[]) {
    // Mock for Safety Copilot
    if (messages.length === 2) {
        return {
            content: "Ottimo. Ho analizzato la descrizione. Quali attrezzature principali prevedete di utilizzare (es. gru, ponteggi, escavatori)?",
            nextStep: 2
        };
    }

    return {
        content: "Ho elaborato tutti i dati. Ecco una bozza del POS con i rischi rilevati e le misure di prevenzione suggerite. Puoi procedere con il salvataggio ufficiale.",
        nextStep: 3,
        draft: {
            risks: ["Caduta dall'alto", "Rischio elettrico", "Rumore", "Polveri"],
            equipment: ["Gru a torre", "Ponteggio fisso", "Trapani", "Flessibili"]
        }
    };
}

export async function parseNaturalLanguageRapportino(text: string, projectId: string) {
    // Mock NLP parser
    return {
        lavoratori: [{ lavoratoreId: 'dummy-id', ore: 8 }],
        articoli: [{ articoloMagazzinoId: 'dummy-art', quantita: 10 }],
        attivita: "Lavori generici di cantiere basati su analisi NLP"
    };
}

export async function analyzePhotoSafety(photoData: string) {
    // Mock safety analysis
    return {
        helmetDetected: true,
        confidence: 0.98,
        detectedObjects: ["Casco", "Gilet", "Escavatore"],
        warning: null
    };
}
