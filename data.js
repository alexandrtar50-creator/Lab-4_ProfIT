// Початкові дані
function getStartData() {
  return {
    books: [
      {id: 1, title: "Кобзар", author: "Тарас Шевченко", genre: "Поезія", year: 1840, pages: 352, copies: 3, shelf: "A-1"},
      {id: 2, title: "Тигролови", author: "Іван Багряний", genre: "Роман", year: 1944, pages: 288, copies: 2, shelf: "A-2"},
      {id: 3, title: "Лісова пісня", author: "Леся Українка", genre: "Драма", year: 1911, pages: 160, copies: 2, shelf: "A-1"},
      {id: 4, title: "Захар Беркут", author: "Іван Франко", genre: "Повість", year: 1883, pages: 224, copies: 1, shelf: "A-3"},
      {id: 5, title: "Сад Гетсиманський", author: "Іван Багряний", genre: "Роман", year: 1950, pages: 512, copies: 1, shelf: "A-2"},
      {id: 6, title: "Кайдашева сім'я", author: "Іван Нечуй-Левицький", genre: "Повість", year: 1879, pages: 192, copies: 4, shelf: "B-1"}
    ],

    readers: [
      {id: 1, name: "Олійник Марта Ігорівна", birth: "2003-04-11", phone: "+380 50 123-45-67", email: "marta.oliinyk@example.com", address: "вул. Шевченка, 12, кв. 5", registered: "2024-09-02", category: "Студент"},
      {id: 2, name: "Захарченко Богдан Сергійович", birth: "1965-08-23", phone: "+380 66 222-33-44", email: "bzakh@example.com", address: "вул. Франка, 3", registered: "2019-03-15", category: "Викладач"},
      {id: 3, name: "Литвин Софія Олегівна", birth: "2011-12-01", phone: "+380 97 555-66-77", email: "sofia.lytvyn@example.com", address: "просп. Миру, 40, кв. 18", registered: "2023-01-20", category: "Школяр"},
      {id: 4, name: "Кузьменко Василь Петрович", birth: "1950-02-14", phone: "+380 63 888-99-00", email: "kuzmenko.vp@example.com", address: "вул. Садова, 7", registered: "2015-06-10", category: "Пенсіонер"},
      {id: 5, name: "Гнатюк Роман Андрійович", birth: "1998-07-30", phone: "+380 93 111-22-33", email: "r.hnatiuk@example.com", address: "вул. Лесі Українки, 25, кв. 3", registered: "2026-02-05", category: "Інше"}
    ],

     // зв'язок
    loans: [
      {id: 1, book: 1, reader: 1, given: "2026-10-01", days: 14, returned: true, librarian: "Ковальчук Н."},
      {id: 2, book: 2, reader: 3, given: "2026-10-10", days: 21, returned: false, librarian: "Ковальчук Н."},
      {id: 3, book: 4, reader: 2, given: "2026-09-20", days: 30, returned: false, librarian: "Петрук О."},
      {id: 4, book: 3, reader: 1, given: "2026-10-15", days: 14, returned: false, librarian: "Петрук О."},
      {id: 5, book: 6, reader: 4, given: "2026-08-25", days: 30, returned: true, librarian: "Ковальчук Н."},
      {id: 6, book: 2, reader: 5, given: "2026-10-20", days: 14, returned: false, librarian: "Петрук О."}
    ]
  }
}
