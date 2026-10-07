import { generateCode } from '../utils/utils';
import { HabitTimeline } from './HabitTimeline';

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
	isAnimateDecrease: boolean = true;
	private _habitDate: HabitTimeline;

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
		this._habitDate = new HabitTimeline(positiveDates, lastUpdate);
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

	get isUpdatedYesterday() {
		return this._habitDate.isUpdatedYesterday;
	}

	getLastPositiveUpdate() {
		return this._habitDate.getLastPositiveUpdate();
	}

	toRaw(): RawHabitData {
		return {
			id: this.id,
			name: this.name,
			maxSize: this.maxSize,
			size: this.size,
			color: this.color,
			positiveUpdates: this._habitDate.positiveUpdates,
			lastUpdate: this._habitDate.lastUpdate,
		};
	}

	updateSettings(settings: Pick<Habit, 'name' | 'color' | 'maxSize'>) {
		this.name = settings.name;
		this.color = settings.color;
		this.maxSize = settings.maxSize;
	}

	changeSize(addedSize: number) {
		const maxSize = 10;
		const newSize = this.size + addedSize;

		if (newSize < 0) {
			return;
		}

		if (
			(newSize > this.size && newSize <= maxSize) ||
			this.isUpdatedYesterday
		) {
			this._habitDate.addPositiveUpdate();
		}

		if (newSize <= maxSize) {
			this.size = newSize;
		}
	}

	decreaseSizeOnload() {
		this.isAnimateDecrease = false;

		if (!this._habitDate.isShouldDecrease()) {
			return;
		}

		const resultSize = this.calculateDecreaseSize();
		this.size = resultSize > 0 ? resultSize : 0;
		this._habitDate.setLastUpdate();
	}

	private calculateDecreaseSize(): number {
		return this.size - this._habitDate.getDayDifferenceFromLastUpdate();
	}
}
