import React from 'react';
import FloatingPanel from './FloatingPanel';
import { SortType } from '../../Models/Settings';

type SortPanelProps = {
	sortHabits: (sort: SortType, increase: boolean) => void;
	sortType: SortType;
	isIncrease: boolean;
};

export default function SortPanel({
	sortHabits, sortType, isIncrease
}: SortPanelProps) {
	const changeType = (event: React.ChangeEvent<HTMLSelectElement>) => {
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
						Sort by
						<select value={sortType} onChange={changeType}>
							<option value={SortType.Custom}>custom</option>
							<option value={SortType.Alphabet}>
								alphabetical
							</option>
							<option value={SortType.LastUpdated}>
								last update
							</option>
							<option value={SortType.Size}>size</option>
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
