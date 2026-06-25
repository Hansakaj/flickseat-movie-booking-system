import React from 'react'

export default function StaticHtmlFrame({ title, html }) {
  return (
    <div style={{ height: 'calc(100vh - 3.5rem)', width: '100%', overflow: 'hidden' }}>
      <iframe
        title={title}
        srcDoc={html}
        style={{ border: 'none', width: '100%', height: '100%', display: 'block' }}
      />
    </div>
  )
}
