import { readFileSync } from 'fs';
import path from 'path';

// Part 1

interface Range {
	lower: number;
	upper: number;
};

const inputFile = readFileSync(path.join(__dirname, 'input.txt'));
const rangePairs = inputFile.toString().trim().split('\n')
	.map((line) => line.split(',').map((part) => {
		const [lower, upper] = part.split('-').map(Number);
		return <Range>{ lower, upper };
	}) as [Range, Range]);

function rangeSize(range: Range): number {
	return range.upper - range.lower;
}

function rangesFullyOverlap(a: Range, b: Range): boolean {
	// The bigger range can contain the smaller, not the other way around
	const [smallerRange, biggerRange] = rangeSize(a) > rangeSize(b) ? [b, a] : [a, b];
	return smallerRange.lower >= biggerRange.lower && smallerRange.upper <= biggerRange.upper;
}

console.log(rangePairs.filter(([a, b]) => rangesFullyOverlap(a, b)).length);

// Part 2

function rangesPartiallyOverlap(a: Range, b: Range): boolean {
	return (a.lower <= b.lower && a.upper >= b.lower)
		|| (b.lower <= a.lower && b.upper >= a.lower);
}

console.log(rangePairs.filter(([a, b]) => rangesPartiallyOverlap(a, b)).length);
