export interface RFQ {
  id: string
  contractor_id: string
  category: string
  subcategory: string
  description: string
  quantity: number
  country: string
  city: string
  region: string
  start_date: string
  end_date: string
  status: 'new' | 'supplier_responded' | 'negotiation' | 'awarded' | 'declined'
  created_at: string
  supplier_responses: SupplierResponse[]
}

export interface SupplierResponse {
  id: string
  supplier_id: string
  resource_id: string
  unit_price_usd: number
  total_price_usd: number
  currency: string
  notes: string
  submitted_at: string
  status: string
}

export interface Job {
  id: string
  rfq_id: string
  supplier_id: string
  contractor_id: string
  allocated_resources: AllocatedResource[]
  start_date: string
  end_date: string
  work_order_url: string
  status: 'in_progress' | 'completed'
  country: string
  city: string
}

export interface AllocatedResource {
  resource_id: string
  quantity: number
  unit: string
}

export interface Resource {
  id: string
  supplier_id: string
  category: string
  subcategory: string
  status: 'available' | 'booked' | 'maintenance'
  availability_start: string
  availability_end: string
  specs: Record<string, unknown>
}

export interface Review {
  id: string
  job_id: string
  contractor_id: string
  supplier_id: string
  rating: number
  text: string
  created_at: string
}

export interface Contractor {
  id: string
  name: string
  phone: string
  region: string
  city: string
  country: string
  total_rfqs: number
  status: string
  created_at: string
}

export interface Supplier {
  id: string
  name: string
  region: string
  city: string
  country: string
  rating: number
  verified: boolean
  subscription_tier: string
  tagline: string
  description: string
  phone: string
  created_at: string
  categories: string[]
}
