require('colors')
const {headerApp} = require("./helpers/messages");
const {inquirerMenu, processOption, EXIT_KEY} = require("./helpers/inquirer-menu");

const main = async() => {
    let opt;
    let res;
    do {
        headerApp();
        opt = await inquirerMenu();
        res = await processOption(opt);

    } while (res !== EXIT_KEY)

}

main();
