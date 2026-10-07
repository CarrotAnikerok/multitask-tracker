import { MarkdownRenderChild } from 'obsidian';
import { createRoot, Root } from 'react-dom/client';
import { App } from './App';
import { Habit, RawHabitData } from './Models/Habit';
import { RawData, SettingData } from './Models/Settings';

export class ReactWidgetChild extends MarkdownRenderChild {
	private root: Root | null = null;
	private onSaveData: (
		habits: Habit[],
		setting: SettingData
	) => Promise<void>;
	private onLoadData: () => RawData;
	private initialHabits: Habit[] | null = null;
	private initialSettings: SettingData = {
		sortType: 1,
		customOrder: [],
		isIncrease: false,
	};

	constructor(
		containerEl: HTMLElement,
		onSaveData: (habits: Habit[], setting: SettingData) => Promise<void>,
		onLoadData: () => RawData
	) {
		super(containerEl);
		this.onSaveData = onSaveData;
		this.onLoadData = onLoadData;
	}

	loadHabits() {
		const loadedData = this.onLoadData();
		if ('habits' in loadedData) {
			//eslint-disable-next-line no-var -- var have a logic here
			var loadedHabits = loadedData.habits;
		} else {
			loadedHabits = loadedData;
		}

		this.initialSettings = loadedData.setting;

		this.initialHabits = loadedHabits.map((raw: RawHabitData) => {
			return Habit.fromRaw(raw);
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

			const handleSettingChange = (updatedSettings: SettingData) => {
				this.initialSettings = updatedSettings;
			};

			this.loadHabits();
			this.root = createRoot(this.containerEl);
			this.root.render(
				<App
					onChangeHabits={handleHabitsChange}
					onChangeSettings={handleSettingChange}
					initialHabits={this.initialHabits || []}
					initialSettings={
						this.initialSettings || { sortType: 1, customOrder: [] }
					}
				/>
			);
		}, 100);
	}

	onunload() {
		if (this.root) {
			this.root.unmount();
		}

		if (this.initialHabits) {
			void this.onSaveData(this.initialHabits, this.initialSettings);
		}
	}
}
