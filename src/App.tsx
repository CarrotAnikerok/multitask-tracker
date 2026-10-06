import * as React from 'react';
import HabitBlock from './Components/HabitBlock';
import HabitSettings from './Components/HabitSettings';
import { Habit } from './Models/Habit';
import SortPanel from './Components/Panels/SortPanel';
import { useScrollOffset } from './hooks/usePointerSpeed';
import { useDragAndDrop } from './hooks/useDragAndDrop';
import { SettingData, SortType } from './Models/Settings';

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
	const [habits, setHabits] = React.useState<Habit[]>(initialHabits);
	const [isHabitCreation, setHabitCreation] = React.useState(false);

	//TODO: move to other component?
	const [customOrder, setCustomOrder] = React.useState(
		initialSettings.customOrder
	);
	const [sortType, setSortType] = React.useState(initialSettings.sortType);
	const [isIncrease, setIncrease] = React.useState(
		initialSettings.isIncrease
	);

	const changeOrder = (newIdsOrder: string[]) => {
		setCustomOrder(newIdsOrder);
		setSortType(SortType.Custom);
		setHabits((prev) => {
			const habitMap = new Map(prev.map((h) => [h.id, h]));
			return newIdsOrder
				.map((id) => habitMap.get(id))
				.filter((h): h is Habit => !!h);
		});
	};

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
						setHabits={setHabits}
						sortType={sortType}
						setSortType={setSortType}
						customOrder={customOrder}
						isIncrease={isIncrease}
						setIncrease={setIncrease}
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
