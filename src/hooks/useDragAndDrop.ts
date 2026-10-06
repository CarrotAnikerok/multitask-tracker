import React from 'react';

export function useDragAndDrop(
	containerRef: React.RefObject<HTMLElement | null>,
	onOrderChange: (newIdsOrder: string[]) => void
) {
	const [isHolding, setHolding] = React.useState(false);
	const [target, setTarget] = React.useState<HTMLElement | null>(null);

	//перечитать про useref
	const onOrderChangeRef = React.useRef(onOrderChange);
	onOrderChangeRef.current = onOrderChange;

	React.useEffect(() => {
		const HOLD_DELAY = 650;
		let holdTimeout: number | null = null;

		if (!containerRef.current) {
			return;
		}

		const container: HTMLElement = containerRef.current;

		const holdStart = (event: PointerEvent) => {
			let target = (event.target as HTMLElement).closest(
				'.habit-cell'
			) as HTMLElement;
			setTarget(target);

			if (!target || isTargetInteractive(event)) return;

			holdTimeout = window.setTimeout(() => {
				setHolding(true);
				const event = new CustomEvent('multitask:hold-started');
				window.dispatchEvent(event);
				target.classList.add('hold');
			}, HOLD_DELAY);
		};

		const holdEnd = () => {
			if (holdTimeout) {
				window.clearTimeout(holdTimeout);
				holdTimeout = null;
			}

			if (isHolding && container) {
				const currentCells: HTMLElement[] = Array.from(
					container.querySelectorAll('.habit-cell')
				);
				const newIdsOrder = currentCells
					.map((cell) => cell.dataset.id)
					.filter(Boolean) as string[];

				onOrderChangeRef.current(newIdsOrder);
			}

			setHolding(false);

			if (target) {
				target.classList.remove('hold');
			}
		};

		const holdMove = (ev: PointerEvent) => {
			if (!isHolding || !target) return;

			const afterElement: HTMLElement | null = getAfterPointerElement(
				ev.clientX
			);
			if (target && afterElement !== null) {
				container.insertBefore(target, afterElement);
			} else {
				container.append(target);
			}
		};

		const onExternalDragStart = () => {
			setHolding(false);

			if (holdTimeout) {
				window.clearTimeout(holdTimeout);
				holdTimeout = null;
			}
		};

		container.addEventListener('pointerdown', holdStart);
		container.addEventListener('pointermove', holdMove);
		container.addEventListener('pointerup', holdEnd);
		window.addEventListener('multitask:drag-started', onExternalDragStart);

		return () => {
			container.removeEventListener('pointerdown', holdStart);
			container.removeEventListener('pointermove', holdMove);
			container.removeEventListener('pointerup', holdEnd);
			window.removeEventListener(
				'multitask:drag-started',
				onExternalDragStart
			);
		};
	}, [containerRef, isHolding]);
}

type AfterElement = {
	offset: number;
	element: HTMLElement | null;
};

function getAfterPointerElement(x: number): HTMLElement | null {
	const staticBlocks = Array.from(
		document.querySelectorAll('.habit-cell:not(.hold)')
	);
	const afterPointerElement: AfterElement = staticBlocks.reduce<AfterElement>(
		(closest, child) => {
			const box = child.getBoundingClientRect();
			const offset = x - box.left - box.width / 2;

			if (offset < 0 && offset > closest.offset) {
				return { offset: offset, element: child as HTMLElement };
			} else {
				return closest;
			}
		},
		{ offset: Number.NEGATIVE_INFINITY, element: null }
	);

	return afterPointerElement.element;
}

function isTargetInteractive(event: PointerEvent) {
	const target = event.target as HTMLElement;
	return target && (target.closest('button') || target.closest('input'));
}
