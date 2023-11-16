/*
  Full Name: Jeffrey Chan
  Date: November 14th, 2023 
  File: script.js
  Description: Javascript for generating the dynamic multiplication table
*/

const form = document.getElementById('form');

// use Jquery to validate the form using rules and our custom messages
$().ready(function () {
  $('#form').validate({
    rules: {
      'start-row': {
        required: true,
        min: -100,
        max: 100,
      },
      'end-row': {
        required: true,
        min: -100,
        max: 100,
      },
      'start-col': {
        required: true,
        min: -100,
        max: 100,
      },
      'end-col': {
        required: true,
        min: -100,
        max: 100,
      },
    },
    messages: {
      'start-row': {
        required: 'Please enter your start row',
        min: 'Please enter a value over -100',
        max: 'Please enter a value under 100',
      },
      'end-row': {
        required: 'Please enter your end row',
        min: 'Please enter a value over -100',
        max: 'Please enter a value under 100',
      },
      'start-col': {
        required: 'Please enter your start col',
        min: 'Please enter a value over -100',
        max: 'Please enter a value under 100',
      },
      'end-col': {
        required: 'Please enter your end col',
        min: 'Please enter a value over -100',
        max: 'Please enter a value under 100',
      },
    },
    submitHandler: function (form) {
      handleSubmit();
    },
  });
});

const handleSubmit = (e) => {
  if (e) e.preventDefault();

  // get the start and end values for multiplication table
  const startRow = parseInt(document.getElementById('form__input--start-row').value);
  const endRow = parseInt(document.getElementById('form__input--end-row').value);
  const startCol = parseInt(document.getElementById('form__input--start-col').value);
  const endCol = parseInt(document.getElementById('form__input--end-col').value);

  const matrix = generateMultiplicationTable(startRow, endRow, startCol, endCol);

  const multiplicationTableWrapper = document.getElementById('multiplication-table-wrapper');
  const testElement = matrixToHtmlElement(matrix);

  multiplicationTableWrapper.innerHTML = '';
  multiplicationTableWrapper.appendChild(testElement);
};

// form.addEventListener('submit', handleSubmit);

// creates a 2d array containing both he headers and content of the table
function generateMultiplicationTable(sRow, eRow, sCol, eCol) {
  let resultMatrix = [];

  // make the column header
  let rowMatrix = [''];
  for (let col = sCol; col <= eCol; col++) {
    rowMatrix.push(col);
  }
  resultMatrix.push(rowMatrix);

  for (let row = sRow; row <= eRow; row++) {
    let rowMatrix = [];
    rowMatrix.push(row);
    for (let col = sCol; col <= eCol; col++) {
      rowMatrix.push(row * col);
    }
    resultMatrix.push(rowMatrix);
  }
  return resultMatrix;
}

// uses the generated matrix to convert it into a html element
function matrixToHtmlElement(matrix) {
  const multiplicationTable = document.createElement('table');
  multiplicationTable.className = 'table';
  multiplicationTable.style.gridTemplateColumns = `repeat(${matrix[0].length}, 1fr)`;
  // generate top row
  const tableHead = document.createElement('thead');
  const tableRow = document.createElement('tr');
  for (let col = 0; col < matrix[0].length; col++) {
    const cell = document.createElement('th');
    cell.textContent = matrix[0][col];
    cell.className = 'table__head';
    tableRow.appendChild(cell);
  }
  tableHead.appendChild(tableRow);
  multiplicationTable.appendChild(tableHead);

  // generate body
  const tableBody = document.createElement('tbody');

  for (let row = 1; row < matrix.length; row++) {
    const tableRow = document.createElement('tr');
    for (let col = 0; col < matrix[0].length; col++) {
      let cell;
      if (col === 0) {
        cell = document.createElement('th');
        cell.className = 'table__head';
      } else {
        cell = document.createElement('td');
        cell.className = 'table__cell';
      }
      if (row % 2 === 1 && col !== 0) {
        // cell.style.filter = 'hue-rotate(90deg)';
        cell.style.backgroundColor = '#e0f2fe';
      }
      cell.textContent = matrix[row][col];
      tableRow.appendChild(cell);
    }
    tableBody.appendChild(tableRow);
  }
  multiplicationTable.appendChild(tableBody);
  return multiplicationTable;
}
