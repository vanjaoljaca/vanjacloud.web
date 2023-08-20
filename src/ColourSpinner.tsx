import React, { useEffect, useState } from 'react';
import { BeatLoader } from 'react-spinners';
import { generateColorTransition, Vec3 } from './colours';

interface ColourSpinnerProps {
  visible: boolean;
  transitionSpeed: number;
  startColor: Vec3;
  endColor: Vec3;
  pauseDuration?: number;
}

const ColourSpinner: React.FC<ColourSpinnerProps> = ({
                                                       visible,
                                                       transitionSpeed,
                                                       startColor,
                                                       endColor,
                                                       pauseDuration = 1
                                                     }) => {
  const [color, setColor] = useState<Vec3>(startColor);
  const [colors, setColors] = useState<Vec3[]>([]);
  const [isReversed, setIsReversed] = useState<boolean>(false);

  useEffect(() => {
    if (visible) {
      setColors(generateColorTransition(startColor, endColor, transitionSpeed));
    }
  }, [visible, transitionSpeed, startColor, endColor]);

  useEffect(() => {
    if (colors.length === 0) {
      if (visible) {
        // Pause for a while when the transition finishes
        setTimeout(() => {
          // Start a new transition in reverse direction
          const newIsReversed = !isReversed;
          setIsReversed(newIsReversed);
          setColors(generateColorTransition(newIsReversed ? endColor : startColor, newIsReversed ? startColor : endColor, transitionSpeed));
        }, pauseDuration * 1000);
      }
      return;
    }

    const intervalId = setInterval(() => {
      const nextColor = colors.shift();
      if (nextColor) {
        setColor(nextColor);
        setColors(colors);
      }
    }, transitionSpeed * 1000 / colors.length);

    return () => clearInterval(intervalId);
  }, [colors, transitionSpeed, startColor, endColor, visible, pauseDuration, isReversed]);


  return (
    <div style={{display: visible ? 'block' : 'none'}}>
      <BeatLoader
        data-testid="spinner"
        color={`rgb(${color[0]}, ${color[1]}, ${color[2]})`}/>

    </div>
  );
};

export default ColourSpinner;
