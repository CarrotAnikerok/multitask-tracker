export function generateCode(): string {
	return Array.apply(0, Array(6))
		.map(function () {
			return (function (charset) {
				return charset.charAt(
					Math.floor(Math.random() * charset.length)
				);
			})('ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789');
		})
		.join('');
}

export function getRandomColor(): string {
	return (
		'#' +
		Math.floor(Math.random() * 16777215)
			.toString(16)
			.padStart(6, '0')
	);
}

export function isTargetInteractive(event: PointerEvent) {
	const target = event.target as HTMLElement;
	return target && (target.closest('button') || target.closest('input'));
}
