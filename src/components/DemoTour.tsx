import { Joyride, STATUS, type Step, type EventData } from 'react-joyride'

const STEPS: Step[] = [
  {
    target: 'body',
    placement: 'center',
    title: '👋 Welcome to EJJAR',
    content: 'You are a supplier on EJJAR — a marketplace connecting contractors with resource suppliers across the GCC. This tour walks you through your full workflow.',
    skipBeacon: true,
  },
  {
    target: '#tour-kpi-cards',
    placement: 'bottom',
    title: '📊 Your Dashboard',
    content: 'See your active RFQs, running jobs, total resources, and average rating — all at a glance.',
    skipBeacon: true,
  },
  {
    target: '#tour-sidebar-rfqs',
    placement: 'right',
    title: '📥 RFQ Inbox',
    content: 'New Requests for Quotation (RFQs) from contractors appear here. Each one is an opportunity to win a job.',
    skipBeacon: true,
  },
  {
    target: '#tour-recent-rfqs',
    placement: 'top',
    title: '🔍 Open an RFQ',
    content: 'Click any row to view the full details — scope of work, location, required dates, and attachments.',
    skipBeacon: true,
  },
  {
    target: '#tour-rfq-actions',
    placement: 'left',
    title: '💬 Submit Your Quote',
    content: "Enter your price, select the resources you'll allocate, add notes, and hit Submit. You can also counter-offer or decline.",
    skipBeacon: true,
  },
  {
    target: '#tour-kpi-cards',
    placement: 'bottom',
    title: '⏳ Wait for the Decision',
    content: 'The contractor reviews all submitted quotes side-by-side and selects the best offer. Your RFQ status updates automatically.',
    skipBeacon: true,
  },
  {
    target: '#tour-sidebar-rfqs',
    placement: 'right',
    title: '🎉 Quote Accepted!',
    content: 'When your quote wins, the RFQ status changes to "Awarded". You\'ll see it highlighted in your RFQ list.',
    skipBeacon: true,
  },
  {
    target: '#tour-upcoming-jobs',
    placement: 'top',
    title: '🏗️ Job Created',
    content: 'A job is automatically created from the awarded RFQ. Your upcoming jobs appear here — tracking begins immediately.',
    skipBeacon: true,
  },
  {
    target: '#tour-sidebar-jobs',
    placement: 'right',
    title: '✅ Mark as Complete',
    content: 'Head to the Jobs page to monitor progress. When the work is done, mark the job as complete.',
    skipBeacon: true,
  },
  {
    target: '#tour-sidebar-reviews',
    placement: 'right',
    title: '⭐ Receive a Review',
    content: 'After completion, the contractor leaves a rating and feedback. Great reviews boost your ranking and help you win more RFQs.',
    skipBeacon: true,
  },
]

interface DemoTourProps {
  run: boolean
  onEnd: () => void
}

export function DemoTour({ run, onEnd }: DemoTourProps) {
  function handleEvent(data: EventData) {
    if (data.status === STATUS.FINISHED || data.status === STATUS.SKIPPED) {
      onEnd()
    }
  }

  return (
    <Joyride
      steps={STEPS}
      run={run}
      continuous
      scrollToFirstStep
      onEvent={handleEvent}
      options={{
        primaryColor: '#192433',
        overlayColor: 'rgba(15, 23, 42, 0.55)',
        overlayClickAction: false,
        showProgress: true,
        buttons: ['back', 'primary', 'skip'],
        zIndex: 10000,
        width: 340,
        spotlightRadius: 8,
      }}
      styles={{
        tooltip: {
          borderRadius: 12,
          boxShadow: '0 20px 40px rgba(0,0,0,0.18)',
          padding: '20px 24px',
        },
        tooltipTitle: {
          fontSize: 15,
          fontWeight: 700,
          marginBottom: 6,
        },
        tooltipContent: {
          fontSize: 13.5,
          lineHeight: '1.6',
          padding: '4px 0 0',
        },
        buttonPrimary: {
          backgroundColor: '#192433',
          borderRadius: 8,
          fontSize: 13,
          padding: '8px 18px',
          fontWeight: 600,
        },
        buttonBack: {
          color: '#64748b',
          fontSize: 13,
          marginRight: 8,
        },
        buttonSkip: {
          color: '#94a3b8',
          fontSize: 12,
        },
      }}
      locale={{
        back: '← Back',
        close: 'Close',
        last: 'Finish Tour',
        nextWithProgress: 'Next ({current} of {total})',
        skip: 'Skip tour',
      }}
    />
  )
}
