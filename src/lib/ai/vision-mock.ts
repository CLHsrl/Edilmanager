export interface VisionResult {
  detectedObjects: string[];
  safetyScore: number;
  complianceIssues: string[];
  progressEstimate?: number;
}

export async function analyzeSiteImage(imageUrl: string): Promise<VisionResult> {
  // Simulating a Vision AI response (e.g. Google Cloud Vision or Azure Vision)
  
  // Random results for demonstration
  const scenarios = [
    {
      detectedObjects: ['Casco', 'Gilet Alta Visibilità', 'Scavo', 'Tubazioni'],
      safetyScore: 98,
      complianceIssues: [],
      progressEstimate: 15
    },
    {
      detectedObjects: ['Operaio', 'Scala', 'Ponteggio'],
      safetyScore: 65,
      complianceIssues: ['Mancanza parapetto su ponteggio', 'Operaio senza casco'],
      progressEstimate: 45
    },
    {
      detectedObjects: ['Betoniera', 'Getto Calcestruzzo'],
      safetyScore: 92,
      complianceIssues: [],
      progressEstimate: 80
    }
  ];

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(scenarios[Math.floor(Math.random() * scenarios.length)]);
    }, 2000);
  });
}
