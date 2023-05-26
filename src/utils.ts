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

export function convertMillisecondsToMinutesAndSeconds(ms: number): string {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    return `minutes: ${minutes}, seconds: ${seconds}`
}
