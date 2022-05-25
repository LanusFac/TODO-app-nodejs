# TODO-app

This is just a little TODO command-line app made with Node.js.

At the beginning, you just need to clone the repo and make an `npm install`.

To run the app you just need to run `npm start` at the root of the project. Then you will have a menu where you will be able to create new task, change their status and delete them, between another things.

All task than you create will be added to a JSON file (`db.json`), and you don't need to create this file if you don't have it, because this is automatically resolves!!!

This repo just has a nice way to use some NODE Inquirer Library, you can see that on the `iquirer-menu.js`, where all the features of this app are created on a `options` array so if you want to add a new feature you just need to add it here setting only a `title` and an `action`.
It is just an easy wey to create new features without modifying the base logic of how the main menu is made.


