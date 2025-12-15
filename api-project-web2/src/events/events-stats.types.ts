// src/events/events-stats.types.ts

export interface AdminEventStatsItem {
    eventId: number;
    title: string;
    startDate: Date;
    location: string;
    price: string | null;
    capacity: number;

    totalRegistrations: number;
    confirmedRegistrations: number;
    cancelledRegistrations: number;
    pendingRegistrations: number;

    approvedPayments: number;
    pendingPayments: number;
    rejectedPayments: number;

    // Monto total recaudado (solo pagos aprobados)
    revenue: number;
}

export interface AdminEventStatsResult {
    // Fechas usadas para el filtro (opcional, vienen como string ISO desde el controller)
    from?: string | null;
    to?: string | null;

    totalEvents: number;
    totalRegistrations: number;
    totalConfirmed: number;
    totalCancelled: number;
    totalPending: number;

    totalApprovedPayments: number;
    totalPendingPayments: number;
    totalRejectedPayments: number;

    totalRevenue: number;

    // Detalle por evento
    events: AdminEventStatsItem[];
}
