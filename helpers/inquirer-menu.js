require('colors');

const inquirer = require('inquirer');
const TaskManager = require("../models/task-manager");

const COMPLETED_MESSAGE = "COMPLETED".green;
const PENDING_MESSAGE = "PENDING".red;
const ASK_FOR_DESCRIPTION_MESSAGE = "Enter the description:";
const DELETE_MESSAGE = "Choose task to delete";
const EXIT_CONFIRMATION_MESSAGE = "Are you sure you want to exit?";
const DELETE_TASK_CONFIRMATION_MESSAGE = "Are you sure you want to delete this task?";
const CHANGE_TASK_STATUS_MESSAGE = "Select the completed tasks:";
const EXIT_MESSAGE = "See you soon!!";
const EXIT_KEY = "EXIT_NOW";

const taskManager = new TaskManager();

const confirmOperation = async (message) => {
    const question = [
        {
            type: 'confirm',
            name: 'ok',
            message
        }
    ];

    const {ok: confirmation} = await inquirer.prompt(question);

    return confirmation;
};


const createNewTask = async () => {
    const description = await readInput(ASK_FOR_DESCRIPTION_MESSAGE);
    taskManager.createTask(description);
};

const printAllTasks = () => {
    taskManager.allTasksArray.forEach((task, index) => {
        const {description, completedAt} = task;
        const res = `${(index + 1).toString().green} :: ${description} :: ` +
                `${completedAt ? COMPLETED_MESSAGE : PENDING_MESSAGE }`;
        console.log(res);
    });
};


const printCompletedTasks = () => {
    taskManager.completedTasksArray.forEach((task, index) => {
        const {description} = task;
        const res = `${(index + 1).toString().green} :: ${description}`;
        console.log(res);
    });
};

const printPendingTasks = () => {
    taskManager.pendingTasksArray.forEach((task, index) => {
        const {description} = task;
        const res = `${(index + 1).toString().red} :: ${description}`;
        console.log(res);
    });
};

const deleteTask = async () => {
    const choices = taskManager.allTasksArray.map((task, index) => {
        return {
            name: `${(index + 1).toString().green} - ${task.description}`,
            value: task
        }
    });

    choices.unshift({
        name: `${"0".green} - Cancel`,
        value: null
    })

    const question = [
        {
            type: 'list',
            name: 'taskToDelete',
            message: DELETE_MESSAGE,
            choices: choices
        }
    ]

    const {taskToDelete} = await inquirer.prompt(question);

    if (!taskToDelete) {
        return;
    }

    const confirmed = await confirmOperation(DELETE_TASK_CONFIRMATION_MESSAGE);

    if (confirmed) {
        taskManager.deleteTask(taskToDelete.id)
    }
};

const changeTaskStatusToCompleted = (task) => {
    task.completedAt = new Date().toISOString();
    taskManager.updateTask(task);
};

const changeTaskStatusToPending = (task) => {
    task.completedAt = null;
    taskManager.updateTask(task);
};

const toggleStatus = async () => {
    const allTasks = taskManager.allTasksArray;
    const choices = allTasks.map((task, index) => {
        return {
            name: `${index.toString().green} - ${task.description}`,
            value: task,
            checked: task.completedAt
        }
    });

    const question = [
        {
            type: 'checkbox',
            name: 'tasksToChangeStatus',
            message: CHANGE_TASK_STATUS_MESSAGE,
            choices
        }
    ];

    const {tasksToChangeStatus} = await inquirer.prompt(question);

    tasksToChangeStatus.forEach(t => {
        if (!t.completedAt) {
            changeTaskStatusToCompleted(t);
        }
    });

    allTasks.filter(t => !tasksToChangeStatus.includes(t)).forEach(t => {
        changeTaskStatusToPending(t);
    });

};

const exit = async () => {
    const confirmed = await confirmOperation(EXIT_CONFIRMATION_MESSAGE);

    if (confirmed) {
        console.log(EXIT_MESSAGE);
        return EXIT_KEY;
    }
};


const options = [
    {
        title: 'Exit',
        action: exit
    },
    {
        title: 'Create task',
        action: createNewTask
    },
    {
        title: 'List all tasks',
        action: printAllTasks
    },
    {
        title: 'List completed tasks',
        action: printCompletedTasks
    },
    {
        title: 'List pending tasks',
        action: printPendingTasks
    },
    {
        title: 'Change task status',
        action: toggleStatus
    },
    {
        title: 'Delete task',
        action: deleteTask
    }
];

const createDynamicChoices = options.map((opt, index) => {
    return {
        name: `${index.toString().green} ${opt.title}`,
        value: opt
    }
})

const menuQuestions = [
    {
        type: 'list',
        name: 'option',
        message: 'What do you want to do?',
        choices: createDynamicChoices
    }
]

const inquirerMenu = async () => {
    const { option } = await inquirer.prompt(menuQuestions);

    return option;
}

const readInput = async message => {
    const question = [
        {
            type: 'input',
            name: 'description',
            message,
            validate(value) {
                return value.length === 0 ?
                    "Please enter a value" :
                    true;
            }
        }
    ];

    const {description} = await inquirer.prompt(question);

    return description;
};

const processOption = option => {
    return option.action();
};


module.exports = {
    inquirerMenu,
    processOption,
    processOption,
    EXIT_KEY
};
