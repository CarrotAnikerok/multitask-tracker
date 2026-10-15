import { RefObject, useEffect, useState } from 'react';
import { isTargetInteractive } from '../utils/utils';

export function useScrollOffset(containerRef: RefObject<HTMLElement | null>) {
	const [scrollOffset, setScrollOffset] = useState(0);

	useEffect(() => {
		let velocity = 0;
		let startX = 0;
		let startY = 0;

		let lastX = 0;
		let lastTime = 0;
		let scrollLeft = 0;

		let isDragging = false;
		let isHolding = false;

		let animationFrameId: number | null = null;

		if (!containerRef.current) {
			return;
		}

		const containerToScroll: HTMLElement = containerRef.current;

		const dragStart = (event: PointerEvent) => {
			isDragging = false;
			isHolding = false;

			if (isTargetInteractive(event)) return;

			containerToScroll.setPointerCapture(event.pointerId);

			startX = event.clientX;
			startY = event.clientY;
			scrollLeft = containerToScroll.scrollLeft;
		};

		const dragEnd = (event: PointerEvent) => {
			if (isTargetInteractive(event)) return;

			isDragging = false;

			const SLOWDOWN_COEFFICIENT = 0.95;
			const INERTIA_COEFFICIENT = 8;

			(function animateInertia() {
				const inertiaVelocity = velocity * INERTIA_COEFFICIENT;

				if (Math.abs(inertiaVelocity) > 0.1) {
					setScrollOffset(
						(scrollOffset) => scrollOffset - inertiaVelocity
					);
					velocity *= SLOWDOWN_COEFFICIENT;
					animationFrameId =
						window.requestAnimationFrame(animateInertia);
				} else {
					animationFrameId = null;
				}
			})();
		};

		const drag = (event: PointerEvent) => {
			if (isTargetInteractive(event) || isHolding) return;

			if (!isDragging) {
				const DRAG_PIXEL_THRESHOLD = 5;
				const dx = event.clientX - startX;
				const dy = event.clientY - startY;
				const isPointerMovedThreshold =
					Math.sqrt(dx * dx + dy * dy) > DRAG_PIXEL_THRESHOLD;

				if (isPointerMovedThreshold) {
					(function emitDragging() {
						isDragging = true;

						const event = new CustomEvent('multitask:drag-started');
						window.dispatchEvent(event);
					})();
				}
			}

			if (
				isDragging &&
				containerToScroll.hasPointerCapture(event.pointerId)
			) {
				(function calculateInertiaValues() {
					const currentTime = Date.now();
					const distanceFromLastFrame = event.clientX - lastX;

					if (lastTime) {
						velocity =
							distanceFromLastFrame / (currentTime - lastTime);
					}

					lastX = event.clientX;
					lastTime = currentTime;
				})();

				const walk = (function calculateDragWalk() {
					const SMOOTH_COEFFICIENT = 0.9;
					return (event.clientX - startX) * SMOOTH_COEFFICIENT;
				})();

				setScrollOffset(scrollLeft - walk);
			}
		};

		const onExternalDragHold = () => {
			isDragging = false;
			isHolding = true;
		};

		containerToScroll.addEventListener('pointerdown', dragStart);
		containerToScroll.addEventListener('pointerup', dragEnd);
		containerToScroll.addEventListener('pointermove', drag);
		window.addEventListener('multitask:hold-started', onExternalDragHold);

		return () => {
			if (animationFrameId !== null) {
				window.cancelAnimationFrame(animationFrameId);
			}

			containerToScroll.removeEventListener('pointerdown', dragStart);
			containerToScroll.removeEventListener('pointerup', dragEnd);
			containerToScroll.removeEventListener('pointermove', drag);
			window.removeEventListener(
				'multitask:hold-started',
				onExternalDragHold
			);
		};
	}, [containerRef]);

	return scrollOffset;
}
