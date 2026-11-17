import { Habit } from '../Models/Habit';
import Tooltip from './Tooltip';
import { getRandomColor } from '../utils/utils';
import { SubmitEvent, useContext, useState } from 'react';
import { LanguageContext } from '../utils/Contexts';
import { getTranslation } from '../utils/translator';

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

	const context = useContext(LanguageContext);
	const habitText = getTranslation('New habit', context);
	const warningText = getTranslation('should be less than', context);

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
		const finalName = name || habitText;

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
				<label htmlFor="name">{getTranslation('name', context)}</label>
				<div style={{ position: 'relative' }}>
					<input
						name="name"
						type="text"
						className={nameError ? 'error' : ''}
						value={name}
						onChange={(e) => setName(e.target.value)}
					></input>
					{nameError ? (
						<Tooltip>
							{warningText} 18{' '}
							{getTranslation('symbols', context)}
						</Tooltip>
					) : null}
				</div>
				<label htmlFor="color">
					{getTranslation('color', context)}
				</label>
				<div className="color-container">
					<input
						name="color"
						type="color"
						value={color}
						onChange={(e) => setColor(e.target.value)}
						style={{ height: '26px' }}
					></input>
				</div>
				<label htmlFor="maxSize">
					{getTranslation('size', context)}
				</label>
				<div style={{ position: 'relative' }}>
					<input
						name="maxSize"
						type="text"
						className={sizeError ? 'error' : ''}
						value={maxSize}
						onChange={(e) => setMaxSize(e.target.value)}
					></input>
					{sizeError ? <Tooltip>{warningText} 150</Tooltip> : null}
				</div>
			</div>
			<div style={{ display: 'flex', gap: '5px' }}>
				<button onClick={() => onClose()}>
					{getTranslation('cancel', context)}
				</button>
				<button type="submit" disabled={nameError || sizeError}>
					{existingHabit
						? getTranslation('update', context)
						: getTranslation('create', context)}
				</button>
			</div>
		</form>
	);
}
