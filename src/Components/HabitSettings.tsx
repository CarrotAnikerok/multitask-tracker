import { Habit } from '../Models/Habit';
import Tooltip from './Tooltip';
import { getRandomColor } from '../utils/utils';
import { SubmitEvent, useState } from 'react';

type SettingsProps = {
	onClose: () => void;
	updateOrCreate: ({ name, size, color }: Habit) => void;
	existingHabit?: Habit;
};

export default function HabitSettings({
	onClose,
	updateOrCreate,
	existingHabit,
}: SettingsProps) {
	const [name, setName] = useState(existingHabit?.name || '');
	const [maxSize, setMaxSize] = useState(existingHabit?.maxSize || '');
	const [color, setColor] = useState(
		existingHabit?.color || getRandomColor()
	);
	let nameError: boolean = false;
	let sizeError: boolean = false;

	if (name.length > 18) {
		nameError = true;
	} else {
		nameError = false;
	}

	const sizeNumber = Number(maxSize);
	if (Number.isNaN(sizeNumber) || sizeNumber < 0 || sizeNumber > 150) {
		sizeError = true;
	} else {
		sizeError = false;
	}

	const handleSubmit = (e: SubmitEvent<HTMLFormElement>) => {
		e.preventDefault();

		const newMaxSize = Number(maxSize) || 5;
		const finalName = name || 'New habit';

		if (existingHabit) {
			existingHabit.updateSettings({
				name: finalName,
				color,
				maxSize: newMaxSize,
			});
			updateOrCreate(existingHabit);
		} else {
			const newHabit = new Habit(finalName, newMaxSize, color);
			updateOrCreate(newHabit);
		}
		onClose();
	};

	return (
		<form className="settings" onSubmit={handleSubmit}>
			<div className="form-fields">
				<label htmlFor="name">Имя</label>
				<div style={{ position: 'relative' }}>
					<input
						name="name"
						type="text"
						className={nameError ? 'error' : ''}
						value={name}
						onChange={(e) => setName(e.target.value)}
					></input>
					{nameError ? (
						<Tooltip>Should be less than 18 symbols</Tooltip>
					) : null}
				</div>
				<label htmlFor="color">Цвет</label>
				<div className="color-container">
					<input
						name="color"
						type="color"
						value={color}
						onChange={(e) => setColor(e.target.value)}
						style={{ height: '26px' }}
					></input>
				</div>
				<label htmlFor="maxSize">Размер</label>
				<div style={{ position: 'relative' }}>
					<input
						name="maxSize"
						type="text"
						className={sizeError ? 'error' : ''}
						value={maxSize}
						onChange={(e) => setMaxSize(e.target.value)}
					></input>
					{sizeError ? (
						<Tooltip>Should be less than 150</Tooltip>
					) : null}
				</div>
			</div>
			<div style={{ display: 'flex', gap: '5px' }}>
				<button onClick={() => onClose()}>Cancel</button>
				<button type="submit" disabled={nameError || sizeError}>
					{existingHabit ? 'Update' : 'Create'}
				</button>
			</div>
		</form>
	);
}
