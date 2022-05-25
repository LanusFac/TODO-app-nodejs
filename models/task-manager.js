const Task = require("./task");
const fs = require("fs");

const dbPath = './db.json';
const ERROR_NO_ENTRY_CODE = "ENOENT";

class TaskManager {

    _list = {};

    constructor() {
        this.#readAllTasksFromDb();
    }

    get allTasksArray() {
        return this.#taskListValues;
    }

    get completedTasksArray() {
        const list = this.#taskListValues;
        return list.filter(task => task.completedAt);
    }

    get pendingTasksArray() {
        const list = this.#taskListValues;
        return list.filter(task => !task.completedAt);
    }

    deleteTask(id) {
        if (this._list[id]) {
            delete this._list[id];
            this.saveAllTasks();
        }
    }

    updateTask(task) {
        this._list[task.id] = task;
        this.saveAllTasks();
    }

    createTask(description) {
        const newTask = new Task(description);

        this._list[newTask.id] = newTask;
        this.saveAllTasks();
    }

    saveAllTasks() {
        const json = JSON.stringify(this.allTasksArray);
        fs.writeFileSync(dbPath, json);
    }

    #readAllTasksFromDb() {
        let readRes = "";
        try {
            readRes = fs.readFileSync(dbPath, {encoding: 'utf8'});
        } catch (err) {
            console.log(err);
            if (err.code === ERROR_NO_ENTRY_CODE) {
                this.#createDbFile();
                this.#readAllTasksFromDb();
                return;
            }
        }
        JSON.parse(readRes).forEach(val => {
            this._list[val.id] = new Task(val.description, val.id, val.completedAt);
        });
    }

    #createDbFile() {
        fs.writeFileSync(dbPath, "[]");
    }

    get #taskListValues() {
        return Object.values(this._list)
    }

}

module.exports = TaskManager;
