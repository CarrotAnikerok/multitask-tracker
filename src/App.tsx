import * as React from 'react';
import HabitBlock from './Components/HabitBlock';
import HabitSettings from './Components/HabitSettings';
import { Habit } from './Models/Habit';
import SortPanel from './Components/Panels/SortPanel';
import { usePointerSpeed } from './hooks/usePointerSpeed';

type AppProps = {
	onChange: (habits: Habit[]) => void;
	initialHabits: Habit[];
};

export const App = ({ initialHabits, onChange }: AppProps) => {
	const [habits, setHabits] = React.useState<Habit[]>(initialHabits);
	const [isHabitCreation, setHabitCreation] = React.useState(false);

	React.useEffect(() => {
		onChange(habits);
	}, [habits]);

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

	const containerRef = React.useRef(null);
	const speed: number = usePointerSpeed(containerRef);

	React.useEffect(() => {
		if (containerRef?.current) {
			const element: HTMLElement = containerRef.current;
			element.scrollLeft = speed;
		}
	}, [speed]);

	return (
		<div>
			<div className="container" ref={containerRef}>
				{isHabitCreation ? (
					<HabitSettings
						onClose={() => setHabitCreation(false)}
						updateOrCreate={updateHabits}
					></HabitSettings>
				) : (
					<div className="setting-buttons">
						<SortPanel setHabits={setHabits}></SortPanel>
						<button onClick={() => setHabitCreation(true)}>
							+
						</button>
					</div>
				)}
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
