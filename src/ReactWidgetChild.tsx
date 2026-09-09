import { MarkdownRenderChild } from "obsidian";
import { createRoot, Root } from "react-dom/client";
import { App } from "./App";
import { Habit, HabitData } from "./Models/Habit";

export class ReactWidgetChild extends MarkdownRenderChild {
    private root: Root | null = null;
    private onSaveData: (habits: Habit[]) => Promise<void>;
    private onLoadData: () => HabitData[];
    private initialHabits: Habit[] | null = null;

    constructor(containerEl: HTMLElement, onSaveData: (habits: Habit[]) => Promise<void>, onLoadData: () => HabitData[]) {
        super(containerEl);
        this.onSaveData = onSaveData;
        this.onLoadData = onLoadData;
    }

    loadHabits() {
        const loadedHabits = this.onLoadData();
        const todayDate = new Date(new Date().setHours(0, 0, 0, 0));

        this.initialHabits = loadedHabits.map((h: HabitData) => {
            const newHabit = new Habit(h.name, h.maxSize, h.color, h.size, h.id, h.positiveUpdates, h.lastUpdate);
            newHabit.decreaseSizeDated(todayDate);
            return newHabit;
        })
    }

    onload() {
        const handleHabitsChange = (updatedHabits: Habit[]) => {
            this.initialHabits = updatedHabits;
        };

        this.loadHabits(); 
        this.root = createRoot(this.containerEl);
        this.root.render(<App onChange={handleHabitsChange} initialHabits={this.initialHabits || []}/>);
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