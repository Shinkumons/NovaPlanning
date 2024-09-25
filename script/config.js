!async function () {
    fetch_events().then(events => {
        parse_event(events);
    })
        .catch(error => {
            console.error(error);
        });
}();

function parse_event(events) {

    var i = 0;
    for (const [option, cursus_list] of Object.entries(events)){
        const button_course = document.createElement("button");
        button_course.innerHTML = option;
        button_course.className = ("buttonList " + (i%2 ? "impair" : "pair"));
        button_course.onclick = onClickButtonList;
        document.getElementById("sbl-course").appendChild(button_course)

        const cursus_div = document.createElement("div");
        cursus_div.id = option;
        cursus_div.style.display= "none";
        document.getElementById("cursus-content").appendChild(cursus_div);

        i++;

        for (const [cursus, courses] of Object.entries(cursus_list)) {
            const year_container = document.createElement("div");
            cursus_div.appendChild(year_container);

            console.log(year_container.id)
            
            const title_box = document.createElement("div");
            title_box.className = "title-box";
            year_container.appendChild(title_box);


            const img = document.createElement("img");
            img.src = "./arrow.png";
            img.className = "arrow-img";
            img.onclick = derollCourses;
            title_box.appendChild(img);

            // Loop for each cursus
            const title = document.createElement("h1");
            title.innerHTML = cursus;
            title.onclick = derollCourses;
            title_box.appendChild(title);

            const checkall = createRowDiv(cursus_div.id + "$" + cursus, "Tout sélectionner", onCheckAll, "", "", true);
            title_box.appendChild(checkall.children[0]);
            title_box.appendChild(checkall.children[0]);

            const table = document.createElement("table");
            table.style.display = "none";
            table.id = cursus;
            year_container.appendChild(table);

            //var row = createRow(cursus,"Tout sélectionner",onCheckAll,"")
            //table.appendChild(row);

            for (const [course, event] of Object.entries(courses)) {
                let base_color =  "#0026ad"
                if (event.length !== 0) {
                    base_color = event[0]["color"];
                }
                const row = createRow(cursus_div.id + "$" + cursus + "_" + course, course, onCheck, cursus_div.id + "$" + cursus, base_color);
                row.id = cursus_div.id + "$" + cursus + "_" + course;
                
                table.appendChild(row);
            }
        }
    }
}

function derollCourses(e) {
    table = e.target.parentElement.parentElement.lastChild;
    img = e.target.parentElement.firstChild;
    if (table.style.display == "none") {
        table.style.display = "inline";
        img.src = "./arrow-close.png";
    } else {
        table.style.display = "none";
        img.src = "./arrow.png";
    }
}


function createRow(id, text, onclick, name, color) {
    const row = document.createElement("tr");

    const checkbox_container = document.createElement("td");
    row.appendChild(checkbox_container);

    // console.log("id : " + id)
    const div = createRowDiv(id, text, onclick, name, color);
    checkbox_container.appendChild(div);

    return row;
}

function onClickScrollBarRoll() {
    const x = document.getElementById("sbl-course");
    if (x.style.display == "none") {
        x.style.display = "flex";
    } else {
        x.style.display = "none";
    }
    
}

function onClickButtonList(e) {
    let cursus = document.getElementById("cursus-content").childNodes;

    for (let i=1; i<cursus.length; i++) {
        cursus[i].style.display = "none";
    }

    document.getElementById(e.target.innerHTML).style.display = "inline";
    document.getElementById("scrlbtn").innerHTML = e.target.innerHTML;
}

function createRowDiv(id, text, onclick, name, base_color, title=false) {
    const div = document.createElement("div");
    div.className = "checkbox-line";
    div.id = id;

    const checkbox_input = document.createElement("input");

    checkbox_input.id = id;
    checkbox_input.type = "checkbox";
    checkbox_input.onclick = onclick;
    checkbox_input.name = name;
    div.appendChild(checkbox_input);
    
    if (!title) {
        const colorBox = document.createElement("input");
        colorBox.type = "color";
        colorBox.className = "colorWell";
        let color = "#878787";
        
        regex_match_color = base_color.match("^#(?:[0-9a-fA-F]{3}){1,2}$")
        if (regex_match_color !== null) {
            if (base_color.match("^#(?:[0-9a-fA-F]{3}){1,2}$").length === 1) {
                color = base_color;
            }
        }

        if (localStorage.getItem("COLORDATA "+id) !== null) {
            color = localStorage.getItem("COLORDATA "+id)
        }
        colorBox.value = color;
        div.appendChild(colorBox);
    }

    const label = document.createElement("label");
    label.htmlFor = id;
    label.innerHTML = text;
    div.appendChild(label);
    checkbox_input.checked = localStorage.getItem(id) !== null;

    return div;
}

function onCheckAll(e) {
    const isCheck = document.getElementById(e.target.id).checked;
    const checkboxes = document.getElementsByName(e.target.id);
    for (const checkbox of checkboxes) {
        if(isCheck && !checkbox.checked){
            checkbox.checked = true;
            toggle_course(checkbox.id);
        }
        else if (!isCheck && checkbox.checked){
            checkbox.checked = false;
            toggle_course(checkbox.id);
        }
    }
    toggle_course(e.target.id);
}

function onCheck(e) {
    const isCheck = document.getElementById(e.target.parentElement.id).checked;
    toggle_course(e.target.id);
}

function changeColor(id, color) {
    if (localStorage.getItem(id) !== null) {
        localStorage.setItem(id, color);    
    }
}

function toggle_course(id, remove=false){
    if (remove || localStorage.getItem(id) !== null){
        localStorage.removeItem(id)
    }else {
        localStorage.setItem(id,"")
    }
}

window.onclick = function(event) {
    if (!event.target.matches('.scrollbtn')) {
        document.getElementById("sbl-course").style.display = "none";
    }
}

let colorWell;
const defaultColor = "#878787";

function startupColor() {
    let colorWell = document.querySelectorAll(".colorWell")

    colorWell.forEach((colorBox) => {
        colorBox.value = localStorage.getItem("COLORDATA " + colorBox.parentElement.id);
        colorBox.addEventListener("change", updateColor, false);
        colorBox.select();
    })
}

function updateColor(e) {
    changeColor(e.target.parentElement.id, e.target.value);
    id = e.target.parentElement.id;
    localStorage.setItem("COLORDATA " + id, e.target.value);
}

window.addEventListener("load", startupColor, false);
