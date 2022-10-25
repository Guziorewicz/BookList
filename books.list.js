window.onload = function() {
    console.log("App started");
    booksList.init();
}; // funkcja początkowa informująca o załadowaniu strony i uruchomieniu funkcji init na klasie bookslist

class Book {
    constructor (title, author) {
        this.title = title;
        this.author = author;
        this.id = Date.now(); //timestamp
    }
}  // tworzy klasę ksiązki 

class BooksList {
    constructor () {
        this.books = [];
    } // tworzy klasę listy książek

    init() {
        document.getElementById("saveButton").addEventListener("click",
        (e) => this.saveButton(e));

        this.loadDataFromStorage();
    } // tworzy funkcję init która zapisuje do listy pozycje po wciśnięciu "zapisz"
    

    loadDataFromStorage() {
        const data = storage.getItems();
        if (data == null || data == undefined) return;

        this.books = data;

        data.forEach((value, index) => {
            ui.addBookToTable(value);
        });
    } // tworzy funckję która ładuje dane zapisane w pamięci


    saveButton(e) {
        console.log("save button");
        const author = document.getElementById("bookAuthor").value;
        const title = document.getElementById("bookTitle").value;

        if(author === "" || title === "") {
            console.log("blank data");
            return;
        }
        e.preventDefault(); // nie wysyłaj formularza na server
        const book = new Book(title, author); // tworzy nową instancję obiektu book
        this.addBook(book);
    } // tworzy funkcjonalność przycisku "save" która zbiera dane z formularza i przypisuje je do instancji obiektu Book, w przypadku nie wpisania wszystkich danych, instrukcja if zwróci błąd

 addBook(book) {
     this.books.push(book);
     ui.addBookToTable(book);
     this.saveData();
 } // dodaje książkę do ui i zapisuje


 removeBookById(bookId) {
    this.books.forEach((el, index) => {
        if(el.id == bookId) this.books.splice(index, 1);
    });
    this.saveData();
} // usuwa książkę z listy

moveBookDown(bookId){
    let arr = this.books;
    for(let a=0; a < arr.length; a++) {
        let el = arr[a];
        if(el.id == bookId) {
            if (a <= arr.length -2) {
                let temp = arr[a+1];
                arr[a+1] = arr[a];
                arr[a]= temp;
                break;
            }
        }
    }
    this.saveData();
    ui.deleteAllBookRows();
    this.loadDataFromStorage();
    
}; // funkcja przesuwa książkę na liście 

moveBookUp(bookId){
    let arr = this.books;
    for(let a=0; a < arr.length; a++) {
        let el = arr[a];
        if(el.id == bookId) {
            if (a >=1) {
                let temp = arr[a-1];
                arr[a-1] = arr[a];
                arr[a]= temp;
                break;
            }
        }
    }
    this.saveData();
    ui.deleteAllBookRows();
    this.loadDataFromStorage();
}; // funkcja przesuwa książkę na liście 

 saveData () {
     storage.saveItems(this.books);
 } // zapisuje dane

} 

const booksList = new BooksList();

class Ui {

    deleteBook(e){
        const bookId = e.target.getAttribute("data-book-id");
        e.target.parentElement.parentElement.remove();
        booksList.removeBookById(bookId);
    } // usuwa książkę z wywołania akcji w tabeli

    deleteAllBookRows() {
        const tbodyRows = document.querySelectorAll("#booksTable tbody tr");

        tbodyRows.forEach(function(el){
            el.remove();
        });
    } // funkcja pomocnicza do przesuwania pozycji na liście, usuwa dane które potem są odświeżane z pamięci

    addBookToTable(book) {
        const tbody = document.querySelector("#booksTable tbody");
        const tr = document.createElement("tr");

        tr.innerHTML = `
        <td> ${book.title} </td>
        <td> ${book.author} </td>
        <td> 
            <button type="button" data-book-id="${book.id}"
            class="btn btn-danger btn-sm delete" > Skasuj </button>

            <button type="button" data-book-id="${book.id}"
            class="btn btn-secondary btn-sm up-arrow" > ⟰ </button>

            <button type="button" data-book-id="${book.id}"
            class="btn btn-secondary btn-sm down-arrow" > ⟱ </button>
        </td>
        `;

        tbody.appendChild(tr);

        let deleteButton = document.querySelector(`button.delete[data-book-id='${book.id}']`);
        deleteButton.addEventListener("click", (e) => this.deleteBook(e));

        let upButton = document.querySelector(`button.up-arrow[data-book-id='${book.id}']`);
        upButton.addEventListener("click", (e) => this.arrowUp(e));

        let downButton = document.querySelector(`button.down-arrow[data-book-id='${book.id}']`);
        downButton.addEventListener("click", (e) => this.arrowDown(e));

        this.clearForm();
    } // dodaje pozycje do tabeli, uzupełnia tabelę o ciało z wpisanymi wartościami i dodaje przyciski akcji


    arrowUp(e) {
        let bookId =e.target.getAttribute("data-book-id");
        console.log("up", bookId);
        booksList.moveBookUp(bookId);
    } // opis przycisku up

    arrowDown(e) {
        let bookId =e.target.getAttribute("data-book-id");
        console.log("down", bookId);
        booksList.moveBookDown(bookId);
    } // opis przycisku down


    clearForm() {
        document.getElementById("bookTitle").value = "";
        document.getElementById("bookAuthor").value = "";

        document.getElementById("bookForm").classList.remove("was-validated");
    } // czyszczenie wartości z formularza 

}

const ui = new Ui();

class Storage {

    getItems () {
        let books = null;
        if (localStorage.getItem("books") !== null) {
            books = JSON.parse(localStorage.getItem("books"));
        } else {
            books =[];
        }
        return books;
    }
    saveItems(books) {
        localStorage.setItem("books", JSON.stringify(books));
    }
} // klasa z pamięcią i dwie funckje, jedna do wyświetlania a druga do zapamiętania danych

const storage = new Storage();

// Gotowy kod z Bootstrapu do validacji danych
// Example starter JavaScript for disabling form submissions if there are invalid fields
(function () {
    'use strict'
  
    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    var forms = document.querySelectorAll('.needs-validation')
  
    // Loop over them and prevent submission
    Array.prototype.slice.call(forms)
      .forEach(function (form) {
        form.addEventListener('submit', function (event) {
          if (!form.checkValidity()) {
            event.preventDefault()
            event.stopPropagation()
          }
  
          form.classList.add('was-validated')
        }, false)
      })
  })()