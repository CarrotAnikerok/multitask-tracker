export type HabitData = {
    id: string;
    name: string;
    maxSize: number;
    size: number;
    color: string;
    positiveUpdates: string[];
    lastUpdate: string;
}

export interface IHabit {
    name: string;
    size: number;
    maxSize: number;
    color: string;
    positiveUpdates: Date[]
}

export class Habit implements IHabit {
    readonly id: string;
    name: string;
    color: string;
    // возможно стоит закрыть но чтоб без багов...
    size: number = 10;
    maxSize: number = 10;

    // i need days, not dates... but for sorting i need dates... hm i need to replace the last date if it the same day
    positiveUpdates: Date[];
    private lastUpdate: Date;

    // может все-таки не воссоздавать объекты... а как-то по другому...
    constructor(name: string, maxSize: number, color: string, size?: number, id?: string, positiveDates?: string[], lastUpdate?: string) {
        this.name = name;
        this.size = size ? size : maxSize;
        this.color = color;
        this.maxSize = maxSize;
        this.id = id ? id : this.generateCode();
        this.positiveUpdates = positiveDates ? positiveDates.map(d => new Date(d)): [new Date()];
        this.lastUpdate = lastUpdate ?  new Date(lastUpdate): new Date();
    }

    changeSize(addedSize: number) {
        const maxSize = 10;
        const newSize = this.size + addedSize;

        if (newSize > maxSize || newSize < 0) {
            return;
        }

        if (newSize > this.size) {
            const lastPositiveUpdate = this.positiveUpdates[this.positiveUpdates.length - 1]!;
            const date = new Date();
            if (lastPositiveUpdate.getDate() === date.getDate()) {
                this.positiveUpdates[this.positiveUpdates.length - 1] =date;
            } else {
                this.positiveUpdates.push(date);
            }
            this.lastUpdate = date;
        }

        this.size = newSize;
    }

    // это бы тестами покрыть емае...
    // TODO: можно будет добавить анимации для уменьшения полосочек только при заходе чтобы понять что упало
    decreaseSizeDated(today: Date) {
        const DAY_MS = 24 * 3600 * 1000;
        const daysFromLastCheck = this.getDaysBetween(this.lastUpdate, today);
        const lastPositiveUpdate: Date = this.positiveUpdates[this.positiveUpdates.length - 1]!;
        const lastPositiveUpdateDay = new Date(lastPositiveUpdate);
        lastPositiveUpdateDay.setHours(0, 0, 0, 0);

        if (daysFromLastCheck > 0 && lastPositiveUpdateDay.getTime() + DAY_MS < today.getTime()) {
            const daysBetweenPositive = this.getDaysBetween(lastPositiveUpdateDay, today);
            let resultSize = this.size;;

            // имеет ли это смысл...
            if (daysFromLastCheck === daysBetweenPositive) {
                resultSize = this.size - (daysFromLastCheck - 1);
            } else {
                resultSize = this.size - (daysFromLastCheck);
            }

            this.lastUpdate = today;
            this.size = resultSize >= 0 ? resultSize : 0;
        }
    }

    private getDaysBetween(earlyDate: Date, lateDate: Date) {
        const DAY_MS = 24 * 3600 * 1000;
        const timeBetween = lateDate.getTime() - earlyDate.getTime();
        return Math.trunc(timeBetween / DAY_MS);
    }

    private generateCode(): string {
        return Array.apply(0, Array(6)).map(function() {
            return (function(charset){
                return charset.charAt(Math.floor(Math.random() * charset.length))
            }('ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'));
        }).join('')
    }
}