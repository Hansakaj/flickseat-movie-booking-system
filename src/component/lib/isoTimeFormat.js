const isoTimeFormat = (input) => {
  if (input == null) return ''

  // ISO date-time string -> HH:mm
  if (typeof input === 'string') {
    const looksLikeIso =
      input.includes('T') ||
      input.endsWith('Z') ||
      /^\d{4}-\d{2}-\d{2}/.test(input)

    if (looksLikeIso) {
      const dt = new Date(input)
      if (!Number.isNaN(dt.getTime())) {
        return dt.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
      }
    }
  }

  // Number (or numeric string) -> duration (e.g., 1h 20m)
  const value = typeof input === 'number' ? input : Number(input)
  if (!Number.isFinite(value) || value <= 0) return 'N/A'

  const hrs = Math.floor(value / 60)
  const mins = value % 60

  if (hrs === 0) return `${mins}m`
  if (mins === 0) return `${hrs}h`

  return `${hrs}h ${mins}m`
}

export default isoTimeFormat