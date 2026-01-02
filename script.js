// DOM elements
const barsContainer = document.getElementById("barsContainer");
const algorithmSelect = document.getElementById("algorithm");
const arraySizeSlider = document.getElementById("arraySize");
const arraySizeValue = document.getElementById("arraySizeValue");
const speedSlider = document.getElementById("speed");
const speedValue = document.getElementById("speedValue");
const generateArrayButton = document.getElementById("generateArray");
const sortButton = document.getElementById("sortButton");
const pauseButton = document.getElementById("pauseButton");
const currentAlgo = document.getElementById("currentAlgo");
const currentSize = document.getElementById("currentSize");
const comparisonsEl = document.getElementById("comparisons");
const swapsEl = document.getElementById("swaps");
const timeElapsedEl = document.getElementById("timeElapsed");
const statusEl = document.getElementById("status");
const currentOperationEl = document.getElementById("currentOperation");
const algoDescriptionEl = document.getElementById("algoDescription");
const actualTimeComplexityEl = document.getElementById("actualTimeComplexity");
const operationsScaleEl = document.getElementById("operationsScale");
const efficiencyEl = document.getElementById("efficiency");

// Complexity card elements
const bubbleSortCard = document.getElementById("bubbleSortCard");
const selectionSortCard = document.getElementById("selectionSortCard");
const insertionSortCard = document.getElementById("insertionSortCard");
const mergeSortCard = document.getElementById("mergeSortCard");
const quickSortCard = document.getElementById("quickSortCard");

// State variables
let array = [];
let isSorting = false;
let isPaused = false;
let animationSpeed = 100;
let comparisons = 0;
let swaps = 0;
let startTime = 0;
let timerInterval = null;
let algorithmDetails = {
  bubbleSort: {
    name: "Bubble Sort",
    description:
      "Bubble Sort repeatedly steps through the list, compares adjacent elements and swaps them if they are in the wrong order. The pass through the list is repeated until the list is sorted.",
    complexities: {
      best: { time: "O(n)", space: "O(1)" },
      average: { time: "O(n²)", space: "O(1)" },
      worst: { time: "O(n²)", space: "O(1)" },
    },
  },
  selectionSort: {
    name: "Selection Sort",
    description:
      "Selection Sort divides the input list into two parts: a sorted sublist and an unsorted sublist. It repeatedly selects the smallest element from the unsorted sublist and moves it to the end of the sorted sublist.",
    complexities: {
      best: { time: "O(n²)", space: "O(1)" },
      average: { time: "O(n²)", space: "O(1)" },
      worst: { time: "O(n²)", space: "O(1)" },
    },
  },
  insertionSort: {
    name: "Insertion Sort",
    description:
      "Insertion Sort builds the final sorted array one item at a time. It takes each element from the input and inserts it into its correct position in the sorted part of the array.",
    complexities: {
      best: { time: "O(n)", space: "O(1)" },
      average: { time: "O(n²)", space: "O(1)" },
      worst: { time: "O(n²)", space: "O(1)" },
    },
  },
  mergeSort: {
    name: "Merge Sort",
    description:
      "Merge Sort is a divide and conquer algorithm. It divides the input array into two halves, recursively sorts them, and then merges the two sorted halves.",
    complexities: {
      best: { time: "O(n log n)", space: "O(n)" },
      average: { time: "O(n log n)", space: "O(n)" },
      worst: { time: "O(n log n)", space: "O(n)" },
    },
  },
  quickSort: {
    name: "Quick Sort",
    description:
      "Quick Sort is a divide and conquer algorithm. It picks a pivot element and partitions the array around the pivot, then recursively sorts the sub-arrays.",
    complexities: {
      best: { time: "O(n log n)", space: "O(log n)" },
      average: { time: "O(n log n)", space: "O(log n)" },
      worst: { time: "O(n²)", space: "O(log n)" },
    },
  },
};

// Initialize the application
function init() {
  updateSpeedDisplay();
  generateNewArray();
  setupEventListeners();
  updateAlgorithmInfo();
}

// Set up event listeners
function setupEventListeners() {
  algorithmSelect.addEventListener("change", () => {
    updateAlgorithmInfo();
    resetStats();
  });

  arraySizeSlider.addEventListener("input", () => {
    arraySizeValue.textContent = arraySizeSlider.value;
    currentSize.textContent = arraySizeSlider.value;
    if (!isSorting) generateNewArray();
  });

  speedSlider.addEventListener("input", updateSpeedDisplay);

  generateArrayButton.addEventListener("click", () => {
    if (!isSorting) {
      generateNewArray();
      resetStats();
    }
  });

  sortButton.addEventListener("click", () => {
    if (!isSorting) {
      startSorting();
    }
  });

  pauseButton.addEventListener("click", togglePause);
}

// Update speed display based on slider value
function updateSpeedDisplay() {
  const speed = parseInt(speedSlider.value);
  animationSpeed = 210 - speed; // Invert so higher slider = faster

  if (speed < 70) {
    speedValue.textContent = "Slow";
  } else if (speed < 130) {
    speedValue.textContent = "Medium";
  } else {
    speedValue.textContent = "Fast";
  }
}

// Update algorithm information
function updateAlgorithmInfo() {
  const algoId = algorithmSelect.value;
  const algoInfo = algorithmDetails[algoId];

  currentAlgo.textContent = algoInfo.name;
  algoDescriptionEl.innerHTML = `<p><strong>${algoInfo.name}</strong> ${algoInfo.description}</p>`;

  // Update algorithm highlighting
  updateAlgorithmHighlight();

  // Reset performance metrics
  actualTimeComplexityEl.textContent = "-";
  operationsScaleEl.textContent = "-";
  efficiencyEl.textContent = "-";
}

// Update algorithm highlighting
function updateAlgorithmHighlight() {
  const algoId = algorithmSelect.value;

  // Remove highlight from all cards
  [
    bubbleSortCard,
    selectionSortCard,
    insertionSortCard,
    mergeSortCard,
    quickSortCard,
  ].forEach((card) => {
    card.classList.remove("current-algo");
  });

  // Highlight the current algorithm card
  switch (algoId) {
    case "bubbleSort":
      bubbleSortCard.classList.add("current-algo");
      break;
    case "selectionSort":
      selectionSortCard.classList.add("current-algo");
      break;
    case "insertionSort":
      insertionSortCard.classList.add("current-algo");
      break;
    case "mergeSort":
      mergeSortCard.classList.add("current-algo");
      break;
    case "quickSort":
      quickSortCard.classList.add("current-algo");
      break;
  }
}

// Generate a new random array
function generateNewArray() {
  const size = parseInt(arraySizeSlider.value);
  array = [];

  for (let i = 0; i < size; i++) {
    array.push(Math.floor(Math.random() * 95) + 5); // Values between 5-100
  }

  renderBars();
  resetStats();
}

// Render bars based on current array
function renderBars(
  highlightIndices = [],
  sortedIndices = [],
  pivotIndex = -1,
  isSwapping = false
) {
  barsContainer.innerHTML = "";
  const containerWidth = barsContainer.clientWidth;
  const barWidth = Math.max(3, containerWidth / array.length - 2);

  array.forEach((value, index) => {
    const bar = document.createElement("div");
    bar.classList.add("bar");
    bar.style.height = `${value}%`;
    bar.style.width = `${barWidth}px`;

    // Determine bar color based on state
    if (sortedIndices.includes(index)) {
      bar.classList.add("sorted");
    } else if (index === pivotIndex) {
      bar.classList.add("pivot");
    } else if (isSwapping && highlightIndices.includes(index)) {
      bar.classList.add("swapping");
    } else if (highlightIndices.includes(index)) {
      bar.classList.add("comparing");
    } else {
      bar.classList.add("default");
    }

    barsContainer.appendChild(bar);
  });
}

// Reset statistics
function resetStats() {
  comparisons = 0;
  swaps = 0;
  comparisonsEl.textContent = "0";
  swapsEl.textContent = "0";
  timeElapsedEl.textContent = "0s";
  statusEl.textContent = "Ready";
  currentOperationEl.textContent = "Ready";

  // Reset performance metrics
  actualTimeComplexityEl.textContent = "-";
  operationsScaleEl.textContent = "-";
  efficiencyEl.textContent = "-";

  stopTimer();
}

// Start the sorting process
function startSorting() {
  if (isSorting) return;

  isSorting = true;
  sortButton.disabled = true;
  generateArrayButton.disabled = true;
  algorithmSelect.disabled = true;
  pauseButton.disabled = false;
  statusEl.textContent = "Sorting...";

  resetStats();
  startTimer();

  const algorithm = algorithmSelect.value;

  // Execute the selected algorithm
  switch (algorithm) {
    case "bubbleSort":
      bubbleSort();
      break;
    case "selectionSort":
      selectionSort();
      break;
    case "insertionSort":
      insertionSort();
      break;
    case "mergeSort":
      mergeSort();
      break;
    case "quickSort":
      quickSort();
      break;
    default:
      bubbleSort();
  }
}

// Toggle pause state
function togglePause() {
  if (!isSorting) return;

  isPaused = !isPaused;

  if (isPaused) {
    pauseButton.innerHTML = '<i class="fas fa-play"></i> Resume';
    statusEl.textContent = "Paused";
    currentOperationEl.textContent = "Paused";
  } else {
    pauseButton.innerHTML = '<i class="fas fa-pause"></i> Pause';
    statusEl.textContent = "Sorting...";
  }
}

// Sleep function for animation delays
function sleep(ms) {
  return new Promise((resolve) => {
    const checkPause = () => {
      if (!isPaused) {
        resolve();
      } else {
        setTimeout(checkPause, 100);
      }
    };
    setTimeout(checkPause, ms);
  });
}

// Start timer
function startTimer() {
  startTime = Date.now();
  timerInterval = setInterval(() => {
    const elapsed = Math.floor((Date.now() - startTime) / 1000);
    timeElapsedEl.textContent = `${elapsed}s`;
  }, 1000);
}

// Stop timer
function stopTimer() {
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
}

// Update statistics display
function updateStats() {
  comparisonsEl.textContent = comparisons;
  swapsEl.textContent = swaps;
}

// Swap two elements in the array
async function swap(i, j) {
  currentOperationEl.textContent = `Swapping elements at indices ${i} and ${j}`;
  [array[i], array[j]] = [array[j], array[i]];
  swaps++;
  updateStats();
  renderBars([i, j], [], -1, true);
  await sleep(animationSpeed);
}

// Bubble Sort algorithm
async function bubbleSort() {
  const n = array.length;
  let sortedIndices = [];

  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      if (!isSorting) return;

      comparisons++;
      updateStats();
      currentOperationEl.textContent = `Comparing elements at indices ${j} and ${
        j + 1
      }`;
      renderBars([j, j + 1], sortedIndices);
      await sleep(animationSpeed);

      if (array[j] > array[j + 1]) {
        await swap(j, j + 1);
      }
    }
    sortedIndices.push(n - i - 1);
  }
  sortedIndices.push(0);
  finishSorting();
}

// Selection Sort algorithm
async function selectionSort() {
  const n = array.length;
  let sortedIndices = [];

  for (let i = 0; i < n - 1; i++) {
    let minIdx = i;

    for (let j = i + 1; j < n; j++) {
      if (!isSorting) return;

      comparisons++;
      updateStats();
      currentOperationEl.textContent = `Finding minimum element in unsorted portion`;
      renderBars([j, minIdx], sortedIndices);
      await sleep(animationSpeed);

      if (array[j] < array[minIdx]) {
        minIdx = j;
      }
    }

    if (minIdx !== i) {
      await swap(i, minIdx);
    }

    sortedIndices.push(i);
  }
  sortedIndices.push(n - 1);
  finishSorting();
}

// Insertion Sort algorithm
async function insertionSort() {
  const n = array.length;
  let sortedIndices = [0];

  for (let i = 1; i < n; i++) {
    let key = array[i];
    let j = i - 1;

    while (j >= 0 && array[j] > key) {
      if (!isSorting) return;

      comparisons++;
      updateStats();
      currentOperationEl.textContent = `Shifting element at index ${j} to the right`;
      renderBars([j, j + 1], sortedIndices);
      await sleep(animationSpeed);

      array[j + 1] = array[j];
      swaps++;
      updateStats();
      j--;
    }

    array[j + 1] = key;
    swaps++;
    updateStats();
    sortedIndices.push(i);
    renderBars([], sortedIndices);
    await sleep(animationSpeed);
  }

  finishSorting();
}

// Merge Sort algorithm
async function mergeSort() {
  await mergeSortHelper(0, array.length - 1);
  finishSorting();
}

async function mergeSortHelper(left, right) {
  if (left >= right) return;

  const mid = Math.floor((left + right) / 2);
  await mergeSortHelper(left, mid);
  await mergeSortHelper(mid + 1, right);
  await merge(left, mid, right);
}

async function merge(left, mid, right) {
  const leftArray = array.slice(left, mid + 1);
  const rightArray = array.slice(mid + 1, right + 1);

  let i = 0,
    j = 0,
    k = left;

  while (i < leftArray.length && j < rightArray.length) {
    if (!isSorting) return;

    comparisons++;
    updateStats();
    currentOperationEl.textContent = `Merging sorted subarrays`;
    renderBars([k], []);
    await sleep(animationSpeed);

    if (leftArray[i] <= rightArray[j]) {
      array[k] = leftArray[i];
      i++;
    } else {
      array[k] = rightArray[j];
      j++;
    }
    swaps++;
    updateStats();
    k++;
  }

  while (i < leftArray.length) {
    if (!isSorting) return;

    array[k] = leftArray[i];
    i++;
    k++;
    swaps++;
    updateStats();
    currentOperationEl.textContent = `Copying remaining elements from left subarray`;
    renderBars([k], []);
    await sleep(animationSpeed);
  }

  while (j < rightArray.length) {
    if (!isSorting) return;

    array[k] = rightArray[j];
    j++;
    k++;
    swaps++;
    updateStats();
    currentOperationEl.textContent = `Copying remaining elements from right subarray`;
    renderBars([k], []);
    await sleep(animationSpeed);
  }
}

// Quick Sort algorithm
async function quickSort() {
  await quickSortHelper(0, array.length - 1);
  finishSorting();
}

async function quickSortHelper(low, high) {
  if (low < high) {
    const pivotIndex = await partition(low, high);
    await quickSortHelper(low, pivotIndex - 1);
    await quickSortHelper(pivotIndex + 1, high);
  } else if (low === high) {
    // Mark single element as sorted
    renderBars([], [low]);
    await sleep(animationSpeed);
  }
}

async function partition(low, high) {
  const pivot = array[high];
  let i = low - 1;

  currentOperationEl.textContent = `Partitioning with pivot at index ${high}`;
  renderBars([], [], high);
  await sleep(animationSpeed);

  for (let j = low; j < high; j++) {
    if (!isSorting) return i + 1;

    comparisons++;
    updateStats();
    currentOperationEl.textContent = `Comparing element at index ${j} with pivot`;
    renderBars([j, high], [], high);
    await sleep(animationSpeed);

    if (array[j] < pivot) {
      i++;
      await swap(i, j);
    }
  }

  await swap(i + 1, high);
  return i + 1;
}

// Calculate and display performance metrics
function calculatePerformanceMetrics() {
  const n = array.length;
  const totalOperations = comparisons + swaps;
  const nSquared = n * n;
  const nLogN = n * Math.log2(n);

  // Calculate actual time complexity approximation
  let actualComplexity = "";
  let operationsScale = "";
  let efficiency = "";

  const algoId = algorithmSelect.value;
  const algoInfo = algorithmDetails[algoId];
  const theoreticalBest = algoInfo.complexities.best.time;
  const theoreticalWorst = algoInfo.complexities.worst.time;

  // Determine actual complexity based on operations
  if (totalOperations <= n * 1.5) {
    actualComplexity = "O(n) - Linear";
    operationsScale = "Linear";
    efficiency = "Excellent";
  } else if (totalOperations <= nLogN * 1.5) {
    actualComplexity = "O(n log n) - Log-linear";
    operationsScale = "Log-linear";
    efficiency = "Very Good";
  } else if (totalOperations <= nSquared * 0.5) {
    actualComplexity = "O(n²) - Quadratic";
    operationsScale = "Quadratic";
    efficiency = "Average";
  } else {
    actualComplexity = "O(n²) - Quadratic";
    operationsScale = "Quadratic";
    efficiency = "Poor";
  }

  // Compare with theoretical
  let theoreticalNote = "";
  if (actualComplexity.includes("O(n)") && theoreticalBest.includes("O(n)")) {
    theoreticalNote = " (Matches best case)";
  } else if (
    actualComplexity.includes("O(n²)") &&
    theoreticalWorst.includes("O(n²)")
  ) {
    theoreticalNote = " (Matches worst case)";
  }

  // Update performance metrics display
  actualTimeComplexityEl.textContent = actualComplexity + theoreticalNote;
  operationsScaleEl.textContent = operationsScale;
  efficiencyEl.textContent = efficiency;
}

// Finish sorting process
function finishSorting() {
  if (!isSorting) return;

  isSorting = false;
  isPaused = false;
  sortButton.disabled = false;
  generateArrayButton.disabled = false;
  algorithmSelect.disabled = false;
  pauseButton.disabled = true;
  pauseButton.innerHTML = '<i class="fas fa-pause"></i> Pause';

  statusEl.textContent = "Sorted";
  currentOperationEl.textContent = "Array is fully sorted";

  // Mark all bars as sorted
  renderBars(
    [],
    Array.from({ length: array.length }, (_, i) => i)
  );

  // Calculate and display performance metrics
  calculatePerformanceMetrics();

  stopTimer();
}

// Initialize the app when page loads
window.addEventListener("DOMContentLoaded", init);
