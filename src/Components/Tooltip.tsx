import React from 'react'

type TooltipProps = {
    children: React.ReactNode;
};

export default function Tooltip({children}: TooltipProps) {
  return (
    <span className='custom-tooltip'>{children}</span>
  )
}
