export type Vec3 = [number, number, number];

import KMeans from 'kmeans-js';

function findRepresentativeColor(colors: Vec3[]): Vec3 {
    const kmeans = new KMeans({
        K: Math.sqrt(colors.length), // Use the square root of the number of colors as the number of clusters
        iterations: 100, // Adjust as needed
    });

    kmeans.cluster(colors);

    // Find the largest cluster
    const largestCluster = kmeans.clusters.reduce((a, b) => (a.length > b.length ? a : b));

    // Calculate the centroid of the largest cluster
    const representativeColor = largestCluster.reduce((acc, color) => acc.map((value, index) => value + color[index]), [0, 0, 0]).map(value => value / largestCluster.length);

    return representativeColor;
}


function generateRandomPoint(): Vec3 {
    return [Math.random() * 255, Math.random() * 255, Math.random() * 255];
}

function clamp(value: number, min: number, max: number): number {
    return Math.min(Math.max(value, min), max);
}

function lerp(a: number, b: number, t: number): number {
    return a * (1 - t) + b * t;
}


export function generateAnalogousColors(colors: Vec3[], offset = 30): [Vec3, Vec3] {
    // Convert the colors to HSL
    const hslColors = colors.map(rgbToHsl);

    // Calculate the average hue, saturation, and lightness
    const avgHue = hslColors.reduce((sum, [h]) => sum + h, 0) / hslColors.length;
    const avgSat = hslColors.reduce((sum, [, s]) => sum + s, 0) / hslColors.length;
    const avgLight = hslColors.reduce((sum, [, , l]) => sum + l, 0) / hslColors.length;

    // Generate two analogous colors
    const color1 = hslToRgb([(avgHue - offset + 360) % 360, avgSat, avgLight]);
    const color2 = hslToRgb([(avgHue + offset) % 360, avgSat, avgLight]);

    return [color1, color2];
}


export function generateColorTransition(pointA: Vec3, pointB: Vec3, N: number): Vec3[] {
    const P0 = pointA;
    const P3 = pointB;
    const P1 = generateRandomPoint();
    const P2 = generateRandomPoint();

    console.log(N, P0, P1, P2, P3)

    const colors: Vec3[] = [];

    for (let t = 0; t <= 1; t += (Math.abs(Math.sin(3 * Math.PI * t)) * N / 100) + 0.01) {
        const Bt: Vec3 = [
            lerp(lerp(lerp(P0[0], P1[0], t), P2[0], t), P3[0], t),
            lerp(lerp(lerp(P0[1], P1[1], t), P2[1], t), P3[1], t),
            lerp(lerp(lerp(P0[2], P1[2], t), P2[2], t), P3[2], t)
        ];

        const R = clamp(Bt[0], 0, 255);
        const G = clamp(Bt[1], 0, 255);
        const B = clamp(Bt[2], 0, 255);

        colors.push([R, G, B]);
    }

    colors[colors.length - 1] = P3;

    return colors;
}

function rgbToHsl([r, g, b]: Vec3): Vec3 {
    r /= 255;
    g /= 255;
    b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h = 0, s, l = (max + min) / 2;

    if (max === min) {
        h = s = 0; // achromatic
    } else {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }

    return [h * 360, s * 100, l * 100];
}

function hslToRgb([h, s, l]: Vec3): Vec3 {
    h /= 360;
    s /= 100;
    l /= 100;
    let r, g, b;

    if (s === 0) {
        r = g = b = l; // achromatic
    } else {
        const hue2rgb = (p: number, q: number, t: number) => {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1 / 6) return p + (q - p) * 6 * t;
            if (t < 1 / 2) return q;
            if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
            return p;
        };
        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;
        r = hue2rgb(p, q, h + 1 / 3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1 / 3);
    }

    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

