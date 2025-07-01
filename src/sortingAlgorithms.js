export function getMergeSortAnimations(array) {
  const animations = [];
  if (array.length <= 1) return array;
  const auxiliaryArray = array.slice();
  mergeSortHelper(array, 0, array.length - 1, auxiliaryArray, animations);
  return animations;
}

function mergeSortHelper(
  mainArray,
  startIdx,
  endIdx,
  auxiliaryArray,
  animations,
) {
  if (startIdx === endIdx) return;
  const middleIdx = Math.floor((startIdx + endIdx) / 2);
  mergeSortHelper(auxiliaryArray, startIdx, middleIdx, mainArray, animations);
  mergeSortHelper(auxiliaryArray, middleIdx + 1, endIdx, mainArray, animations);
  doMerge(mainArray, startIdx, middleIdx, endIdx, auxiliaryArray, animations);
}

function doMerge(
  mainArray,
  startIdx,
  middleIdx,
  endIdx,
  auxiliaryArray,
  animations,
) {
  let k = startIdx;
  let i = startIdx;
  let j = middleIdx + 1;
  while (i <= middleIdx && j <= endIdx) {
    // These are the values that we're comparing; we push them once
    // to change their color.
    animations.push([i, j]);
    // These are the values that we're comparing; we push them a second
    // time to revert their color.
    animations.push([i, j]);
    if (auxiliaryArray[i] <= auxiliaryArray[j]) {
      // We overwrite the value at index k in the original array with the
      // value at index i in the auxiliary array.
      animations.push([k, auxiliaryArray[i]]);
      mainArray[k++] = auxiliaryArray[i++];
    } else {
      // We overwrite the value at index k in the original array with the
      // value at index j in the auxiliary array.
      animations.push([k, auxiliaryArray[j]]);
      mainArray[k++] = auxiliaryArray[j++];
    }
  }
  while (i <= middleIdx) {
    // These are the values that we're comparing; we push them once
    // to change their color.
    animations.push([i, i]);
    // These are the values that we're comparing; we push them a second
    // time to revert their color.
    animations.push([i, i]);
    // We overwrite the value at index k in the original array with the
    // value at index i in the auxiliary array.
    animations.push([k, auxiliaryArray[i]]);
    mainArray[k++] = auxiliaryArray[i++];
  }
  while (j <= endIdx) {
    // These are the values that we're comparing; we push them once
    // to change their color.
    animations.push([j, j]);
    // These are the values that we're comparing; we push them a second
    // time to revert their color.
    animations.push([j, j]);
    // We overwrite the value at index k in the original array with the
    // value at index j in the auxiliary array.
    animations.push([k, auxiliaryArray[j]]);
    mainArray[k++] = auxiliaryArray[j++];
  }
}

// Bubble Sort Implementation
export function getBubbleSortAnimations(array) {
  const animations = [];
  if (array.length <= 1) return animations;
  const n = array.length;
  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      // Highlight bars for comparison
      animations.push(['compare', j, j + 1]);
      // Revert color
      animations.push(['revert', j, j + 1]);
      if (array[j] > array[j + 1]) {
        // Push swap command
        animations.push(['swap', j, j + 1]);
        // Perform swap on the local array to keep track
        swap(array, j, j + 1);
      }
    }
  }
  return animations;
}

// Quick Sort Implementation
// ... existing code for other algorithms ...

export function getQuickSortAnimations(array) {
  const animations = [];
  if (array.length <= 1) return animations;
  quickSortHelper(array, 0, array.length - 1, animations);
  return animations;
}

function quickSortHelper(mainArray, startIdx, endIdx, animations) {
  if (startIdx >= endIdx) return;
  const pivotIdx = partition(mainArray, startIdx, endIdx, animations);
  quickSortHelper(mainArray, startIdx, pivotIdx - 1, animations);
  quickSortHelper(mainArray, pivotIdx + 1, endIdx, animations);
}

function partition(mainArray, startIdx, endIdx, animations) {
  let pivotValue = mainArray[endIdx];
  let pivotIdx = startIdx;
  
  for (let i = startIdx; i < endIdx; i++) {
    // Push indices to highlight them for comparison
    animations.push(['compare', i, endIdx]);
    // Push them again to revert color
    animations.push(['revert', i, endIdx]);
    
    if (mainArray[i] < pivotValue) {
      // Push swap animation: ['swap', index1, index2]
      // The actual height values will be retrieved from the working array
      // in the main component, which is more reliable.
      animations.push(['swap', i, pivotIdx]);
      swap(mainArray, i, pivotIdx);
      pivotIdx++;
    }
  }
  
  // Final swap for the pivot
  animations.push(['swap', pivotIdx, endIdx]);
  swap(mainArray, pivotIdx, endIdx);
  
  return pivotIdx;
}



// Heap Sort Implementation
export function getHeapSortAnimations(array) {
  const animations = [];
  if (array.length <= 1) return animations;
  
  const n = array.length;
  // Build the max heap
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    heapify(array, n, i, animations);
  }

  // Extract elements from heap one by one
  for (let i = n - 1; i > 0; i--) {
    // Move current root to end
    animations.push(['swap', 0, i]);
    swap(array, 0, i);
    // Call heapify on the reduced heap
    heapify(array, i, 0, animations);
  }
  return animations;
}

function heapify(array, n, i, animations) {
  let largest = i; // Initialize largest as root
  const left = 2 * i + 1;
  const right = 2 * i + 2;

  // If left child is larger than root
  if (left < n) {
    animations.push(['compare', left, largest]);
    animations.push(['revert', left, largest]);
    if (array[left] > array[largest]) {
      largest = left;
    }
  }

  // If right child is larger than largest so far
  if (right < n) {
    animations.push(['compare', right, largest]);
    animations.push(['revert', right, largest]);
    if (array[right] > array[largest]) {
      largest = right;
    }
  }

  // If largest is not root
  if (largest !== i) {
    animations.push(['swap', i, largest]);
    swap(array, i, largest);
    // Recursively heapify the affected sub-tree
    heapify(array, n, largest, animations);
  }
}

function swap(array, i, j) {
  const temp = array[i];
  array[i] = array[j];
  array[j] = temp;
}