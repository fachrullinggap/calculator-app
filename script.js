// Mendapatkan elemen-elemen yang diperlukan dari DOM
const numbers = document.querySelectorAll(".number")
const calculatorScreen = document.querySelector(".calculator-screen")
const operators = document.querySelectorAll(".operator")
const equalSign = document.querySelector(".equal-sign")
const clearSign = document.querySelector(".all-clear")
const decimalSign = document.querySelector(".decimal")
const percentageSign = document.querySelector(".percentage")

// Fungsi untuk memperbarui layar kalkulator
const updateScreen = (number) => {
    calculatorScreen.value = number
}

// Variabel untuk menyimpan angka sebelumnya, operator, dan angka saat ini
let previousNumber = ""
let calculationOperator = ""
let currentNumber = "0"
let lastPercent = 0
let baseNumber = 0

// Fungsi untuk menginput angka
const inputNumber = (number) => {
    try {
        // Jika angka yang ditampilkan adalah "Error in input number", reset ke 0
        if (currentNumber === "Error input") {
            currentNumber = "0"
        }

        if (currentNumber === "0" && number !== ".") {
            // Jika angka saat ini adalah 0 dan angka yang ditekan bukan titik, ganti 0 dengan angka yang ditekan
            currentNumber = number
        }
        else if (currentNumber === "0" && number === ".") {
            // Jika angka saat ini adalah 0 dan angka yang ditekan adalah titik, ganti 0 dengan 0.
            currentNumber = "0."
        }
        else if (currentNumber.includes(".") && number === ".") {
            // Jika angka saat ini sudah mengandung titik, jangan tambahkan titik lagi
            return
        }
        else if (currentNumber === ".") {
            // Jika angka saat ini adalah titik, ganti dengan 0.
            currentNumber = "0."
        }
        else {
            // Tambahkan angka yang ditekan ke angka saat ini
            currentNumber += number
        } 
    }
    catch (error) {
        //console.error("Error in inputNumber:", error)
        previousNumber = ""
        calculationOperator = ""
        currentNumber = "Error input"
        return
    }

    // Jika angka saat ini sudah lebih dari 10 karakter, batasi menjadi 10 karakter
    if (currentNumber.length > 10) {
        currentNumber = currentNumber.slice(0, 10)
    }    
}

// Menambahkan event listener untuk setiap tombol angka
for (let i = 0; i < numbers.length; i++) {
    // console.log(numbers[i])
    numbers[i].addEventListener("click", (event) => {
        // console.log("tombol angka ditekan")
        if (equalFlag) {
        // Jika tombol sama dengan ditekan sebelumnya, reset currentNumber
        currentNumber = "0"
        equalFlag = false
        }
        inputNumber(event.target.value)
        updateScreen(currentNumber)
    })
}

// Fungsi untuk menginput operator
// Fungsi ini akan menyimpan angka saat ini sebagai angka sebelumnya dan mengatur operator yang dipilih
const inputOperator = (operator) => {
    if (currentNumber === "") {
        // Jika hanya operator yang ditekan tanpa angka
        calculationOperator = operator
        return
    }
    
    
    if (previousNumber !== "" && currentNumber !== "") {
        // Jika sudah ada angka sebelumnya dan angka saat ini, lakukan perhitungan
        calculate()
    }

    previousNumber = currentNumber
    calculationOperator = operator
    currentNumber = ""
}

for (let i = 0; i < operators.length; i++) {
    operators[i].addEventListener("click", (event) => {
        inputOperator(event.target.value)
        updateScreen(previousNumber + event.target.value)
        // console.log(event.target.value)
    })
}

// Menambahkan event listener untuk tombol sama dengan/equal sign
equalSign.addEventListener("click", () => {
    // console.log("equal sign pressed")

    if (previousNumber === "" || currentNumber === "") {
        // Jika tidak ada angka sebelumnya atau angka saat ini, tidak melakukan perhitungan
        return
    }

    calculate()
    if (currentNumber !== "") {
        updateScreen(currentNumber)
        equalFlag = true
    }
})

let equalFlag = false; // Variabel untuk menandai apakah tombol sama dengan telah ditekan
// Fungsi untuk menghitung hasil berdasarkan operator yang dipilih
const calculate = () => {
    let result = ""
    switch (calculationOperator) {
        case "+":
            result = parseFloat(previousNumber) + parseFloat(currentNumber)
            break
        case "-":
            result = parseFloat(previousNumber) - parseFloat(currentNumber)
            break
        case "x":
            result = parseFloat(previousNumber) * parseFloat(currentNumber)
            break
        case "÷":
            result = parseFloat(previousNumber) / parseFloat(currentNumber)
            break
        default:
            return
    }

    currentNumber = result
    //previousNumber = ""
    calculationOperator = ""
}

// Menambahkan event listener untuk tombol clear
clearSign.addEventListener("click", () => {
    // console.log("clear sign pressed")
    clearAll()
    updateScreen(currentNumber)
})

const clearAll = () => {
    // Reset semua variabel
    previousNumber = ""
    calculationOperator = ""
    currentNumber = "0"
}

// Menambahkan event listener untuk tombol desimal
decimalSign.addEventListener("click", (event) => {
    inputNumber(event.target.value)
    updateScreen(currentNumber)
})


// Menambahkan event listener untuk tombol persentase
percentageSign.addEventListener("click", () => {
    if (currentNumber === "0") {
        // Jika tidak ada angka sebelumnya, tidak melakukan perhitungan
        return
    }

    if (calculationOperator === "+" || calculationOperator === "-") {
        currentNumber = (parseFloat(currentNumber) / 100) * previousNumber
        updateScreen(currentNumber)
    }
    else {
        currentNumber = parseFloat(currentNumber) / 100
        updateScreen(currentNumber)
        // console.log("lastPercent: " + lastPercent);
    }
})

// Menambahkan event listener untuk menangani keyboard input
document.addEventListener("keydown", (event) => {
    const key = event.key;
    if (!isNaN(key) || key === ".") {
        // Jika tombol yang ditekan adalah angka atau titik
        inputNumber(key)
        updateScreen(currentNumber)
    } else if (["+", "-", "*", "/"].includes(key)) {
        // Jika tombol yang ditekan adalah operator
        inputOperator(key === "*" ? "x" : key === "/" ? "÷" : key)
        updateScreen(previousNumber + calculationOperator)
    } else if (key === "Enter") {
        // Jika tombol Enter ditekan
        equalSign.click();
    } else if (key === "Delete") {
        // Jika tombol Delete ditekan, bersihkan kalkulator
        clearSign.click()
    }
});