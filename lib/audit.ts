import { headers } from 'next/headers';
import { after } from 'next/server';
import { db } from '@/lib/db';

export interface LogAuditEventParams {
  adminId?: number | string | null;
  adminEmail?: string | null;
  action: string;
  entity?: string | null;
  entityId?: number | string | null;
  details?: Record<string, unknown> | null;
}

export async function logAuditEvent(params: LogAuditEventParams): Promise<void> {
  try {
    const headersList = await headers();

    const userAgent = headersList.get('user-agent') || undefined;
    const rawIp =
      headersList.get('x-forwarded-for') ||
      headersList.get('x-real-ip') ||
      undefined;

    const ip = rawIp ? rawIp.split(',')[0].trim() : undefined;

    const combinedDetails = {
      ...(params.details || {}),
      ...(ip ? { ip } : {}),
      ...(userAgent ? { userAgent } : {}),
    };

    after(async () => {
      try {
        await db.auditLog.create({
          data: {
            adminId: params.adminId != null ? String(params.adminId) : null,
            adminEmail: params.adminEmail || null,
            action: params.action,
            entity: params.entity || null,
            entityId: params.entityId != null ? String(params.entityId) : null,
            details: Object.keys(combinedDetails).length > 0 ? combinedDetails : undefined,
          },
        });
      } catch (dbError) {
        console.error('[AuditLog DB Error]: Failed to persist audit log:', dbError);
      }
    });
  } catch (error) {
    console.error('[AuditLog Header Error]: Failed to process request headers:', error);
  }
}