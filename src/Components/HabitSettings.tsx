import * as React from 'react';
import { Habit } from '../Models/Habit';

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
	const [nameError, setNameError] = React.useState(false);
	const [color, setColor] = React.useState(existingHabit?.color || '');

	const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
		e.preventDefault();

		const form = e.target;
		const formData = new FormData(form);

		const name = (formData.get('name') as string) || 'New habit'; //should be 9 or less string

		if (name.length > 18) {
			setNameError(true);
			return;
		} else {
			setNameError(false);
		}

		const color = (formData.get('color') as string) || 'white';
		const maxSize = Number(formData.get('maxSize')) || 5;

		//TODO: need to rewrite to method
		if (existingHabit) {
			existingHabit.name = name;
			existingHabit.color = color;
			existingHabit.maxSize = maxSize;
			updateOrCreate(existingHabit);
		} else {
			const newHabit = new Habit(name, maxSize, color);
			updateOrCreate(newHabit);
		}
		onClose();
	};

	const changeColor = (event: React.ChangeEvent<HTMLInputElement>) => {
		setColor(event.target.value);
	};

	return (
		<form className="settings" onSubmit={handleSubmit}>
			<div className="form-fields">
				<label htmlFor="name">Имя (18)</label>
				<input
					name="name"
					type="text"
					defaultValue={existingHabit?.name || ''}
					className={nameError ? 'error' : ''}
				></input>
				<label htmlFor="color">Цвет</label>
				<div className="color-container">
					<input
						name="color"
						type="color"
						value={color}
						onChange={changeColor}
						style={{ 'height': '26px'}}
					></input>
				</div>
				<label htmlFor="maxSize">Размер</label>
				<input
					name="maxSize"
					type="text"
					defaultValue={existingHabit?.size || ''}
				></input>
			</div>
			<div style={{ display: 'flex', gap: '5px' }}>
				<button onClick={() => onClose()}>Cancel</button>
				<button type="submit">
					{existingHabit ? 'Update' : 'Create'}
				</button>
			</div>
		</form>
	);
}
