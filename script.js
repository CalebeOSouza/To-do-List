document.addEventListener("DOMContentLoaded", function () {
  var addTask = document.getElementById("add-task");
  var indiceTask = 0;
  var noclick = false;
  var click = 0;
  var clickemojis = 0;
  var quantity = 0;
  var descriptions = JSON.parse(localStorage.getItem("descriptionsS")) || {};
  var titles = JSON.parse(localStorage.getItem("titlesS")) || {};
  var emojis = JSON.parse(localStorage.getItem("emojisS")) || {};
  var variaveis = {};
  var elements = ["emoji", "title_task", "checkbox"];
  var OtherElements = ["icons", "content"];
  var DeletectedTasksQuantity = 0;
  var DTQbox = 0;
  var Deletectedtasks = [];

  function TasksDescriptions(TaskDescription) {
    if (!descriptions[TaskDescription]) {
      descriptions[TaskDescription] = "";
    }
  }

  function TasksTitles(TaskTitle) {
    if (!titles[TaskTitle]) {
      titles[TaskTitle] = "";
    }
  }

  function TasksEmojis(TaskEmoji) {
    if (!emojis[TaskEmoji]) {
      emojis[TaskEmoji] = "";
    }
  }

  function rearrangeDTE() {
    //Descriptions

    var descriptionsKeys = Object.keys(descriptions);
    var newDescriptions = {};

    descriptionsKeys.forEach((key, index) => {
      var newKey = `description${index + 1}`;
      newDescriptions[newKey] = descriptions[key];
    });

    descriptions = newDescriptions;

    localStorage.setItem("descriptionsS", JSON.stringify(newDescriptions));

    //Titles

    var titlesKeys = Object.keys(titles);
    var newTitles = {};

    titlesKeys.forEach((key, index) => {
      var newKey = `title${index + 1}`;
      newTitles[newKey] = titles[key];
    });

    titles = newTitles;

    localStorage.setItem("titlesS", JSON.stringify(newTitles));

    //Emojis

    var emojisKeys = Object.keys(emojis);
    var newEmojis = {};

    emojisKeys.forEach((key, index) => {
      var newKey = `emoji${index + 1}`;
      newEmojis[newKey] = emojis[key];
    });

    emojis = newEmojis;

    localStorage.setItem("emojisS", JSON.stringify(newEmojis));

    console.log("Reorganized!");
  }

  function rearrangeIDS(DeletectedTasksQ, DTArray) {
    var Alltasks = document.querySelectorAll(".tasks");
    indiceTask = 0;

    console.log("Rearrange Array: " + "[ " + DTArray + " ]");

    console.log("Rearrange Quantity: " + DeletectedTasksQ);

    Alltasks.forEach(function (task) {
      indiceTask++;
      task.setAttribute("id", "task" + indiceTask);

      //Elements
      elements.forEach(function (element) {
        var ElementVariable = task.querySelector("." + element + "-container");
        if (ElementVariable) {
          ElementVariable.setAttribute("id", element + indiceTask);
        }
      });

      //Other Elements
      OtherElements.forEach(function (Oelement) {
        var OtherElementVariable = task.querySelector("." + Oelement);
        if (OtherElementVariable) {
          if (Oelement === "icons") {
            OtherElementVariable.setAttribute("id", "icon" + indiceTask);
          }

          if (Oelement === "content") {
            OtherElementVariable.setAttribute("id", "title" + indiceTask);
          }
        }
      });

      //Titles,descriptions and emojis

      for (var i = 0; i < DeletectedTasksQ; i++) {
        var descriptionBoxDelete = "description" + DTArray[i];
        console.log("Deleting description: " + descriptionBoxDelete);
        delete descriptions[descriptionBoxDelete];

        localStorage.setItem("descriptionsS", JSON.stringify(descriptions));

        var TitleBoxDelete = "title" + DTArray[i];
        console.log("Deleting title: " + TitleBoxDelete);
        delete titles[TitleBoxDelete];

        localStorage.setItem("titlesS", JSON.stringify(titles));

        var EmojiBoxDelete = "emoji" + DTArray[i];
        console.log("Deleting emoji: " + EmojiBoxDelete);
        delete emojis[EmojiBoxDelete];

        localStorage.setItem("emojisS", JSON.stringify(emojis));
      }
    });
  }

  function updateCheckedCount() {
    var checkboxAll = document.querySelectorAll(".checkbox-container");
    var checked = 0;

    checkboxAll.forEach(function (checkAll) {
      if (checkAll.checked) {
        checked++;
      }
    });
    var quantity_checked = document.querySelector("#quantity_checked_text");
    quantity_checked.textContent = "Selected:" + checked;

    if (checked === 0) {
      quantity_checked.textContent = "";

      var quantity_container = document.querySelector(
        "#quantity-checked-container"
      );
      quantity_container.style.display = "none";
    } else if (checked != 0) {
      var quantity_container = document.querySelector(
        "#quantity-checked-container"
      );
      quantity_container.style.display = "flex";
    }
  }

  function DeleteSelectedTasks() {
    var checkedTasks = [];
    var checkboxAll = document.querySelectorAll(".checkbox-container");
    var Alltasks = document.querySelectorAll(".tasks");
    DeletectedTasksQuantity = 0;

    checkboxAll.forEach(function (checkAll) {
      var checkboxID = checkAll.id;
      var checkboxIDNumber = Number(checkboxID.replace(/^\D+/g, ""));
      var checkedIDNumber = 0;

      if (checkAll.checked) {
        checkedIDNumber = checkboxIDNumber;
        checkedTasks.push(checkboxIDNumber);
      }

      Alltasks.forEach(function (Tasks) {
        var taskId = Tasks.id;
        var taskIdNumber = Number(taskId.replace(/^\D+/g, ""));

        if (taskIdNumber === checkedIDNumber) {
          DeletectedTasksQuantity++;

          DTQbox = DeletectedTasksQuantity;

          Deletectedtasks.push(taskIdNumber);

          var quantity_checked = document.querySelector(
            "#quantity_checked_text"
          );

          setTimeout(function () {
            var quantity_container = document.querySelector(
              "#quantity-checked-container"
            );
            quantity_checked.textContent = "";
            quantity_container.style.display = "none";
          }, 500);

          Tasks.classList.remove("tasks");
          Tasks.classList.add("delected");

          if (Tasks.classList.contains("delected")) {
            quantity--;

            localStorage.setItem("quantityStorage", quantity);
            var quantity_text = document.querySelector("#quantity_text");
            quantity_text.textContent = quantity + "/40";
          }

          setTimeout(function () {
            Tasks.remove();

            rearrangeIDS(DTQbox, Deletectedtasks);
            rearrangeDTE();

            localStorage.setItem("emojisS", JSON.stringify(emojis));
            localStorage.setItem("titlesS", JSON.stringify(titles));
            localStorage.setItem("descriptionsS", JSON.stringify(descriptions));

            if (quantity == 0) {
              emojis = {};
              titles = {};
              descriptions = {};
              localStorage.setItem("emojisS", JSON.stringify(emojis));
              localStorage.setItem("titlesS", JSON.stringify(titles));
              localStorage.setItem(
                "descriptionsS",
                JSON.stringify(descriptions)
              );
            }

            console.log("");
            console.log("Emojis Object (DeleteSelectedTasks Function): ");
            Object.entries(emojis).forEach(([key, value]) => {
              console.log(`${key}: ${value}`);
            });

            console.log("Titles Object (DeleteSelectedTasks Function):");
            Object.entries(titles).forEach(([key, value]) => {
              console.log(`${key}: ${value}`);
            });

            console.log("Descriptions Object (DeleteSelectedTasks Function):");
            Object.entries(descriptions).forEach(([key, value]) => {
              console.log(`${key}: ${value}`);
            });

            Deletectedtasks.length = 0;
          }, 1500);
        }
      });
    });
  }

  var themes = document.querySelector("#themes");
  var picker = document.querySelector("#theme_picker");
  themes.addEventListener("click", function () {
    click++;
    switch (click) {
      case 1:
        picker.style.display = "grid";
        break;
      case 2:
        picker.style.display = "none";
        click = 0;
        break;
    }
  });

  var saveThemeBtn = document.querySelector("#Save_color");
  var resetThemeBtn = document.querySelector("#reset");
  var cores = document.querySelectorAll(".cores");

  function newcolors() {
    var Alltasks = document.querySelectorAll(".tasks");
    var Alltitles = document.querySelectorAll(".title_task-container");

    Alltasks.forEach(function (allta) {
      allta.style.background = localStorage.getItem("color1S");
    });

    Alltitles.forEach(function (allti) {
      allti.style.background = localStorage.getItem("color2S");
    });
  }

  var color1 = "";
  var color2 = "";

  cores.forEach(function (core) {
    core.addEventListener("click", function () {
      var gradient = core.getAttribute("data-color");
      var colors = gradient.match(/(#[a-f0-9]{6})/g);

      color1 = colors[0];
      color2 = colors[1];
      localStorage.setItem("color1S", color1);
      localStorage.setItem("color2S", color2);
    });
  });

  saveThemeBtn.addEventListener("click", function () {
    newcolors();
  });

  resetThemeBtn.addEventListener("click", function () {
    var Alltasks = document.querySelectorAll(".tasks");
    var Alltitles = document.querySelectorAll(".title_task-container");
    color1 = "";
    color2 = "";

    Alltasks.forEach(function (allta) {
      allta.style.background = "#9ba8cc";
    });

    Alltitles.forEach(function (allti) {
      allti.style.background = "#afbadb";
    });
  });

  var selectedTaskId = null;

  function createElements(tagName, classes, id) {
    var element = document.createElement(tagName);
    element.classList.add(classes);
    element.setAttribute("id", id);
    return element;
  }

  function ReloadTasks() {
    var quantityStorage = parseInt(localStorage.getItem("quantityStorage"), 10);
    var EmojisStorage = JSON.parse(localStorage.getItem("emojisS")) || {};
    var TitlesStorage = JSON.parse(localStorage.getItem("titlesS")) || {};
    var DescriptionsStorage =
      JSON.parse(localStorage.getItem("descriptionsS")) || {};

    console.log(EmojisStorage);
    console.log(TitlesStorage);
    console.log(DescriptionsStorage);

    for (i = 1; i <= quantityStorage; i++) {
      createTaskElements(i);
      quantity++;
    }

    var Allicons = document.querySelectorAll(".icons");

    Allicons.forEach(function (icon) {
      var iconId = icon.id;
      var iconIdNumber = Number(iconId.replace(/^\D+/g, ""));

      Object.entries(EmojisStorage).forEach(([key, value]) => {
        var lastCharacter = Number(key.charAt(key.length - 1));

        if (iconIdNumber === lastCharacter) {
          icon.innerHTML = value;
        }
      });
    });

    var AllTitleContent = document.querySelectorAll(".content");

    AllTitleContent.forEach(function (tinput) {
      var titleId = tinput.id;
      var titleIdNumber = Number(titleId.replace(/^\D+/g, ""));

      Object.entries(TitlesStorage).forEach(([key, value]) => {
        var lastCharacter = Number(key.charAt(key.length - 1));

        if (titleIdNumber === lastCharacter) {
          tinput.innerHTML = value;
        }
      });
    });

    var quantity_text = document.querySelector("#quantity_text");
    quantityStorage = localStorage.getItem("quantityStorage");
    quantity_text.textContent = quantityStorage + "/40";
  }

  ReloadTasks();

  function createTaskElements(indice) {
    var taskContainer = document.createElement("div");
    taskContainer.classList.add("tasks");

    taskContainer.setAttribute("id", "task" + indice);

    var TaskManagerContainer = document.querySelector(".tasks-container");
    TaskManagerContainer.appendChild(taskContainer);

    elements.forEach(function (elementName) {
      var element;
      if (elementName === "checkbox") {
        var div = document.createElement("div");
        div.classList.add("checkbox-div");
        taskContainer.appendChild(div);

        element = createElements(
          "input",
          elementName + "-container",
          elementName + indice
        );
        element.type = "checkbox";
        div.appendChild(element);

        element.addEventListener("change", updateCheckedCount);

        var deleteBtn = document.querySelector("#delete_checkeds_botton");

        deleteBtn.addEventListener("click", function () {
          var taskpainel = document.querySelector(".tasks_panel");

          taskpainel.style.animation = "push 2s 1";

          setTimeout(function () {
            taskpainel.style.display = "none";

            variaveis[clickKey] = 0;
          }, 1000);

          setTimeout(function () {
            var sidebar = document.querySelector(".sidebar");
            var taskcontainer = document.querySelector(".tasks-container");
            var sidebarBottons = document.querySelectorAll(".sidebar-bottons");

            taskcontainer.setAttribute("id", "task-container-only");
            sidebar.setAttribute("id", "Modified-size-sidebar-1");

            sidebarBottons.forEach(function (btns) {
              btns.style.fontSize = "21px";
            });
          }, 300);

          DeleteSelectedTasks();
        });
      } else {
        element2 = createElements(
          "div",
          elementName + "-container",
          elementName + indice
        );
        taskContainer.appendChild(element2);
      }

      newcolors();

      if (elementName == "emoji") {
        var EmojiDiv = document.querySelector("#emoji" + indice);
        var emojiIcon = document.createElement("span");
        emojiIcon.setAttribute("id", "icon" + indice);
        emojiIcon.classList.add("icons");
        emojiIcon.innerHTML = "📃";
        EmojiDiv.appendChild(emojiIcon);
      }

      if (elementName == "title_task") {
        var titleDiv = document.querySelector("#title_task" + indice);
        var divcontent = document.createElement("div");
        titleDiv.appendChild(divcontent);

        var newTitleH3 = document.createElement("h3");
        newTitleH3.classList.add("content");
        newTitleH3.setAttribute("id", "title" + indice);
        newTitleH3.innerHTML = "Title";
        divcontent.appendChild(newTitleH3);
      }
    });

    //interações

    var emojiContainer = document.querySelector("#emoji" + indice);
    var icons = document.querySelector("#icon" + indice);

    icons.addEventListener("click", function () {
      clickemojis++;
      var emojiSelectionDiv = document.querySelector(".emoji-selection");

      switch (clickemojis) {
        case 1:
          var rect = emojiContainer.getBoundingClientRect();
          emojiSelectionDiv.style.top = rect.bottom + "px";
          emojiSelectionDiv.style.left = rect.left + "px";
          emojiSelectionDiv.style.display = "flex";
          clickemojis++;
          break;
        case 3:
          emojiSelectionDiv.style.display = "none";
          clickemojis = 0;
          break;
      }

      var iconsID = icons.id;
      var iconsIDNumber = Number(iconsID.replace(/^\D+/g, ""));

      var emojisElements = document.querySelectorAll(".emoji");
      emojisElements.forEach(function (emojiElement) {
        emojiElement.addEventListener("click", function () {
          var emojiContent = emojiElement.textContent;

          var iconSelected = document.querySelector("#icon" + iconsIDNumber);

          if (selectedTaskId) {
            var selectedTaskIdNumber = Number(
              selectedTaskId.replace(/^\D+/g, "")
            );
            if (iconsIDNumber == selectedTaskIdNumber) {
              iconSelected.textContent = emojiContent;

              TasksEmojis(`emoji${selectedTaskIdNumber}`);

              console.log("Selected emoji: ", emojiContent);

              emojis[`emoji${selectedTaskIdNumber}`] = emojiContent;

              localStorage.setItem("emojisS", JSON.stringify(emojis));
            }
          }
        });
      });

      var emojiCategory = document.querySelectorAll(".category");
      emojiCategory.forEach(function (emojiC) {
        emojiC.addEventListener("click", function (event) {
          var categoryId = event.target.id;
          var CategoryIdNumber = Number(categoryId.replace(/^\D+/g, ""));
          var EmojiSection = document.querySelectorAll(".category-section");
          EmojiSection.forEach(function (EmojiS) {
            var SectionId = EmojiS.id;
            var SectionIdNumber = Number(SectionId.replace(/^\D+/g, ""));
            if (CategoryIdNumber == SectionIdNumber) {
              EmojiS.style.display = "flex";
              EmojiS.style.flexDirection = "column";
            } else {
              EmojiS.style.display = "none";
            }
          });
        });
      });
    });

    var emojiClicked = false;
    var checkboxClicked = false;

    var EmjCont = document.querySelectorAll(".emoji-container");
    EmjCont.forEach(function (emj) {
      emj.addEventListener("click", function () {
        emojiClicked = true;
      });
    });

    var CheckCont = document.querySelectorAll(".checkbox-container");
    CheckCont.forEach(function (check) {
      check.addEventListener("click", function () {
        checkboxClicked = true;
      });
    });

    function DashboardDisplay(clickKey) {
      var taskpainel = document.querySelector(".tasks_panel");
      variaveis[clickKey] = variaveis[clickKey] || 0;
      var taskcontainer = document.querySelector(".tasks-container");
      var sidebar = document.querySelector(".sidebar");
      var sidebarBottons = document.querySelectorAll(".sidebar-bottons");

      if (noclick || emojiClicked || checkboxClicked) {
        emojiClicked = false;
        checkboxClicked = false;
        return;
      } else {
        variaveis[clickKey]++;

        if (variaveis[clickKey] === 1) {
          taskpainel.style.display = "flex";
          taskpainel.style.animation = "pull 2s 1";

          setTimeout(function () {
            taskcontainer.setAttribute("id", "task-container-not-only");
            sidebar.setAttribute("id", "Modified-size-sidebar");

            sidebarBottons.forEach(function (btns) {
              btns.style.fontSize = "20px";
            });
          }, 500);
        } else {
          taskpainel.style.animation = "push 2s 1";

          setTimeout(function () {
            taskpainel.style.display = "none";

            variaveis[clickKey] = 0;
          }, 1000);

          setTimeout(function () {
            taskcontainer.setAttribute("id", "task-container-only");
            sidebar.setAttribute("id", "Modified-size-sidebar-1");

            sidebarBottons.forEach(function (btns) {
              btns.style.fontSize = "21px";
            });
          }, 300);
        }
      }

      noclick = true;
      setTimeout(function () {
        noclick = false;
      }, 1100);
    }

    //Task

    var Alltasks = document.querySelectorAll(".tasks");
    Alltasks.forEach(function (task) {
      task.addEventListener("click", function (event) {
        selectedTaskId = task.id;

        var AllDescriptionInput =
          document.querySelectorAll(".DescriptionField");

        var AllTitleInput = document.querySelectorAll(".TitleField");

        var taskId = task.id;
        var taskIdNumber = Number(taskId.replace(/^\D+/g, ""));

        console.log(taskId);

        console.log("");

        DashboardDisplay(`clicks${taskIdNumber}`);
        TasksDescriptions(`description${taskIdNumber}`);
        TasksTitles(`title${taskIdNumber}`);

        console.log("Titles Object:");
        Object.entries(titles).forEach(([key, value]) => {
          console.log(`${key}: ${value}`);
        });
        console.log("");
        console.log("Descriptions Object:");
        Object.entries(descriptions).forEach(([key, value]) => {
          console.log(`${key}: ${value}`);
        });
        console.log("");
        console.log("Emojis Object:");
        Object.entries(emojis).forEach(([key, value]) => {
          console.log(`${key}: ${value}`);
        });

        var titlepanel = document.querySelector(".TitlePanel");
        titlepanel.innerHTML = "<h2>Task" + "</h2>";

        var titleEditor = document.querySelector(".TitleField");
        titleEditor.setAttribute("id", "TitleEditor" + taskIdNumber);

        var InputDescripitions = document.querySelector(".DescriptionField");
        InputDescripitions.setAttribute(
          "id",
          "DescriptionEditor" + taskIdNumber
        );

        for (var j = 0; j < AllDescriptionInput.length; j++) {
          var DescriptionInput = AllDescriptionInput[j];
          var DescriptionId = DescriptionInput.id;
          var DescriptionIdNumber = 0;

          if (DescriptionId) {
            DescriptionIdNumber = Number(DescriptionId.replace(/^\D+/g, ""));
          }

          if (DescriptionIdNumber == taskIdNumber) {
            DescriptionInput.value = descriptions[`description${taskIdNumber}`];
          }
        }

        for (var i = 0; i < AllTitleInput.length; i++) {
          var titleInput = AllTitleInput[i];
          var titleId = titleInput.id;
          var titleIdNumber = 0;

          if (titleId) {
            titleIdNumber = Number(titleId.replace(/^\D+/g, ""));
          }

          if (titleIdNumber == taskIdNumber) {
            titleInput.value = titles[`title${taskIdNumber}`];
          }
        }

        var submitbtn = document.querySelector("#submitbotton");
        submitbtn.addEventListener("click", function () {
          for (var j = 0; j < AllTitleInput.length; j++) {
            var InputTitles = AllTitleInput[j];
            var TitleInputId = InputTitles.id;
            var TitleInputIdNumber = 0;

            if (TitleInputId) {
              TitleInputIdNumber = Number(TitleInputId.replace(/^\D+/g, ""));
            }

            if (TitleInputId == "TitleEditor" + taskIdNumber) {
              var TextTitle = InputTitles.value;
              var Title_tasks = document.querySelectorAll(
                ".title_task-container"
              );
              for (var k = 0; k < Title_tasks.length; k++) {
                var NewTitles = Title_tasks[k];
                if (NewTitles.id == "title_task" + TitleInputIdNumber) {
                  if (TextTitle === "") {
                    return;
                  } else {
                    NewTitles.innerHTML =
                      "<div><h3 class='content'>" + TextTitle + "</h3></div>";
                  }
                }
              }
            }
          }

          for (var j = 0; j < AllDescriptionInput.length; j++) {
            var DescriptionInput = AllDescriptionInput[j];
            var DescriptionId = DescriptionInput.id;
            var DescriptionIdNumber = 0;

            if (DescriptionId) {
              DescriptionIdNumber = Number(DescriptionId.replace(/^\D+/g, ""));
            }

            if (DescriptionId === "DescriptionEditor" + taskIdNumber) {
              descriptions[`description${taskIdNumber}`] =
                DescriptionInput.value;

              localStorage.setItem(
                "descriptionsS",
                JSON.stringify(descriptions)
              );
            }
          }

          for (var i = 0; i < AllTitleInput.length; i++) {
            var titleInput = AllTitleInput[i];
            var titleId = titleInput.id;
            var titleIdNumber = 0;

            if (titleId) {
              titleIdNumber = Number(titleId.replace(/^\D+/g, ""));
            }

            if (titleId === "TitleEditor" + taskIdNumber) {
              titles[`title${taskIdNumber}`] = titleInput.value;

              localStorage.setItem("titlesS", JSON.stringify(titles));
            }
          }

          var newCheckboxes = document.querySelectorAll("#checkbox" + indice);
          newCheckboxes.forEach(function (newCheckbox) {
            newCheckbox.addEventListener("change", updateCheckedCount);
          });

          updateCheckedCount();
        });
      });
    });
  }

  addTask.addEventListener("click", function () {
    if (noclick) {
      return;
    } else {
      var quantity_text = document.querySelector("#quantity_text");

      quantity++;
      localStorage.setItem("quantityStorage", quantity);
      quantityStorage = localStorage.getItem("quantityStorage");
      quantity_text.textContent = quantityStorage + "/40";

      if (quantityStorage >= 40) {
        quantity_text.style.color = "#b73131";
        return;
      } else {
        quantity_text.style.color = "#ffffff";
      }
    }

    createTaskElements(quantity);

    noclick = true;
    setTimeout(function () {
      noclick = false;
    }, 500);
  });
});
