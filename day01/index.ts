import { readFileSync } from 'fs';
import path from 'path';

// Part 1

const inputFile = readFileSync(path.join(__dirname, 'input.txt'));
const input = inputFile.toString().trim()
	.split('\n\n')
	.map((group) => group.split('\n')
		.map((line) => parseInt(line))
	);

function sum(array: number[]): number {
	return array.reduce((acc, next) => acc + next);
}

const sumsOfGroups = input.map(sum);

console.log(Math.max(...sumsOfGroups));

// Part 2

const sortedSums = sumsOfGroups.sort((a, b) => a - b); // 2022 and we still need to write this

console.log(sum(sortedSums.slice(-3)));
