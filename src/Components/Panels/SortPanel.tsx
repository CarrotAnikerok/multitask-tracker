import React, { Dispatch, SetStateAction, useState } from 'react'
import { Habit } from '../../Models/Habit';
import FloatingPanel from './FloatingPanel';

type SortPanelProps = {
    setHabits: Dispatch<SetStateAction<Habit[]>>;
}

enum SortType {
    Alphabet,
    LastUpdated,
    Size
}

//TODO: clean
export default function SortPanel({setHabits}: SortPanelProps ) {
    const [type, setType] = useState(SortType.Size);
    const [isIncrease, setIncrease] = useState(false);

    const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const numericValue = Number(event.target.value);
        setType(numericValue);
    }

    const sortByPositiveUpdate = () => {
        setHabits(habits => [...habits].sort((a, b) => {
            const lastPositiveUpdateA = a.positiveUpdates[a.positiveUpdates.length - 1]!;
            const lastPositiveUpdateB = b.positiveUpdates[b.positiveUpdates.length - 1]!;
            if (isIncrease) {
                return lastPositiveUpdateA?.getTime() - lastPositiveUpdateB.getTime();
            } else {
                return lastPositiveUpdateB.getTime() - lastPositiveUpdateA?.getTime();
            }
        }))
    }

    const sortBySize = () => {
        setHabits(habits => [...habits].sort((a, b) => {
                const aCoeff = a.size/a.maxSize;
                const bCoeff = b.size/b.maxSize; 

                if (isIncrease) {
                    return aCoeff - bCoeff;
                } else {
                    return bCoeff - aCoeff;
                }
            }))

    }

    const sortByAlphabet = () => {
        setHabits(habits => [...habits].sort((a, b) => {
            if (isIncrease) {
                return b.name.localeCompare(a.name)
            } else {
                return a.name.localeCompare(b.name);
            }
        }))
    }

    const sort = () => {
        switch (type) {
            case SortType.Alphabet:
                sortByAlphabet();
                break;
            case SortType.LastUpdated:
                sortByPositiveUpdate();
                break;
            case SortType.Size:
                sortBySize();
                break;
            default:
                sortBySize();
        }
    }

    return (
        <div>
            <FloatingPanel content={(close) => (
                <div className="sort-panel">
                    Sort by
                    <select value={type} onChange={handleChange}>
                        <option value={SortType.Alphabet}>alphabetical</option>
                        <option value={SortType.LastUpdated}>last update</option>
                        <option value={SortType.Size}>size</option>
                    </select>
                    <button onClick={() => setIncrease(!isIncrease)}>{isIncrease ? '↑':'↓'}</button>
                    <button onClick={() => {sort(); close()}}>Ok</button>
                </div>
            )}>
                ⇅
            </FloatingPanel>   
        </div>
    )
}
