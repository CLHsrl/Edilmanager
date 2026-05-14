'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { logAuditEvent } from '@/lib/auditLog';
import { randomUUID } from 'crypto';

import { getServerSession } from '@/lib/auth-server';

export async function getNextProjectNumber(clientId: string) {
    const lastProject = await prisma.project.findFirst({
        where: { clientId },
        orderBy: { number: 'desc' }
    });
    return (lastProject?.number ?? 0) + 1;
}

export async function getClientByNumber(number: number) {
    return await prisma.client.findUnique({
        where: { number }
    });
}

export async function assignClientNumber(clientId: string, number: number) {
    // Check if taken
    const existing = await prisma.client.findUnique({ where: { number } });
    if (existing && existing.id !== clientId) {
        throw new Error('Numero già assegnato a ' + existing.name);
    }

    await prisma.client.update({
        where: { id: clientId },
        data: { number }
    });
    revalidatePath('/clients');
}

export async function getClients(query?: string) {
    if (query) {
        return await prisma.client.findMany({
            where: {
                OR: [
                    { name: { contains: query } },
                    { email: { contains: query } },
                    { taxId: { contains: query } }
                ]
            },
            orderBy: { createdAt: 'desc' }
        });
    }
    return await prisma.client.findMany({
        orderBy: { createdAt: 'desc' }
    });
}

// Force recompile 1
export async function createClient(formData: FormData) {
    const type = formData.get('type') as string || 'PRIVATE';
    const email = formData.get('email') as string;
    const phone = formData.get('phone') as string;
    const taxId = formData.get('taxId') as string;
    const address = formData.get('address') as string;
    const city = formData.get('city') as string;
    const cap = formData.get('cap') as string;
    const province = formData.get('province') as string;
    const pec = formData.get('pec') as string;
    const sdiCode = formData.get('sdiCode') as string;
    const notes = formData.get('notes') as string;

    // New fields
    const firstName = formData.get('firstName') as string;
    const lastName = formData.get('lastName') as string;
    const gender = formData.get('gender') as string;
    const companyName = formData.get('companyName') as string;
    const clientNumber = formData.get('number') ? parseInt(formData.get('number') as string) : null;

    // Compute display name
    let name = '';
    if (type === 'COMPANY') {
        name = companyName || formData.get('name') as string; // Fallback to 'name' if companyName missing
    } else {
        name = `${firstName} ${lastName}`.trim();
        if (!name) name = formData.get('name') as string; // Fallback
    }

    const session = await getServerSession();

    const newClient = await prisma.client.create({
        data: {
            type,
            name, // Display name
            number: clientNumber,
            firstName: type === 'PRIVATE' ? firstName : undefined,
            lastName: type === 'PRIVATE' ? lastName : undefined,
            gender: type === 'PRIVATE' ? gender : undefined,
            email,
            phone,
            taxId,
            address,
            city,
            cap,
            province,
            pec,
            sdiCode,
            notes
        }
    });

    await logAuditEvent('CREATE_CLIENT', `CLIENT_ID:${newClient.id}`, `Creato nuovo contatto: ${newClient.name}`, session.userId);

    revalidatePath('/clients');
    redirect('/clients');
}

export async function updateClient(id: string, formData: FormData) {
    // const type = formData.get('type') as string; // Type usually doesn't change
    const firstName = formData.get('firstName') as string;
    const lastName = formData.get('lastName') as string;
    const companyName = formData.get('companyName') as string;
    const gender = formData.get('gender') as string;
    const clientNumber = formData.get('number') ? parseInt(formData.get('number') as string) : null;

    const email = formData.get('email') as string;
    const phone = formData.get('phone') as string;
    const taxId = formData.get('taxId') as string;
    const address = formData.get('address') as string;
    const city = formData.get('city') as string;
    const cap = formData.get('cap') as string;
    const province = formData.get('province') as string;
    const pec = formData.get('pec') as string;
    const sdiCode = formData.get('sdiCode') as string;

    // We infer name update
    // If specific fields are provided, we update name.
    let name = formData.get('name') as string; // Default to existing simple name field if provided

    if (companyName) {
        name = companyName;
    } else if (firstName && lastName) {
        name = `${firstName} ${lastName}`.trim();
    }

    await prisma.client.update({
        where: { id },
        data: {
            name,
            number: clientNumber,
            firstName: firstName || undefined,
            lastName: lastName || undefined,
            gender: gender || undefined,
            email,
            phone,
            taxId,
            address,
            city,
            cap,
            province,
            pec,
            sdiCode
        }
    });

    revalidatePath('/clients');
    redirect('/clients');
}

export async function deleteClient(id: string) {
    await prisma.client.delete({ where: { id } });
    revalidatePath('/clients');
}

// --- PROJECTS ---

export async function getProjects(query?: string) {
    if (query) {
        return await prisma.project.findMany({
            where: {
                OR: [
                    { name: { contains: query } },
                    { client: { name: { contains: query } } }
                ]
            },
            include: { 
                client: true,
                lavoratori: {
                    select: {
                        id: true,
                        nome: true,
                        cognome: true
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });
    }
    return await prisma.project.findMany({
        include: { 
            client: true,
            lavoratori: {
                select: {
                    id: true,
                    nome: true,
                    cognome: true
                }
            }
        },
        orderBy: { createdAt: 'desc' }
    });
}

export async function createProject(formData: FormData) {
    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    const clientId = formData.get('clientId') as string; // Existing client
    const budget = formData.get('budget') ? parseFloat(formData.get('budget') as string) : null;
    const status = formData.get('status') as string;

    // Handle new client creation if 'newClientName' is present and no clientId
    let finalClientId = clientId;
    const newClientName = formData.get('newClientName') as string;

    if (!clientId && newClientName) {
        const newClient = await prisma.client.create({
            data: { name: newClientName }
        });
        finalClientId = newClient.id;
    }

    if (!finalClientId) {
        throw new Error("Client is required");
    }

    // Calculate next project number for this client
    const lastProject = await prisma.project.findFirst({
        where: { clientId: finalClientId },
        orderBy: { number: 'desc' }
    });
    const nextNumber = (lastProject?.number ?? 0) + 1;

    // Auto-generate name if not provided or to enforce pattern
    // The user wants "number project", so we use the number as the primary ID displayed.
    // We can stick to a convention for the name.
    const finalName = name || `Progetto #${nextNumber}`;

    const newProject = await prisma.project.create({
        data: {
            name: finalName,
            number: nextNumber,
            description,
            clientId: finalClientId,
            budget,
            status: status || 'ONGOING',
            latitude: formData.get('latitude') ? parseFloat(formData.get('latitude') as string) : null,
            longitude: formData.get('longitude') ? parseFloat(formData.get('longitude') as string) : null,
            portalKey: randomUUID()
        }
    });

    revalidatePath('/projects');
    revalidatePath('/clients');
    redirect(`/projects/${newProject.id}`);
}

export async function generatePortalKey(projectId: string) {
    const session = await getServerSession();
    const portalKey = randomUUID();
    
    await prisma.project.update({
        where: { id: projectId },
        data: { portalKey }
    });

    await logAuditEvent('ACTIVATE_PORTAL', `PROJECT_ID:${projectId}`, `Attivazione portale cliente con chiave: ${portalKey}`, session.userId);
    revalidatePath(`/projects/${projectId}`);
    return { success: true, portalKey };
}

export async function updateProjectStatus(id: string, status: string) {
    await prisma.project.update({
        where: { id },
        data: { status }
    });
    revalidatePath('/projects');
}

export async function updateProject(id: string, formData: FormData) {
    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    const budget = formData.get('budget') ? parseFloat(formData.get('budget') as string) : null;
    const status = formData.get('status') as string;
    const startDate = formData.get('startDate') ? new Date(formData.get('startDate') as string) : undefined;
    const endDate = formData.get('endDate') ? new Date(formData.get('endDate') as string) : undefined;

    await prisma.project.update({
        where: { id },
        data: {
            name,
            description,
            budget,
            status,
            startDate,
            endDate,
            latitude: formData.get('latitude') ? parseFloat(formData.get('latitude') as string) : null,
            longitude: formData.get('longitude') ? parseFloat(formData.get('longitude') as string) : null,
        }
    });

    revalidatePath('/projects');
    revalidatePath(`/projects/${id}`);
    redirect(`/projects/${id}`);
}


export async function deleteProject(id: string) {
    const session = await getServerSession();
    if (session.role !== 'ADMIN') {
        throw new Error('AUTHORIZATION ERROR: Solo la Direzione può eliminare un cantiere. Contatta un Super Admin.');
    }

    const prj = await prisma.project.findUnique({ where: { id } });
    await prisma.project.delete({ where: { id } });
    
    await logAuditEvent('DELETE_PROJECT', `PROJECT_ID:${id}`, `Eliminato cantiere ${prj?.number} - ${prj?.name}`, session.userId);
    
    revalidatePath('/projects');
    redirect('/projects');
}

// --- WORKFLOW TASKS ---

export async function createTask(formData: FormData) {
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const priority = formData.get('priority') as string;
    const roleScope = formData.get('roleScope') as string;
    const dueDate = formData.get('dueDate') ? new Date(formData.get('dueDate') as string) : null;
    const assignedToId = formData.get('assignedToId') as string;
    const lavoratoreId = formData.get('lavoratoreId') as string;

    await prisma.workflowTask.create({
        data: {
            title,
            description,
            priority,
            roleScope,
            dueDate,
            assignedToId: assignedToId || null,
            lavoratoreId: lavoratoreId || null,
            status: 'TODO'
        }
    });

    revalidatePath('/workflows');
    redirect('/workflows');
}

export async function updateTask(id: string, formData: FormData) {
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const priority = formData.get('priority') as string;
    const roleScope = formData.get('roleScope') as string;
    const dueDate = formData.get('dueDate') ? new Date(formData.get('dueDate') as string) : null;
    const status = formData.get('status') as string;
    const assignedToId = formData.get('assignedToId') as string;
    const lavoratoreId = formData.get('lavoratoreId') as string;

    await prisma.workflowTask.update({
        where: { id },
        data: {
            title,
            description,
            priority,
            roleScope,
            dueDate,
            status,
            assignedToId: assignedToId || undefined,
            lavoratoreId: lavoratoreId || undefined
        }
    });

    revalidatePath('/workflows');
    revalidatePath(`/workflows/${id}`);
    redirect('/workflows');
}

export async function deleteTask(id: string) {
    await prisma.workflowTask.delete({ where: { id } });
    revalidatePath('/workflows');
}

// Project Items (Lavori) Actions
export async function addProjectItem(projectId: string, formData: FormData) {
    const description = formData.get('description') as string;
    const unit = formData.get('unit') as string;
    const unitPrice = parseFloat(formData.get('unitPrice') as string || formData.get('price') as string || '0');
    const quantity = parseFloat(formData.get('quantity') as string || '0');
    const totalPrice = unitPrice * quantity;
    const startDateRaw = formData.get('startDate') as string;
    const endDateRaw = formData.get('endDate') as string;

    await prisma.projectItem.create({
        data: {
            projectId,
            description,
            unit,
            unitPrice,
            quantity,
            totalPrice,
            startDate: startDateRaw ? new Date(startDateRaw) : undefined,
            endDate: endDateRaw ? new Date(endDateRaw) : undefined,
        }
    });

    await syncProjectBudget(projectId);
    await syncProjectStatus(projectId);
    revalidatePath(`/projects/${projectId}`);
}

export async function updateProjectItemGantt(itemId: string, projectId: string, data: { startDate: Date, endDate: Date, progress?: number }) {
    await prisma.projectItem.update({
        where: { id: itemId },
        data: {
            startDate: data.startDate,
            endDate: data.endDate,
            completed: data.progress === 100 ? true : undefined
        }
    });
    revalidatePath(`/projects/${projectId}`);
}

export async function deleteProjectItem(itemId: string, projectId: string) {
    await prisma.projectItem.delete({
        where: { id: itemId }
    });

    await syncProjectBudget(projectId);
    await syncProjectStatus(projectId);
    revalidatePath(`/projects/${projectId}`);
}

async function syncProjectBudget(projectId: string) {
    const items = await prisma.projectItem.findMany({
        where: { projectId }
    });

    const totalBudget = items.reduce((sum: number, item: any) => sum + (item.totalPrice || 0), 0);

    await prisma.project.update({
        where: { id: projectId },
        data: { budget: totalBudget }
    });
}

export async function toggleProjectItemCompletion(itemId: string, completed: boolean, projectId: string) {
    await prisma.projectItem.update({
        where: { id: itemId },
        data: { completed }
    });

    await syncProjectStatus(projectId);
    revalidatePath(`/projects/${projectId}`);
}

async function syncProjectStatus(projectId: string) {
    const items = await prisma.projectItem.findMany({
        where: { projectId }
    });

    if (items.length === 0) return;

    const allCompleted = items.length > 0 && items.every(item => item.completed === true);
    const newStatus = allCompleted ? 'COMPLETED' : 'ONGOING';

    await prisma.project.update({
        where: { id: projectId },
        data: { status: newStatus }
    });
}
export async function searchClients(query: string) {
    if (!query) return [];
    return await prisma.client.findMany({
        where: {
            OR: [
                { name: { contains: query } },
                { firstName: { contains: query } },
                { lastName: { contains: query } },
                { taxId: { contains: query } },
            ]
        },
        take: 10
    });
}

export async function searchProjectsByClient(clientId: string, query: string) {
    return await prisma.project.findMany({
        where: {
            clientId,
            OR: [
                { name: { contains: query } },
                { description: { contains: query } },
            ]
        },
        include: {
            items: true
        }
    });
}

export async function createQuote(data: {
    clientId: string;
    projectIds: string[];
    vatType: string;
    items: any[];
}) {
    const lastQuote = await prisma.quote.findFirst({
        orderBy: { number: 'desc' }
    });
    const nextNumber = (lastQuote?.number ?? 0) + 1;

    let taxableAmount = 0;
    const itemsData = data.items.map((item, index) => {
        const itemTotal = item.type === 'ITEM' ? (item.price || 0) * (item.quantity || 0) : 0;
        if (item.type === 'ITEM') taxableAmount += itemTotal;

        return {
            type: item.type,
            description: item.description,
            unit: item.unit,
            price: item.price,
            quantity: item.quantity,
            total: itemTotal,
            order: index,
            priceItemId: item.priceItemId
        };
    });

    const vatRate = data.vatType === '10%' ? 0.1 : data.vatType === '22%' ? 0.22 : 0;
    const vatAmount = taxableAmount * vatRate;
    const total = taxableAmount + vatAmount;

    const newQuote = await prisma.quote.create({
        data: {
            number: nextNumber,
            clientId: data.clientId,
            vatType: data.vatType,
            taxableAmount,
            vatAmount,
            total,
            projects: {
                connect: data.projectIds.map(id => ({ id }))
            },
            items: {
                create: itemsData
            }
        }
    });

    revalidatePath('/quotes');
    redirect(`/quotes/${newQuote.id}`);
}
