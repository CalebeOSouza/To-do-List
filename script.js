document.addEventListener("DOMContentLoaded", function () {
  const addTask = document.getElementById("add-task");
  let indiceTask = 0;
  let noclick = false;
  let click = 0;
  let clickemojis = 0;
  let quantity = 0;
  let descriptions = JSON.parse(localStorage.getItem("descriptionsS")) || {};
  let titles = JSON.parse(localStorage.getItem("titlesS")) || {};
  let emojis = JSON.parse(localStorage.getItem("emojisS")) || {};
  let variaveis = {};
  const elements = ["emoji", "title_task", "checkbox"];
  const OtherElements = ["icons", "content"];
  let DeletectedTasksQuantity = 0;
  let DTQbox = 0;
  let Deletectedtasks = [];

  const colorsbtn = document.querySelectorAll(".cores");

  colorsbtn.forEach(function (btn) {
    btn.addEventListener("click", function () {
      colorsbtn.forEach(function (all) {
all.style.border = "none";
      });

        btn.style.border = "2px solid gray";

    });
  });

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

    const descriptionsKeys = Object.keys(descriptions);
    let newDescriptions = {};

    descriptionsKeys.forEach((key, index) => {
      let newKey = `description${index + 1}`;
      newDescriptions[newKey] = descriptions[key];
    });

    descriptions = newDescriptions;

    localStorage.setItem("descriptionsS", JSON.stringify(newDescriptions));

    //Titles

    const titlesKeys = Object.keys(titles);
    let newTitles = {};

    titlesKeys.forEach((key, index) => {
      let newKey = `title${index + 1}`;
      newTitles[newKey] = titles[key];
    });

    titles = newTitles;

    localStorage.setItem("titlesS", JSON.stringify(newTitles));

    //Emojis

    const emojisKeys = Object.keys(emojis);
    let newEmojis = {};

    emojisKeys.forEach((key, index) => {
      let newKey = `emoji${index + 1}`;
      newEmojis[newKey] = emojis[key];
    });

    emojis = newEmojis;

    localStorage.setItem("emojisS", JSON.stringify(newEmojis));

    console.log("Reorganized!");
  }

  function rearrangeIDS(DeletectedTasksQ, DTArray) {
    const Alltasks = document.querySelectorAll(".tasks");
    indiceTask = 0;

    console.log("Rearrange Array: " + "[ " + DTArray + " ]");

    console.log("Rearrange Quantity: " + DeletectedTasksQ);

    Alltasks.forEach(function (task) {
      indiceTask++;
      task.setAttribute("id", "task" + indiceTask);

      //Elements
      elements.forEach(function (element) {
        const ElementVariable = task.querySelector("." + element + "-container");
        if (ElementVariable) {
          ElementVariable.setAttribute("id", element + indiceTask);
        }
      });

      //Other Elements
      OtherElements.forEach(function (Oelement) {
        const OtherElementVariable = task.querySelector("." + Oelement);
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

      for (let i = 0; i < DeletectedTasksQ; i++) {
        let descriptionBoxDelete = "description" + DTArray[i];
        console.log("Deleting description: " + descriptionBoxDelete);
        delete descriptions[descriptionBoxDelete];

        localStorage.setItem("descriptionsS", JSON.stringify(descriptions));

        let TitleBoxDelete = "title" + DTArray[i];
        console.log("Deleting title: " + TitleBoxDelete);
        delete titles[TitleBoxDelete];

        localStorage.setItem("titlesS", JSON.stringify(titles));

        let EmojiBoxDelete = "emoji" + DTArray[i];
        console.log("Deleting emoji: " + EmojiBoxDelete);
        delete emojis[EmojiBoxDelete];

        localStorage.setItem("emojisS", JSON.stringify(emojis));
      }
    });
  }

  function updateCheckedCount() {
    const checkboxAll = document.querySelectorAll(".checkbox-container");
    let checked = 0;

    checkboxAll.forEach(function (checkAll) {
      if (checkAll.checked) {
        checked++;
      }
    });
    const quantity_checked = document.querySelector("#quantity_checked_text");
    quantity_checked.textContent = "Selected:" + checked;

    if (checked === 0) {
      quantity_checked.textContent = "";

      const quantity_container = document.querySelector(
        "#quantity-checked-container"
      );
      quantity_container.style.display = "none";
    } else if (checked != 0) {
      const quantity_container = document.querySelector(
        "#quantity-checked-container"
      );
      quantity_container.style.display = "flex";
    }
  }

  function DeleteSelectedTasks() {
    noclick = true;

    let checkedTasks = [];
    const checkboxAll = document.querySelectorAll(".checkbox-container");
    const Alltasks = document.querySelectorAll(".tasks");
    DeletectedTasksQuantity = 0;

    checkboxAll.forEach(function (checkAll) {
      let checkboxID = checkAll.id;
      let checkboxIDNumber = Number(checkboxID.replace(/^\D+/g, ""));
      let checkedIDNumber = 0;

      if (checkAll.checked) {
        checkedIDNumber = checkboxIDNumber;
        checkedTasks.push(checkboxIDNumber);
      }

      Alltasks.forEach(function (Tasks) {
        let taskId = Tasks.id;
        let taskIdNumber = Number(taskId.replace(/^\D+/g, ""));

        if (taskIdNumber === checkedIDNumber) {
          DeletectedTasksQuantity++;

          DTQbox = DeletectedTasksQuantity;

          Deletectedtasks.push(taskIdNumber);

          const quantity_checked = document.querySelector(
            "#quantity_checked_text"
          );

          setTimeout(function () {
            const quantity_container = document.querySelector(
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
            const quantity_text = document.querySelector("#quantity_text");
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

    setTimeout(function () {
      noclick = false;
      console.log(noclick);
    }, 1500);
  }

  const themes = document.querySelector("#themes");
  const picker = document.querySelector("#theme_picker");
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

  const saveThemeBtn = document.querySelector("#Save_color");
  const resetThemeBtn = document.querySelector("#reset");
  const cores = document.querySelectorAll(".cores");

  function newcolors() {
    const Alltasks = document.querySelectorAll(".tasks");
    const Alltitles = document.querySelectorAll(".title_task-container");

    Alltasks.forEach(function (allta) {
      allta.style.background = localStorage.getItem("color1S");
    });

    Alltitles.forEach(function (allti) {
      allti.style.background = localStorage.getItem("color2S");
    });
  }

  let color1 = "";
  let color2 = "";

  cores.forEach(function (core) {
    core.addEventListener("click", function () {
      const gradient = core.getAttribute("data-color");
      let colors = gradient.match(/(#[a-f0-9]{6})/g);

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
    const Alltasks = document.querySelectorAll(".tasks");
    const Alltitles = document.querySelectorAll(".title_task-container");
    color1 = "";
    color2 = "";

    Alltasks.forEach(function (allta) {
      allta.style.background = "#9ba8cc";
    });

    Alltitles.forEach(function (allti) {
      allti.style.background = "#afbadb";
    });
  });

  let selectedTaskId = null;

  function createElements(tagName, classes, id) {
    const element = document.createElement(tagName);
    element.classList.add(classes);
    element.setAttribute("id", id);
    return element;
  }

  function ReloadTasks() {
    let quantityStorage = parseInt(localStorage.getItem("quantityStorage"), 10);
    let EmojisStorage = JSON.parse(localStorage.getItem("emojisS")) || {};
    let TitlesStorage = JSON.parse(localStorage.getItem("titlesS")) || {};
    let DescriptionsStorage =
      JSON.parse(localStorage.getItem("descriptionsS")) || {};

    console.log(EmojisStorage);
    console.log(TitlesStorage);
    console.log(DescriptionsStorage);

    for (i = 1; i <= quantityStorage; i++) {
      createTaskElements(i);
      quantity++;
    }

    const Allicons = document.querySelectorAll(".icons");

    Allicons.forEach(function (icon) {
      let iconId = icon.id;
      let iconIdNumber = Number(iconId.replace(/^\D+/g, ""));

      Object.entries(EmojisStorage).forEach(([key, value]) => {
        let lastCharacter = Number(key.charAt(key.length - 1));

        if (iconIdNumber === lastCharacter) {
          icon.innerHTML = value;
        }
      });
    });

    const AllTitleContent = document.querySelectorAll(".content");

    AllTitleContent.forEach(function (tinput) {
      let titleId = tinput.id;
      let titleIdNumber = Number(titleId.replace(/^\D+/g, ""));

      Object.entries(TitlesStorage).forEach(([key, value]) => {
        let lastCharacter = Number(key.charAt(key.length - 1));

        if (titleIdNumber === lastCharacter) {
          tinput.innerHTML = value;
        }
      });
    });

    const quantity_text = document.querySelector("#quantity_text");
    quantityStorage = localStorage.getItem("quantityStorage");
    quantity_text.textContent = quantityStorage + "/40";
  }

  ReloadTasks();

  function createTaskElements(indice) {
    const taskContainer = document.createElement("div");
    taskContainer.classList.add("tasks");

    taskContainer.setAttribute("id", "task" + indice);

    const TaskManagerContainer = document.querySelector(".tasks-container");
    TaskManagerContainer.appendChild(taskContainer);

    elements.forEach(function (elementName) {
      let element;
      if (elementName === "checkbox") {
        const div = document.createElement("div");
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

        const deleteBtn = document.querySelector("#delete_checkeds_botton");

        deleteBtn.addEventListener("click", function () {
          const taskpainel = document.querySelector(".tasks_panel");

          taskpainel.style.animation = "push 2s 1";

          setTimeout(function () {
            taskpainel.style.display = "none";

            variaveis[clickKey] = 0;
          }, 1000);

          setTimeout(function () {
            const sidebar = document.querySelector(".sidebar");
            const taskcontainer = document.querySelector(".tasks-container");
            const sidebarBottons = document.querySelectorAll(".sidebar-bottons");

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
        const EmojiDiv = document.querySelector("#emoji" + indice);
        const emojiIcon = document.createElement("span");
        emojiIcon.setAttribute("id", "icon" + indice);
        emojiIcon.classList.add("icons");
        emojiIcon.innerHTML = "📃";
        EmojiDiv.appendChild(emojiIcon);
      }

      if (elementName == "title_task") {
        const titleDiv = document.querySelector("#title_task" + indice);
        const divcontent = document.createElement("div");
        titleDiv.appendChild(divcontent);

        const newTitleH3 = document.createElement("h3");
        newTitleH3.classList.add("content");
        newTitleH3.setAttribute("id", "title" + indice);
        newTitleH3.innerHTML = "Title";
        divcontent.appendChild(newTitleH3);
      }
    });

    //interações

    const emojiContainer = document.querySelector("#emoji" + indice);
    const icons = document.querySelector("#icon" + indice);

    icons.addEventListener("click", function () {
      clickemojis++;
      const emojiSelectionDiv = document.querySelector(".emoji-selection");

      switch (clickemojis) {
        case 1:
          let rect = emojiContainer.getBoundingClientRect();
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

      let iconsID = icons.id;
      let iconsIDNumber = Number(iconsID.replace(/^\D+/g, ""));

      const emojisElements = document.querySelectorAll(".emoji");
      emojisElements.forEach(function (emojiElement) {
        emojiElement.addEventListener("click", function () {
          let emojiContent = emojiElement.textContent;

          let iconSelected = document.querySelector("#icon" + iconsIDNumber);

          if (selectedTaskId) {
            let selectedTaskIdNumber = Number(
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

      const emojiCategory = document.querySelectorAll(".category");
      emojiCategory.forEach(function (emojiC) {
        emojiC.addEventListener("click", function (event) {
          let categoryId = event.target.id;
          let CategoryIdNumber = Number(categoryId.replace(/^\D+/g, ""));
          const EmojiSection = document.querySelectorAll(".category-section");
          EmojiSection.forEach(function (EmojiS) {
            let SectionId = EmojiS.id;
            let SectionIdNumber = Number(SectionId.replace(/^\D+/g, ""));
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

    let emojiClicked = false;
    let checkboxClicked = false;

    const EmjCont = document.querySelectorAll(".emoji-container");
    EmjCont.forEach(function (emj) {
      emj.addEventListener("click", function () {
        emojiClicked = true;
      });
    });

    const CheckCont = document.querySelectorAll(".checkbox-container");
    CheckCont.forEach(function (check) {
      check.addEventListener("click", function () {
        checkboxClicked = true;
      });
    });

    function DashboardDisplay(clickKey) {
      const taskpainel = document.querySelector(".tasks_panel");
      variaveis[clickKey] = variaveis[clickKey] || 0;
      const taskcontainer = document.querySelector(".tasks-container");
      const sidebar = document.querySelector(".sidebar");
      const sidebarBottons = document.querySelectorAll(".sidebar-bottons");

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

    const Alltasks = document.querySelectorAll(".tasks");
    Alltasks.forEach(function (task) {
      task.addEventListener("click", function (event) {
        selectedTaskId = task.id;

        const AllDescriptionInput =
          document.querySelectorAll(".DescriptionField");

        const AllTitleInput = document.querySelectorAll(".TitleField");

        let taskId = task.id;
        let taskIdNumber = Number(taskId.replace(/^\D+/g, ""));

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

        const titlepanel = document.querySelector(".TitlePanel");
        titlepanel.innerHTML = "<h2>Task" + "</h2>";

        const titleEditor = document.querySelector(".TitleField");
        titleEditor.setAttribute("id", "TitleEditor" + taskIdNumber);

        const InputDescripitions = document.querySelector(".DescriptionField");
        InputDescripitions.setAttribute(
          "id",
          "DescriptionEditor" + taskIdNumber
        );

        for (let j = 0; j < AllDescriptionInput.length; j++) {
          let DescriptionInput = AllDescriptionInput[j];
          let DescriptionId = DescriptionInput.id;
          let DescriptionIdNumber = 0;

          if (DescriptionId) {
            DescriptionIdNumber = Number(DescriptionId.replace(/^\D+/g, ""));
          }

          if (DescriptionIdNumber == taskIdNumber) {
            DescriptionInput.value = descriptions[`description${taskIdNumber}`];
          }
        }

        for (let i = 0; i < AllTitleInput.length; i++) {
          let titleInput = AllTitleInput[i];
          let titleId = titleInput.id;
          let titleIdNumber = 0;

          if (titleId) {
            titleIdNumber = Number(titleId.replace(/^\D+/g, ""));
          }

          if (titleIdNumber == taskIdNumber) {
            titleInput.value = titles[`title${taskIdNumber}`];
          }
        }

        const submitbtn = document.querySelector("#submitbotton");
        submitbtn.addEventListener("click", function () {
          for (let j = 0; j < AllTitleInput.length; j++) {
            let InputTitles = AllTitleInput[j];
            let TitleInputId = InputTitles.id;
            let TitleInputIdNumber = 0;

            if (TitleInputId) {
              TitleInputIdNumber = Number(TitleInputId.replace(/^\D+/g, ""));
            }

            if (TitleInputId == "TitleEditor" + taskIdNumber) {
              let TextTitle = InputTitles.value;
              const Title_tasks = document.querySelectorAll(
                ".title_task-container"
              );
              for (let k = 0; k < Title_tasks.length; k++) {
                let NewTitles = Title_tasks[k];
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

          for (let j = 0; j < AllDescriptionInput.length; j++) {
            let DescriptionInput = AllDescriptionInput[j];
            let DescriptionId = DescriptionInput.id;
            let DescriptionIdNumber = 0;

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

          for (let i = 0; i < AllTitleInput.length; i++) {
            let titleInput = AllTitleInput[i];
            let titleId = titleInput.id;
            let titleIdNumber = 0;

            if (titleId) {
              titleIdNumber = Number(titleId.replace(/^\D+/g, ""));
            }

            if (titleId === "TitleEditor" + taskIdNumber) {
              titles[`title${taskIdNumber}`] = titleInput.value;

              localStorage.setItem("titlesS", JSON.stringify(titles));
            }
          }

          const newCheckboxes = document.querySelectorAll("#checkbox" + indice);
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
      const quantity_text = document.querySelector("#quantity_text");

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
