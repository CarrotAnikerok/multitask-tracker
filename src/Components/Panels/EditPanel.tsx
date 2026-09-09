import { Habit } from '../../Models/Habit';
import FloatingPanel from './FloatingPanel';

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
		<div>
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
							edit
						</button>
						<button
							onClick={() => {
								handleDelete(habit);
								close();
							}}
						>
							delete
						</button>
					</div>
				)}
			>
				...
			</FloatingPanel>
		</div>
	);
}
