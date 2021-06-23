let add = document.querySelector("form button");
let section = document.querySelector("section");
add.addEventListener("click", (e) => {
  //避免表單被交出去
  e.preventDefault();
  //取得input values
  let form = e.target.parentElement;
  let todoText = form.children[0].value;
  let todoMonth = form.children[1].value;
  let todoDate = form.children[2].value;

  if (todoText === "") {
    alert("請輸入代辦事項");
    return; //此處加入return結束程式碼
  }
  if (todoMonth > 12 || todoMonth < 1) {
    alert("請輸入正確月份");
    return; //此處加入return結束程式碼
  }
  if (todoDate > 31 || todoDate < 1) {
    alert("請輸入正確日期");
    return; //此處加入return結束程式碼
  }
  //創造todo item
  let todo = document.createElement("div");
  todo.classList.add("todo");
  let text = document.createElement("p");
  text.classList.add("todoText");
  text.innerText = todoText;
  let time = document.createElement("p");
  time.classList.add("todoTime");
  time.innerText = todoMonth + "/" + todoDate;
  todo.appendChild(text);
  todo.appendChild(time);

  //創造綠色勾勾,紅色垃圾桶
  //為兩個按鈕加入監聽器，若點擊之後選取整個母元素,替母元素加入新的class
  let completeButton = document.createElement("button");
  completeButton.classList.add("complete");
  completeButton.innerHTML = '<i class="fas fa-check"></i>';

  completeButton.addEventListener("click", (e) => {
    let todoItem = e.target.parentElement;
    todoItem.classList.toggle("done"); //這裡使用toggle使，沒有時加入done class, 有done時刪除 done class
  });

  let trashButton = document.createElement("button");
  trashButton.classList.add("trash");
  trashButton.innerHTML = '<i class="fas fa-trash"></i>';

  trashButton.addEventListener("click", (e) => {
    let todoItem = e.target.parentElement;
    // 消失方法1  trash.innerHTML = ""
    todoItem.addEventListener("animationend", () => {
      //remove from loacalStorage
      let text = todoItem.children[0].innerText;
      let myListArray = JSON.parse(localStorage.getItem("list"));
      myListArray.forEach((item, index) => {
        if (item.todoText == text) {
          myListArray.splice(index, 1);
          localStorage.setItem("list", JSON.stringify(myListArray));
        }
      });
      todoItem.remove();
    });
    todoItem.style.animation = "scaleDown 0.3s forwards";
    //使用animation製造出縮小效果,加入監聽器使remove在animation結束之後才生效
  });

  todo.appendChild(completeButton);
  todo.appendChild(trashButton);
  todo.style.animation = "scaleUp 0.3s forwards";
  //create an object
  let myTodo = {
    todoText: todoText,
    todoMonth: todoMonth,
    todoDate: todoDate,
  };
  //store data into an array of objects
  let myList = localStorage.getItem("list");
  if (myList == null) {
    localStorage.setItem("list", JSON.stringify([myTodo]));
  } else {
    let myListArray = JSON.parse(myList);
    myListArray.push(myTodo);
    localStorage.setItem("list", JSON.stringify(myListArray));
  }

  form.children[0].value = "";
  section.appendChild(todo);
});

loadData();

function loadData() {
  let myList = localStorage.getItem("list");
  if (myList !== null) {
    let myListArray = JSON.parse(myList);
    myListArray.forEach((item) => {
      //create a todo
      let todo = document.createElement("div");
      todo.classList.add("todo");
      let text = document.createElement("p");
      text.classList.add("todoText");
      let time = document.createElement("p");
      time.classList.add("todoTime");

      text.innerText = item.todoText;
      time.innerText = item.todoMonth + "/" + item.todoDate;

      todo.appendChild(text);
      todo.appendChild(time);

      let completeButton = document.createElement("button");
      completeButton.classList.add("complete");
      completeButton.innerHTML = '<i class="fas fa-check"></i>';

      completeButton.addEventListener("click", (e) => {
        let todoItem = e.target.parentElement;
        todoItem.classList.toggle("done"); //這裡使用toggle使，沒有時加入done class, 有done時刪除 done class
      });

      let trashButton = document.createElement("button");
      trashButton.classList.add("trash");
      trashButton.innerHTML = '<i class="fas fa-trash"></i>';
      trashButton.addEventListener("click", (e) => {
        let todoItem = e.target.parentElement;
        // 消失方法1  trash.innerHTML = ""
        todoItem.addEventListener("animationend", () => {
          //remove from loacalStorage
          let text = todoItem.children[0].innerText;
          let myListArray = JSON.parse(localStorage.getItem("list"));
          myListArray.forEach((item, index) => {
            if (item.todoText == text) {
              myListArray.splice(index, 1);
              localStorage.setItem("list", JSON.stringify(myListArray));
            }
          });
          todoItem.remove();
        });
        todoItem.style.animation = "scaleDown 0.3s forwards";

        //使用animation製造出縮小效果,加入監聽器使remove在animation結束之後才生效
      });

      todo.appendChild(completeButton);
      todo.appendChild(trashButton);

      section.appendChild(todo);
    });
  }
}

function mergeTime(arr1, arr2) {
  let result = [];
  let i = 0;
  let j = 0;

  while (i < arr1.length && j < arr2.length) {
    if (Number(arr1[i].todoMonth) > Number(arr2[j].todoMonth)) {
      result.push(arr2[j]);
      j++;
    } else if (Number(arr1[i].todoMonth) < Number(arr2[j].todoMonth)) {
      result.push(arr1[i]);
      i++;
    } else if (Number(arr1[i].todoMonth) == Number(arr2[j].todoMonth)) {
      if (Number(arr1[i].todoDate) > Number(arr2[j].todoDate)) {
        result.push(arr2[j]);
        j++;
      } else {
        result.push(arr1[i]);
        i++;
      }
    }
  }

  while (i < arr1.length) {
    result.push(arr1[i]);
    i++;
  }
  while (j < arr2.length) {
    result.push(arr2[j]);
    j++;
  }

  return result;
}

function mergeSort(arr) {
  if (arr.length === 1) {
    return arr;
  } else {
    let middle = Math.floor(arr.length / 2);
    let right = arr.slice(0, middle);
    let left = arr.slice(middle, arr.length);
    return mergeTime(mergeSort(right), mergeSort(left));
  }
}

let sortButton = document.querySelector("div.sort button");
sortButton.addEventListener("click", () => {
  //sort data
  let sortedArray = mergeSort(JSON.parse(localStorage.getItem("list")));
  localStorage.setItem("list", JSON.stringify(sortedArray));

  //remove data
  let len = section.children.length;
  for (let i = 0; i < len; i++) {
    section.children[0].remove();
  }

  //load data
  loadData();
});
