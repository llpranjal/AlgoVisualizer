import React, { useState, useEffect } from 'react';
import {getMergeSortAnimations, getQuickSortAnimations, getBubbleSortAnimations, getHeapSortAnimations} from './sortingAlgorithms.js';
import './App.css';

// Configuration constants
const ANIMATION_SPEED_MS = 5;
const NUMBER_OF_ARRAY_BARS = 100;
const PRIMARY_COLOR = '#3b82f6';
const SECONDARY_COLOR = '#ef4444';
const SORTED_COLOR = '#10b981';

export default function SortingVisualizer() {
  const [array, setArray] = useState([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationSpeed, setAnimationSpeed] = useState(ANIMATION_SPEED_MS);
  const [arraySize, setArraySize] = useState(NUMBER_OF_ARRAY_BARS);

  useEffect(() => {
    resetArray();
  }, [arraySize]); // eslint-disable-line react-hooks/exhaustive-deps

const resetArray = () => {
  if (isAnimating) return;
  
  const newArray = [];
  for (let i = 0; i < arraySize; i++) {
    newArray.push(randomIntFromInterval(5, 350)); // Reduced max height to fit container better
  }
  
  // Force a new array reference to ensure React re-renders
  setArray([...newArray]);
  
  // Reset all bar colors after a small delay to ensure bars are rendered
  setTimeout(() => {
    const arrayBars = document.getElementsByClassName('array-bar');
    for (let i = 0; i < arrayBars.length; i++) {
      if (arrayBars[i]) {
        arrayBars[i].style.backgroundColor = PRIMARY_COLOR;
      }
    }
  }, 10);
};

// ...existing code...
const animateAlgorithm = (animations) => {
  if (isAnimating) return;
  
  setIsAnimating(true);
  
  // Create a working copy of the array to track changes
  const workingArray = [...array];
  
  for (let i = 0; i < animations.length; i++) {
    const arrayBars = document.getElementsByClassName('array-bar');
    const animation = animations[i];
    const [type] = animation;

    setTimeout(() => {
      if (type === 'compare' || type === 'revert') {
        const [, barOneIdx, barTwoIdx] = animation;
        const barOneStyle = arrayBars[barOneIdx]?.style;
        const barTwoStyle = arrayBars[barTwoIdx]?.style;
        const color = type === 'compare' ? SECONDARY_COLOR : PRIMARY_COLOR;
        if (barOneStyle) barOneStyle.backgroundColor = color;
        if (barTwoStyle) barTwoStyle.backgroundColor = color;
      } 
      else if (type === 'swap') {
        const [, barOneIdx, barTwoIdx] = animation;
        const barOneStyle = arrayBars[barOneIdx]?.style;
        const barTwoStyle = arrayBars[barTwoIdx]?.style;

        // Swap heights in the working array first
        const tempHeight = workingArray[barOneIdx];
        workingArray[barOneIdx] = workingArray[barTwoIdx];
        workingArray[barTwoIdx] = tempHeight;

        // Then apply the swapped heights to the DOM
        if (barOneStyle) barOneStyle.height = `${workingArray[barOneIdx]}px`;
        if (barTwoStyle) barTwoStyle.height = `${workingArray[barTwoIdx]}px`;
      }
      else { // Legacy support for Merge Sort
        const isColorChange = i % 3 !== 2;
        if (isColorChange) {
          const [barOneIdx, barTwoIdx] = animation;
          const barOneStyle = arrayBars[barOneIdx]?.style;
          const barTwoStyle = arrayBars[barTwoIdx]?.style;
          const color = i % 3 === 0 ? SECONDARY_COLOR : PRIMARY_COLOR;
          if (barOneStyle) barOneStyle.backgroundColor = color;
          if (barTwoStyle) barTwoStyle.backgroundColor = color;
        } else {
          const [barOneIdx, newHeight] = animation;
          const barOneStyle = arrayBars[barOneIdx]?.style;
          if (barOneStyle) {
            barOneStyle.height = `${newHeight}px`;
            workingArray[barOneIdx] = newHeight;
          }
        }
      }
    }, i * animationSpeed);
  }
  
  
  // Mark as complete after all animations
  setTimeout(() => {
    const arrayBars = document.getElementsByClassName('array-bar');
    
    // Change all bars to sorted color
    for (let i = 0; i < arrayBars.length; i++) {
      setTimeout(() => {
        if (arrayBars[i]) {
          arrayBars[i].style.backgroundColor = SORTED_COLOR;
        }
      }, i * 2);
    }
    
    // Update the actual array state and finish animation
    setTimeout(() => {
      // Update the React state with the sorted values
      setArray([...workingArray]);
      setIsAnimating(false);
    }, arrayBars.length * 2 + 100);
  }, animations.length * animationSpeed);
};

  const mergeSort = () => {
    // Pass a copy of the array using .slice() to prevent mutation
    const animations = getMergeSortAnimations(array.slice());
    animateAlgorithm(animations);
  };

  const quickSort = () => {
    // Pass a copy of the array using .slice()
    const animations = getQuickSortAnimations(array.slice());
    animateAlgorithm(animations);
  };

  const heapSort = () => {
    // Pass a copy of the array using .slice()
    const animations = getHeapSortAnimations(array.slice());
    animateAlgorithm(animations);
  };

  const bubbleSort = () => {
    // Pass a copy of the array using .slice()
    const animations = getBubbleSortAnimations(array.slice());
    animateAlgorithm(animations);
  };

  const testSortingAlgorithms = () => {
    if (isAnimating) return;
    
    console.log('Testing sorting algorithms...');
    for (let i = 0; i < 10; i++) {
      const testArray = [];
      const length = randomIntFromInterval(1, 100);
      for (let j = 0; j < length; j++) {
        testArray.push(randomIntFromInterval(-100, 100));
      }
      const javaScriptSortedArray = testArray.slice().sort((a, b) => a - b);
      
      // Test merge sort
      const mergeSortAnimations = getMergeSortAnimations(testArray.slice());
      const mergeSortedArray = testArray.slice();
      simulateAnimations(mergeSortedArray, mergeSortAnimations);
      
      console.log(`Test ${i + 1}: ${arraysAreEqual(javaScriptSortedArray, mergeSortedArray) ? 'PASS' : 'FAIL'}`);
    }
  };

const simulateAnimations = (arr, animations) => {
  for (let i = 0; i < animations.length; i++) {
    const animation = animations[i];
    
    // For merge sort (3-step pattern)
    if (animations.length > 0 && animations[0].length === 2) {
      const isColorChange = i % 3 !== 2;
      if (!isColorChange) {
        const [barOneIdx, newHeight] = animation;
        if (barOneIdx < arr.length) {
          arr[barOneIdx] = newHeight;
        }
      }
    } else {
      // For other algorithms
      const isColorChange = animation.length === 2 && typeof animation[1] !== 'number';
      
      if (!isColorChange) {
        if (animation.length === 4) {
          // Swap operation: [idx1, val1, idx2, val2]
          const [barOneIdx, barOneHeight, barTwoIdx, barTwoHeight] = animation;
          if (barOneIdx < arr.length && barTwoIdx < arr.length) {
            arr[barOneIdx] = barOneHeight;
            arr[barTwoIdx] = barTwoHeight;
          }
        } else if (animation.length === 2) {
          // Single height change: [idx, newHeight]
          const [barIdx, newHeight] = animation;
          if (barIdx < arr.length) {
            arr[barIdx] = newHeight;
          }
        }
      }
    }
  }
};

  return (
    <div className="visualizer-container">
      <div className="header">
        <h1>Algorithm Visualizer</h1>
        <p>Educational tool for understanding sorting algorithms</p>
      </div>
      
      <div className="controls">
        <div className="control-group">
          <label>Array Size: {arraySize}</label>
          <input 
            type="range" 
            min="10" 
            max="200" 
            value={arraySize} 
            onChange={(e) => setArraySize(parseInt(e.target.value))}
            disabled={isAnimating}
          />
        </div>
        
        <div className="control-group">
          <label>Animation Speed: {animationSpeed}ms</label>
          <input 
            type="range" 
            min="1" 
            max="50" 
            value={animationSpeed} 
            onChange={(e) => setAnimationSpeed(parseInt(e.target.value))}
            disabled={isAnimating}
          />
        </div>
        
        <button 
          onClick={resetArray} 
          disabled={isAnimating}
          className="generate-btn"
        >
          Generate New Array
        </button>
      </div>

      <div className="array-container">
        {array.map((value, idx) => (
          <div
            className="array-bar"
            key={idx}
            style={{
              backgroundColor: PRIMARY_COLOR,
              height: `${value}px`,
              width: `${Math.max(2, 800 / arraySize)}px`,
            }}
          />
        ))}
      </div>
      
      <div className="algorithm-buttons">
        <button 
          onClick={mergeSort} 
          disabled={isAnimating}
          className="sort-btn merge"
        >
          Merge Sort
        </button>
        <button 
          onClick={quickSort} 
          disabled={isAnimating}
          className="sort-btn quick"
        >
          Quick Sort
        </button>
        <button 
          onClick={heapSort} 
          disabled={isAnimating}
          className="sort-btn heap"
        >
          Heap Sort
        </button>
        <button 
          onClick={bubbleSort} 
          disabled={isAnimating}
          className="sort-btn bubble"
        >
          Bubble Sort
        </button>
        <button 
          onClick={testSortingAlgorithms} 
          disabled={isAnimating}
          className="test-btn"
        >
          More coming soon!
        </button>
      </div>
      
      {isAnimating && (
        <div className="animation-status">
          <p>Sorting in progress...</p>
        </div>
      )}
    </div>
  );
}

// From https://stackoverflow.com/questions/4959975/generate-random-number-between-two-numbers-in-javascript
function randomIntFromInterval(min, max) {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function arraysAreEqual(arrayOne, arrayTwo) {
  if (arrayOne.length !== arrayTwo.length) return false;
  for (let i = 0; i < arrayOne.length; i++) {
    if (arrayOne[i] !== arrayTwo[i]) {
      return false;
    }
  }
  return true;
}