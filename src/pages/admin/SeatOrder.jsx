import React from 'react'
import StaticHtmlFrame from './StaticHtmlFrame.jsx'
import seatOrderHtml from './seat-order.html?raw'

export default function SeatOrder() {
  return <StaticHtmlFrame title="Seat Order" html={seatOrderHtml} />
}
