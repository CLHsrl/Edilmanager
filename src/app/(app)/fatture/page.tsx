import { getFatture, getFattureDashboardStats } from '../fatture-actions';
import { getProjects } from '../actions';
import FattureClient from './FattureClient';

export default async function FatturePage() {
  const [fatture, stats, projects] = await Promise.all([
    getFatture(),
    getFattureDashboardStats(),
    getProjects()
  ]);

  return <FattureClient fatture={fatture as any} stats={stats} projects={projects as any} />;
}
