import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { format } from 'date-fns'
import { Star, MessageCircle } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { reviews as allReviews, CURRENT_SUPPLIER_ID, maskContractor } from '@/utils/mockData'

function StarRow({ count }: { count: number }) {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} className={`h-4 w-4 ${i < count ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}`} />
      ))}
    </div>
  )
}

export default function Reviews() {
  const { t } = useTranslation()
  const reviews = allReviews.filter((r) => r.supplier_id === CURRENT_SUPPLIER_ID)

  const avgRating = useMemo(
    () => (reviews.length ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : 0),
    [reviews]
  )

  const distribution = useMemo(() => {
    const dist: Record<number, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
    reviews.forEach((r) => { dist[r.rating] = (dist[r.rating] || 0) + 1 })
    return dist
  }, [reviews])

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">{t('reviews.title')}</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Summary */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">{t('reviews.summary')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <p className="text-5xl font-bold text-slate-900">{avgRating.toFixed(1)}</p>
              <StarRow count={Math.round(avgRating)} />
              <p className="text-sm text-slate-500 mt-1">{reviews.length} {t('reviews.total_reviews')}</p>
            </div>
            <div className="space-y-2">
              {[5, 4, 3, 2, 1].map((star) => (
                <div key={star} className="flex items-center gap-3">
                  <span className="text-xs text-slate-500 w-4">{star}</span>
                  <Star className="h-3 w-3 fill-amber-400 text-amber-400 shrink-0" />
                  <Progress
                    value={reviews.length ? (distribution[star] / reviews.length) * 100 : 0}
                    className="flex-1 h-2"
                  />
                  <span className="text-xs text-slate-500 w-4 text-right">{distribution[star]}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Reviews List */}
        <div className="lg:col-span-2 space-y-4">
          {reviews.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-slate-400 space-y-3">
              <MessageCircle className="h-12 w-12" />
              <p className="text-sm">{t('reviews.no_reviews')}</p>
            </div>
          ) : (
            reviews.map((review) => (
              <Card key={review.id}>
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="text-sm font-medium text-slate-700">
                        {maskContractor(review.contractor_id)}
                      </p>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {format(new Date(review.created_at), 'dd MMM yyyy')}
                      </p>
                    </div>
                    <StarRow count={review.rating} />
                  </div>
                  <p className="text-sm text-slate-600 leading-relaxed">{review.text}</p>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
