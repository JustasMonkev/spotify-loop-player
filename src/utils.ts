import {Bars} from "./types/bars";

export function findClosest(target: number, data: Bars[]): number {
    let closestValue = Infinity;
    let closestStart = 0;

    data.forEach(obj => {
        const difference = Math.abs(target - obj.start);
        if (difference < closestValue) {
            closestValue = difference;
            closestStart = obj.start;
        }
    });

    return closestStart;
}
