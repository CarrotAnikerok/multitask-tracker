import { generateCode } from '../utils/utils';

const DAY_MS = 24 * 3600 * 1000;

export type RawHabitData = {
	id: string;
	name: string;
	maxSize: number;
	size: number;
	color: string;
	positiveUpdates: string[];
	lastUpdate: string;
};

export class Habit {
	readonly id: string;
	name: string;
	color: string;

	size: number = 10;
	maxSize: number = 10;
	isAnimateDecrease: boolean = false;
	private _positiveUpdates: Date[];
	private _lastUpdate: Date;

	constructor(
		name: string,
		maxSize: number,
		color: string,
		size?: number,
		id?: string,
		positiveDates?: string[],
		lastUpdate?: string
	) {
		this.name = name;
		this.size = size || size === 0 ? size : maxSize;
		this.color = color;
		this.maxSize = maxSize;
		this.id = id ? id : generateCode();
		this._positiveUpdates = positiveDates
			? positiveDates.map((d) => new Date(d))
			: [new Date()];

		this._lastUpdate = lastUpdate ? new Date(lastUpdate) : new Date();
	}

	static fromRaw(raw: RawHabitData): Habit {
		return new Habit(
			raw.name,
			raw.maxSize,
			raw.color,
			raw.size,
			raw.id,
			raw.positiveUpdates,
			raw.lastUpdate
		);
	}

	toRaw(): RawHabitData {
		return {
			id: this.id,
			name: this.name,
			maxSize: this.maxSize,
			size: this.size,
			color: this.color,
			positiveUpdates: this._positiveUpdates.map((u) => u.toISOString()),
			lastUpdate: this._lastUpdate.toISOString(),
		};
	}

	getLastPositiveUpdate(): Date {
		const lastIndex = this._positiveUpdates.length - 1;
		const lastPositiveUpdate = this._positiveUpdates[lastIndex];

		if (!lastPositiveUpdate) {
			throw new Error('There is no last positive update');
		}

		return lastPositiveUpdate;
	}

	updateSettings(settings: Pick<Habit, 'name' | 'color' | 'maxSize'>) {
		this.name = settings.name;
		this.color = settings.color;
		this.maxSize = settings.maxSize;
	}

	changeSize(addedSize: number) {
		const maxSize = 10;
		const newSize = this.size + addedSize;

		if (newSize > maxSize || newSize < 0) {
			return;
		}

		if (newSize > this.size) {
			const lastPositiveUpdate = this.getLastPositiveUpdate();
			const date = new Date();

			if (lastPositiveUpdate.getDate() === date.getDate()) {
				this._positiveUpdates[this._positiveUpdates.length - 1] = date;
			} else {
				this._positiveUpdates.push(date);
			}

			this._lastUpdate = date;
		}

		this.size = newSize;
	}

	// этот весь функционал в отдельный класс можно
	// в целом логики много.. странной...

	decreaseDatedSize() {
		const todayDate = new Date(new Date().setHours(0, 0, 0, 0));

		if (!this.isDatedSizeDecrease(todayDate)) {
			return;
		}
		const resultSize = this.calculateDecreaseSizeDated(todayDate);

		this._lastUpdate = todayDate;
		this.size = resultSize > 0 ? resultSize : 0;
		this.isAnimateDecrease = false;
	}

	//CLEAN
	isDatedSizeDecrease(today: Date): boolean {
		const daysFromLastCheck = this.getDaysBetween(this._lastUpdate, today);
		const lastPositiveUpdate: Date =
			this._positiveUpdates[this._positiveUpdates.length - 1]!;
		const lastPositiveUpdateDay = new Date(lastPositiveUpdate);
		lastPositiveUpdateDay.setHours(0, 0, 0, 0);

		return (
			daysFromLastCheck > 0 &&
			lastPositiveUpdateDay.getTime() + DAY_MS < today.getTime()
		);
	}

	// TODO: add tests
	// TODO: можно будет добавить анимации для уменьшения полосочек только при заходе чтобы понять что упало
	calculateDecreaseSizeDated(today: Date): number {
		const daysFromLastCheck = this.getDaysBetween(this._lastUpdate, today);
		const lastPositiveUpdate: Date =
			this._positiveUpdates[this._positiveUpdates.length - 1]!;
		const lastPositiveUpdateDay = new Date(lastPositiveUpdate);
		lastPositiveUpdateDay.setHours(0, 0, 0, 0);

		const daysBetweenPositive = this.getDaysBetween(
			lastPositiveUpdateDay,
			today
		);
		let resultSize = this.size;

		// does this make sense?
		if (daysFromLastCheck === daysBetweenPositive) {
			resultSize = this.size - (daysFromLastCheck - 1);
		} else {
			resultSize = this.size - daysFromLastCheck;
		}

		this.isAnimateDecrease = true;
		return resultSize;
	}

	private getDaysBetween(earlyDate: Date, lateDate: Date) {
		const timeBetween = lateDate.getTime() - earlyDate.getTime();
		return Math.trunc(timeBetween / DAY_MS);
	}
}
