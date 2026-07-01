const Timeformater = (minutes) => {
  const value = Number(minutes)
  if (!Number.isFinite(value) || value <= 0) return 'N/A'

  const hrs = Math.floor(value / 60)
  const mins = value % 60

  if (hrs === 0) return `${mins}m`
  if (mins === 0) return `${hrs}h`

  return `${hrs}h ${mins}m`
}

export default Timeformater
