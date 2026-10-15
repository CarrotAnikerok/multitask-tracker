import { SettingData, SortType } from '../Models/Settings';
import { Habit } from '../Models/Habit';
import { getCustomSortedHabits, getSortedHabits } from '../utils/sortHabits';
import { useState } from 'react';

export function useHabitSort(initialSettings: SettingData) {
	const [customOrder, setCustomOrder] = useState(initialSettings.customOrder);
	const [sortType, setSortType] = useState(initialSettings.sortType);
	const [isIncrease, setIncrease] = useState(initialSettings.isIncrease);

	const setAndGetSorting = (
		habits: Habit[],
		order: string[],
		sort: SortType,
		increase: boolean
	) => {
		setSortType(sort);
		setIncrease(increase);
		return getSortedHabits(habits, order, sort, increase);
	};

	const setAndGetCustomSorting = (
		habits: Habit[],
		newIdsOrder: string[]
	): Habit[] => {
		setCustomOrder(newIdsOrder);
		setSortType(SortType.Custom);
		setIncrease(false);
		return getCustomSortedHabits(habits, newIdsOrder);
	};

	return {
		customOrder,
		setCustomOrder,
		setAndGetCustomSorting,
		sortType,
		isIncrease,
		setAndGetSorting,
	};
}
