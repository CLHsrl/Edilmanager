import { prisma } from './prisma';

/**
 * Logs a system event to the SystemAuditLog table.
 * Used to provide traceable history for operations, adhering to ISO 9001 and strict governance.
 * @param action String describing the action (e.g. 'DELETE_FATTURA', 'UPDATE_BUDGET')
 * @param resource String identifying the resource affected (e.g. 'FATTURA_ID')
 * @param details Optional JSON string or note with details about the change
 * @param userId ID of the user performing the action. If not provided, falls back to 'SYSTEM' or simulated 'ADMIN'.
 */
export async function logAuditEvent(action: string, resource: string, details?: string, userId?: string) {
    try {
        // In a real application, we would retrieve the user from the current session.
        // For Phase 2 sandbox, we mock the user context if missing.
        await prisma.systemAuditLog.create({
            data: {
                action,
                resource,
                details,
                userId: userId || 'MOCKED_ADMIN_USER_001'
            }
        });
        console.log(`[AUDIT] Action: ${action} | Resource: ${resource}`);
    } catch (error) {
        console.error('[AUDIT_ERROR] Failed to save audit log:', error);
        // We typically do not throw here to prevent blocking the main business logic if audit fails,
        // though strictly governed applications might choose to block.
    }
}
