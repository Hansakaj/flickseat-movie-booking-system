export const Blurcircal = ({ top, right, bottom, left }) => {
  return (
    <div
      className='pointer-events-none absolute -z-10 h-60 w-60 rounded-full bg-red-500/20 blur-3xl'
      style={{ top, right, bottom, left }}
    />
  )
}
