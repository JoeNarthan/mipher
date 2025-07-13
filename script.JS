/**
 * Cipher Master Project - JavaScript Implementation
 * This file contains all cipher algorithms with detailed comments
 */

/**
 * UTILITY FUNCTIONS
 */

/**
 * Proper modulo function that handles negative numbers
 * @param {number} n - The dividend
 * @param {number} m - The divisor
 * @returns {number} The remainder
 */
function mod(n, m) {
  return ((n % m) + m) % m;
}

/**
 * Calculates the greatest common divisor (GCD) of two numbers
 * @param {number} a - First number
 * @param {number} b - Second number
 * @returns {number} GCD of a and b
 */
function gcd(a, b) {
  if (b === 0) return a;
  return gcd(b, a % b);
}

/**
 * Finds the modular inverse of a number
 * @param {number} a - The number
 * @param {number} m - The modulus
 * @returns {number} The modular inverse or -1 if none exists
 */
function modInverse(a, m) {
  for (let x = 1; x < m; x++) {
    if (mod(a * x, m) === 1) return x;
  }
  return -1;
}

/**
 * Checks if a number is prime
 * @param {number} num - Number to check
 * @returns {boolean} True if prime, false otherwise
 */
function isPrime(num) {
  if (num <= 1) return false;
  if (num <= 3) return true;
  if (num % 2 === 0 || num % 3 === 0) return false;
  for (let i = 5; i * i <= num; i += 6) {
    if (num % i === 0 || num % (i + 2) === 0) return false;
  }
  return true;
}

/**
 * I. CAESAR CIPHER (Fixed Shift = 3)
 */

/**
 * Encrypts text using Caesar cipher with shift of 3
 * This cipher moves each letter 3 places forward in the alphabet (A -> D, B -> E, ...)
 */
function caesarEncrypt() {
  const text = document.getElementById("caesarText").value.toUpperCase();
  let result = '';
  
  for (let char of text) {
    if (char >= 'A' && char <= 'Z') {
      // Shift character by 3 positions in the alphabet
      result += String.fromCharCode(((char.charCodeAt(0) - 65 + 3) % 26) + 65);
    } else {
      result += char; // Leave non-alphabet characters unchanged
    }
  }
  
  document.getElementById("caesarResult").innerText = result;
}

/**
 * Decrypts text using Caesar cipher with shift of 3
 */
function caesarDecrypt() {
  const text = document.getElementById("caesarText").value.toUpperCase();
  let result = '';
  
  for (let char of text) {
    if (char >= 'A' && char <= 'Z') {
      // Unshift character by 3 positions in the alphabet
      result += String.fromCharCode(((char.charCodeAt(0) - 65 - 3 + 26) % 26) + 65);
    } else {
      result += char;
    }
  }
  
  document.getElementById("caesarResult").innerText = result;
}

/**
 * II. GENERAL SHIFT CIPHER
 */

/**
 * Encrypts text using a general shift cipher with user-provided key
 */
function shiftEncrypt() {
  const text = document.getElementById("shiftText").value.toUpperCase();
  const key = parseInt(document.getElementById("shiftKey").value);
  if (isNaN(key)) return alert("Please enter a valid key!");

  let result = '';
  
  for (let char of text) {
    if (char >= 'A' && char <= 'Z') {
      // Shift character by key positions in the alphabet
      result += String.fromCharCode(mod((char.charCodeAt(0) - 65 + key), 26) + 65);
    } else {
      result += char;
    }
  }
  
  document.getElementById("shiftResult").innerText = result;
}

/**
 * Decrypts text using a general shift cipher with user-provided key
 */
function shiftDecrypt() {
  const text = document.getElementById("shiftText").value.toUpperCase();
  const key = parseInt(document.getElementById("shiftKey").value);
  if (isNaN(key)) return alert("Please enter a valid key!");

  let result = '';
  
  for (let char of text) {
    if (char >= 'A' && char <= 'Z') {
      // Unshift character by key positions in the alphabet
      result += String.fromCharCode(mod((char.charCodeAt(0) - 65 - key), 26) + 65);
    } else {
      result += char;
    }
  }
  
  document.getElementById("shiftResult").innerText = result;
}

/**
 * Brute Force Attack for Shift Cipher
 * Tries all possible shift values (1-25) to find potential plaintext
 */
function shiftBruteForce() {
  const ciphertext = document.getElementById("shiftText").value.toUpperCase();
  if (!ciphertext) return alert("Please enter some ciphertext!");
  
  const resultsContainer = document.getElementById("shiftBruteForceResults");
  resultsContainer.innerHTML = "<h4>Brute Force Results:</h4>";
  
  // Try all possible shifts (1 to 25)
  for (let key = 1; key < 26; key++) {
    let plaintext = '';
    
    for (let char of ciphertext) {
      if (char >= 'A' && char <= 'Z') {
        plaintext += String.fromCharCode(mod((char.charCodeAt(0) - 65 - key), 26) + 65);
      } else {
        plaintext += char;
      }
    }
    
    // Display each attempt
    const resultElement = document.createElement("p");
    resultElement.innerHTML = `<strong>Shift ${key}:</strong> ${plaintext}`;
    resultsContainer.appendChild(resultElement);
  }
}

/**
 * III. AFFINE CIPHER
 */

/**
 * Encrypts text using an affine cipher with keys a and b
 * Encryption formula: E(x) = (a * x + b) mod 26
 */
function affineEncrypt() {
  const text = document.getElementById("affineText").value.toUpperCase();
  const a = parseInt(document.getElementById("keyA").value);
  const b = parseInt(document.getElementById("keyB").value);
  if (isNaN(a) || isNaN(b)) return alert("Enter valid keys!");

  let result = '';
  
  for (let char of text) {
    if (char >= 'A' && char <= 'Z') {
      // Apply affine transformation: E(x) = (a*x + b) mod 26
      let x = char.charCodeAt(0) - 65;
      result += String.fromCharCode(mod((a * x + b), 26) + 65);
    } else {
      result += char;
    }
  }
  
  document.getElementById("affineResult").innerText = result;
}

/**
 * Decrypts text using an affine cipher with keys a and b
 */
function affineDecrypt() {
  const text = document.getElementById("affineText").value.toUpperCase();
  const a = parseInt(document.getElementById("keyA").value);
  const b = parseInt(document.getElementById("keyB").value);
  if (isNaN(a) || isNaN(b)) return alert("Enter valid keys!");

  // Find modular inverse of a
  let a_inv = modInverse(a, 26);
  if (a_inv === -1) return alert("Invalid key a (no modular inverse)");

  let result = '';
  
  for (let char of text) {
    if (char >= 'A' && char <= 'Z') {
      // Apply inverse affine transformation: D(y) = a_inv*(y - b) mod 26
      let y = char.charCodeAt(0) - 65;
      result += String.fromCharCode(mod(a_inv * (y - b), 26) + 65);
    } else {
      result += char;
    }
  }
  
  document.getElementById("affineResult").innerText = result;
}

/**
 * Brute Force Attack for Affine Cipher
 * Tries all possible valid a values (coprime with 26) with all possible b values
 */
function affineBruteForce() {
  const ciphertext = document.getElementById("affineText").value.toUpperCase();
  if (!ciphertext) return alert("Please enter some ciphertext!");
  
  const resultsContainer = document.getElementById("affineBruteForceResults");
  resultsContainer.innerHTML = "<h4>Brute Force Results:</h4>";
  
  // Valid a values (must be coprime with 26)
  const validAValues = [1, 3, 5, 7, 9, 11, 15, 17, 19, 21, 23, 25];
  
  // Try all valid a and b combinations
  for (let a of validAValues) {
    for (let b = 0; b < 26; b++) {
      const a_inv = modInverse(a, 26);
      let plaintext = '';
      
      for (let char of ciphertext) {
        if (char >= 'A' && char <= 'Z') {
          let y = char.charCodeAt(0) - 65;
          plaintext += String.fromCharCode(mod(a_inv * (y - b), 26) + 65);
        } else {
          plaintext += char;
        }
      }
      
      // Display each attempt
      const resultElement = document.createElement("p");
      resultElement.innerHTML = `<strong>a=${a}, b=${b}:</strong> ${plaintext}`;
      resultsContainer.appendChild(resultElement);
    }
  }
}

/**
 * IV. TRANSPOSITION CIPHER
 */

/**
 * Encrypts text using a columnar transposition cipher with the given keyword
 */
function transpositionEncrypt() {
  const text = document.getElementById("transpositionText").value.toUpperCase().replace(/[^A-Z]/g, '');
  const key = document.getElementById("transpositionKey").value;
  
  if (!text || !key) return alert("Please enter both text and key!");
  
  // Determine number of columns from key length
  const cols = key.length;
  const rows = Math.ceil(text.length / cols);
  
  // Pad text if needed
  let paddedText = text;
  while (paddedText.length < rows * cols) {
    paddedText += 'X';
  }
  
  // Create grid
  let grid = [];
  for (let i = 0; i < rows; i++) {
    grid.push(paddedText.substr(i * cols, cols).split(''));
  }
  
  // Determine column order from key (sort columns based on key digits)
  const colOrder = key.split('').map(Number).map((num, i) => ({num, i})).sort((a, b) => a.num - b.num).map(x => x.i);
  
  // Read columns in order to create ciphertext
  let result = '';
  for (let col of colOrder) {
    for (let row = 0; row < rows; row++) {
      result += grid[row][col];
    }
  }
  
  document.getElementById("transpositionResult").innerText = result;
}

/**
 * Decrypts text using a columnar transposition cipher with the given keyword
 */
function transpositionDecrypt() {
  const text = document.getElementById("transpositionText").value.toUpperCase().replace(/[^A-Z]/g, '');
  const key = document.getElementById("transpositionKey").value;
  
  if (!text || !key) return alert("Please enter both text and key!");
  
  const cols = key.length;
  const rows = Math.ceil(text.length / cols);
  
  // Determine column order from key
  const colOrder = key.split('').map(Number).map((num, i) => ({num, i})).sort((a, b) => a.num - b.num).map(x => x.i);
  
  // Determine original column order (inverse permutation)
  const originalCols = [];
  for (let i = 0; i < cols; i++) {
    originalCols[colOrder.indexOf(i)] = i;
  }
  
  // Reconstruct grid by filling columns in the original order
  let grid = Array(rows).fill().map(() => Array(cols).fill(''));
  let index = 0;
  
  for (let col of originalCols) {
    for (let row = 0; row < rows; row++) {
      if (index < text.length) {
        grid[row][col] = text.charAt(index++);
      }
    }
  }
  
  // Read row-wise to get original plaintext
  let result = '';
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      result += grid[row][col];
    }
  }
  
  // Remove padding X's (if any)
  result = result.replace(/X+$/, '');
  
  document.getElementById("transpositionResult").innerText = result;
}

/**
 * V. RSA CRYPTOGRAPHY
 */

/**
 * Generates RSA public and private keys from two prime numbers
 */
function rsaGenerateKeys() {
  const p = parseInt(document.getElementById("rsaP").value);
  const q = parseInt(document.getElementById("rsaQ").value);
  
  if (!isPrime(p) || !isPrime(q)) return alert("Both numbers must be prime!");
  
  // Calculate modulus and Euler's totient function
  const n = p * q;
  const phi = (p - 1) * (q - 1);
  
  // Find public exponent e (coprime with phi)
  let e = 2;
  while (e < phi) {
    if (gcd(e, phi) === 1) break;
    e++;
  }
  
  // Find private exponent d (modular inverse of e mod phi)
  const d = modInverse(e, phi);
  if (d === -1) return alert("Could not compute modular inverse!");
  
  // Display keys
  document.getElementById("rsaPublicKey").innerText = `(${e}, ${n})`;
  document.getElementById("rsaPrivateKey").innerText = `(${d}, ${n})`;
}

/**
 * Encrypts text using RSA public key
 */
function rsaEncrypt() {
  const text = document.getElementById("rsaEncryptText").value;
  const e = parseInt(document.getElementById("rsaEncryptE").value);
  const n = parseInt(document.getElementById("rsaEncryptN").value);
  
  if (!text || isNaN(e) || isNaN(n)) return alert("Please enter valid values!");
  
  let result = '';
  for (let char of text) {
    // Encrypt each character: c = m^e mod n
    const code = char.charCodeAt(0);
    const encrypted = mod(Math.pow(code, e), n);
    result += encrypted + ' ';
  }
  
  document.getElementById("rsaEncryptResult").innerText = result.trim();
}

/**
 * Decrypts text using RSA private key
 */
function rsaDecrypt() {
  const text = document.getElementById("rsaDecryptText").value;
  const d = parseInt(document.getElementById("rsaDecryptD").value);
  const n = parseInt(document.getElementById("rsaDecryptN").value);
  
  if (!text || isNaN(d) || isNaN(n)) return alert("Please enter valid values!");
  
  const codes = text.split(' ').filter(x => x).map(Number);
  let result = '';
  
  for (let code of codes) {
    // Decrypt each number: m = c^d mod n
    const decrypted = mod(Math.pow(code, d), n);
    result += String.fromCharCode(decrypted);
  }
  
  document.getElementById("rsaDecryptResult").innerText = result;
}