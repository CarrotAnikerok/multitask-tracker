export enum Language {
	en = 'en',
	ru = 'ru',
}

const translations: Partial<Record<Language, Record<string, string>>> = {
	ru: {
		edit: 'изменить',
		delete: 'удалить',
		name: 'имя',
		color: 'цвет',
		size: 'размер',
		create: 'создать',
		update: 'изменить',
		cancel: 'отмена',
		'should be less than': 'должно быть меньше чем',
		symbols: 'символов',
		custom: 'пользовательская',
		'sort by': 'сортировка',
		'last update': 'обновление',
		alphabetical: 'алфавит',
		'New habit': 'Занятие',
		// TODO: think of better name
		drop: `шаг`,
	},
};

export function getTranslation(key: string, lang: Language): string {
	if (lang === Language.ru && translations.ru) {
		return translations.ru[key] ?? key;
	}

	return key;
}
