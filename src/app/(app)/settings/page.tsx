import { getCompanyProfile, getCurrentUser, getConti } from './settings-actions';
import SettingsClient from './SettingsClient';

export default async function SettingsPage() {
    const user = await getCurrentUser();
    const company = await getCompanyProfile();
    const conti = await getConti();

    return (
        <SettingsClient user={user} company={company} conti={conti} />
    );
}
