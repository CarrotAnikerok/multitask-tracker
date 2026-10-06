import { Plugin } from 'obsidian';
import { Habit } from './Models/Habit';
import { ReactWidgetChild } from './ReactWidgetChild';
import { RawData, SettingData } from './Models/Settings';

export default class ExamplePlugin extends Plugin {
	async onload() {
		this.registerMarkdownCodeBlockProcessor(
			'multitask',
			(source, el, ctx) => {
				const container = el.createDiv();

				const loadData = (): RawData => {
					try {
						if (!source.trim()) {
							return {
								habits: [],
								setting: {
									sortType: 1,
									customOrder: [],
									isIncrease: false,
								},
							};
						}

						return JSON.parse(source) as RawData;
					} catch (e) {
						console.error(
							'Parsing error JSON in multitask code-block:',
							e
						);
						return {
							habits: [],
							setting: {
								sortType: 1,
								customOrder: [],
								isIncrease: false,
							},
						};
					}
				};

				//saveSettings
				const saveData = async (
					habits: Habit[],
					settings: SettingData
				) => {
					const section = ctx.getSectionInfo(el);
					if (!section) {
						return;
					}

					const file = this.app.vault.getFileByPath(ctx.sourcePath);
					if (!file) return;

					const fileContent = await this.app.vault.read(file);
					const lines = fileContent.split('\n');

					const rawHabits = habits.map((h) => h.toRaw());
					const rawData: RawData = {
						habits: rawHabits,
						setting: settings,
					};
					const newJsonText = JSON.stringify(rawData, null, 2);
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
					saveData,
					loadData
				);
				ctx.addChild(child);
			}
		);
	}
}
