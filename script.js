const startBooks = [
  {id: 1, title: "Кобзар", author: "Тарас Шевченко", genre: "Поезія", year: 1840, pages: 352, copies: 3, shelf: "A-1"},
  {id: 2, title: "Тигролови", author: "Іван Багряний", genre: "Роман", year: 1944, pages: 288, copies: 2, shelf: "A-2"},
  {id: 3, title: "Лісова пісня", author: "Леся Українка", genre: "Драма", year: 1911, pages: 160, copies: 2, shelf: "A-1"},
  {id: 4, title: "Захар Беркут", author: "Іван Франко", genre: "Повість", year: 1883, pages: 224, copies: 1, shelf: "A-3"},
  {id: 5, title: "Сад Гетсиманський", author: "Іван Багряний", genre: "Роман", year: 1950, pages: 512, copies: 1, shelf: "A-2"},
  {id: 6, title: "Кайдашева сім'я", author: "Іван Нечуй-Левицький", genre: "Повість", year: 1879, pages: 192, copies: 4, shelf: "B-1"}
]

const startReaders = [
  {id: 1, name: "Олійник Марта Ігорівна", birth: "2003-04-11", phone: "+380 50 123-45-67", email: "marta.oliinyk@example.com", address: "вул. Шевченка, 12, кв. 5", registered: "2024-09-02", category: "Студент"},
  {id: 2, name: "Захарченко Богдан Сергійович", birth: "1965-08-23", phone: "+380 66 222-33-44", email: "bzakh@example.com", address: "вул. Франка, 3", registered: "2019-03-15", category: "Викладач"},
  {id: 3, name: "Литвин Софія Олегівна", birth: "2011-12-01", phone: "+380 97 555-66-77", email: "sofia.lytvyn@example.com", address: "просп. Миру, 40, кв. 18", registered: "2023-01-20", category: "Школяр"},
  {id: 4, name: "Кузьменко Василь Петрович", birth: "1950-02-14", phone: "+380 63 888-99-00", email: "kuzmenko.vp@example.com", address: "вул. Садова, 7", registered: "2015-06-10", category: "Пенсіонер"},
  {id: 5, name: "Гнатюк Роман Андрійович", birth: "1998-07-30", phone: "+380 93 111-22-33", email: "r.hnatiuk@example.com", address: "вул. Лесі Українки, 25, кв. 3", registered: "2026-02-05", category: "Інше"}
]

const startLoans = [
  {id: 1, book: 1, reader: 1, given: "2026-10-01", days: 14, returned: true, librarian: "Ковальчук Н."},
  {id: 2, book: 2, reader: 3, given: "2026-10-10", days: 21, returned: false, librarian: "Ковальчук Н."},
  {id: 3, book: 4, reader: 2, given: "2026-09-20", days: 30, returned: false, librarian: "Петрук О."},
  {id: 4, book: 3, reader: 1, given: "2026-10-15", days: 14, returned: false, librarian: "Петрук О."},
  {id: 5, book: 6, reader: 4, given: "2026-08-25", days: 30, returned: true, librarian: "Ковальчук Н."},
  {id: 6, book: 2, reader: 5, given: "2026-10-20", days: 14, returned: false, librarian: "Петрук О."}
]

let books = load("lib_books", startBooks)
let readers = load("lib_readers", startReaders)
let loans = load("lib_loans", startLoans)

const columns = {
  books: [["id", "№"], ["title", "Назва"], ["author", "Автор"], ["genre", "Жанр"], ["year", "Рік видання"], ["pages", "Сторінок"], ["copies", "Примірників"], ["free", "Вільно"], ["shelf", "Полиця"]],
  readers: [["id", "№"], ["name", "ПІБ"], ["birth", "Дата народження"], ["phone", "Телефон"], ["email", "Email"], ["address", "Адреса"], ["registered", "Дата реєстрації"], ["category", "Категорія"], ["onHands", "Книг на руках"]],
  loans: [["id", "№"], ["book", "Книга"], ["reader", "Читач"], ["given", "Дата видачі"], ["days", "Термін, днів"], ["back", "Повернути до"], ["returned", "Повернено"], ["librarian", "Бібліотекар"]]
}

const genres = ["Роман", "Повість", "Поезія", "Драма", "Детектив", "Фантастика", "Наукова"]
const categories = ["Студент", "Школяр", "Викладач", "Пенсіонер", "Інше"]

const fields = {
  books: {title: "text", author: "text", genre: genres, year: "number", pages: "number", copies: "number", shelf: "text"},
  readers: {name: "text", birth: "date", phone: "tel", email: "email", address: "text", registered: "date", category: categories},
  loans: {book: "books", reader: "readers", given: "date", days: "number", returned: "check", librarian: "text"}
}

const tabNames = ["books", "readers", "loans"]

function todayIso() {
  const d = new Date()
  return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0")
}

const today = todayIso()

function load(key, def) {
  const s = localStorage.getItem(key)
  if (s) {
    try {
      return JSON.parse(s)
    } catch (e) {
      console.log("не вдалося прочитати " + key)
    }
  }
  return JSON.parse(JSON.stringify(def))
}

function save(name) {
  localStorage.setItem("lib_" + name, JSON.stringify(getData(name)))
}

function getData(name) {
  if (name == "books") return books
  if (name == "readers") return readers
  return loans
}

function setData(name, arr) {
  if (name == "books") books = arr
  if (name == "readers") readers = arr
  if (name == "loans") loans = arr
}

function dateUa(iso) {
  return iso.split("-").reverse().join(".")
}

function addDays(iso, n) {
  const d = new Date(iso)
  d.setUTCDate(d.getUTCDate() + Number(n))
  return d.toISOString().slice(0, 10)
}

function freeCopies(bookId) {
  const book = books.find(b => b.id == bookId)
  if (!book) return 0
  return book.copies - loans.filter(l => l.book == bookId && !l.returned).length
}

function onHands(readerId) {
  return loans.filter(l => l.reader == readerId && !l.returned).length
}

function nextId(arr) {
  if (arr.length == 0) return 1
  return Math.max(...arr.map(r => r.id)) + 1
}

function showValue(name, row, key) {
  if (key == "free") return freeCopies(row.id)
  if (key == "onHands") return onHands(row.id)
  if (key == "book") {
    const b = books.find(x => x.id == row.book)
    return b ? b.title : "-"
  }
  if (key == "reader") {
    const r = readers.find(x => x.id == row.reader)
    return r ? r.name : "-"
  }
  if (key == "back") {
    const d = addDays(row.given, row.days)
    if (!row.returned && d < today) return dateUa(d) + " (прострочено)"
    return dateUa(d)
  }
  if (key == "returned") return row.returned ? "так" : "ні"
  if (key == "birth" || key == "registered" || key == "given") return dateUa(row[key])
  return row[key]
}

function makeInput(name, key, value) {
  const type = fields[name][key]
  let el
  if (Array.isArray(type)) {
    el = document.createElement("select")
    type.forEach(t => el.add(new Option(t, t)))
  } else if (type == "books" || type == "readers") {
    el = document.createElement("select")
    getData(type).forEach(r => el.add(new Option(type == "books" ? r.title : r.name, r.id)))
  } else if (type == "check") {
    el = document.createElement("input")
    el.type = "checkbox"
    el.checked = value == true
  } else {
    el = document.createElement("input")
    el.type = type
  }
  if (type != "check" && value !== undefined) el.value = value
  el.dataset.key = key
  return el
}

function convertValue(name, key, v) {
  const type = fields[name][key]
  if (type == "number" || type == "books" || type == "readers") return Number(v)
  return v
}

function checkValue(name, key, v, row) {
  const type = fields[name][key]
  const label = columns[name].find(c => c[0] == key)[1]
  if (type == "check") {
    if (row && row.returned && !v && freeCopies(row.book) <= 0) return "Усі примірники цієї книги вже видані"
    return ""
  }
  if (v === "") return "Заповніть поле \"" + label + "\""
  if (type == "number") {
    const n = Number(v)
    if (!Number.isInteger(n) || n <= 0) return "У полі \"" + label + "\" має бути ціле число більше 0"
    if (key == "year" && n > new Date().getFullYear()) return "Рік видання не може бути більшим за поточний"
    if (key == "copies" && row) {
      const out = row.copies - freeCopies(row.id)
      if (n < out) return "Зараз видано " + out + " прим., менше бути не може"
    }
  }
  if (type == "email" && (v.indexOf("@") < 1 || v.indexOf(".") == -1)) return "Неправильний email"
  if (key == "birth" && v > today) return "Дата народження не може бути в майбутньому"
  if (key == "book" && row && !row.returned && Number(v) != row.book && freeCopies(Number(v)) <= 0) return "Усі примірники цієї книги вже видані"
  return ""
}

function addRow(name) {
  const tr = document.createElement("tr")
  columns[name].forEach(col => {
    const td = document.createElement("td")
    if (fields[name][col[0]]) {
      let def
      if (col[0] == "given" || col[0] == "registered") def = today
      if (col[0] == "days") def = 14
      td.appendChild(makeInput(name, col[0], def))
    } else if (col[0] == "id") {
      td.textContent = "+"
    }
    tr.appendChild(td)
  })
  const td = document.createElement("td")
  const btn = document.createElement("button")
  btn.textContent = "Додати"
  btn.addEventListener("click", () => addRecord(name, tr))
  td.appendChild(btn)
  tr.appendChild(td)
  return tr
}

function addRecord(name, tr) {
  const obj = {}
  const inputs = tr.querySelectorAll("[data-key]")
  for (const el of inputs) {
    const key = el.dataset.key
    const v = el.type == "checkbox" ? el.checked : el.value.trim()
    const err = checkValue(name, key, v, null)
    if (err) {
      alert(err)
      el.focus()
      return
    }
    obj[key] = convertValue(name, key, v)
  }
  if (name == "loans" && !obj.returned && freeCopies(obj.book) <= 0) {
    alert("Усі примірники цієї книги вже видані")
    return
  }
  const arr = getData(name)
  obj.id = nextId(arr)
  arr.push(obj)
  save(name)
  drawAll()
}

function removeRow(name, id) {
  if (name == "books") {
    const used = loans.filter(l => l.book == id).length
    if (used > 0) {
      alert("Цю книгу видалити не можна!\nВона використовується в таблиці \"Видачі\" (записів: " + used + ").\nСпочатку видаліть ці видачі.")
      return
    }
  }
  if (name == "readers") {
    const used = loans.filter(l => l.reader == id).length
    if (used > 0) {
      alert("Цього читача видалити не можна!\nЧитач використовується в таблиці \"Видачі\" (записів: " + used + ").\nСпочатку видаліть ці видачі.")
      return
    }
  }
  if (!confirm("Видалити запис №" + id + "?")) return
  setData(name, getData(name).filter(r => r.id != id))
  save(name)
  drawAll()
}

function startEdit(td, name, row, key) {
  if (td.querySelector("input, select")) return
  const el = makeInput(name, key, row[key])
  td.textContent = ""
  td.appendChild(el)
  el.focus()
  let finished = false
  const finish = ok => {
    if (finished) return
    finished = true
    if (ok) {
      const v = el.type == "checkbox" ? el.checked : el.value.trim()
      const err = checkValue(name, key, v, row)
      if (err) {
        alert(err)
      } else {
        row[key] = convertValue(name, key, v)
        save(name)
      }
    }
    drawAll()
  }
  el.addEventListener("keydown", e => {
    if (e.key == "Enter") finish(true)
    if (e.key == "Escape") finish(false)
  })
  el.addEventListener("blur", () => finish(true))
  if (el.tagName == "SELECT" || el.type == "checkbox") el.addEventListener("change", () => finish(true))
}

function drawTable(name) {
  const table = document.getElementById("table-" + name)
  table.innerHTML = ""
  const head = document.createElement("tr")
  columns[name].forEach(col => {
    const th = document.createElement("th")
    th.textContent = col[1]
    head.appendChild(th)
  })
  head.appendChild(document.createElement("th"))
  table.appendChild(head)
  table.appendChild(addRow(name))
  getData(name).forEach(row => {
    const tr = document.createElement("tr")
    columns[name].forEach(col => {
      const td = document.createElement("td")
      td.textContent = showValue(name, row, col[0])
      if (fields[name][col[0]]) {
        td.title = "Клікніть, щоб змінити"
        td.addEventListener("click", () => startEdit(td, name, row, col[0]))
      }
      tr.appendChild(td)
    })
    const td = document.createElement("td")
    const btn = document.createElement("button")
    btn.textContent = "✕"
    btn.title = "Видалити"
    btn.addEventListener("click", () => removeRow(name, row.id))
    td.appendChild(btn)
    tr.appendChild(td)
    table.appendChild(tr)
  })
}

function drawAll() {
  tabNames.forEach(drawTable)
}

function openTab(name) {
  tabNames.forEach(t => {
    document.getElementById("sec-" + t).hidden = t != name
    document.getElementById("tab-" + t).disabled = t == name
  })
}

tabNames.forEach(t => {
  document.getElementById("tab-" + t).addEventListener("click", () => openTab(t))
})

document.getElementById("reset").addEventListener("click", () => {
  if (!confirm("Видалити всі збережені зміни і повернути початкові дані?")) return
  tabNames.forEach(t => localStorage.removeItem("lib_" + t))
  location.reload()
})

window.addEventListener("storage", e => {
  if (e.key == null) {
    location.reload()
    return
  }
  if (e.key.startsWith("lib_")) {
    if (e.newValue == null) {
      location.reload()
      return
    }
    setData(e.key.slice(4), JSON.parse(e.newValue))
    drawAll()
  }
})

drawAll()
openTab("books")
