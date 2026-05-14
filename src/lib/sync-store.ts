'use client';

interface PendingRapportino {
  id: string;
  projectId: string;
  data: any; // FormData serialized or object
  timestamp: number;
}

const SYNC_KEY = 'gestionale_edile_sync_queue';

export const SyncStore = {
  getQueue: (): PendingRapportino[] => {
    if (typeof window === 'undefined') return [];
    try {
      const data = localStorage.getItem(SYNC_KEY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error('Failed to read sync queue', e);
      return [];
    }
  },

  addToQueue: (projectId: string, data: any) => {
    const queue = SyncStore.getQueue();
    const newItem: PendingRapportino = {
      id: crypto.randomUUID(),
      projectId,
      data,
      timestamp: Date.now()
    };
    localStorage.setItem(SYNC_KEY, JSON.stringify([...queue, newItem]));
    return newItem.id;
  },

  removeFromQueue: (id: string) => {
    const queue = SyncStore.getQueue();
    const newQueue = queue.filter(item => item.id !== id);
    localStorage.setItem(SYNC_KEY, JSON.stringify(newQueue));
  },

  pop: (): PendingRapportino | null => {
    const queue = SyncStore.getQueue();
    if (queue.length === 0) return null;
    const item = queue[0];
    SyncStore.removeFromQueue(item.id);
    return item;
  },

  clearQueue: () => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(SYNC_KEY);
  }
};
