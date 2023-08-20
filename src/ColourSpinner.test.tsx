import React from 'react';
import { act, render, screen } from '@testing-library/react';
import ColourSpinner from './ColourSpinner';
import { Vec3 } from "./colours";

import '@testing-library/jest-dom/extend-expect';

const startColor: Vec3 = [0, 0, 0];
const endColor: Vec3 = [255, 255, 255];

describe('ColorfulSpinner', () => {
  it('renders the spinner when visible is true', () => {
    render(<ColourSpinner visible={true} transitionSpeed={1}
                          startColor={startColor} endColor={endColor}/>);
    expect(screen.getByTestId('spinner')).toBeInTheDocument();
  });

  it('does not render the spinner when visible is false', () => {
    render(<ColourSpinner visible={false} transitionSpeed={1}
                          startColor={startColor} endColor={endColor}/>);
    expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
  });

  it('changes the color of the spinner', async () => {
    render(<ColourSpinner visible={true} transitionSpeed={1}
                          startColor={startColor} endColor={endColor}/>);

    const spinner = screen.getByTestId('spinner');

    // Wait for the color to change
    await new Promise(resolve => setTimeout(resolve, 1000));

    const color = getComputedStyle(spinner).getPropertyValue('color');

    // Check that the color is not black
    expect(color).not.toBe('rgb(0, 0, 0)');
  });


  it('transitions between two statically decided random colors', async () => {

    jest.useFakeTimers();

    const startColor: Vec3 = [120, 60, 180]; // A random color
    const endColor: Vec3 = [60, 180, 120]; // Another random color

    render(<ColourSpinner visible={true} transitionSpeed={1} startColor={startColor} endColor={endColor}/>);

    const spinner = screen.getByTestId('spinner');

    // Advance timers by 1 second
    jest.advanceTimersByTime(1000);

    const color = getComputedStyle(spinner).getPropertyValue('color');

    // Check that the color is not the start color
    expect(color).not.toBe(`rgb(${startColor[0]}, ${startColor[1]}, ${startColor[2]})`);

    jest.useRealTimers()
  });

  xit('transitions between two statically decided random colors and then reverses', async () => {

    jest.useFakeTimers();

    const startColor: Vec3 = [120, 60, 180]; // A random color
    const endColor: Vec3 = [60, 180, 120]; // Another random color
    const transitionSpeed = 1;
    const pauseDuration = 1;

    jest.mock('react-spinners/BeatLoader', () => {
      return ({ color }) => <div style={{ backgroundColor: color }} />;
    });


    render(<ColourSpinner visible={true} transitionSpeed={transitionSpeed} startColor={startColor} endColor={endColor}
                          pauseDuration={pauseDuration}/>);

    const spinner = screen.getByTestId('spinner'); //?

    // Advance timers by the transition duration
    act(() => {
      jest.advanceTimersByTime(transitionSpeed * 1000);
    });

    // Check that the color is the end color
    // let color = getComputedStyle(spinner).getPropertyValue('color');
    let color = spinner.style.backgroundColor; //?

    expect(color).toBe(`rgb(${endColor[0]}, ${endColor[1]}, ${endColor[2]})`);

    // Wait for the pause to finish
    act(() => {
      jest.advanceTimersByTime(pauseDuration * 1000);
    });

    // Advance timers by the transition duration again
    act(() => {
      jest.advanceTimersByTime(transitionSpeed * 1000);
    });

    // Check that the color is the start color again
    color = getComputedStyle(spinner).getPropertyValue('color');
    expect(color).toBe(`rgb(${startColor[0]}, ${startColor[1]}, ${startColor[2]})`);

    jest.useRealTimers()
  });

});
