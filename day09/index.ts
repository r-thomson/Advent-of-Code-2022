import { readFileSync } from 'fs';
import path from 'path';

// Part 1

type Vec2 = [x: number, y: number];

const vec2Sum = (a: Vec2, b: Vec2): Vec2 => [a[0] + b[0], a[1] + b[1]];
const vec2Diff = (a: Vec2, b: Vec2): Vec2 => [a[0] - b[0], a[1] - b[1]];

class RopeSegment {
	headPos: Vec2;
	tailPos: Vec2;
	tailHistory: Vec2[];

	constructor() {
		this.headPos = [0, 0];
		this.tailPos = [0, 0];
		this.tailHistory = [[0, 0]];
	}

	moveHead([x, y]: Vec2) {
		this.headPos = [x, y];

		const [dx, dy] = vec2Diff(this.headPos, this.tailPos);
		if (Math.abs(dx) > 1 || Math.abs(dy) > 1) {
			this.updateTailPosition();
		}
	}

	updateTailPosition() {
		const [dx, dy] = vec2Diff(this.headPos, this.tailPos);

		const moveBy: Vec2 = [Math.sign(dx), Math.sign(dy)];
		this.tailPos = vec2Sum(this.tailPos, moveBy);

		this.tailHistory.push(this.tailPos);
	}
}

const inputFile = readFileSync(path.join(__dirname, 'input.txt'));
const input = inputFile.toString().trimEnd().split('\n').map((line) => {
	const [direction, steps] = line.split(' ');
	let directionalVec: Vec2;
	switch (direction as 'U' | 'D' | 'L' | 'R') {
		case 'U':
			directionalVec = [0, -1];
			break;
		case 'D':
			directionalVec = [0, 1];
			break;
		case 'L':
			directionalVec = [-1, 0];
			break;
		case 'R':
			directionalVec = [1, 0];
			break;
	}
	return [directionalVec, Number(steps)] as [Vec2, number];
});


const ropeSeg = new RopeSegment();
input.forEach(([moveVec, steps]) => {
	for (let i = 0; i < steps; i++) {
		ropeSeg.moveHead(vec2Sum(ropeSeg.headPos, moveVec));
	}
});

console.log(new Set(ropeSeg.tailHistory.map(String)).size);

// Part 2

class Rope {
	segments: RopeSegment[];

	constructor(length: number) {
		this.segments = new Array(length).fill(undefined).map(() => new RopeSegment());
	}

	get headPos(): Vec2 { return this.segments[0].headPos; }
	get tailPos(): Vec2 { return this.segments.at(-1)!.tailPos; }
	get tailHistory(): Vec2[] { return this.segments.at(-1)!.tailHistory; }

	moveHead([x, y]: Vec2) {
		this.segments[0].moveHead([x, y]);
		for (let i = 1; i < this.segments.length; i++) {
			this.segments[i].moveHead(this.segments[i - 1].tailPos);
		}
	}
}

const rope = new Rope(9);
input.forEach(([moveVec, steps]) => {
	for (let i = 0; i < steps; i++) {
		rope.moveHead(vec2Sum(rope.headPos, moveVec));
	}
});

console.log(new Set(rope.segments.at(-1)!.tailHistory.map(String)).size);
