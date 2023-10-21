const mysql = require('mysql');
var user_id = "NULL";
var con;
var tablerows = 0;
var tempsqlargs = '';
var tempsqlstring = '';
const config = require("./tables-config.json")
let headtblvals = config.table_data
let orderBy = 1;
asc_desc = "asc"

var canBeReturned = []

const connectToDbPromise = new Promise((resolve, reject) => {

    con = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: "password",
        database: 'футбольналіга'
    });

    con.connect(function (err) {
        if (err) throw err;
        resolve()
        console.log("Connected to db!");
    });
});

async function checkMainFile() {
    await connectToDbPromise;
    var params = new URLSearchParams(window.location.search);
    var table_name = params.get("table_name");
    var typeOfAction = params.get("typeOfAction");
    if (document.getElementById('add_row_container')) {
        try {
            con.query(
                `SELECT COLUMN_NAME
                FROM INFORMATION_SCHEMA.COLUMNS
                WHERE TABLE_NAME = '${table_name}';
                `,
                function (err, result, fields) {
                    if (err) {
                        throw err
                    }

                    let button = document.createElement("button");
                    let container = document.getElementById("add_row_container");
                    tablerows = result.length;

                    for (let i = 0; i < tablerows; i++) {
                        let label = document.createElement("label");
                        let input = document.createElement("input");
                        let br = document.createElement("br");
                        label.setAttribute("for", `myInput${i}`);
                        label.textContent = `Стовбець ${result[i].COLUMN_NAME}: `;
                        if (i > 0) {
                            tempsqlargs += ","
                        }
                        tempsqlargs += result[i].COLUMN_NAME

                        let inputType = "text"
                        if (result[i].COLUMN_NAME.includes("Дата")) {
                            inputType = "date"
                        }
                        input.setAttribute("type", inputType);
                        input.setAttribute("id", `myInput${i}`);

                        container.appendChild(label);
                        container.appendChild(input);
                        container.appendChild(br);
                    }
                    button.innerText = "Добавити рядок"
                    button.setAttribute("onClick", `extrawin_submit( '${typeOfAction}')`)
                    container.appendChild(button);
                }
            );
        } catch (error) {
            console.error('Помилка пошуку таблиці для добавлення:', error);
        }
    } else if (document.getElementById('del_row_container')) {
        try {
            con.query(
                `SELECT COLUMN_NAME
                FROM INFORMATION_SCHEMA.COLUMNS
                WHERE TABLE_NAME = '${table_name}';
                `,
                function (err, result, fields) {
                    if (err) {
                        throw err
                    }

                    let button = document.createElement("button");
                    let container = document.getElementById("del_row_container");

                    let label = document.createElement("label");
                    label.setAttribute(`for`, `${table_name}`);
                    label.textContent = `Видалити елемент де стовбець : `;
                    container.appendChild(label);

                    let select = document.createElement("select")
                    select.setAttribute("name", table_name)
                    select.setAttribute("id", table_name)
                    select.setAttribute("onchange", "extrawin_onChange()")
                    container.appendChild(select);

                    tablerows = result.length;

                    for (let i = 0; i < tablerows; i++) {
                        let option = document.createElement("option")
                        option.setAttribute("value", result[i].COLUMN_NAME)
                        option.innerText = result[i].COLUMN_NAME

                        select.appendChild(option);
                    }

                    label = document.createElement("label");
                    label.setAttribute(`for`, `deleteVal`);
                    label.textContent = `Дорівнює : `;
                    container.appendChild(label);

                    input = document.createElement("input")
                    input.setAttribute("type", "text");
                    input.setAttribute("id", `deleteVal`);
                    container.appendChild(input)

                    button.innerText = "Видалити рядок"
                    button.setAttribute("onClick", `extrawin_submit( '${typeOfAction}')`)
                    container.appendChild(button);
                }
            );
        } catch (error) {
            console.error('Помилка пошуку таблиці для видалення:', error);
        }
    } else if (document.getElementById('upd_row_container')) {
        try {
            con.query(
                `SELECT COLUMN_NAME
                FROM INFORMATION_SCHEMA.COLUMNS
                WHERE TABLE_NAME = '${table_name}';
                `,
                function (err, result, fields) {
                    if (err) {
                        throw err
                    }

                    let button = document.createElement("button");
                    let container = document.getElementById("upd_row_container");

                    let label = document.createElement("label");
                    label.setAttribute(`for`, `${table_name}`);
                    label.textContent = `Змінити елемент де стовбець : `;
                    container.appendChild(label);

                    let select = document.createElement("select")
                    select.setAttribute("name", table_name)
                    select.setAttribute("id", table_name)
                    select.setAttribute("onchange", `extrawin_onChange("del")`)
                    container.appendChild(select);

                    tablerows = result.length;

                    for (let i = 0; i < tablerows; i++) {
                        let option = document.createElement("option")
                        option.setAttribute("value", result[i].COLUMN_NAME)
                        option.innerText = result[i].COLUMN_NAME

                        select.appendChild(option);
                    }

                    label = document.createElement("label");
                    label.setAttribute(`for`, `deleteVal`);
                    label.textContent = `Дорівнює : `;
                    container.appendChild(label);

                    input = document.createElement("input")
                    input.setAttribute("type", "text");
                    input.setAttribute("id", `deleteVal`);
                    container.appendChild(input)

                    label = document.createElement("label");
                    label.setAttribute(`for`, `upd_whatVal`);
                    label.textContent = `Змінити : `;
                    container.appendChild(label);

                    select = document.createElement("select")
                    select.setAttribute("name", `upd_whatVal`)
                    select.setAttribute("id", `upd_whatVal`)
                    select.setAttribute("onchange", `extrawin_onChange("upd")`)
                    container.appendChild(select);

                    for (let i = 0; i < tablerows; i++) {
                        let option = document.createElement("option")
                        option.setAttribute("value", result[i].COLUMN_NAME)
                        option.innerText = result[i].COLUMN_NAME

                        select.appendChild(option);
                    }

                    label = document.createElement("label");
                    label.setAttribute(`for`, `updVal`);
                    label.textContent = `На : `;
                    container.appendChild(label);

                    input = document.createElement("input")
                    input.setAttribute("type", "text");
                    input.setAttribute("id", `updVal`);
                    container.appendChild(input)

                    button.innerText = "Змінити рядок"
                    button.setAttribute("onClick", `extrawin_submit( '${typeOfAction}')`)
                    container.appendChild(button);
                }
            );
        } catch (error) {
            console.error('Помилка пошуку таблиці для зміни:', error);
        }
    }
}

function toRegistration() {
    resetLoginForm();
    document.getElementById("registration_form").style.display = "block";
}

function toLogin() {
    resetLoginForm();
    document.getElementById("login_form").style.display = "block";
    document.getElementById("registration_form").style.display = "none";
}

function logOut() {
    document.getElementById("main_app").style.display = "none";
    toLogin();
    user_id = "NULL";
}

function resetLoginForm() {
    document.getElementById("login__username").value = "";
    document.getElementById("login__password").value = "";
}


function login() {
    let username = document.getElementsByClassName("logLogin")[0].value
    let password = document.getElementsByClassName("logPass")[0].value


    con.query("SELECT * FROM user_list", function (err, result, fields) {
        if (err) throw err;
        for (let i = 0; i < result.length; i++) {
            if (result[i].user_login == username &&
                result[i].user_password == password) {
                console.log("Вхід успішний")
                user_id = result[i].user_id
                dataLogUserActions(user_id, 'Logged in')
                app_connect(true);
                return
            }
        }
        alert("Данні для входу невірні")
    });
    
}

async function registrate() {
    let username = document.getElementsByClassName("regLogin")[0].value;
    let password = document.getElementsByClassName("regPass")[0].value;
    let password2 = document.getElementsByClassName("repeatPassword")[0].value;

    if (password === password2) {
        try {
            const findUserPromise = new Promise((resolve, reject) => {
                con.query(
                    `SELECT * FROM user_list WHERE user_login = '${username}'`,
                    function (err, result, fields) {
                        if (err) {
                            reject(err);
                            return;
                        }

                        if (result.length > 0) {
                            alert("Користувач з таким логіном вже є")
                            reject(new Error('Пользователь уже существует'));
                        } else {
                            resolve();
                        }
                    }
                );
            });

            await findUserPromise;

            const insertUserPromise = new Promise((resolve, reject) => {
                con.query(
                    `INSERT INTO user_list (user_login, user_password, user_restrictions)
           VALUES ('${username}', '${password}', 1)`,
                    function (err, result, fields) {
                        if (err) {
                            reject(err);
                            return;
                        }

                        console.log('Регистрация прошла успешно');
                        resolve(result.insertId);
                    }
                );
            });

            userId = await insertUserPromise;
            
            con.query(
                `INSERT INTO user_actions (user_id, user_action)
         VALUES ('${userId}', 'Registrated new account')`,
                function (err, result, fields) {
                    if (err) throw err;
                    console.log('Запись в лог успешно добавлена');
                    app_connect(true);
                }
            );
        } catch (error) {
            console.error('Ошибка регистрации:', error);
        }
    }
}

function asAGuest() {
    dataLogUserActions("NULL", 'Guest logged in');
    user_id = "NULL";
    app_connect(false);
}


async function app_connect(isLogged) {
    document.getElementById("login_form").style.display = "none";
    document.getElementById("registration_form").style.display = "none";
    document.getElementById("main_app").style.display = "block";

    let getUserStatus = new Promise((resolve, reject) => {
        con.query("SELECT * FROM user_list", function (err, result, fields) {
            if (err) {
                resolve(false)
                throw err
            }
            if (isLogged) {
                for (i = 0; i < document.getElementsByClassName("delButton").length; i++) {
                    document.getElementsByClassName("addButton")[i].disabled = false
                    document.getElementsByClassName("delButton")[i].disabled = false
                    document.getElementsByClassName("updButton")[i].disabled = false
                }
                for (let i = 0; i < result.length; i++) {
                    if (user_id == result[i].user_id) {
                        if (result[i].user_restrictions != 2) {
                            canBeReturned.push(document.getElementById("tab-10").parentNode)
                            canBeReturned.push(document.getElementById("tab-11").parentNode)
                            if (document.getElementById("tab-10").parentNode) {
                                document.getElementById("tab-10").parentNode.remove()
                                document.getElementById("tab-11").parentNode.remove()
                            }
                        } else {
                            if (canBeReturned.length) {
                                document.getElementsByClassName("tabs")[0].appendChild(canBeReturned[0])
                                document.getElementsByClassName("tabs")[0].appendChild(canBeReturned[1])
                                canBeReturned = []
                            }
                        }
                        break
                    }
                }
            } else {
                canBeReturned.push(document.getElementById("tab-10").parentNode)
                canBeReturned.push(document.getElementById("tab-11").parentNode)
                if (document.getElementById("tab-10").parentNode) {
                    document.getElementById("tab-10").parentNode.remove()
                    document.getElementById("tab-11").parentNode.remove()
                }
                for (i = 0; i < document.getElementsByClassName("delButton").length; i++) {
                    document.getElementsByClassName("addButton")[i].disabled = true
                    document.getElementsByClassName("delButton")[i].disabled = true
                    document.getElementsByClassName("updButton")[i].disabled = true
                }
            }
            resolve(true)
        });
    })

    if (await getUserStatus) {
        reloadTables() 
    }

    for (let i = 1; document.getElementById("tab-" + i) != undefined; i++) {
        let p = document.getElementById("tab-" + i);
        p.onclick = function (event) { defaultOrder() };
        let search = document.getElementsByClassName("searchInput")[i-1]
        search.setAttribute("id", "searchInput" + i)
    }
}

function dataLogUserActions(id_of_user, action_text) {
    con.query(
        `INSERT INTO user_actions (user_id, user_action)
         VALUES (${id_of_user}, '${action_text}')`,
        (err, result, fields) => {
            if (err) {
                console.error('Помилка логу:', err);
            } else {
                console.log('Запис в лог успішно додано');
            }
        }
    );
}

function rowAction(table_name, typeOfAction) { 
    extrawindow = window.open(`${typeOfAction}row.html?table_name=` + encodeURIComponent(table_name)
                                + '&typeOfAction=' + encodeURIComponent(typeOfAction)
                                + '&user_id=' + encodeURIComponent(user_id)
                             );
}

async function extrawin_submit(typeOfAction) {
    var params = new URLSearchParams(window.location.search);
    var table_name = params.get("table_name");
    var typeOfAction = params.get("typeOfAction");
    var user_id = params.get("user_id")
    var action;

    switch (typeOfAction) {
        case "add":
            action = new Promise((resolve, reject) => {
                try {
                    for (let i = 0; i < tablerows; i++) {
                        if (i > 0) {
                            tempsqlstring += ','
                        }
                        let temp = document.getElementById(`myInput${i}`).value
                        tempsqlstring += goToSqlString(temp)
                    }
                    con.query(
                        `INSERT INTO ${table_name} (${tempsqlargs})
                     VALUES (${tempsqlstring});
                    `,
                        function (err, result, fields) {
                            if (err) {
                                throw err;
                                resolve(false);
                            }
                            resolve(true);
                        }
                    );
                } catch (error) {
                    resolve(false);
                    console.log(error)
                }
            });
            break;

        case "del":
            action = new Promise((resolve, reject) => {
                try {
                    where = document.getElementById(`${table_name}`).value
                    what = document.getElementById(`deleteVal`).value
                     con.query(
                         `DELETE FROM ${table_name} WHERE ${where} = ${goToSqlString(what)} LIMIT 1`,
                        function (err, result, fields) {
                            if (err) {
                                resolve(false);
                            }
                            resolve(true);
                        }
                    );
                } catch (error) {
                    resolve(false);
                }
            });
            break;
        case "upd":
            action = new Promise((resolve, reject) => {
                try {
                    where = document.getElementById(`${table_name}`).value
                    what = document.getElementById(`deleteVal`).value
                    fromWhere = document.getElementById("upd_whatVal").value
                    toWhat = document.getElementById(`updVal`).value
                    con.query(
                        `UPDATE ${table_name} SET ${fromWhere} = ${goToSqlString(toWhat)} WHERE ${where} = ${goToSqlString(what)} LIMIT 1`,
                        function (err, result, fields) {
                            if (err) {
                                resolve(false);
                            }
                            resolve(true);
                        }
                    );
                } catch (error) {
                    resolve(false);
                }
            });
            break;
    }
    if (await action) {
        alert("Операція прошла успішно")
        dataLogUserActions(user_id, `Змінення таблиці ${table_name} : ${typeOfAction}`)
        window.close()
    } else {
        console.error('Помилка при зміненні таблиці:', error);
        alert("При виконанні операції сталася помилка")
        dataLogUserActions(user_id, `Невдала спроба змінення таблиці ${table_name} : ${typeOfAction}`)
        window.close()
    }
    
}

function goToSqlString(str) {
    return /^\d+$/.test(str) ? str : `'${str}'`;
}


async function extrawin_onChange(typeAction) {
    const params = new URLSearchParams(window.location.search);
    const table_name = params.get("table_name");
    const inputType = document.getElementById(table_name).value.includes("Дата") ? "date" : "text";
    const inputId = typeAction ? "deleteVal" : "updVal";

    const input = document.getElementById(inputId);
    input.setAttribute("value", "");
    input.setAttribute("type", inputType);
}


function reloadTables() {
    try {
        // Запрос на отримання списку таблиць з бд
        const getTables = new Promise((resolve, reject) => {
            con.query(
                `SELECT table_name
                 FROM INFORMATION_SCHEMA.tables
                 WHERE table_schema = "футбольналіга"`,
                function (err, result, fields) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(result);
                    }
                }
            );
        });

        getTables
            .then((tables) => {
                // Обработка списку таблиць
                const promises = tables.map((table) => {
                    const tableName = table.TABLE_NAME;
                    const table_head = document.getElementById("table_head-" + tableName);

                    if (table_head) {
                        let tr_head = document.getElementById("tr-" + tableName);
                        tr_head.innerHTML = '';
                        let table_body = document.getElementById("table_body-" + tableName);
                        table_body.innerHTML = '';

                        // Запрос на отримання списку стовбців
                        const getColumns = new Promise((resolve, reject) => {
                            con.query(
                                `SELECT COLUMN_NAME
                                 FROM INFORMATION_SCHEMA.COLUMNS
                                 WHERE TABLE_NAME = '${tableName}'`,
                                function (err, result, fields) {
                                    if (err) {
                                        reject(err);
                                    } else {
                                        resolve(result);
                                    }
                                }
                            );
                        });

                        return getColumns.then((columns) => {
                            let pos;
                            for (let p = 0; p < headtblvals.length; p++) {
                                if (tableName == headtblvals[p][0]) {
                                    pos = p;
                                    break;
                                }
                            }
                            for (let j = 0; j < columns.length; j++) {
                                let th = document.createElement("th");
                                th.setAttribute("class", "column" + j);
                                th.setAttribute("onclick", "placeOrderBy(" + j +")");
                                if (headtblvals[pos][1][j] != undefined) {
                                    tr_head.appendChild(th);
                                    th.innerHTML = headtblvals[pos][1][j];
                                }
                            }

                            // Запрос отримання даних з таблиці
                            const getTableData = new Promise((resolve, reject) => {
                                con.query(
                                    `SELECT * FROM ${tableName} order by ${orderBy} ${asc_desc}`,
                                    function (err, result, fields) {
                                        if (err) {
                                            reject(err);
                                        } else {
                                            resolve(result);
                                        }
                                    }
                                );
                            });

                            return getTableData.then((data) => {
                                for (let k = 0; k < data.length; k++) {
                                    let tr = document.createElement("tr");
                                    table_body.appendChild(tr);
                                    rowData = Object.values(data[k]);
                                    for (let h = 0; h < rowData.length; h++) {
                                        let td = document.createElement("td");
                                        td.setAttribute("class", "column" + h);
                                        tr.appendChild(td);
                                        rowString = rowData[h] + " "
                                        if (rowString.includes("GMT") && tableName != "user_actions"){
                                            rowData[h] = rowString.substring(0,15)
                                        }
                                        if (tableName == "user_actions") {
                                            if (rowData[h] == null) {
                                                rowData[h] = "Guest"
                                            }
                                        }
                                        td.innerHTML = rowData[h];
                                        // Допрацювати це гівно
                                    }
                                }
                            });
                        });
                    } else {
                        return Promise.resolve();
                    }
                });

                return Promise.all(promises);
            })
            .catch((error) => {
                console.error('Помилка завантаження таблиць:', error);
            });
    } catch (error) {
        console.error('Помилка завантаження таблиць:', error);
    }
}

function placeOrderBy(pos) {
    if (orderBy == pos + 1) {
        asc_desc = asc_desc === "asc" ? "desc" : "asc";
    } else {
        orderBy = pos + 1;
    }
}

function defaultOrder() {
    orderBy = 1;
    asc_desc = "asc"
}

function searchBy(temp_table_name) {
    const table_name_like = config.table_name_like;

    const pos = headtblvals.findIndex(([name]) => name === temp_table_name);
    if (pos === -1) {
        console.error('Елемент з іменем ' + temp_table_name + ' не знайдений.');
        return;
    }

    const like = document.getElementById("searchInput" + (pos + 1)).value;

    con.query(
        `SELECT * FROM ${temp_table_name} WHERE ${table_name_like[pos][1]} LIKE "%${like}%" ORDER BY ${orderBy} ${asc_desc}`,
        function (err, result, fields) {
            if (err) {
                console.error(err);
                return;
            }

            const table_body = document.getElementById("table_body-" + temp_table_name);
            table_body.innerHTML = '';

            for (const row of result) {
                const tr = document.createElement("tr");
                table_body.appendChild(tr);

                for (let i = 0; i < Object.values(row).length; i++) {
                    const td = document.createElement("td");
                    td.setAttribute("class", "column" + i);
                    tr.appendChild(td);
                    let rowString = Object.values(row)[i] + " ";
                    if (rowString.includes("GMT") && temp_table_name !== "user_actions") {
                        rowString = rowString.substring(0, 15);
                    }
                    if (temp_table_name === "user_actions" && Object.values(row)[i] === null) {
                        Object.values(row)[i] = "Guest";
                    }
                    td.innerHTML = Object.values(row)[i];
                }
            }
        }
    );
}


function printElement(temp_table_name) {
    const elementToPrint = Array.from(headtblvals).find(([name]) => name === temp_table_name);
    if (elementToPrint) {
        const [, element] = elementToPrint;
        const printWindow = window.open('', '_blank');
        printWindow.document.write('<html><head><title>Print</title></head><body>');
        printWindow.document.write(document.getElementsByClassName("print")[headtblvals.indexOf(elementToPrint)].innerHTML);
        printWindow.document.write('</body></html>');
        printWindow.document.close();
        printWindow.print();
        printWindow.close();
    } else {
        console.error('Елемент з іменем ' + temp_table_name + ' не знайдений.');
    }
}



checkMainFile();