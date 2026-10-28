import { RefObject, useEffect, useState } from 'react';
import { isTargetInteractive } from '../utils/utils';

export function useDragAndDrop(
	containerRef: RefObject<HTMLElement | null>,
	onOrderChange: (newIdsOrder: string[]) => void
) {
	const [isHolding, setHolding] = useState(false);
	const [target, setTarget] = useState<HTMLElement | null>(null);

	useEffect(() => {
		const HOLD_DELAY = 650;
		let previousClientX = 0;
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

				onOrderChange(newIdsOrder);
			}

			setHolding(false);

			if (target) {
				target.classList.remove('hold');
			}
		};

		const holdMove = (ev: PointerEvent) => {
			if (!isHolding || !target) return;

			const afterElement: HTMLElement | null = getAfterPointerElement(
				ev.clientX,
				previousClientX > ev.clientX,
				container
			);
			if (afterElement !== null) {
				container.insertBefore(target, afterElement);
			} else {
				container.append(target);
			}

			previousClientX = ev.clientX;
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

function getAfterPointerElement(
	x: number,
	isLeft: boolean,
	container: HTMLElement
): HTMLElement | null {
	const staticBlocks = Array.from(
		container.querySelectorAll('.habit-cell:not(.hold)')
	);
	const OFFSET_COEFF = 0.3;
	const sensitivityThreshold = isLeft ? 1 - OFFSET_COEFF : OFFSET_COEFF;
	const afterPointerElement: AfterElement = staticBlocks.reduce<AfterElement>(
		(closest, child) => {
			const box = child.getBoundingClientRect();
			const triggerPoint = box.left + box.width * sensitivityThreshold;
			const offset = x - triggerPoint;

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
