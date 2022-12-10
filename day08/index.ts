import { readFileSync } from 'fs';
import path from 'path';

// Part 1

function transpose<T>(matrix: T[][]): T[][] {
	return matrix[0].map((_, i) => matrix.map((row) => row[i]));
}

const inputFile = readFileSync(path.join(__dirname, 'input.txt'));
const input = inputFile.toString().trimEnd();

const map: number[][] = input.split('\n').map((line) => {
	return line.split('').map(Number);
});

const transposedMap = transpose(map);

let visibleTrees = 0;
for (let i = 0; i < map.length; i++) {
	const row = map[i];

	for (let j = 0; j < map[i].length; j++) {
		const col = transposedMap[j];

		const treeLines = [
			row.slice(0, j),
			row.slice(j + 1),
			col.slice(0, i),
			col.slice(i + 1),
		];

		const treeHeight = map[i][j];
		if (treeLines.some((line) => Math.max(...line, -Infinity) < treeHeight)) {
			visibleTrees += 1;
		}
	}
}
console.log(visibleTrees);

// Part 2

function product(array: number[]): number {
	return array.reduce((acc, next) => acc * next);
}

let bestScore = -Infinity;
for (let i = 0; i < map.length; i++) {
	const row = map[i];

	for (let j = 0; j < map[i].length; j++) {
		const col = transposedMap[j];

		// We now need this in order from closest to farthest
		const treeLines = [
			row.slice(0, j).reverse(),
			row.slice(j + 1),
			col.slice(0, i).reverse(),
			col.slice(i + 1),
		];

		const treeHeight = map[i][j];
		const scores = treeLines.map((line) => {
			let count = 0;
			for (const height of line) {
				count += 1;
				if (height >= treeHeight) break;
			}
			return count;
		});

		bestScore = Math.max(product(scores), bestScore);
	}
}
console.log(bestScore);
