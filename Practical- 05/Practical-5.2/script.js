// Empty array to store numbers
let numbers = [];

function updateArrayDisplay() {
  const displayEl = document.getElementById('arrayDisplay');
  displayEl.textContent = numbers.length > 0 ? '[ ' + numbers.join(', ') + ' ]' : '[ ] (empty)';
}

function logOutput(message) {
  const outputEl = document.getElementById('outputDisplay');
  const p = document.createElement('p');
  p.textContent = message;
  outputEl.prepend(p);
}

function getInputValue() {
  const input = document.getElementById('numberInput');
  const value = input.value.trim();

  if (value === '') {
    alert('Please enter a number first.');
    return null;
  }
  const num = Number(value);
  if (isNaN(num)) {
    alert('Please enter a valid number.');
    return null;
  }
  input.value = '';
  return num;
}

// ---------- Add elements ----------
function pushNumber() {
  const num = getInputValue();
  if (num === null) return;
  numbers.push(num);
  updateArrayDisplay();
  logOutput(`➕ Push: Added ${num} to the end.`);
}

function unshiftNumber() {
  const num = getInputValue();
  if (num === null) return;
  numbers.unshift(num);
  updateArrayDisplay();
  logOutput(`⬅️ Unshift: Added ${num} to the beginning.`);
}

// ---------- Remove elements ----------
function popNumber() {
  if (numbers.length === 0) {
    alert('Array is empty. Nothing to pop.');
    return;
  }
  const removed = numbers.pop();
  updateArrayDisplay();
  logOutput(`➖ Pop: Removed ${removed} from the end.`);
}

function shiftNumber() {
  if (numbers.length === 0) {
    alert('Array is empty. Nothing to shift.');
    return;
  }
  const removed = numbers.shift();
  updateArrayDisplay();
  logOutput(`➡️ Shift: Removed ${removed} from the beginning.`);
}

// ---------- Splice ----------
function applySplice() {
  const startEl = document.getElementById('spliceStart');
  const deleteEl = document.getElementById('spliceDelete');
  const valueEl = document.getElementById('spliceValue');

  if (startEl.value.trim() === '' || isNaN(Number(startEl.value))) {
    alert('Please enter a valid starting index.');
    return;
  }
  if (deleteEl.value.trim() === '' || isNaN(Number(deleteEl.value))) {
    alert('Please enter a valid number of elements to remove.');
    return;
  }

  const startIndex = Number(startEl.value);
  const deleteCount = Number(deleteEl.value);
  const newValueRaw = valueEl.value.trim();

  let removed;
  if (newValueRaw === '') {
    removed = numbers.splice(startIndex, deleteCount);
  } else {
    const newValue = Number(newValueRaw);
    if (isNaN(newValue)) {
      alert('New value must be a number.');
      return;
    }
    removed = numbers.splice(startIndex, deleteCount, newValue);
  }

  updateArrayDisplay();
  logOutput(`✂️ Splice: Removed [${removed.join(', ')}] starting at index ${startIndex}.`);
}

// ---------- Slice ----------
function applySlice() {
  const startEl = document.getElementById('sliceStart');
  const endEl = document.getElementById('sliceEnd');

  if (startEl.value.trim() === '' || endEl.value.trim() === '') {
    alert('Please enter both start and end index.');
    return;
  }

  const start = Number(startEl.value);
  const end = Number(endEl.value);

  if (isNaN(start) || isNaN(end)) {
    alert('Start and End index must be numbers.');
    return;
  }

  const sliced = numbers.slice(start, end);
  logOutput(`🔍 Slice(${start}, ${end}) → [${sliced.join(', ')}]  |  Original unchanged: [${numbers.join(', ')}]`);
}

// ---------- forEach ----------
function runForEach() {
  if (numbers.length === 0) { alert('Array is empty.'); return; }

  let result = '';
  numbers.forEach((value, index) => {
    result += `Index ${index} → ${value}\n`;
  });
  logOutput(`🔁 forEach() Output:\n${result}`);
}

// ---------- map ----------
function runMapDouble() {
  if (numbers.length === 0) { alert('Array is empty.'); return; }
  const mapped = numbers.map(n => n * 2);
  logOutput(`✨ map() Double → Original: [${numbers.join(', ')}] | Mapped: [${mapped.join(', ')}]`);
}

function runMapSquare() {
  if (numbers.length === 0) { alert('Array is empty.'); return; }
  const mapped = numbers.map(n => n * n);
  logOutput(`✨ map() Square → Original: [${numbers.join(', ')}] | Mapped: [${mapped.join(', ')}]`);
}

// ---------- filter ----------
function runFilterEven() {
  if (numbers.length === 0) { alert('Array is empty.'); return; }
  const filtered = numbers.filter(n => n % 2 === 0);
  logOutput(`🎯 filter() Even Numbers: [${filtered.join(', ')}]`);
}

function runFilterOdd() {
  if (numbers.length === 0) { alert('Array is empty.'); return; }
  const filtered = numbers.filter(n => n % 2 !== 0);
  logOutput(`🎯 filter() Odd Numbers: [${filtered.join(', ')}]`);
}

function runFilterGreater50() {
  if (numbers.length === 0) { alert('Array is empty.'); return; }
  const filtered = numbers.filter(n => n > 50);
  logOutput(`🎯 filter() Numbers > 50: [${filtered.join(', ')}]`);
}

// ---------- Max / Min ----------
function findMax() {
  if (numbers.length === 0) { alert('Array is empty.'); return; }
  const max = Math.max(...numbers);
  // Loop-based alternative:
  // let max = numbers[0];
  // for (let i = 1; i < numbers.length; i++) if (numbers[i] > max) max = numbers[i];
  logOutput(`🔺 Maximum Value: ${max}`);
}

function findMin() {
  if (numbers.length === 0) { alert('Array is empty.'); return; }
  const min = Math.min(...numbers);
  // Loop-based alternative:
  // let min = numbers[0];
  // for (let i = 1; i < numbers.length; i++) if (numbers[i] < min) min = numbers[i];
  logOutput(`🔻 Minimum Value: ${min}`);
}
