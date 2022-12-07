import { readFileSync } from 'fs';
import path from 'path';

// Part 1

const inputFile = readFileSync(path.join(__dirname, 'input.txt'));
const input = inputFile.toString().trimEnd();

for (let i = 0; i <= input.length - 4; i++) {
	const chars = input.slice(i, i + 4);

	if (new Set(chars).size === chars.length) {
		console.log(i + 4);
		break;
	}
}

// Part 2

for (let i = 0; i <= input.length - 14; i++) {
	const chars = input.slice(i, i + 14);

	if (new Set(chars).size === chars.length) {
		console.log(i + 14);
		break;
	}
}
