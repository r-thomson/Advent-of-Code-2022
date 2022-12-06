import { readFileSync } from 'fs';
import path from 'path';

// Part 1

const inputFile = readFileSync(path.join(__dirname, 'input.txt'));
const [stacksInput, movesInput] = inputFile.toString().trimEnd().split('\n\n');

const NUM_STACKS = 9;
const stacks: string[][] = new Array(NUM_STACKS).fill(undefined).map(() => []);

function setInitialStackState() {
	// We go in reverse to read from the bottom up
	stacksInput.split('\n').reverse().slice(1).forEach((line) => {
		for (let i = 0; i < NUM_STACKS; i++) {
			const char = line.charAt(i * 4 + 1);
			if (char && char !== ' ') {
				stacks[i].push(char);
			}
		}
	});
}

setInitialStackState();

interface MoveCommand {
	quantity: number;
	from: number;
	to: number;
}

const moveCommands = movesInput.split('\n').map((line) => {
	let [_, quantity, from, to] = line.match(/move (\d+) from (\d) to (\d)/)!;
	return <MoveCommand>{ quantity: Number(quantity), from: Number(from), to: Number(to) };
});

moveCommands.forEach(({ quantity, from, to }) => {
	const fromStack = stacks[from - 1], toStack = stacks[to - 1];
	const removed = fromStack.splice(-quantity, quantity);
	toStack.push(...removed.reverse());
});

console.log(stacks.map((stack) => stack.at(-1)).join(''));

// Part 2

// Reset the stacks
stacks.map(() => []);
setInitialStackState();

moveCommands.forEach(({ quantity, from, to }) => {
	const fromStack = stacks[from - 1], toStack = stacks[to - 1];
	const removed = fromStack.splice(-quantity, quantity);
	toStack.push(...removed);
});

console.log(stacks.map((stack) => stack.at(-1)).join(''));
