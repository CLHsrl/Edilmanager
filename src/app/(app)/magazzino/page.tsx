import { getArticoli, getAttrezzature } from '../magazzino-actions';
import { getProjects } from '../actions';
import { getLavoratori } from '../lavoratori-actions';
import MagazzinoClient from './MagazzinoClient';

export default async function MagazzinoPage() {
    const [articoli, attrezzature, projects, lavoratori] = await Promise.all([
        getArticoli(),
        getAttrezzature(),
        getProjects(),
        getLavoratori()
    ]);

    return <MagazzinoClient 
        articoli={articoli} 
        attrezzature={attrezzature} 
        projects={projects} 
        lavoratori={lavoratori} 
    />;
}
