import { Habit } from '../Models/Habit';
import EditPanel from './Panels/EditPanel';
import HabitSettings from './HabitSettings';
import { CSSProperties, useContext, useState } from 'react';
import { LanguageContext } from '../utils/Contexts';
import { getTranslation } from '../utils/translator';

type HabitProps = {
	habit: Habit;
	handleUpdate: (habit: Habit) => void;
	handleDelete: (habit: Habit) => void;
};

export default function HabitBlock({
	habit,
	handleUpdate,
	handleDelete,
}: HabitProps) {
	const [size, setSize] = useState(habit.size);
	const [isIncreasedToday, setIsIncreasedToday] = useState(
		habit.isIncreasedToday
	);
	const [isEdit, setEditing] = useState(false);

	if (habit.isAnimateDecrease) {
		window.setTimeout(() => {
			habit.decreaseSizeOnload();
			setSize(habit.size);
		}, 1200);
	}

	const maxSize = habit.maxSize;
	const pixelSize = 4.2;
	let percent = 0;

	const changeSize = (addedSize: number) => {
		const newSize = size + addedSize;

		if (newSize >= 0) {
			if (newSize <= maxSize) {
				setSize(newSize);
			}

			habit.changeSize(addedSize);
			handleUpdate(habit);
		}

		if (!isIncreasedToday && addedSize > 0) {
			setIsIncreasedToday(true);
		}
	};

	const habitHeight = (size / maxSize) * pixelSize;

	if (habit.isUpdatedRecently) {
		const growCoefficient = 10;
		const oneUnitHeightPercent =
			maxSize < 15
				? Math.round((1 / size) * 100)
				: (maxSize / size) * growCoefficient;
		percent = oneUnitHeightPercent > 50 ? 50 : oneUnitHeightPercent;
	}

	// TODO: move somewhere else
	const rtf = new Intl.RelativeTimeFormat('ru', { numeric: 'auto' });
	const context = useContext(LanguageContext);
	const lastUpdatedText = getTranslation('Updated {date}, {days}', context)
		.replace('{date}', habit.lastUpdate.toLocaleDateString(context))
		.replace('{days}', rtf.format(-habit.daysFromLastUpdate, 'day'));

	return (
		<div
			className={`habit-cell ${isEdit ? 'habit-setting' : ''}`}
			data-id={habit.id}
		>
			{isEdit ? (
				<HabitSettings
					onClose={() => {
						setEditing(false);
						setSize(habit.size);
					}}
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
					<div className="habit" title={lastUpdatedText}>
						<div
							className="habit-block"
							style={
								{
									height: `${habitHeight === 0 ? 0.1 : habitHeight}em`,
									'--habit-color': habit.color,
									'--percent': `${percent}%`,
								} as CSSProperties
							}
						></div>
						<span>{size}</span>
					</div>
					<div className="size-buttons">
						<button
							className={`custom-button ${isIncreasedToday ? 'increased' : ''}`}
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
