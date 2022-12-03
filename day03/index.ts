import { readFileSync } from 'fs';
import path from 'path';

// Part 1

const inputFile = readFileSync(path.join(__dirname, 'input.txt'));

function halfString(str: string): [string, string] {
	return [str.slice(0, str.length / 2), str.slice(str.length / 2)];
}

function charToPriority(char: string): number {
	const charCode = char.charCodeAt(0);
	// 'a' -> 97 -> 1, 'A' -> 65 -> 27
	return charCode >= 97 ? charCode - 96 : charCode - 38;
}

function intersection<T>(a: Iterable<T>, b: Iterable<T>): T[] {
	const bSet = new Set(b);
	return Array.from(a).filter((el) => bSet.has(el));
}

function sum(array: number[]): number {
	return array.reduce((acc, next) => acc + next);
}

const input = inputFile.toString().trim().split('\n');
const commonItems = input
	.map((line) => halfString(line))
	.map(([l, r]) => intersection(l, r)[0]);
console.log(sum(commonItems.map(charToPriority)));

// Part 2

function chunk<T>(array: T[], size: number): T[][] {
	const chunks = [];
	for (let i = 0; i < array.length; i += size) {
		chunks.push(array.slice(i, i + size));
	}
	return chunks;
}

const groupItems = chunk(input, 3)
	.map(([a, b, c]) => intersection(a, intersection(b, c))[0]);
console.log(sum(groupItems.map(charToPriority)));
