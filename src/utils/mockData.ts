import rfqsRaw from '../../../shared/mock/rfqs.json'
import jobsRaw from '../../../shared/mock/jobs.json'
import resourcesRaw from '../../../shared/mock/resources.json'
import reviewsRaw from '../../../shared/mock/reviews.json'
import contractorsRaw from '../../../shared/mock/contractors.json'
import suppliersRaw from '../../../shared/mock/suppliers.json'
import type { RFQ, Job, Resource, Review, Contractor, Supplier } from '../types'

export const rfqs: RFQ[] = rfqsRaw as RFQ[]
export const jobs: Job[] = jobsRaw as Job[]
export const resources: Resource[] = resourcesRaw as Resource[]
export const reviews: Review[] = reviewsRaw as Review[]
export const contractors: Contractor[] = contractorsRaw as Contractor[]
export const suppliers: Supplier[] = suppliersRaw as Supplier[]

export const CURRENT_SUPPLIER_ID = 'sup-001'

export function maskContractor(contractorId: string): string {
  const num = contractorId.replace(/\D/g, '').padStart(4, '0')
  return `Contractor #${num}`
}

export function getContractor(id: string): Contractor | undefined {
  return contractors.find((c) => c.id === id)
}

export function getSupplier(id: string): Supplier | undefined {
  return suppliers.find((s) => s.id === id)
}

export function getRFQStatusLabel(status: string): string {
  const map: Record<string, string> = {
    new: 'New',
    supplier_responded: 'Responded',
    negotiation: 'In Negotiation',
    awarded: 'Awarded',
    declined: 'Declined',
  }
  return map[status] || status
}

export const CATEGORIES = ['manpower', 'machinery', 'vehicles', 'shipping']
export const COUNTRIES = ['Oman', 'Saudi Arabia', 'UAE', 'Kuwait', 'Qatar', 'Bahrain']
