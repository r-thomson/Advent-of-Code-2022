import { readFileSync } from 'fs';
import path from 'path';

// Part 1

type Command = 'cd' | 'ls';
type Directory = { [index: string]: Directory | File; };
type File = Number;

const filesystem: Directory = {};
let currentPath: Directory[] = [filesystem];

function handleCommand(command: Command, ...args: string[]) {
	const currentDir = currentPath.at(-1)!;

	switch (command) {
		case 'cd':
			if (args[0] === '/') {
				currentPath = [filesystem];
			} else if (args[0] === '..') {
				currentPath.pop();
			} else {
				currentPath.push(currentDir[args[0]] as Directory);
			}
			break;
		case 'ls':
			break; // Just assume any non-command is the result of an ls, so don't do anything
	}
}

const inputFile = readFileSync(path.join(__dirname, 'input.txt'));
const input = inputFile.toString().trimEnd().split('\n');

for (const line of input) {
	if (line.startsWith('$')) {
		const [command, ...args] = line.slice(2).split(' ');
		handleCommand(command as Command, ...args);
	} else {
		const currentDir = currentPath.at(-1)!;

		if (line.startsWith('dir')) {
			const dirName = line.slice(4);
			currentDir[dirName] = {} as Directory;
		} else {
			const [size, name] = line.split(' ');
			currentDir[name] = Number(size);
		}
	}
}

const dirSizes = new Map<Directory, number>();

function getSizeOfDirectory(dir: Directory): number {
	let size = 0;

	for (const child of Object.values(dir)) {
		if (typeof child === 'number') {
			size += child;
		} else {
			size += getSizeOfDirectory(child as Directory);
		}
	};

	dirSizes.set(dir, size);
	return size;
}
getSizeOfDirectory(filesystem);

let totalSizeOfSmallDirs = 0;
dirSizes.forEach((size) => {
	if (size <= 100000) {
		totalSizeOfSmallDirs += size;
	}
});
console.log(totalSizeOfSmallDirs);

// Part 2

const FREE_SPACE = 70000000 - dirSizes.get(filesystem)!;
const NEEDED_SPACE = 30000000;
const NEED_TO_DELETE = NEEDED_SPACE - FREE_SPACE;

const [, sizeToDelete] = Array.from(dirSizes).sort(([, a], [, b]) => a - b)
	.find(([dir, size]) => size >= NEED_TO_DELETE)!;
console.log(sizeToDelete);
