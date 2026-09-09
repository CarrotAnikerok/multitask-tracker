import { Dispatch, SetStateAction, useState } from 'react'
import { Habit } from '../../Models/Habit';
import FloatingPanel from './FloatingPanel';

type SortPanelProps = {
    setHabits: Dispatch<SetStateAction<Habit[]>>;
}

export default function SortPanel({setHabits}: SortPanelProps ) {
    const sortByPositiveUpdate = () => {
        setHabits(habits => [...habits].sort((a, b) => {
            return b.lastPositiveUpdate.getTime() - a.lastPositiveUpdate.getTime();
        }))
    }

    const sortByCoeff = () => {
        setHabits(habits => [...habits].sort((a, b) => {
                const aCoeff = a.size/a.maxSize;
                const bCoeff = b.size/b.maxSize; 
                return bCoeff - aCoeff;
            }))

    }

    const sortByAlphabet = () => {
        setHabits(habits => [...habits].sort((a, b) => a.name.localeCompare(b.name)))
    }

    return (
        <div>
            <FloatingPanel content={(close) => (
                <div>
                    <button onClick={() => { sortByAlphabet(); close(); }}>alphabet</button>
                    <button onClick={() => { sortByPositiveUpdate(); close(); }}>lastUpdated</button>
                    <button onClick={() => { sortByCoeff(); close(); }}>size</button>
                </div>
            )}>
                ⇅
            </FloatingPanel>   
        </div>
    )
}
