var books=[]
var readers=[]
var loans=[]

function getBookTitle(id){
  for(var i=0;i<books.length;i++){
    if(books[i].id==id) return books[i].title
  }
  return ""
}

function getReaderName(id) {
    for (let i = 0; i < readers.length; i++) {
        if (readers[i].id == id) {
            return readers[i].name;
        }
    }
    return "";
}

function getFree(bookId){
    var book=null
    for(var i=0;i<books.length;i++){
        if(books[i].id==bookId) book=books[i]
    }
    if(book==null) return 0
    var taken=0
    for(var i=0;i<loans.length;i++){
        if(loans[i].book==bookId&&loans[i].returned==false) taken++
    }
    return book.copies-taken
}

function getAge(birth){
var parts=birth.split(".")
var age = new Date().getFullYear() - parts[2]
return age
}

function getBackDate(given,days){
    var p=given.split(".")
    var d=new Date(p[2],p[1]-1,Number(p[0])+Number(days))
    var dd=String(d.getDate()).padStart(2,"0")
    var mm=String(d.getMonth()+1).padStart(2,"0")
    return dd+"."+mm+"."+d.getFullYear()
}

function isLate(loan){
    if(loan.returned) return false
    var p=getBackDate(loan.given,loan.days).split(".")
    var back=new Date(p[2],p[1]-1,p[0])
    var today=new Date()
    today.setHours(0,0,0,0)
    return back<today
}

function editTd(value,table,id,field){
  return "<td title='Клікніть щоб змінити' onclick=\"editCell(this,'"+table+"',"+id+",'"+field+"')\">"+value+"</td>"
}

function delTd(table,id){
    return "<td><button title='Видалити' onclick=\"deleteRow('"+table+"',"+id+")\">&#10006;</button></td>"
}

function fillBooks(){
    var html = "<tr><th>№</th><th>Назва</th><th>Автор</th><th>Жанр</th><th>Рік видання</th><th>Сторінок</th><th>Примірників</th><th>Вільно</th><th>Полиця</th><th></th></tr>"
    for(var i=0;i<books.length;i++){
        var b=books[i]
        html+="<tr>"
        html+="<td>"+b.id+"</td>"
        html += editTd(b.title,"books",b.id,"title")
        html+=editTd(b.author,"books",b.id,"author")
        html+=editTd(b.genre,"books",b.id,"genre")
        html+=editTd(b.year,"books",b.id,"year")
        html+=editTd(b.pages,"books",b.id,"pages")
        html+=editTd(b.copies,"books",b.id,"copies")
        html+="<td>"+getFree(b.id)+"</td>"
        html+=editTd(b.shelf,"books",b.id,"shelf")
        html+=delTd("books",b.id)
        html+="</tr>"
    }
    document.getElementById("table1").innerHTML=html
}

function fillReaders() {
  let html = "<tr><th>№</th><th>ПІБ</th><th>Дата народження</th><th>Вік</th><th>Телефон</th><th>Email</th><th>Адреса</th><th>Дата реєстрації</th><th>Категорія</th><th></th></tr>";
  for (let i = 0; i < readers.length; i++) {
    let r = readers[i];
    html += "<tr><td>" + r.id + "</td>" + editTd(r.name, "readers", r.id, "name") + "<td>" + r.birth + "</td><td>" + getAge(r.birth) + "</td>" + editTd(r.phone, "readers", r.id, "phone") + editTd(r.email, "readers", r.id, "email") + editTd(r.address, "readers", r.id, "address") + "<td>" + r.registered + "</td>" + editTd(r.category, "readers", r.id, "category") + delTd("readers", r.id) + "</tr>";
  }
  document.getElementById("table2").innerHTML = html;
}

function fillLoans(){
var html="<tr><th>№</th><th>Книга</th><th>Читач</th><th>Дата видачі</th><th>Термін, днів</th><th>Повернути до</th><th>Повернено</th><th>Бібліотекар</th><th></th></tr>"
for(var i=0;i<loans.length;i++){
    var l = loans[i]
    var ret
    if(l.returned==true){ret="так"}else{ret="ні"}
    var back=getBackDate(l.given,l.days)
    if(isLate(l)) back+=" (прострочено)"
    html+="<tr>"
    html+="<td>"+l.id+"</td>"+editTd(getBookTitle(l.book),"loans",l.id,"book")+editTd(getReaderName(l.reader),"loans",l.id,"reader")
    html+="<td>"+l.given+"</td>"+editTd(l.days,"loans",l.id,"days")+"<td>"+back+"</td>"
    html+=editTd(ret,"loans",l.id,"returned")+editTd(l.librarian,"loans",l.id,"librarian")
    html+=delTd("loans",l.id)
    html+="</tr>"
}
document.getElementById("table3").innerHTML=html
}

function getArray(table){
    if(table=="books") return books
    if(table=="readers") return readers
    return loans
}

function fillAll(){
  fillBooks()
  fillReaders()
  fillLoans()
  fillSelects()
}

function deleteRow(table,id){
    var arr=getArray(table)

    if(table=="books"){
        var count=0
        for(var i=0;i<loans.length;i++){
            if(loans[i].book==id) count++
        }
        if(count>0){
            alert("Неможливо видалити книгу \""+getBookTitle(id)+"\"!\nВона використовується в таблиці Видачі (записів: "+count+").\nСпочатку видаліть ці видачі.")
            return
        }
    }
    if (table == "readers") {
        let count = 0
        for (let i = 0; i < loans.length; i++) {
            if (loans[i].reader == id) count++
        }
        if (count > 0) {
            alert("Неможливо видалити читача " + getReaderName(id) + "!\nЧитач використовується в таблиці Видачі (записів: " + count + ").\nСпочатку видаліть ці видачі.")
            return
        }
    }

    if(!confirm("Видалити запис №"+id+"?")) return

    for(var i=0;i<arr.length;i++){
        if(arr[i].id==id){
            arr.splice(i,1)
            break
        }
    }
    saveData()
    fillAll()
}

var numberFields=["year","pages","copies","days"]

function getOptions(field){
    var list=[]
    if(field=="book"){
        for(var i=0;i<books.length;i++) list.push([books[i].id,books[i].title])
        return list
    }
    if(field=="reader"){
        for(var i=0;i<readers.length;i++) list.push([readers[i].id,readers[i].name])
        return list
    }
    if(field=="genre") return [["Роман","Роман"],["Повість","Повість"],["Поезія","Поезія"],["Драма","Драма"],["Детектив","Детектив"],["Фантастика","Фантастика"],["Наукова","Наукова"]]
    if(field=="category") return [["Студент","Студент"],["Школяр","Школяр"],["Викладач","Викладач"],["Пенсіонер","Пенсіонер"],["Інше","Інше"]]
    if(field=="returned") return [["true","так"],["false","ні"]]
    return null
}

function editCell(td,table,id,field){
    if(td.getElementsByTagName("input").length>0||td.getElementsByTagName("select").length>0) return

    var arr=getArray(table)
    var obj
    for(var i=0;i<arr.length;i++){
        if(arr[i].id==id) obj=arr[i]
    }

    var input
    var options=getOptions(field)
    if(options!=null){
        input=document.createElement("select")
        for(var i=0;i<options.length;i++){
            var opt=document.createElement("option")
            opt.value=options[i][0]
            opt.text=options[i][1]
            input.appendChild(opt)
        }
        input.value=String(obj[field])
        input.onchange=function(){ save() }
        td.innerHTML=""
        td.appendChild(input)
        input.focus()
    } else {
    input=document.createElement("input")
    input.value=obj[field]
    if(numberFields.indexOf(field)!=-1) input.type="number"
    td.innerHTML=""
    td.appendChild(input)
    input.focus()
    input.select()
    }

    var done=false

    function save(){
        if(done) return
        done=true
        var value=input.value.trim()
        if(value==""){
            alert("Значення не може бути порожнім")
            fillAll()
            return
        }
        if(numberFields.indexOf(field)!=-1){
            value=Number(value)
            if(isNaN(value)||value<=0){
                alert("Потрібно ввести число більше 0")
                fillAll()
                return
            }
        }
        if(field=="year"&&value>new Date().getFullYear()){
            alert("Рік видання не може бути більшим за поточний")
            fillAll()
            return
        }
        if(table=="books"&&field=="copies"&&value<obj.copies-getFree(obj.id)){
          alert("Зараз видано "+(obj.copies-getFree(obj.id))+" прим., менше бути не може")
          fillAll()
          return
        }
        if(field=="email"&&value.indexOf("@")<1){
            alert("Неправильний email")
            fillAll()
            return
        }
        if(field=="book"||field=="reader") value=Number(value)
        if(field=="returned") value=(value=="true")
        if(table=="loans"&&field=="book"&&obj.returned==false&&value!=obj.book&&getFree(value)<=0){
            alert("Усі примірники цієї книги вже видані")
            fillAll()
            return
        }
        if(table=="loans"&&field=="returned"&&value==false&&obj.returned==true&&getFree(obj.book)<=0){
            alert("Усі примірники цієї книги вже видані")
            fillAll()
            return
        }
        obj[field]=value
        saveData()
        fillAll()
    }

    input.onkeydown=function(e){
        if(e.key=="Enter") save()
        if(e.key=="Escape"){
            done=true
            fillAll()
        }
    }
    input.onblur=save
}

function showTab(n){
    for(var i=1;i<=3;i++){
        document.getElementById("tab"+i).style.display="none"
        document.getElementById("btn"+i).style.fontWeight="normal"
    }
    document.getElementById("tab"+n).style.display="block"
  document.getElementById("btn"+n).style.fontWeight="bold"
}

function showForm(n){
  document.getElementById("form"+n).style.display="block"
}

function hideForm(n) {
    document.getElementById("form"+n).style.display = "none";
    var inputs = document.getElementById("form"+n).getElementsByTagName("input")
    for(var i=0;i<inputs.length;i++){
        if(inputs[i].type=="checkbox") inputs[i].checked=false
        else if(inputs[i].id=="loanDays") inputs[i].value=14
        else inputs[i].value=""
    }
}

function fillSelects(){
    var html=""
    for(var i=0;i<books.length;i++){
        html+="<option value='"+books[i].id+"'>"+books[i].title+" (вільно: "+getFree(books[i].id)+")</option>"
    }
    document.getElementById("loanBook").innerHTML=html
    html = ""
    for (let i = 0; i < readers.length; i++) {
        html += "<option value='" + readers[i].id + "'>" + readers[i].name + "</option>"
    }
    document.getElementById("loanReader").innerHTML = html
}

function newId(arr){
  if(arr.length==0) return 1
  return arr[arr.length-1].id+1
}

function toDate(value){
var parts = value.split("-")
return parts[2]+"."+parts[1]+"."+parts[0]
}

function addBook(){
    var title=document.getElementById("bookTitle").value.trim()
    var author=document.getElementById("bookAuthor").value.trim()
    var genre=document.getElementById("bookGenre").value
    var year=document.getElementById("bookYear").value
    var pages=document.getElementById("bookPages").value
    var copies=document.getElementById("bookCopies").value
    var shelf=document.getElementById("bookShelf").value.trim()

    if(title==""||author==""||year==""||pages==""||copies==""||shelf==""){
        alert("Заповніть всі поля!")
        return
    }
    if (Number(year) < 1450 || Number(year) > new Date().getFullYear()) {
      alert("Неправильний рік видання")
      return
    }
    if(Number(pages)<=0||Number(copies)<=0){
        alert("Кількість сторінок і примірників має бути більше 0")
        return
    }

    books.push({id:newId(books),title:title,author:author,genre:genre,year:Number(year),pages:Number(pages),copies:Number(copies),shelf:shelf})
    saveData()
    fillAll()
    hideForm(1)
}

function addReader() {
  let name = document.getElementById("readerName").value.trim();
  let birth = document.getElementById("readerBirth").value;
  let phone = document.getElementById("readerPhone").value.trim();
  let email = document.getElementById("readerEmail").value.trim();
  let address = document.getElementById("readerAddress").value.trim();
  let registered = document.getElementById("readerRegistered").value;
  let category = document.getElementById("readerCategory").value;

  if (name == "" || birth == "" || phone == "" || email == "" || address == "" || registered == "") {
    alert("Заповніть всі поля!");
    return;
  }
  if(email.indexOf("@")<1){
    alert("Неправильний email")
    return
  }
  if(new Date(birth)>new Date()){
    alert("Дата народження не може бути в майбутньому")
    return
  }

  readers.push({id: newId(readers), name: name, birth: toDate(birth), phone: phone, email: email, address: address, registered: toDate(registered), category: category});
  saveData();
  fillAll();
  hideForm(2);
}

function addLoan(){
var book=document.getElementById("loanBook").value
var reader=document.getElementById("loanReader").value
var given=document.getElementById("loanGiven").value
var days=document.getElementById("loanDays").value
var returned=document.getElementById("loanReturned").checked
var librarian=document.getElementById("loanLibrarian").value.trim()

if(book==""||reader==""||given==""||days==""||librarian==""){
    alert("Заповніть всі поля!")
    return
}
if(Number(days)<=0){
    alert("Термін має бути більше 0 днів")
    return
}
if(returned==false&&getFree(book)<=0){
  alert("Усі примірники цієї книги вже видані")
  return
}

loans.push({id:newId(loans),book:Number(book),reader:Number(reader),given:toDate(given),days:Number(days),returned:returned,librarian:librarian})
saveData()
fillAll()
hideForm(3)
}

function saveData(){
    var data={books:books,readers:readers,loans:loans}
    localStorage.setItem("library",JSON.stringify(data))
}

function loadData(){
    books=[]
    readers=[]
    loans=[]
    var data=localStorage.getItem("library")
    if(data==null) return
    try{
        data=JSON.parse(data)
        books=data.books||[]
        readers=data.readers||[]
        loans=data.loans||[]
    }catch(e){
        console.log("помилка читання localStorage",e)
    }
}

function clearData(){
  if(!confirm("Видалити всі дані з усіх таблиць?")) return
  localStorage.removeItem("library")
  loadData()
  fillAll()
}

window.addEventListener("storage",function(e){
    if(e.key=="library"||e.key==null){
        loadData()
        fillAll()
    }
})

loadData()
fillAll()
showTab(1)
