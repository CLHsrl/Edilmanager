import { getStrategicData, generateInitialMissions } from './advisor-actions';
import StrategicAdvisorClient from './StrategicAdvisorClient';

export default async function StrategyPage() {
  // Ensure we have some missions to show
  await generateInitialMissions();
  
  const data = await getStrategicData();

  return (
    <div className="p-4 md:p-8">
      <StrategicAdvisorClient data={data} />
    </div>
  );
}
