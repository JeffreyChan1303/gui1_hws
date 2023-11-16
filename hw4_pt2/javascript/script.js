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
    submitHandler: function (form, event) {
      handleSubmit(event);
    },
  });
});

// slider code
const sliderClassArray = [
  '.slider-start-row',
  '.slider-end-row',
  '.slider-start-col',
  '.slider-end-col',
];
const inputIdArray = [
  '#form__input--start-row',
  '#form__input--end-row',
  '#form__input--start-col',
  '#form__input--end-col',
];
for (let i = 0; i < 4; i++) {
  $(sliderClassArray[i]).slider({
    min: -100,
    max: 100,
    slide: function (event, ui) {
      $(inputIdArray[i]).val(ui.value);
      if ($(inputIdArray[i]).valid()) {
        generateInputMultTable();
        console.log('test');
      }
    },
  });
  $(inputIdArray[i]).val($(sliderClassArray[i]).slider('value'));
  $(inputIdArray[i]).on('input', (e) => {
    $(sliderClassArray[i]).slider({
      value: e.target.value,
    });
    if ($(inputIdArray[i]).valid()) {
      generateInputMultTable();
      console.log('test');
    }
  });
}

// create new tab for mult table
const tabHeaderWrapper = document.querySelector('.tab-header__tab-input');
const tabsWrapper = document.getElementById('tabs-wrapper');
let multCount = 0;

const createNewTab = () => {
  multCount += 1;
  console.log(multCount);
  const newTabHeader = document.createElement('li');
  newTabHeader.setAttribute('id', `tab-header-${multCount}`);
  const newTabHeaderLink = document.createElement('a');
  newTabHeaderLink.setAttribute('href', `#mult-table-${multCount}`);
  newTabHeaderLink.textContent = `Mult Table ${multCount}`;
  newTabHeader.appendChild(newTabHeaderLink);
  tabHeaderWrapper.appendChild(newTabHeader);

  const newMultiplicationTableWrapper = document.createElement('div');
  newMultiplicationTableWrapper.setAttribute('id', `mult-table-${multCount}`);
  newMultiplicationTableWrapper.setAttribute('class', 'multiplication-table-wrapper');
  tabsWrapper.appendChild(newMultiplicationTableWrapper);

  return newMultiplicationTableWrapper;
};

// form submission code
function handleSubmit(e) {
  if (e) e.preventDefault();

  // get the start and end values for multiplication table
  const startRow = parseInt(document.getElementById('form__input--start-row').value);
  const endRow = parseInt(document.getElementById('form__input--end-row').value);
  const startCol = parseInt(document.getElementById('form__input--start-col').value);
  const endCol = parseInt(document.getElementById('form__input--end-col').value);

  const matrix = generateMultiplicationTable(startRow, endRow, startCol, endCol);

  // this is where we create a new wrapper, by creating new tabs
  createNewTab();
  const multiplicationTableWrapper = document.getElementById(`mult-table-${multCount}`);
  const matrixElement = matrixToHtmlElement(matrix);

  const wrapperDiv = document.createElement('div');

  multiplicationTableWrapper.innerHTML = '';
  wrapperDiv.appendChild(matrixElement);
  multiplicationTableWrapper.appendChild(wrapperDiv);

  // create delete tab button
  const deleteTabButton = document.createElement('button');
  deleteTabButton.setAttribute('class', `delete-tab-button delete-tab-button-${multCount}`);
  deleteTabButton.textContent = 'Delete Multiplication Table';
  multiplicationTableWrapper.appendChild(deleteTabButton);

  const curTabHeader = document.getElementById(`tab-header-${multCount}`);
  deleteTabButton.addEventListener('click', (e) => {
    // e.preventDefault();
    clearElement(curTabHeader);
    clearElement(multiplicationTableWrapper);
  });

  $(function () {
    $('#tabs-wrapper').tabs('refresh');
  });
}

// function to show mult table for input elements
function generateInputMultTable() {
  const startRow = parseInt(document.getElementById('form__input--start-row').value);
  const endRow = parseInt(document.getElementById('form__input--end-row').value);
  const startCol = parseInt(document.getElementById('form__input--start-col').value);
  const endCol = parseInt(document.getElementById('form__input--end-col').value);

  const matrix = generateMultiplicationTable(startRow, endRow, startCol, endCol);

  const multiplicationTableWrapper = document.getElementById('mult-table-0');
  const matrixElement = matrixToHtmlElement(matrix);
  multiplicationTableWrapper.innerHTML = '';
  multiplicationTableWrapper.appendChild(matrixElement);
}

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

// logic for deleting tabs
function deleteTab(tabNum) {
  const deleteTabButton = document.getElementById(`delete-tab-button-${tabNum}`);
}

function clearElement(node) {
  while (node.hasChildNodes()) {
    clearElement(node.firstChild);
  }
  node.parentNode.removeChild(node);
}
