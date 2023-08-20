import { generateColorTransition, Vec3, generateAnalogousColors} from "./colours";



// Test


it('generates a color transition from black to white', () => {
    const pointA: Vec3 = [0, 0, 0];  // Black
    const pointB: Vec3 = [255, 255, 255];  // White
    const N = 0.1;

    const colors = generateColorTransition(pointA, pointB, N);


    expect(colors[0]).toEqual(pointA);
    expect(colors[colors.length - 1]).toEqual(pointB);
});

describe('generateAnalogousColors', () => {
    // it('generates analogous colors for a single color', () => {
    //     const colors = generateAnalogousColors([[255, 0, 0]]); //?
    //     expect(colors).toEqual([[255, 153, 0], [255, 0, 153]]);
    // });
    //
    // it('generates analogous colors for multiple colors', () => {
    //     const colors = generateAnalogousColors([[255, 0, 0], [0, 255, 0], [0, 0, 255]]);
    //     expect(colors).toEqual([[255, 255, 0], [0, 255, 255], [255, 0, 255]]);
    // });
    //
    // it('uses the provided offset', () => {
    //     const colors = generateAnalogousColors([[255, 0, 0]], 60);
    //     expect(colors).toEqual([[255, 255, 0], [255, 0, 255]]);
    // });
});
