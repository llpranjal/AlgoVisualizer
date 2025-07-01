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
  const arr = array.slice();
  const n = arr.length;
  
  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      // Push comparison animation
      animations.push([j, j + 1]);
      animations.push([j, j + 1]);
      
      if (arr[j] > arr[j + 1]) {
        // Push swap animation
        animations.push([j, arr[j + 1]]);
        animations.push([j + 1, arr[j]]);
        
        // Swap elements
        const temp = arr[j];
        arr[j] = arr[j + 1];
        arr[j + 1] = temp;
      } else {
        // Push no-swap animation (maintain same values)
        animations.push([j, arr[j]]);
        animations.push([j + 1, arr[j + 1]]);
      }
    }
  }
  return animations;
}

// Quick Sort Implementation
export function getQuickSortAnimations(array) {
  const animations = [];
  const arr = array.slice();
  quickSortHelper(arr, 0, arr.length - 1, animations);
  return animations;
}

function quickSortHelper(arr, low, high, animations) {
  if (low < high) {
    const pi = partition(arr, low, high, animations);
    quickSortHelper(arr, low, pi - 1, animations);
    quickSortHelper(arr, pi + 1, high, animations);
  }
}

function partition(arr, low, high, animations) {
  const pivot = arr[high];
  let i = low - 1;
  
  for (let j = low; j < high; j++) {
    // Push comparison animation
    animations.push([j, high]);
    animations.push([j, high]);
    
    if (arr[j] < pivot) {
      i++;
      // Push swap animation
      animations.push([i, arr[j]]);
      animations.push([j, arr[i]]);
      
      // Swap elements
      const temp = arr[i];
      arr[i] = arr[j];
      arr[j] = temp;
    } else {
      // Push no-swap animation
      animations.push([j, arr[j]]);
      animations.push([j, arr[j]]);
    }
  }
  
  // Final swap with pivot
  animations.push([i + 1, high]);
  animations.push([i + 1, high]);
  animations.push([i + 1, arr[high]]);
  animations.push([high, arr[i + 1]]);
  
  const temp = arr[i + 1];
  arr[i + 1] = arr[high];
  arr[high] = temp;
  
  return i + 1;
}

// Heap Sort Implementation
export function getHeapSortAnimations(array) {
  const animations = [];
  const arr = array.slice();
  const n = arr.length;
  
  // Build heap
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    heapify(arr, n, i, animations);
  }
  
  // Extract elements from heap
  for (let i = n - 1; i > 0; i--) {
    // Push comparison animation
    animations.push([0, i]);
    animations.push([0, i]);
    
    // Move current root to end
    animations.push([0, arr[i]]);
    animations.push([i, arr[0]]);
    
    const temp = arr[0];
    arr[0] = arr[i];
    arr[i] = temp;
    
    // Call heapify on the reduced heap
    heapify(arr, i, 0, animations);
  }
  
  return animations;
}

function heapify(arr, n, i, animations) {
  let largest = i;
  const left = 2 * i + 1;
  const right = 2 * i + 2;
  
  if (left < n) {
    animations.push([left, largest]);
    animations.push([left, largest]);
    if (arr[left] > arr[largest]) {
      largest = left;
    }
    animations.push([left, arr[left]]);
    animations.push([largest, arr[largest]]);
  }
  
  if (right < n) {
    animations.push([right, largest]);
    animations.push([right, largest]);
    if (arr[right] > arr[largest]) {
      largest = right;
    }
    animations.push([right, arr[right]]);
    animations.push([largest, arr[largest]]);
  }
  
  if (largest !== i) {
    animations.push([i, largest]);
    animations.push([i, largest]);
    animations.push([i, arr[largest]]);
    animations.push([largest, arr[i]]);
    
    const temp = arr[i];
    arr[i] = arr[largest];
    arr[largest] = temp;
    
    heapify(arr, n, largest, animations);
  }
}