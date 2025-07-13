// Theme Toggle Functionality
document.addEventListener('DOMContentLoaded', function() {
    const themeToggle = document.getElementById('themeToggle');
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
    
    // Set initial theme based on user preference or localStorage
    if (localStorage.getItem('theme') === 'dark' || (!localStorage.getItem('theme') && prefersDarkScheme.matches)) {
        document.documentElement.setAttribute('data-theme', 'dark');
        themeToggle.checked = true;
    }
    
    // Theme toggle event listener
    themeToggle.addEventListener('change', function() {
        if (this.checked) {
            document.documentElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.removeAttribute('data-theme');
            localStorage.setItem('theme', 'light');
        }
    });
    
    // Tab switching functionality
    const tabButtons = document.querySelectorAll('.tab-btn');
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            
            // Remove active class from all buttons and content
            tabButtons.forEach(btn => btn.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(content => {
                content.classList.remove('active');
            });
            
            // Add active class to clicked button and corresponding content
            this.classList.add('active');
            document.getElementById(tabId).classList.add('active');
        });
    });
});

// Helper Functions
function isLetter(char) {
    return char.toLowerCase() !== char.toUpperCase();
}

function processText(text, processFunction) {
    return text.split('').map(char => {
        if (isLetter(char)) {
            return processFunction(char);
        }
        return char;
    }).join('');
}

function mod(n, m) {
    return ((n % m) + m) % m;
}

// Caesar Cipher Functions
function caesarEncrypt() {
    const text = document.getElementById('caesarText').value;
    const result = processText(text, char => {
        const code = char.charCodeAt(0);
        const shift = char.toLowerCase() === char ? 97 : 65;
        return String.fromCharCode(mod((code - shift + 3), 26) + shift);
    });
    document.getElementById('caesarResult').textContent = result;
}

function caesarDecrypt() {
    const text = document.getElementById('caesarText').value;
    const result = processText(text, char => {
        const code = char.charCodeAt(0);
        const shift = char.toLowerCase() === char ? 97 : 65;
        return String.fromCharCode(mod((code - shift - 3), 26) + shift);
    });
    document.getElementById('caesarResult').textContent = result;
}

// Shift Cipher Functions
function shiftEncrypt() {
    const text = document.getElementById('shiftText').value;
    const shift = parseInt(document.getElementById('shiftKey').value) || 0;
    const result = processText(text, char => {
        const code = char.charCodeAt(0);
        const base = char.toLowerCase() === char ? 97 : 65;
        return String.fromCharCode(mod((code - base + shift), 26) + base);
    });
    document.getElementById('shiftResult').textContent = result;
}

function shiftDecrypt() {
    const text = document.getElementById('shiftText').value;
    const shift = parseInt(document.getElementById('shiftKey').value) || 0;
    const result = processText(text, char => {
        const code = char.charCodeAt(0);
        const base = char.toLowerCase() === char ? 97 : 65;
        return String.fromCharCode(mod((code - base - shift), 26) + base);
    });
    document.getElementById('shiftResult').textContent = result;
}

function shiftBruteForce() {
    const text = document.getElementById('shiftText').value;
    const grid = document.getElementById('shiftBruteForceGrid');
    grid.innerHTML = '';
    
    for (let shift = 0; shift < 26; shift++) {
        const result = processText(text, char => {
            const code = char.charCodeAt(0);
            const base = char.toLowerCase() === char ? 97 : 65;
            return String.fromCharCode(mod((code - base - shift), 26) + base);
        });
        
        const item = document.createElement('div');
        item.className = 'result-item';
        item.innerHTML = `<strong>Shift ${shift}:</strong> ${result}`;
        grid.appendChild(item);
    }
}

// Affine Cipher Functions
function gcd(a, b) {
    if (b === 0) return a;
    return gcd(b, a % b);
}

function modInverse(a, m) {
    a = mod(a, m);
    for (let x = 1; x < m; x++) {
        if (mod(a * x, m) === 1) return x;
    }
    return 1;
}

function affineEncrypt() {
    const text = document.getElementById('affineText').value;
    const a = parseInt(document.getElementById('keyA').value) || 1;
    const b = parseInt(document.getElementById('keyB').value) || 0;
    
    if (gcd(a, 26) !== 1) {
        alert('Key A must be coprime with 26 (gcd(a,26) = 1)');
        return;
    }
    
    const result = processText(text, char => {
        const code = char.charCodeAt(0);
        const base = char.toLowerCase() === char ? 97 : 65;
        const x = code - base;
        return String.fromCharCode(mod(a * x + b, 26) + base);
    });
    document.getElementById('affineResult').textContent = result;
}

function affineDecrypt() {
    const text = document.getElementById('affineText').value;
    const a = parseInt(document.getElementById('keyA').value) || 1;
    const b = parseInt(document.getElementById('keyB').value) || 0;
    
    if (gcd(a, 26) !== 1) {
        alert('Key A must be coprime with 26 (gcd(a,26) = 1)');
        return;
    }
    
    const aInv = modInverse(a, 26);
    const result = processText(text, char => {
        const code = char.charCodeAt(0);
        const base = char.toLowerCase() === char ? 97 : 65;
        const y = code - base;
        return String.fromCharCode(mod(aInv * (y - b), 26) + base);
    });
    document.getElementById('affineResult').textContent = result;
}

function affineBruteForce() {
    const text = document.getElementById('affineText').value;
    const grid = document.getElementById('affineBruteForceGrid');
    grid.innerHTML = '';
    
    const validAValues = [1, 3, 5, 7, 9, 11, 15, 17, 19, 21, 23, 25];
    
    for (const a of validAValues) {
        for (let b = 0; b < 26; b++) {
            const aInv = modInverse(a, 26);
            const result = processText(text, char => {
                const code = char.charCodeAt(0);
                const base = char.toLowerCase() === char ? 97 : 65;
                const y = code - base;
                return String.fromCharCode(mod(aInv * (y - b), 26) + base);
            });
            
            const item = document.createElement('div');
            item.className = 'result-item';
            item.innerHTML = `<strong>a=${a}, b=${b}:</strong> ${result}`;
            grid.appendChild(item);
        }
    }
}

// Transposition Cipher Functions
function transpositionEncrypt() {
    const text = document.getElementById('transpositionText').value;
    const key = document.getElementById('transpositionKey').value;
    
    if (!key) {
        alert('Please enter a keyword');
        return;
    }
    
    // Remove non-alphanumeric characters from key and convert to uppercase
    const cleanKey = key.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
    const keyOrder = getKeyOrder(cleanKey);
    
    const cols = keyOrder.length;
    const rows = Math.ceil(text.length / cols);
    
    // Create grid and fill with text
    let grid = Array(rows).fill().map(() => Array(cols).fill(''));
    let index = 0;
    
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            if (index < text.length) {
                grid[i][j] = text[index++];
            }
        }
    }
    
    // Read columns in key order
    let result = '';
    for (const col of keyOrder) {
        for (let row = 0; row < rows; row++) {
            result += grid[row][col];
        }
    }
    
    document.getElementById('transpositionResult').textContent = result;
}

function transpositionDecrypt() {
    const text = document.getElementById('transpositionText').value;
    const key = document.getElementById('transpositionKey').value;
    
    if (!key) {
        alert('Please enter a keyword');
        return;
    }
    
    const cleanKey = key.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
    const keyOrder = getKeyOrder(cleanKey);
    
    const cols = keyOrder.length;
    const rows = Math.ceil(text.length / cols);
    
    // Create grid
    let grid = Array(rows).fill().map(() => Array(cols).fill(''));
    let index = 0;
    
    // Fill grid column-wise in key order
    for (const col of keyOrder) {
        for (let row = 0; row < rows; row++) {
            if (index < text.length) {
                grid[row][col] = text[index++];
            }
        }
    }
    
    // Read row-wise
    let result = '';
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            result += grid[row][col];
        }
    }
    
    document.getElementById('transpositionResult').textContent = result;
}

function getKeyOrder(key) {
    // Create array of objects with character and original position
    const keyChars = key.split('').map((char, index) => ({
        char,
        originalIndex: index
    }));
    
    // Sort by character (case-insensitive)
    keyChars.sort((a, b) => a.char.localeCompare(b.char));
    
    // Create order array with original column indices in sorted order
    const order = [];
    const seen = new Set();
    
    for (const item of keyChars) {
        // For duplicate characters, maintain original order
        if (seen.has(item.char)) {
            order.push(item.originalIndex);
        } else {
            seen.add(item.char);
            order.push(item.originalIndex);
        }
    }
    
    return order;
}

// RSA Functions
function isPrime(num) {
    if (num <= 1) return false;
    if (num <= 3) return true;
    if (num % 2 === 0 || num % 3 === 0) return false;
    
    let i = 5;
    while (i * i <= num) {
        if (num % i === 0 || num % (i + 2) === 0) return false;
        i += 6;
    }
    return true;
}

function rsaGenerateKeys() {
    const p = parseInt(document.getElementById('rsaP').value);
    const q = parseInt(document.getElementById('rsaQ').value);
    
    if (!isPrime(p) || !isPrime(q)) {
        alert('Both p and q must be prime numbers');
        return;
    }
    
    if (p === q) {
        alert('p and q must be different prime numbers');
        return;
    }
    
    const n = p * q;
    const phi = (p - 1) * (q - 1);
    
    // Find e (public key exponent)
    let e = 65537; // Common choice for e
    if (e >= phi || gcd(e, phi) !== 1) {
        // Find a smaller e that's coprime with phi
        e = 3;
        while (e < phi && gcd(e, phi) !== 1) {
            e += 2;
        }
    }
    
    // Find d (private key exponent)
    const d = modInverse(e, phi);
    
    // Display keys
    document.getElementById('rsaPublicKey').textContent = `(${e}, ${n})`;
    document.getElementById('rsaPrivateKey').textContent = `(${d}, ${n})`;
    
    // Fill encryption fields with public key
    document.getElementById('rsaEncryptE').value = e;
    document.getElementById('rsaEncryptN').value = n;
    
    // Fill decryption fields with private key
    document.getElementById('rsaDecryptD').value = d;
    document.getElementById('rsaDecryptN').value = n;
}

function rsaEncrypt() {
    const text = document.getElementById('rsaEncryptText').value;
    const e = parseInt(document.getElementById('rsaEncryptE').value);
    const n = parseInt(document.getElementById('rsaEncryptN').value);
    
    if (!e || !n) {
        alert('Please generate keys first or enter valid e and n values');
        return;
    }
    
    const result = [];
    for (let i = 0; i < text.length; i++) {
        const charCode = text.charCodeAt(i);
        const encrypted = mod(Math.pow(charCode, e), n);
        result.push(encrypted);
    }
    
    document.getElementById('rsaEncryptResult').textContent = result.join(' ');
}

function rsaDecrypt() {
    const ciphertext = document.getElementById('rsaDecryptText').value;
    const d = parseInt(document.getElementById('rsaDecryptD').value);
    const n = parseInt(document.getElementById('rsaDecryptN').value);
    
    if (!d || !n) {
        alert('Please generate keys first or enter valid d and n values');
        return;
    }
    
    const numbers = ciphertext.split(/\s+/).map(num => parseInt(num));
    let result = '';
    
    for (const num of numbers) {
        if (isNaN(num)) continue;
        const decrypted = mod(Math.pow(num, d), n);
        result += String.fromCharCode(decrypted);
    }
    
    document.getElementById('rsaDecryptResult').textContent = result;
}
