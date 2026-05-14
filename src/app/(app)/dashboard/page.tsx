import { getDashboardToDoList } from './dashboard-actions';
import DashboardClient from './DashboardClient';

export default async function Home() {
  const data = await getDashboardToDoList();

  return <DashboardClient data={data as any} />;
}
