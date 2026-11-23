import { useContext } from 'react';
import { Habit } from '../../Models/Habit';
import { getTranslation } from '../../utils/translator';
import FloatingPanel from './FloatingPanel';
import { LanguageContext } from '../../utils/Contexts';

type EditPanelProps = {
	habit: Habit;
	handleEditing: () => void;
	handleDelete: (habit: Habit) => void;
};

export default function EditPanel({
	habit,
	handleEditing,
	handleDelete,
}: EditPanelProps) {
	return (
		<FloatingPanel
			className="habit-setting-button"
			content={(close) => (
				<div className="edit-panel-buttons">
					<button
						onClick={() => {
							handleEditing();
							close();
						}}
					>
						{getTranslation('edit', useContext(LanguageContext))}
					</button>
					<button
						onClick={() => {
							handleDelete(habit);
							close();
						}}
					>
						{getTranslation('delete', useContext(LanguageContext))}
					</button>
				</div>
			)}
		>
			...
		</FloatingPanel>
	);
}
