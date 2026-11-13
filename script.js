// Дані
let books = []
let readers = []
let loans = []

// Колонки 
const columns = {
  books: [["id", "№"], ["title", "Назва"], ["author", "Автор"], ["genre", "Жанр"], ["year", "Рік видання"], ["pages", "Сторінок"], ["copies", "Примірників"], ["free", "Вільно"], ["shelf", "Полиця"]],
  readers: [["id", "№"], ["name", "ПІБ"], ["birth", "Дата народження"], ["phone", "Телефон"], ["email", "Email"], ["address", "Адреса"], ["registered", "Дата реєстрації"], ["category", "Категорія"], ["onHands", "Книг на руках"]],
  loans: [["id", "№"], ["book", "Книга"], ["reader", "Читач"], ["given", "Дата видачі"], ["days", "Термін, днів"], ["back", "Повернути до"], ["returned", "Повернено"], ["librarian", "Бібліотекар"]]
}

const genres = ["Роман", "Повість", "Поезія", "Драма", "Детектив", "Фантастика", "Наукова"]
const categories = ["Студент", "Школяр", "Викладач", "Пенсіонер", "Інше"]

// Поля та тип вводу :
const fields = {
  books: {title: "text", author: "text", genre: genres, year: "number", pages: "number", copies: "number", shelf: "text"},
  readers: {name: "text", birth: "date", phone: "tel", email: "email", address: "text", registered: "date", category: categories},
  loans: {book: "books", reader: "readers", given: "date", days: "number", returned: "check", librarian: "text"}
}

// Назви таблиць
const tabNames = ["books", "readers", "loans"]

// Сьогоднішня дата 
function todayIso() {
  const d = new Date()
  return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0")
}

const today = todayIso()

// Дані з localStorage або початкові дані з data.js
function load(name) {
  const s = localStorage.getItem("lib_" + name)
  if (s) {
    try {
      return JSON.parse(s)
    } catch (e) {
      console.log("не вдалося прочитати lib_" + name)
    }
  }
  return getStartData()[name]
}

// Зберігає таблицю в localStorage 
function save(name) {
  localStorage.setItem("lib_" + name, JSON.stringify(getData(name)))
}

// Повертає масив даних 
function getData(name) {
  if (name == "books") return books
  if (name == "readers") return readers
  return loans
}

// Замінює масив даних 
function setData(name, arr) {
  if (name == "books") books = arr
  if (name == "readers") readers = arr
  if (name == "loans") loans = arr
}

// Перетворює дату 
function dateUa(iso) {
  return iso.split("-").reverse().join(".")
}

// Додає до дати n днів 
function addDays(iso, n) {
  const d = new Date(iso)
  d.setUTCDate(d.getUTCDate() + Number(n))
  return d.toISOString().slice(0, 10)
}

// Скільки примірників 
function freeCopies(bookId) {
  const book = books.find(b => b.id == bookId)
  if (!book) return 0
  return book.copies - loans.filter(l => l.book == bookId && !l.returned).length
}

// Скільки книг у читача
function onHands(readerId) {
  return loans.filter(l => l.reader == readerId && !l.returned).length
}

// Новий id 
function nextId(arr) {
  if (arr.length == 0) return 1
  return Math.max(...arr.map(r => r.id)) + 1
}

// Показати у комірці 
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
  // дата повернення = дата видачі + термін, якщо книгу вчасно не повернули - позначаємо це
  if (key == "back") {
    const d = addDays(row.given, row.days)
    if (!row.returned && d < today) return dateUa(d) + " (прострочено)"
    return dateUa(d)
  }
  if (key == "returned") return row.returned ? "так" : "ні"
  if (key == "birth" || key == "registered" || key == "given") return dateUa(row[key])
  return row[key]
}

// Створює поле вводу потрібного типу, поле - key, таблиця - name.
function makeInput(name, key, value) {
  const type = fields[name][key]
  let el
  if (Array.isArray(type)) {
    el = document.createElement("select")
    type.forEach(t => el.add(new Option(t, t)))
  } else if (type == "books" || type == "readers") {
    el = document.createElement("select")
    // варіанти беремо з іншої таблиці: текст - назва книги або ПІБ, значення - id
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
  // запам'ятовуємо, яке це поле, щоб потім знайти його значення
  el.dataset.key = key
  return el
}

// Перетворює текст з поля вводу в потрібний тип 
function convertValue(name, key, v) {
  const type = fields[name][key]
  if (type == "number" || type == "books" || type == "readers") return Number(v)
  return v
}

// Повертає текст помилки або порожній рядок, якщо все добре
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
    // примірників не може стати менше, ніж зараз видано читачам
    if (key == "copies" && row) {
      const out = row.copies - freeCopies(row.id)
      if (n < out) return "Зараз видано " + out + " прим., менше бути не може"
    }
  }
  if (type == "email" && (v.indexOf("@") < 1 || v.indexOf(".") == -1)) return "Неправильний email"
  if (key == "birth" && v > today) return "Дата народження не може бути в майбутньому"
  // при зміні книги у видачі перевіряємо, чи є вільний примірник
  if (key == "book" && row && !row.returned && Number(v) != row.book && freeCopies(Number(v)) <= 0) return "Усі примірники цієї книги вже видані"
  return ""
}

// Рядок для додавання нового запису 
function addRow(name) {
  const tr = document.createElement("tr")
  columns[name].forEach(col => {
    const td = document.createElement("td")
    if (fields[name][col[0]]) {
      let def
      // значення за замовчуванням
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

// Натиснули "Додати"
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
  // перевірка - примірники вже на руках?
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

// Видалення запису
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
  // лишаємо всі записи, крім видаленого
  setData(name, getData(name).filter(r => r.id != id))
  save(name)
  drawAll()
}

// Редагування комірки
function startEdit(td, name, row, key) {
  // поле вже відкрите
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

// Малює таблицю заново з масиву даних
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
  // перший рядок - для додавання
  table.appendChild(addRow(name))
  getData(name).forEach(row => {
    const tr = document.createElement("tr")
    columns[name].forEach(col => {
      const td = document.createElement("td")
      td.textContent = showValue(name, row, col[0])
      if (fields[name][col[0]]) {
        // цю комірку можна редагувати
        td.title = "Клікніть, щоб змінити"
        td.addEventListener("click", () => startEdit(td, name, row, col[0]))
      }
      tr.appendChild(td)
    })
    const td = document.createElement("td")
    const btn = document.createElement("button")
    // кнопка видалення в кінці рядка
    btn.textContent = "✕"
    btn.title = "Видалити"
    btn.addEventListener("click", () => removeRow(name, row.id))
    td.appendChild(btn)
    tr.appendChild(td)
    table.appendChild(tr)
  })
}

// Перемальовує всі таблиці 
function drawAll() {
  tabNames.forEach(drawTable)
}

// Вибрана таблиця - і ховає інші
function openTab(name) {
  tabNames.forEach(t => {
    document.getElementById("sec-" + t).hidden = t != name
    document.getElementById("tab-" + t).disabled = t == name
  })
}

// Головна - Початкові дані - data.js
function main() {
    if (typeof getStartData != "function") {
    alert("Не знайдено data.js. Його розмістіть в одну папку з index.html і підключіть перед script.js")
    return
  }

  // Беремо дані з localStorage, а якщо проблеми - початкові з data.js
  books = load("books")
  readers = load("readers")
  loans = load("loans")

  // Клік по кнопці таба 
  tabNames.forEach(t => {
    document.getElementById("tab-" + t).addEventListener("click", () => openTab(t))
  })

  // видаляємо збережене і перезавантажуємо 
  document.getElementById("reset").addEventListener("click", () => {
    if (!confirm("Видалити всі збережені зміни і повернути початкові дані?")) return
    tabNames.forEach(t => localStorage.removeItem("lib_" + t))
    location.reload()
  })

  
  // Перемальовуємо таблиці
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

  // Малюємо
  drawAll()
  openTab("books")
}

// Запуск
if (document.readyState == "loading") {
  document.addEventListener("DOMContentLoaded", main)
} else {
  main()
}
