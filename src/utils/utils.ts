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
	return '#' + ((Math.random() * 0xffffff) << 0).toString(16);
}
