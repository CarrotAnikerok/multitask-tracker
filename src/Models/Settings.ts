import { RawHabitData } from './Habit';

export type RawData = {
	setting: SettingData;
	habits: RawHabitData[];
};

export enum SortType {
	Custom,
	Alphabet,
	LastUpdated,
	Size,
}

export type SettingData = {
	sortType: SortType;
	isIncrease: boolean;
	customOrder: string[];
};
