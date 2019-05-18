 // User Story #1: My calculator should contain a clickable element containing an = (equal sign) with a corresponding id="equals".
// User Story #2: My calculator should contain 10 clickable elements containing one number each from 0-9, with the following corresponding IDs: id="zero", id="one", id="two", id="three", id="four", id="five", id="six", id="seven", id="eight", and id="nine".
// User Story #3: My calculator should contain 4 clickable elements each containing one of the 4 primary mathematical operators with the following corresponding IDs: id="add", id="subtract", id="multiply", id="divide".
// User Story #4: My calculator should contain a clickable element containing a . (decimal point) symbol with a corresponding id="decimal".
// User Story #5: My calculator should contain a clickable element with an id="clear".
// User Story #6: My calculator should contain an element to display values with a corresponding id="display".
// User Story #7: At any time, pressing the clear button clears the input and output values, and returns the calculator to its initialized state; 0 should be shown in the element with the id of display.
// User Story #8: As I input numbers, I should be able to see my input in the element with the id of display.
// User Story #9: In any order, I should be able to add, subtract, multiply and divide a chain of numbers of any length, and when I hit =, the correct result should be shown in the element with the id of display.
// User Story #10: When inputting numbers, my calculator should not allow a number to begin with multiple zeros.
// User Story #11: When the decimal element is clicked, a . should append to the currently displayed value; two . in one number should not be accepted.
// User Story #12: I should be able to perform any operation (+, -, *, /) on numbers containing decimal points.
// User Story #13: If 2 or more operators are entered consecutively, the operation performed should be the last operator entered.
// User Story #14: Pressing an operator immediately following = should start a new calculation that operates on the result of the previous evaluation.
// User Story #15: My calculator should have several decimal places of precision when it comes to rounding (note that there is no exact standard, but you should be able to handle calculations like 2 / 7 with reasonable precision to at least 4 decimal places).

// init objects
// var entries new array
// var total new float

// var temp new string

// on button click if number or decimal point button add to temp

// if some symbol other than equals 
// add temp to entries -then add our current symbol and clear temp

// else if all clear button re init all objects 

// else if clear entry button clear temp 

// change button outputs to handle entries calculation

// if equals peform calculation and set total

const calculate = (n1, operator, n2) => {
    const firstNum = parseFloat(n1)
    const secondNum = parseFloat(n2)
    if (operator === 'add') return firstNum + secondNum
    if (operator === 'subtract') return firstNum - secondNum
    if (operator === 'multiply') return firstNum * secondNum
    if (operator === 'divide') return firstNum / secondNum
  }
  
  const getKeyType = key => {
    const { action } = key.dataset
    if (!action) return 'number'
    if (
      action === 'add' ||
      action === 'subtract' ||
      action === 'multiply' ||
      action === 'divide'
    ) return 'operator'
    // For everything else, return the action
    return action
  }
  
  const createResultString = (key, displayedNum, state) => {
    const keyContent = key.textContent
    const keyType = getKeyType(key)
    const {
      firstValue,
      operator,
      modValue,
      previousKeyType
    } = state
  
    if (keyType === 'number') {
      return displayedNum === '0' ||
        previousKeyType === 'operator' ||
        previousKeyType === 'calculate'
        ? keyContent
        : displayedNum + keyContent
    }
  
    if (keyType === 'decimal') {
      if (!displayedNum.includes('.')) return displayedNum + '.'
      if (previousKeyType === 'operator' || previousKeyType === 'calculate') return '0.'
      return displayedNum
    }
  
    if (keyType === 'operator') {
      return firstValue &&
        operator &&
        previousKeyType !== 'operator' &&
        previousKeyType !== 'calculate'
        ? calculate(firstValue, operator, displayedNum)
        : displayedNum
    }
  
    if (keyType === 'clear') return 0
  
    if (keyType === 'calculate') {
      return firstValue
        ? previousKeyType === 'calculate'
          ? calculate(displayedNum, operator, modValue)
          : calculate(firstValue, operator, displayedNum)
        : displayedNum
    }
  }
  
  const updateCalculatorState = (key, calculator, calculatedValue, displayedNum) => {
    const keyType = getKeyType(key)
    const {
      firstValue,
      operator,
      modValue,
      previousKeyType
    } = calculator.dataset
  
    calculator.dataset.previousKeyType = keyType
  
    if (keyType === 'operator') {
      calculator.dataset.operator = key.dataset.action
      calculator.dataset.firstValue = firstValue &&
        operator &&
        previousKeyType !== 'operator' &&
        previousKeyType !== 'calculate'
        ? calculatedValue
        : displayedNum
    }
  
    if (keyType === 'calculate') {
      calculator.dataset.modValue = firstValue && previousKeyType === 'calculate'
        ? modValue
        : displayedNum
    }
  
    if (keyType === 'clear' && key.textContent === 'AC') {
      calculator.dataset.firstValue = ''
      calculator.dataset.modValue = ''
      calculator.dataset.operator = ''
      calculator.dataset.previousKeyType = ''
    }
  }
  
  const updateVisualState = (key, calculator) => {
    const keyType = getKeyType(key)
    Array.from(key.parentNode.children).forEach(k => k.classList.remove('is-depressed'))
  
    if (keyType === 'operator') key.classList.add('is-depressed')
    if (keyType === 'clear' && key.textContent !== 'AC') key.textContent = 'AC'
    if (keyType !== 'clear') {
      const clearButton = calculator.querySelector('[data-action=clear]')
      clearButton.textContent = 'CE'
    }
  }
  
  const calculator = document.querySelector('.calculator')
  const display = calculator.querySelector('.calculator__display')
  const keys = calculator.querySelector('.calculator__keys')
  
  keys.addEventListener('click', e => {
    if (!e.target.matches('button')) return
    const key = e.target
    const displayedNum = display.textContent
    const resultString = createResultString(key, displayedNum, calculator.dataset)
  
    display.textContent = resultString
    updateCalculatorState(key, calculator, resultString, displayedNum)
    updateVisualState(key, calculator)
  })