import { Badge, cn, Separator } from '@blog/ui'
import { getDay, getDaysInMonth, startOfMonth } from 'date-fns'

interface CalendarPostListProps {
  year: number
  month: number
  dayList: number[]
}

export const PostCalendar = async ({ year, month, dayList }: CalendarPostListProps) => {
  const firstDay = getDay(startOfMonth(new Date(year, month - 1)))
  const totalDays = getDaysInMonth(new Date(year, month - 1))

  const calendar = Array(firstDay)
    .fill(null)
    .concat(Array.from({ length: totalDays }, (_, i) => i + 1))

  const daysInWeek = ['S', 'M', 'T', 'W', 'T', 'F', 'S']

  return (
    <div className="border-l-2 border-border pl-8">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">
          {year} {String(month).padStart(2, '0')}
        </h2>

        <Badge variant="secondary" className="font-normal">
          posts {dayList?.length}
        </Badge>
      </div>
      <Separator className="my-4" />

      <div className="grid grid-cols-7 text-center text-xs text-muted-foreground">
        {daysInWeek.map((d, index) => (
          <div key={index} className="py-1 font-medium">
            {d}
          </div>
        ))}
      </div>

      <div className="mt-2 grid grid-cols-7 gap-y-2 text-center">
        {calendar.map((day, idx) => {
          const hasPost = day != null && dayList?.includes(day)

          return (
            <div key={idx} className="h-8">
              {day == null ? (
                <span className="block h-8" />
              ) : (
                <button
                  type="button"
                  className={cn(
                    'mx-auto flex h-8 w-8 flex-col items-center justify-center rounded-md text-xs transition-colors',
                    hasPost
                      ? 'text-foreground hover:bg-muted'
                      : 'text-muted-foreground/40 hover:bg-transparent',
                  )}
                  aria-label={`${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`}
                >
                  <span className={cn('leading-none', hasPost && 'font-semibold')}>{day}</span>

                  <span
                    className={cn(
                      'mt-1 h-1 w-1 rounded-full',
                      hasPost ? 'bg-foreground' : 'bg-transparent',
                    )}
                  />
                </button>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
