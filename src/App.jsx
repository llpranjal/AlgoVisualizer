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
      newArray.push(randomIntFromInterval(5, 500));
    }
    setArray(newArray);
    
    // Reset all bar colors
    const arrayBars = document.getElementsByClassName('array-bar');
    for (let i = 0; i < arrayBars.length; i++) {
      arrayBars[i].style.backgroundColor = PRIMARY_COLOR;
    }
  };

  const animateAlgorithm = (animations) => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    
    for (let i = 0; i < animations.length; i++) {
      const arrayBars = document.getElementsByClassName('array-bar');
      
      // For merge sort (3-step pattern)
      if (animations.length > 0 && animations[0].length === 2) {
        const isColorChange = i % 3 !== 2;
        
        if (isColorChange) {
          const [barOneIdx, barTwoIdx] = animations[i];
          const barOneStyle = arrayBars[barOneIdx]?.style;
          const barTwoStyle = arrayBars[barTwoIdx]?.style;
          const color = i % 3 === 0 ? SECONDARY_COLOR : PRIMARY_COLOR;
          
          setTimeout(() => {
            if (barOneStyle) barOneStyle.backgroundColor = color;
            if (barTwoStyle) barTwoStyle.backgroundColor = color;
          }, i * animationSpeed);
        } else {
          setTimeout(() => {
            const [barOneIdx, newHeight] = animations[i];
            const barOneStyle = arrayBars[barOneIdx]?.style;
            if (barOneStyle) {
              barOneStyle.height = `${newHeight}px`;
            }
          }, i * animationSpeed);
        }
      } else {
        // For other algorithms (4-step pattern)
        const isColorChange = i % 4 < 2;
        
        if (isColorChange) {
          const [barOneIdx, barTwoIdx] = animations[i];
          const barOneStyle = arrayBars[barOneIdx]?.style;
          const barTwoStyle = arrayBars[barTwoIdx]?.style;
          const color = i % 4 === 0 ? SECONDARY_COLOR : PRIMARY_COLOR;
          
          setTimeout(() => {
            if (barOneStyle) barOneStyle.backgroundColor = color;
            if (barTwoStyle) barTwoStyle.backgroundColor = color;
          }, i * animationSpeed);
        } else {
          setTimeout(() => {
            const [barIdx, newHeight] = animations[i];
            const barStyle = arrayBars[barIdx]?.style;
            if (barStyle) {
              barStyle.height = `${newHeight}px`;
            }
          }, i * animationSpeed);
        }
      }
    }
    
    // Mark as complete after all animations
    setTimeout(() => {
      const arrayBars = document.getElementsByClassName('array-bar');
      for (let i = 0; i < arrayBars.length; i++) {
        setTimeout(() => {
          arrayBars[i].style.backgroundColor = SORTED_COLOR;
        }, i * 2);
      }
      
      setTimeout(() => {
        setIsAnimating(false);
      }, arrayBars.length * 2 + 100);
    }, animations.length * animationSpeed);
  };

  const mergeSort = () => {
    const animations = getMergeSortAnimations(array);
    animateAlgorithm(animations);
  };

  const quickSort = () => {
    const animations = getQuickSortAnimations(array);
    animateAlgorithm(animations);
  };

  const heapSort = () => {
    const animations = getHeapSortAnimations(array);
    animateAlgorithm(animations);
  };

  const bubbleSort = () => {
    const animations = getBubbleSortAnimations(array);
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
      const isColorChange = i % 3 !== 2;
      if (!isColorChange) {
        const [barOneIdx, newHeight] = animations[i];
        if (barOneIdx < arr.length) {
          arr[barOneIdx] = newHeight;
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
          Test Algorithms
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