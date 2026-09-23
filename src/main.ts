import { Plugin } from 'obsidian';
import { Habit, RawHabitData } from './Models/Habit';
import { ReactWidgetChild } from './ReactWidgetChild';

export default class ExamplePlugin extends Plugin {
	async onload() {
		this.registerMarkdownCodeBlockProcessor(
			'multitask',
			(source, el, ctx) => {
				const container = el.createDiv();

				const getHabits = (): RawHabitData[] => {
					try {
						if (!source.trim()) {
							return [];
						}

						return JSON.parse(source) as RawHabitData[];
					} catch (e) {
						console.error(
							'Parsing error JSON in multitask code-block:',
							e
						);
						return [];
					}
				};

				const saveHabits = async (habits: Habit[]) => {
					const section = ctx.getSectionInfo(el);
					if (!section) {
						return;
					}

					const file = this.app.vault.getFileByPath(ctx.sourcePath);
					if (!file) return;

					const fileContent = await this.app.vault.read(file);
					const lines = fileContent.split('\n');

					const newJsonText = JSON.stringify(habits, null, 2);
					const currentBlockContent = lines
						.slice(section.lineStart + 1, section.lineEnd)
						.join('\n');

					if (currentBlockContent.trim() === newJsonText.trim()) {
						return;
					}

					const updatedLines = [
						...lines.slice(0, section.lineStart),
						'```multitask',
						newJsonText.trim(),
						'```',
						...lines.slice(section.lineEnd + 1),
					];

					await this.app.vault.modify(file, updatedLines.join('\n'));
				};

				const child = new ReactWidgetChild(
					container,
					saveHabits,
					getHabits
				);
				ctx.addChild(child);
			}
		);
	}
}
