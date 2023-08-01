type Vec3 = [number, number, number];

function generateRandomPoint(): Vec3 {
    return [Math.random() * 255, Math.random() * 255, Math.random() * 255];
}

function clamp(value: number, min: number, max: number): number {
    return Math.min(Math.max(value, min), max);
}

function lerp(a: number, b: number, t: number): number {
    return a * (1 - t) + b * t;
}

function generateColorTransition(pointA: Vec3, pointB: Vec3, N: number): Vec3[] {
    const P0 = pointA;
    const P3 = pointB;
    const P1 = generateRandomPoint();
    const P2 = generateRandomPoint();

    const colors: Vec3[] = [];

    for (let t = 0; t <= 1; t += 0.01) {
        const Bt: Vec3 = [
            lerp(lerp(lerp(P0[0], P1[0], t), P2[0], t), P3[0], t),
            lerp(lerp(lerp(P0[1], P1[1], t), P2[1], t), P3[1], t),
            lerp(lerp(lerp(P0[2], P1[2], t), P2[2], t), P3[2], t)
        ];

        const R = clamp(Bt[0], 0, 255);
        const G = clamp(Bt[1], 0, 255);
        const B = clamp(Bt[2], 0, 255);

        const stepSize = N * Math.sin(3 * Math.PI * t);
        t += stepSize;

        colors.push([R, G, B]);
    }

    return colors;
}

// Test
import { expect } from 'jest';

it('generates a color transition from black to white', () => {
    const pointA: Vec3 = [0, 0, 0];  // Black
    const pointB: Vec3 = [255, 255, 255];  // White
    const N = 0.1;

    const colors = generateColorTransition(pointA, pointB, N);

    expect(colors[0]).toEqual(pointA);
    expect(colors[colors.length - 1]).toEqual(pointB);
});
