import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

type FloatingPanelProps = {
	children: React.ReactNode;
	content: (close: () => void) => React.ReactNode;
	className?: string;
};

export default function FloatingPanel({
	children,
	content,
	className,
}: FloatingPanelProps) {
	const [isPanel, setPanel] = useState(false);
	const [coords, setCoords] = useState({ top: 0, left: 0 });

	const panelRef = useRef(null);
	const triggerRef = useRef(null);

	const toggleVisibility = () => {
		if (!isPanel && triggerRef.current) {
			const rect = (
				triggerRef.current as HTMLElement
			).getBoundingClientRect();
			setCoords({
				top: rect.bottom + 5,
				left: rect.left - 20,
			});
		}
		setPanel(!isPanel);
	};

	useEffect(() => {
		const handleClickOutside = (event: PointerEvent) => {
			const panelElem: HTMLElement = panelRef.current!;
			const triggerElem: HTMLElement = triggerRef.current!;

			if (
				panelElem &&
				!panelElem.contains(event.target as Node) &&
				!triggerElem.contains(event.target as Node)
			) {
				setPanel(false);
			}
		};

		document.addEventListener('pointerdown', handleClickOutside);
		return () => {
			document.removeEventListener('pointerdown', handleClickOutside);
		};
	}, []);

	return (
		<div className={className}>
			<button
				ref={triggerRef}
				className="panel-trigger"
				onClick={toggleVisibility}
			>
				{children}
			</button>
			{isPanel
				? createPortal(
						<div
							ref={panelRef}
							className="floating-panel"
							style={{
								position: 'absolute',
								top: `${coords.top}px`,
								left: `${coords.left}px`,
								zIndex: 99999,
							}}
						>
							{content(() => setPanel(false))}
						</div>,
						document.body
					)
				: null}
		</div>
	);
}
