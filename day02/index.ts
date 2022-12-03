import { readFileSync } from 'fs';
import path from 'path';

// Part 1

// rock | paper | scissors
type TheirShape = 'A' | 'B' | 'C';
type YourShape = 'X' | 'Y' | 'Z';

const winningCombos: [TheirShape, YourShape][] = [['A', 'Y'], ['B', 'Z'], ['C', 'X']];
const losingCombos: [TheirShape, YourShape][] = [['A', 'Z'], ['B', 'X'], ['C', 'Y']];

const inputFile = readFileSync(path.join(__dirname, 'input.txt'));
const input = inputFile.toString().trim()
	.split('\n')
	.map((line) => line.split(' ') as [TheirShape, YourShape]);

function getScore(theirs: TheirShape, yours: YourShape): number {
	const shapeScore = yours === 'X' ? 1 : yours === 'Y' ? 2 : 3;

	const didWin = winningCombos.some(([t, y]) => theirs === t && yours === y);
	const didLose = losingCombos.some(([t, y]) => theirs === t && yours === y);
	const outcomeScore = didWin ? 6 : didLose ? 0 : 3;

	return shapeScore + outcomeScore;
}

function sumOf(array: number[]): number {
	return array.reduce((acc, next) => acc + next);
}

console.log(sumOf(input.map(([t, y]) => getScore(t, y))));

// Part 2

type DesiredOutcome = 'X' | 'Y' | 'Z'; // lose | draw | win

function neededShape(theirs: TheirShape, outcome: DesiredOutcome): YourShape {
	if (theirs === 'A') { // rock
		return outcome === 'X' ? 'Z' : outcome === 'Y' ? 'X' : 'Y';
	} else if (theirs === 'B') { // paper
		return outcome === 'X' ? 'X' : outcome === 'Y' ? 'Y' : 'Z';
	} else if (theirs === 'C') { // scissors
		return outcome === 'X' ? 'Y' : outcome === 'Y' ? 'Z' : 'X';
	}
	throw TypeError();
}

const input2 = (input as [TheirShape, DesiredOutcome][])
	.map(([t, o]) => <[TheirShape, YourShape]>[t, neededShape(t, o)]);

console.log(sumOf(input2.map(([t, y]) => getScore(t, y))));
