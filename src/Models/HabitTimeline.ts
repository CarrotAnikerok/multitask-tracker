const DAY_MS = 24 * 3600 * 1000;

// TODO: add tests
/**
 * Not working with date changing in realtime. Define behavior by calculating difference between load day and update days.
 */
export class HabitTimeline {
	private _daysFromLastUpdate: number = 0;
	private _positiveUpdates: Date[];
	private _lastUpdate: Date;
	private _currentLoadDay: Date;

	constructor(positiveUpdates?: string[], lastUpdate?: string) {
		this._positiveUpdates = positiveUpdates
			? positiveUpdates.map((d) => new Date(d))
			: [new Date()];

		this._lastUpdate = lastUpdate ? new Date(lastUpdate) : new Date();
		this._currentLoadDay = this.getDateStart(new Date());
	}

	get positiveUpdates() {
		return this._positiveUpdates.map((u) => u.toISOString());
	}

	get lastUpdate(): Date {
		return this._lastUpdate;
	}

	get daysFromLastUpdate(): number {
		return this._daysFromLastUpdate;
	}

	get isIncreasedToday(): boolean {
		return (
			this.getLastPositiveUpdate().toDateString() ===
			this._currentLoadDay.toDateString()
		);
	}

	addPositiveUpdate() {
		const date = new Date();

		if (
			this.getLastPositiveUpdate().toDateString() === date.toDateString()
		) {
			this._positiveUpdates[this._positiveUpdates.length - 1] = date;
		} else {
			this._positiveUpdates.push(date);
		}

		this._lastUpdate = date;
	}

	setLastUpdate() {
		this._lastUpdate = new Date();
	}

	isShouldDecrease(fallDayStep: number): boolean {
		this._daysFromLastUpdate = this.getDaysBetween(
			this._lastUpdate,
			this._currentLoadDay
		);
		return (
			//why checking for positive update anyway, if lat update should be newer ir equal?
			this._daysFromLastUpdate >= fallDayStep &&
			this.isPositiveUpdateOlderThanFallStep(fallDayStep)
		);
	}

	getDayDifferenceFromLastUpdate(): number {
		this._daysFromLastUpdate = this.getDaysBetween(
			this._lastUpdate,
			this._currentLoadDay
		);

		const daysFromPositiveUpdate = this.getDaysBetween(
			this.getLastPositiveUpdate(),
			this._currentLoadDay
		);

		if (this._daysFromLastUpdate === daysFromPositiveUpdate) {
			const forgiveDayForPositiveUpdate = 1;
			return this._daysFromLastUpdate - forgiveDayForPositiveUpdate;
		} else {
			return this._daysFromLastUpdate;
		}
	}

	getLastPositiveUpdate(): Date {
		const lastIndex = this._positiveUpdates.length - 1;
		const lastPositiveUpdate = this._positiveUpdates[lastIndex];

		if (!lastPositiveUpdate) {
			throw new Error('There is no last positive update');
		}

		return lastPositiveUpdate;
	}

	isUpdatedRecently(fallDayStep: number): boolean {
		return (
			!this.isPositiveUpdateOlderThanFallStep(fallDayStep) &&
			this.getLastPositiveUpdate().getTime() <
				this._currentLoadDay.getTime()
		);
	}

	private isPositiveUpdateOlderThanFallStep(fallDayStep: number): boolean {
		return (
			this.getLastPositiveUpdate().getTime() + DAY_MS * fallDayStep <
			this._currentLoadDay.getTime()
		);
	}

	//test! Math.trunc is sus here
	private getDaysBetween(earlyDate: Date, lateDate: Date): number {
		const timeBetween = lateDate.getTime() - earlyDate.getTime();
		return timeBetween > 0 ? Math.trunc(timeBetween / DAY_MS) + 1 : 0;
	}

	private getDateStart(date: Date) {
		const startDate = new Date(date);
		startDate.setHours(0, 0, 0, 0);
		return startDate;
	}
}
