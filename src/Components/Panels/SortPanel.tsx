import React, { Dispatch, SetStateAction, useEffect } from 'react';
import { Habit } from '../../Models/Habit';
import FloatingPanel from './FloatingPanel';
import { SortType } from '../../Models/Settings';

type SortPanelProps = {
	setHabits: Dispatch<SetStateAction<Habit[]>>;
	sortType: SortType;
	setSortType: Dispatch<React.SetStateAction<SortType>>;
	isIncrease: boolean;
	setIncrease: Dispatch<React.SetStateAction<boolean>>;
	customOrder: string[];
};

//TODO: clean
export default function SortPanel({
	setHabits,
	sortType,
	setSortType,
	customOrder,
	isIncrease,
	setIncrease,
}: SortPanelProps) {
	const changeType = (event: React.ChangeEvent<HTMLSelectElement>) => {
		const sortValue = Number(event.target.value);
		setSortType(sortValue);
		sort(sortValue, isIncrease);
	};

	//TODO: remake with LAZY inicialization
	useEffect(() => {
		sort(sortType, isIncrease);
	}, []);

	const changeIncrease = () => {
		setIncrease((isIncrease) => !isIncrease);
		sort(sortType, !isIncrease);
	};

	const sortByPositiveUpdate = (isIncrease: boolean) => {
		setHabits((habits) =>
			[...habits].sort((a, b) => {
				const lastPositiveUpdateA = a.getLastPositiveUpdate();
				const lastPositiveUpdateB = b.getLastPositiveUpdate();
				if (isIncrease) {
					return (
						lastPositiveUpdateA.getTime() -
						lastPositiveUpdateB.getTime()
					);
				} else {
					return (
						lastPositiveUpdateB.getTime() -
						lastPositiveUpdateA.getTime()
					);
				}
			})
		);
	};

	const sortBySize = (isIncrease: boolean) => {
		setHabits((habits) =>
			[...habits].sort((a, b) => {
				const aCoefficient = a.size / a.maxSize;
				const bCoefficient = b.size / b.maxSize;

				if (isIncrease) {
					return aCoefficient - bCoefficient;
				} else {
					return bCoefficient - aCoefficient;
				}
			})
		);
	};

	const sortByAlphabet = (isIncrease: boolean) => {
		setHabits((habits) =>
			[...habits].sort((a, b) => {
				if (isIncrease) {
					return b.name.localeCompare(a.name);
				} else {
					return a.name.localeCompare(b.name);
				}
			})
		);
	};

	const getCustomOrder = (isIncrease: boolean) => {
		setHabits((prev) => {
			const habitMap = new Map(prev.map((h) => [h.id, h]));
			const order = customOrder
				.map((id) => habitMap.get(id))
				.filter((h): h is Habit => !!h);
			//TODO: maybe todo like this everywhere
			if (isIncrease) {
				return order.reverse();
			}

			return order;
		});
	};

	const sort = (type: SortType, isIncrease: boolean) => {
		switch (type) {
			case SortType.Custom:
				getCustomOrder(isIncrease);
				break;
			case SortType.Alphabet:
				sortByAlphabet(isIncrease);
				break;
			case SortType.LastUpdated:
				sortByPositiveUpdate(isIncrease);
				break;
			case SortType.Size:
				sortBySize(isIncrease);
				break;
			default:
				sortBySize(isIncrease);
		}
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
