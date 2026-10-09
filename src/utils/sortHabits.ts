import { Habit } from '../Models/Habit';
import { SortType } from '../Models/Settings';

export function getSortedHabits(
	habits: Habit[],
	customOrder: string[],
	type: SortType,
	isIncrease: boolean
): Habit[] {
	switch (type) {
		case SortType.Custom:
			return getCustomOrder(habits, customOrder, isIncrease);
		case SortType.Alphabet:
			return sortByAlphabet(habits, isIncrease);
		case SortType.LastUpdated:
			return sortByPositiveUpdate(habits, isIncrease);
		case SortType.Size:
			return sortBySize(habits, isIncrease);
		default:
			return sortBySize(habits, isIncrease);
	}
}

export function getCustomSortedHabits(
	habits: Habit[],
	customOrder: string[]
): Habit[] {
	const habitMap = new Map(habits.map((h) => [h.id, h]));
	return customOrder
		.map((id) => habitMap.get(id))
		.filter((h): h is Habit => !!h);
}

function sortByPositiveUpdate(habits: Habit[], isIncrease: boolean): Habit[] {
	return [...habits].sort((a, b) => {
		const lastPositiveUpdateA = a.getLastPositiveUpdate();
		const lastPositiveUpdateB = b.getLastPositiveUpdate();
		if (isIncrease) {
			return (
				lastPositiveUpdateA.getTime() - lastPositiveUpdateB.getTime()
			);
		} else {
			return (
				lastPositiveUpdateB.getTime() - lastPositiveUpdateA.getTime()
			);
		}
	});
}

function sortBySize(habits: Habit[], isIncrease: boolean): Habit[] {
	return [...habits].sort((a, b) => {
		const aCoefficient = a.size / a.maxSize;
		const bCoefficient = b.size / b.maxSize;

		if (isIncrease) {
			return aCoefficient - bCoefficient;
		} else {
			return bCoefficient - aCoefficient;
		}
	});
}

function sortByAlphabet(habits: Habit[], isIncrease: boolean): Habit[] {
	return [...habits].sort((a, b) => {
		if (isIncrease) {
			return b.name.localeCompare(a.name);
		} else {
			return a.name.localeCompare(b.name);
		}
	});
}

function getCustomOrder(
	habits: Habit[],
	customOrder: string[],
	isIncrease: boolean
): Habit[] {
	const orderedHabits = getCustomSortedHabits(habits, customOrder);

	if (isIncrease) {
		return orderedHabits.reverse();
	}

	return orderedHabits;
}
