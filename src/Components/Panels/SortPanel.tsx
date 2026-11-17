import FloatingPanel from './FloatingPanel';
import { SortType } from '../../Models/Settings';
import { ChangeEvent, useContext } from 'react';
import { LanguageContext } from '../../utils/Contexts';
import { getTranslation } from '../../utils/translator';

type SortPanelProps = {
	sortHabits: (sort: SortType, increase: boolean) => void;
	sortType: SortType;
	isIncrease: boolean;
};

export default function SortPanel({
	sortHabits,
	sortType,
	isIncrease,
}: SortPanelProps) {
	const context = useContext(LanguageContext);
	const changeType = (event: ChangeEvent<HTMLSelectElement>) => {
		const sortValue = Number(event.target.value);
		sortHabits(sortValue, isIncrease);
	};

	const changeIncrease = () => {
		sortHabits(sortType, !isIncrease);
	};

	return (
		<div>
			<FloatingPanel
				content={() => (
					<div className="sort-panel">
						{getTranslation('sort by', context)}
						<select value={sortType} onChange={changeType}>
							<option value={SortType.Custom}>
								{getTranslation('custom', context)}
							</option>
							<option value={SortType.Alphabet}>
								{getTranslation('alphabetical', context)}
							</option>
							<option value={SortType.LastUpdated}>
								{getTranslation('last update', context)}
							</option>
							<option value={SortType.Size}>
								{getTranslation('size', context)}
							</option>
						</select>
						<button onClick={changeIncrease}>
							{isIncrease ? '↑' : '↓'}
						</button>
					</div>
				)}
			>
				⇅
			</FloatingPanel>
		</div>
	);
}
