import React from 'react';
import { Habit } from '../Models/Habit';
import EditPanel from './Panels/EditPanel';
import HabitSettings from './HabitSettings';

type HabitProps = {
	habit: Habit;
	handleUpdate: (habit: Habit) => void;
	handleDelete: (habit: Habit) => void;
};

// после первого клика за сутки должна блокироваться?
export default function HabitBlock({
	habit,
	handleUpdate,
	handleDelete,
}: HabitProps) {
	const [size, setSize] = React.useState(habit.size);
	const [isEdit, setEditing] = React.useState(false);

	const maxSize = habit.maxSize;
	const pixelSize = 80;

	const changeSize = (addedSize: number) => {
		// немного странно, переделать наверное
		const newSize = size + addedSize;

		if (newSize <= maxSize && newSize >= 0) {
			habit.changeSize(addedSize);
			setSize(newSize);
			handleUpdate(habit);
		}
	};

	const habitHeight = (size / maxSize) * pixelSize;
	return (
		<div className="habit-container">
			{isEdit ? (
				<HabitSettings
					onClose={() => setEditing(false)}
					updateOrCreate={handleUpdate}
					existingHabit={habit}
				></HabitSettings>
			) : (
				<div className="habit-container">
					<EditPanel
						habit={habit}
						handleEditing={() => setEditing(true)}
						handleDelete={handleDelete}
					></EditPanel>
					<span className="name">{habit.name}</span>
					<div className="habit">
						<div
							className="habit-block"
							style={{
								height: `${habitHeight === 0 ? 2 : habitHeight}px`,
								backgroundColor: habit.color,
							}}
						></div>
						<span>{size}</span>
					</div>
					<div className="size-buttons">
						<button
							className="custom-button"
							onClick={() => changeSize(1)}
						>
							⭡
						</button>
						<button
							className="custom-button"
							onClick={() => changeSize(-1)}
						>
							⭣
						</button>
					</div>
				</div>
			)}
		</div>
	);
}
