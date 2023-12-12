let num = process.argv[2];
let currentBase = Number(process.argv[3]);
let convertBase = Number(process.argv[4]);

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

let toBaseTenConversion = function(num, convertBase){

    //tackling letters from bases above 10
    let numbersArrayStrings = Array.from(num);
    for (let i = 0; i < numbersArrayStrings.length; i++) {
        if(isNaN(Number(numbersArrayStrings[i]))) {
            numbersArrayStrings[i] = assignLetterToNumber(numbersArrayStrings[i]);
        }
    }

    //conversion prerequisites
    let conversionResult = 0;
    const numberConversionFunction = num => Number(num);
    const numbersArray = Array.from(numbersArrayStrings, numberConversionFunction);

    //check if number is in correct base
    for (let i = 0; i < numbersArray.length; i++) {
        if (numbersArray[i] >= currentBase) {
            conversionResult = "bad"; 
            return conversionResult;
        }
        conversionResult += numbersArray[i] * (convertBase ** (numbersArray.length - i - 1));
    }
    return conversionResult;
}

let fromBaseTenConversion = function(num, convertBase) {
    if(typeof num === "string") {
        return `The number you entered is not in base ${currentBase}`;
    }
    let result = '';
    let quotient = num;
    while (quotient > 0) {
        let remainder = quotient % convertBase;
        if (remainder >= 10) {
            remainder = assignLetterToNumber(remainder);
        }
        result = remainder.toString() + result;
        quotient = Math.floor(quotient / convertBase);
    }
    return result;
}

function convertHard (num, currentBase, convertBase) {
    if ((currentBase > 36 || currentBase < 2) || (convertBase > 36 || convertBase < 2)) {
        return "Base values must be in the range: 2-36";
    }
    
    //check if number is in correct base
    let digits = num.split('').map(Number);
    
    //convert number from base 10
    if (currentBase === 10) {
        return fromBaseTenConversion(num, convertBase);
    }
    
    //convert number from any base
    let numInBaseTen = toBaseTenConversion(num, currentBase);
    return fromBaseTenConversion(numInBaseTen, convertBase);
}

// console.log(`You converted ${num} from base: ${currentBase} to base: ${convertBase}. The result is:`);
console.log(convertHard(num, currentBase, convertBase));
