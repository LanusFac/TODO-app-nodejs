const {v4: uuid} = require('uuid');

class Task {
    id = '';
    description = '';
    completedAt = null;

    constructor(description, id = uuid(), completedAt = null) {
        this.description = description;
        this.id = id;
        this.completedAt = completedAt;
    }

}

module.exports = Task;
