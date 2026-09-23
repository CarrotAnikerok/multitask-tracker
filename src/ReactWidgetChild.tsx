import { MarkdownRenderChild } from 'obsidian';
import { createRoot, Root } from 'react-dom/client';
import { App } from './App';
import { Habit, RawHabitData } from './Models/Habit';

export class ReactWidgetChild extends MarkdownRenderChild {
	private root: Root | null = null;
	private onSaveData: (habits: Habit[]) => Promise<void>;
	private onLoadData: () => RawHabitData[];
	private initialHabits: Habit[] | null = null;

	constructor(
		containerEl: HTMLElement,
		onSaveData: (habits: Habit[]) => Promise<void>,
		onLoadData: () => RawHabitData[]
	) {
		super(containerEl);
		this.onSaveData = onSaveData;
		this.onLoadData = onLoadData;
	}

	loadHabits() {
		const loadedHabits = this.onLoadData();
		const todayDate = new Date(new Date().setHours(0, 0, 0, 0));

		this.initialHabits = loadedHabits.map((raw: RawHabitData) => {
			const newHabit = Habit.fromRaw(raw);
			newHabit.decreaseSizeDated(todayDate);

			return newHabit;
		});
	}

	onload() {
		// artificial slowdown, because onunload cannot be async,
		// but with reload onunload SHOULD end before onload starts.
		// but because its different instances we cannot track when onunload is over to start onload.
		// so slowdown for now it is.
		window.setTimeout(() => {
			const handleHabitsChange = (updatedHabits: Habit[]) => {
				this.initialHabits = updatedHabits;
			};

			this.loadHabits();
			this.root = createRoot(this.containerEl);
			this.root.render(
				<App
					onChange={handleHabitsChange}
					initialHabits={this.initialHabits || []}
				/>
			);
		}, 100);
	}

	onunload() {
		if (this.root) {
			this.root.unmount();
		}

		if (this.initialHabits) {
			void this.onSaveData(this.initialHabits);
		}
	}
}
