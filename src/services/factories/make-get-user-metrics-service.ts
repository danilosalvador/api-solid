import { GetUserMetricsService } from '../get-user-metrics'
import { PrismaCheckInsRepository } from '@/repositories/prisma/prisma-check-ins-repository'

export function makeGetUserMetrics() {
    const repository = new PrismaCheckInsRepository()
    const service = new GetUserMetricsService(repository)

    return service
}
