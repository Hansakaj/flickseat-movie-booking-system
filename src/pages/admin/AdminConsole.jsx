import React from 'react'
import StaticHtmlFrame from './StaticHtmlFrame.jsx'
import adminConsoleHtml from './index.html?raw'

export default function AdminConsole() {
  return <StaticHtmlFrame title="Admin Console" html={adminConsoleHtml} />
}
