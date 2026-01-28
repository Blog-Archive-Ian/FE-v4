export const Field = ({ label, value }: { label: string; value?: string }) => {
  return (
    <div className="space-y-1">
      <p className="text-xs font-medium text-muted-foreground">{label}</p>
      <p className="text-sm leading-6">
        {value?.trim() ? value : <span className="text-muted-foreground">-</span>}
      </p>
    </div>
  )
}
