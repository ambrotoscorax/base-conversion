const stateBase = {
    "number": 0,
    "current-base": 2,
    "convert-base": 10,
    "numberArray": []
};

const stateHandler = {
    get(target, prop, receiver) {
        return target[prop];
    },
    set(target, prop, value) {
        target[prop] = value;
        if (value === "") {
            selectCurrentBase.value = 2;
        }
    }
};
const state = new Proxy(stateBase, stateHandler);

let selectCurrentBase = document.getElementById("current-base");
let selectConvertBase = document.getElementById("convert-base");

console.log(state);


// generating the options for selecting bases
for (let i = 2; i <= 36; i++) {
    let optionCurrentBase = document.createElement('option');
    optionCurrentBase.value = i;
    optionCurrentBase.innerHTML = String(i);
    switch (i) {
        case 2: 
            optionCurrentBase.innerHTML = i + "(binary)";
            optionCurrentBase.selected = true;
            break;
        case 8:
            optionCurrentBase.innerHTML = i + "(octal)";
            break;
        case 10: 
            optionCurrentBase.innerHTML = i + "(decimal)";
            break;
        case 16:
            optionCurrentBase.innerHTML = i + "(hexadecimal)";
            break;
    }
    selectCurrentBase.appendChild(optionCurrentBase);

    let optionConvertBase = document.createElement('option');
    optionConvertBase.value = i;
    optionConvertBase.innerHTML = String(i);
    switch (i) {
        case 2: 
            optionConvertBase.innerHTML = i + "(binary)";
            break;
        case 8:
            optionConvertBase.innerHTML = i + "(octal)";
            break;
        case 10: 
            optionConvertBase.innerHTML = i + "(decimal)";
            optionConvertBase.selected = true;
            break;
        case 16:
            optionConvertBase.innerHTML = i + "(hexadecimal)";
            break;
    }
    selectConvertBase.appendChild(optionConvertBase);
}

// saving the value of the selected option
function saveSelectedOption(selectElement) {
    state[selectElement.id] = Number(selectElement.options[selectElement.selectedIndex].value);
}




// saving the value of the number and disabling options based on it
function saveInputNumber() {
    state['number'] = document.getElementById('number').value;
    state['numberArray'] = Array.from(state["number"]);

    let input = state['number'];
    let error = document.getElementById('error');
    let regex = /[^a-zA-Z\d:]/;
    if (regex.test(input)) {
        error.textContent = 'Please enter only numbers and letters';
        document.getElementById('number').classList.add("error-border");
    } else {
        error.textContent = '';
        document.getElementById('number').classList.remove("error-border");
    }

    // changing letters to numbers in the strings array, then making them all numbers
    let numbersArrayStrings = state["numberArray"];
    for (let i = 0; i < numbersArrayStrings.length; i++) {
        if(isNaN(Number(numbersArrayStrings[i]))) {
            numbersArrayStrings[i] = assignLetterToNumber(numbersArrayStrings[i]);
        }
    }
    const numberConversionFunction = el => Number(el);
    const checkBase = Array.from(numbersArrayStrings, numberConversionFunction);
    let currentBaseOptions = document.getElementById("current-base").options;

    // check if there is a number inputed
    if(checkBase.length === 0) {
        state["current-base"] = 2; 
        return;
    }

    // enabling options on input change
    for (let i = 0; i < currentBaseOptions.length; i++) {
        let option = currentBaseOptions[i];
        option.disabled = false;   
    } 

    // disabling options if they aren't good
    for (let i = 0; i < currentBaseOptions.length; i++) {
        for (let j = 0; j < checkBase.length; j++) {
            if (checkBase[j] >= currentBaseOptions[i].value) {
                currentBaseOptions[i].disabled = true; 
                currentBaseOptions[i+1].selected = true;
                state["current-base"] = Number(currentBaseOptions[i + 1].value);
                break;
            }
        }  
    } 
}



// conversion
function convertHard() {
    let num = state["number"];

    let num1 = stateHandler.get(stateBase, "number", state)

    let currentBase = state["current-base"];
    let convertBase = state["convert-base"];
    
    // convert number from base 10
    if (currentBase === 10) {
        document.getElementById('result-p').innerHTML = fromBaseTenConversion(num, convertBase);
    }
    
    // convert number from any base
    let numInBaseTen = toBaseTenConversion(currentBase);

    if(numInBaseTen === "bad") {
        document.getElementById('result-p').innerHTML = `The number is not in base ${currentBase}`;
        return;
    }

    document.getElementById('result-p').innerHTML = fromBaseTenConversion(numInBaseTen, convertBase);
}

//assigning numbers to letter and vice versa
let assignLetterToNumber = function(input) {
    let alphabetArray = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];
    let alphabetNumbers = ["10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26", "27", "28", "29", "30", "31", "32", "33", "34", "35"];
    let result = "";

    if (typeof input === "number") {
        let index = alphabetNumbers.indexOf(String(input));
        return result = alphabetArray[index];
    }

    if (typeof input === "string") {
        let index = alphabetArray.indexOf(input.toUpperCase());
        return result = alphabetNumbers[index];
    }
}

// converting to base ten
let toBaseTenConversion = function(someBase){
    
    // tackling letters from bases above 10
    let numbersArrayStrings = state["numberArray"];
    for (let i = 0; i < numbersArrayStrings.length; i++) {
        if(isNaN(Number(numbersArrayStrings[i]))) {
            numbersArrayStrings[i] = assignLetterToNumber(numbersArrayStrings[i]);
        }
    }

    // conversion prerequisites
    let conversionResult = 0;
    const numberConversionFunction = el => Number(el);
    const numbersArray = Array.from(numbersArrayStrings, numberConversionFunction);
    // check if number is in correct base
    for (let i = 0; i < numbersArray.length; i++) {
        if (numbersArray[i] >= someBase) {
            return "bad"; 
        }

        conversionResult += numbersArray[i] * (someBase ** (numbersArray.length - i - 1));
    }
    return conversionResult;
}

// converting from base ten to other bases
let fromBaseTenConversion = function(num, someBase) {
    let result = '';
    let quotient = num;
    while (quotient > 0) {
        let remainder = quotient % someBase;
        if (remainder >= 10) {
            remainder = assignLetterToNumber(remainder);
        }
        result = remainder.toString() + result;
        quotient = Math.floor(quotient / someBase);
    }

    return result;
}
