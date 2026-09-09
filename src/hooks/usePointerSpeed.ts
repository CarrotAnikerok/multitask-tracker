import * as React from 'react';

export function usePointerSpeed(
	containerRef: React.RefObject<HTMLElement | null>
) {
	const [speed, setSpeed] = React.useState(0);

	React.useEffect(() => {
		let velocity = 0;
		let startX = 0;
		let lastX = 0;
		let lastTime: number;
		let scrollLeft: number;

		if (!containerRef.current) {
			return;
		}

		const elem: HTMLElement = containerRef.current;

		const dragStart = (ev: PointerEvent) => {
			const target = ev.target as HTMLElement;
			if (target && target.closest('button')) {
				return;
			}

			elem.setPointerCapture(ev.pointerId);
			startX = ev.clientX;
			scrollLeft = elem.scrollLeft;
		};
		const dragEnd = (ev: PointerEvent) => {
			const target = ev.target as HTMLElement;
			if (target && target.closest('button')) {
				return;
			}
			elem.releasePointerCapture(ev.pointerId);

			const inertiaFactor = 0.95;

			let animateInertia = () => {
				if (Math.abs(velocity) > 0.1) {
					setSpeed((speed) => speed - velocity * 10);
					velocity *= inertiaFactor;
					window.requestAnimationFrame(animateInertia);
				}
			};

			animateInertia();
		};

		const drag = (ev: PointerEvent) => {
			const target = ev.target as HTMLElement;
			if (target && target.closest('button')) {
				return;
			}

			if (elem.hasPointerCapture(ev.pointerId)) {
				const currentTime = Date.now();

				if (lastTime) {
					velocity = (ev.clientX - lastX) / (currentTime - lastTime);
				}

				lastX = ev.clientX;
				lastTime = currentTime;

				const walk = (ev.clientX - startX) * 0.9;
				setSpeed(scrollLeft - walk);
			}
		};

		elem.addEventListener('pointerdown', dragStart);
		elem.addEventListener('pointerup', dragEnd);
		elem.addEventListener('pointermove', drag);

		return () => {
			elem.removeEventListener('pointerdown', dragStart);
			elem.removeEventListener('pointerup', dragEnd);
			elem.removeEventListener('pointermove', drag);
		};
	}, [containerRef]);

	return speed;
}
