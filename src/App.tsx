import * as React from 'react';
import HabitBlock from './Components/HabitBlock';
import HabitSettings from './Components/HabitSettings';
import { Habit } from './Models/Habit';
import SortPanel from './Components/Panels/SortPanel';
import { useScrollOffset } from './hooks/usePointerSpeed';
import { useDragAndDrop } from './hooks/useDragAndDrop';
import { SettingData, SortType } from './Models/Settings';
import { getSortedHabits } from './utils/sortHabits';
import { useHabitSort } from './hooks/useHabitSort';

type AppProps = {
	onChangeHabits: (habits: Habit[]) => void;
	onChangeSettings: (setting: SettingData) => void;
	initialHabits: Habit[];
	initialSettings: SettingData;
};

export const App = ({
	initialHabits,
	onChangeHabits,
	onChangeSettings,
	initialSettings,
}: AppProps) => {
	const [isHabitCreation, setHabitCreation] = React.useState(false);
	const {
		customOrder,
        setAndGetCustomSorting,
        sortType,
        isIncrease,
        setAndGetSorting
	 } = useHabitSort(initialSettings);
	const [habits, setHabits] = React.useState<Habit[]>(
		() => getSortedHabits(initialHabits, customOrder, sortType, isIncrease)
	);

	const changeOrder = (newIdsOrder: string[]) => {
		setHabits((prev) => setAndGetCustomSorting(prev, newIdsOrder));
	};

	const sortHabits = (sort: SortType, increase: boolean) => {
		setHabits(prevHabits => setAndGetSorting(prevHabits, customOrder, sort, increase));
	}

	React.useEffect(() => {
		onChangeHabits(habits);
	}, [habits]);

	React.useEffect(() => {
		onChangeSettings({ sortType, customOrder, isIncrease });
	}, [customOrder, sortType, isIncrease]);

	const containerRef = React.useRef(null);
	useDragAndDrop(containerRef, changeOrder);
	const scrollOffset: number = useScrollOffset(containerRef);

	React.useEffect(() => {
		if (containerRef?.current) {
			const element: HTMLElement = containerRef.current;
			element.scrollLeft = scrollOffset;
		}
	}, [scrollOffset]);

	const deleteHabit = (habitToDelete: Habit) => {
		setHabits((prev) =>
			prev.filter((habit) => habit.id !== habitToDelete.id)
		);
	};

	const updateHabits = (habitToUpdate: Habit) => {
		const isHabitExist = habits.some((h) => h.id === habitToUpdate.id);
		if (isHabitExist) {
			setHabits((prev) =>
				prev.map((h) => (h.id === habitToUpdate.id ? habitToUpdate : h))
			);
		} else {
			setHabits((prev) => [...prev, habitToUpdate]);
		}
	};

	return (
		<div className="app-container">
			{isHabitCreation ? (
				<HabitSettings
					onClose={() => setHabitCreation(false)}
					updateOrCreate={updateHabits}
				></HabitSettings>
			) : (
				<div className="setting-buttons">
					<SortPanel
						sortHabits={sortHabits}
						sortType={sortType}
						isIncrease={isIncrease}
					></SortPanel>
					<button onClick={() => setHabitCreation(true)}>+</button>
				</div>
			)}
			<div className="cells-container" ref={containerRef}>
				{habits.map((habit) => {
					return (
						<HabitBlock
							key={habit.id}
							habit={habit}
							handleUpdate={updateHabits}
							handleDelete={deleteHabit}
						></HabitBlock>
					);
				})}
			</div>
		</div>
	);
};
