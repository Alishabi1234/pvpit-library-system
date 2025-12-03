// Initialize data from localStorage or create empty arrays
let books = JSON.parse(localStorage.getItem('books')) || [];
let issuedBooks = JSON.parse(localStorage.getItem('issuedBooks')) || [];
let currentUser = null;

// Login Function
function login() {
    const userType = document.getElementById('userType').value;
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    if (username === '' || password === '') {
        showMessage('loginMessage', 'Please enter username and password', 'error');
        return;
    }
    
    // Simple login validation (you can enhance this)
    if (password.length >= 4) {
        currentUser = {
            type: userType,
            username: username
        };
        
        document.getElementById('welcomeMsg').textContent = `Welcome, ${username} (${userType})`;
        showPage('dashboard');
    } else {
        showMessage('loginMessage', 'Invalid credentials', 'error');
    }
}

// Logout Function
function logout() {
    currentUser = null;
    document.getElementById('username').value = '';
    document.getElementById('password').value = '';
    showPage('loginPage');
}

// Show/Hide Pages
function showPage(pageId) {
    const pages = ['loginPage', 'dashboard', 'addBook', 'issueBook', 'returnBook', 'searchBook', 'bookHolders', 'allBooks'];
    
    pages.forEach(page => {
        document.getElementById(page).classList.add('hidden');
    });
    
    document.getElementById(pageId).classList.remove('hidden');
    
    // Load data for specific pages
    if (pageId === 'allBooks') {
        displayAllBooks();
    } else if (pageId === 'bookHolders') {
        displayBookHolders();
    }
}

// Add Book Function
function submitBook() {
    const bookId = document.getElementById('bookId').value;
    const bookName = document.getElementById('bookName').value;
    const author = document.getElementById('author').value;
    const edition = document.getElementById('edition').value;
    const price = document.getElementById('price').value;
    const quantity = document.getElementById('quantity').value;
    const isbn = document.getElementById('isbn').value;
    
    if (!bookId || !bookName || !author || !edition || !price || !quantity || !isbn) {
        showMessage('addBookMessage', 'Please fill all fields', 'error');
        return;
    }
    
    // Check if book ID already exists
    const existingBook = books.find(b => b.bookId === bookId);
    if (existingBook) {
        showMessage('addBookMessage', 'Book ID already exists', 'error');
        return;
    }
    
    const book = {
        bookId,
        bookName,
        author,
        edition,
        price,
        quantity,
        isbn,
        available: quantity
    };
    
    books.push(book);
    localStorage.setItem('books', JSON.stringify(books));
    
    showMessage('addBookMessage', 'Data has been submitted successfully!', 'success');
    
    // Clear form
    document.getElementById('bookId').value = '';
    document.getElementById('bookName').value = '';
    document.getElementById('author').value = '';
    document.getElementById('edition').value = '';
    document.getElementById('price').value = '';
    document.getElementById('quantity').value = '';
    document.getElementById('isbn').value = '';
}

// Issue Book Function
function submitIssueBook() {
    const bookId = document.getElementById('issueBookId').value;
    const bookName = document.getElementById('issueBookName').value;
    const studentRoll = document.getElementById('studentRoll').value;
    const studentName = document.getElementById('studentName').value;
    const course = document.getElementById('course').value;
    const subject = document.getElementById('subject').value;
    const issueDate = document.getElementById('issueDate').value;
    const returnDate = document.getElementById('returnDate').value;
    
    if (!bookId || !bookName || !studentRoll || !studentName || !course || !subject || !issueDate || !returnDate) {
        showMessage('issueBookMessage', 'Please fill all fields', 'error');
        return;
    }
    
    // Check if book exists
    const book = books.find(b => b.bookId === bookId && b.bookName === bookName);
    if (!book) {
        showMessage('issueBookMessage', 'Book ID and Book Name do not match or book not found', 'error');
        return;
    }
    
    // Check if book is available
    if (book.available <= 0) {
        showMessage('issueBookMessage', 'Book is not available', 'error');
        return;
    }
    
    const issuedBook = {
        bookId,
        bookName,
        studentRoll,
        studentName,
        course,
        subject,
        issueDate,
        returnDate,
        status: 'issued'
    };
    
    issuedBooks.push(issuedBook);
    
    // Update book availability
    book.available--;
    
    localStorage.setItem('books', JSON.stringify(books));
    localStorage.setItem('issuedBooks', JSON.stringify(issuedBooks));
    
    showMessage('issueBookMessage', 'Book issued successfully!', 'success');
    
    // Clear form
    document.getElementById('issueBookId').value = '';
    document.getElementById('issueBookName').value = '';
    document.getElementById('studentRoll').value = '';
    document.getElementById('studentName').value = '';
    document.getElementById('course').value = '';
    document.getElementById('subject').value = '';
    document.getElementById('issueDate').value = '';
    document.getElementById('returnDate').value = '';
}

// Return Book Function
function submitReturnBook() {
    const bookId = document.getElementById('returnBookId').value;
    const studentRoll = document.getElementById('returnStudentRoll').value;
    const actualReturnDate = document.getElementById('actualReturnDate').value;
    
    if (!bookId || !studentRoll || !actualReturnDate) {
        showMessage('returnBookMessage', 'Please fill all fields', 'error');
        return;
    }
    
    // Find issued book
    const issuedBookIndex = issuedBooks.findIndex(
        b => b.bookId === bookId && b.studentRoll === studentRoll && b.status === 'issued'
    );
    
    if (issuedBookIndex === -1) {
        showMessage('returnBookMessage', 'No matching issued book found', 'error');
        return;
    }
    
    // Update status
    issuedBooks[issuedBookIndex].status = 'returned';
    issuedBooks[issuedBookIndex].actualReturnDate = actualReturnDate;
    
    // Update book availability
    const book = books.find(b => b.bookId === bookId);
    if (book) {
        book.available++;
    }
    
    localStorage.setItem('books', JSON.stringify(books));
    localStorage.setItem('issuedBooks', JSON.stringify(issuedBooks));
    
    showMessage('returnBookMessage', 'Book has been returned successfully!', 'success');
    
    // Clear form
    document.getElementById('returnBookId').value = '';
    document.getElementById('returnStudentRoll').value = '';
    document.getElementById('actualReturnDate').value = '';
}

// Search Books Function
function searchBooks() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    
    if (!searchTerm) {
        showMessage('searchResults', 'Please enter search term', 'error');
        return;
    }
    
    const results = books.filter(book => 
        book.bookId.toLowerCase().includes(searchTerm) ||
        book.bookName.toLowerCase().includes(searchTerm) ||
        book.author.toLowerCase().includes(searchTerm) ||
        book.isbn.toLowerCase().includes(searchTerm)
    );
    
    const resultsDiv = document.getElementById('searchResults');
    
    if (results.length === 0) {
        resultsDiv.innerHTML = '<div class="no-data">No books found</div>';
        return;
    }
    
    let html = '<table><thead><tr><th>Book ID</th><th>Book Name</th><th>Author</th><th>Edition</th><th>Price</th><th>Quantity</th><th>Available</th><th>ISBN</th></tr></thead><tbody>';
    
    results.forEach(book => {
        html += `<tr>
            <td>${book.bookId}</td>
            <td>${book.bookName}</td>
            <td>${book.author}</td>
            <td>${book.edition}</td>
            <td>₹${book.price}</td>
            <td>${book.quantity}</td>
            <td>${book.available}</td>
            <td>${book.isbn}</td>
        </tr>`;
    });
    
    html += '</tbody></table>';
    resultsDiv.innerHTML = html;
}

// Display Book Holders
function displayBookHolders() {
    const holdersDiv = document.getElementById('holdersTable');
    
    const currentlyIssued = issuedBooks.filter(book => book.status === 'issued');
    
    if (currentlyIssued.length === 0) {
        holdersDiv.innerHTML = '<div class="no-data">No books currently issued</div>';
        return;
    }
    
    let html = '<table><thead><tr><th>Student Roll</th><th>Student Name</th><th>Book ID</th><th>Book Name</th><th>Course</th><th>Subject</th><th>Issue Date</th><th>Return Date</th></tr></thead><tbody>';
    
    currentlyIssued.forEach(book => {
        html += `<tr>
            <td>${book.studentRoll}</td>
            <td>${book.studentName}</td>
            <td>${book.bookId}</td>
            <td>${book.bookName}</td>
            <td>${book.course}</td>
            <td>${book.subject}</td>
            <td>${book.issueDate}</td>
            <td>${book.returnDate}</td>
        </tr>`;
    });
    
    html += '</tbody></table>';
    holdersDiv.innerHTML = html;
}

// Display All Books
function displayAllBooks() {
    const allBooksDiv = document.getElementById('allBooksTable');
    
    if (books.length === 0) {
        allBooksDiv.innerHTML = '<div class="no-data">No books in library</div>';
        return;
    }
    
    let html = '<table><thead><tr><th>Book ID</th><th>Book Name</th><th>Author</th><th>Edition</th><th>Price</th><th>Total Quantity</th><th>Available</th><th>ISBN</th></tr></thead><tbody>';
    
    books.forEach(book => {
        html += `<tr>
            <td>${book.bookId}</td>
            <td>${book.bookName}</td>
            <td>${book.author}</td>
            <td>${book.edition}</td>
            <td>₹${book.price}</td>
            <td>${book.quantity}</td>
            <td>${book.available}</td>
            <td>${book.isbn}</td>
        </tr>`;
    });
    
    html += '</tbody></table>';
    allBooksDiv.innerHTML = html;
}

// Show Message Function
function showMessage(elementId, message, type) {
    const element = document.getElementById(elementId);
    element.innerHTML = `<div class="message ${type}">${message}</div>`;
    
    setTimeout(() => {
        element.innerHTML = '';
    }, 3000);
}

// Set today's date as default for date inputs
window.onload = function() {
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('issueDate').value = today;
    document.getElementById('actualReturnDate').value = today;
}