import * as React from 'react';
import { Habit } from '../Models/Habit';
import Tooltip from './Tooltip';
import { getRandomColor } from '../utils/utils';

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
	const [name, setName] = React.useState(existingHabit?.name || '');
	const [size, setSize] = React.useState(existingHabit?.size || '');
	const [color, setColor] = React.useState(
		existingHabit?.color || getRandomColor()
	);
	let nameError: boolean = false;
	let sizeError: boolean = false;

	if (name.length > 18) {
		nameError = true;
	} else {
		nameError = false;
	}

	const sizeNumber = Number(size);
	if (Number.isNaN(sizeNumber) || sizeNumber < 0 || sizeNumber > 150) {
		sizeError = true;
	} else {
		sizeError = false;
	}

	const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
		e.preventDefault();

		const maxSize = Number(size) || 5;
		const finalName = name || 'New habit';

		if (existingHabit) {
			existingHabit.updateSettings({ name: finalName, color, maxSize });
			updateOrCreate(existingHabit);
		} else {
			const newHabit = new Habit(finalName, maxSize, color);
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
						value={size}
						onChange={(e) => setSize(e.target.value)}
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
