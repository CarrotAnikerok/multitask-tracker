import { ReactNode } from 'react';

type TooltipProps = {
	children: ReactNode;
};

export default function Tooltip({ children }: TooltipProps) {
	return <span className="custom-tooltip">{children}</span>;
}
