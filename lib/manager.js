const Employee = require("./employee");

class Manager extends Employee {
    constructor(name, id, email, number) {
        super(name, id, email);
        this.officeNumber = number;
    }
    getRole() {
        return "Manager";
    }
}

module.exports = Manager;