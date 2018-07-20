const chalk = require("chalk");
const yargs = require("yargs");
const path = require("path");
const fs = require("fs");
const config = require("./config.json");

yargs
.command("rip <path>", "Infects the file with invisible unicode characters", $ => {
    $.positional("path", {
        describe: "Path of the source code file"
    })
}, argv => infect(argv))
.command("clean <path>", "Cleans the infected file", $ => {
    $.positional("path", {
        describe: "Path of the source code file"
    })
}, argv => cleanFile(argv))
.demandCommand().help().argv;

function cleanFile(options) {
    let _p = options.path;
    _p = path.resolve(_p);

    if(!fs.existsSync(_p)) {
        return console.log("File", chalk.yellow(_p), "does not exist!");
    }

    fs.readFile(_p, (err, data) => {
        if(err) throw err;

        let d = data.toString();
        
        for(let i = 0; i < config.chars.length; i++) {
            d = d.replace(RegExp(config.chars[i], "gm"), "");
        }

        fs.writeFile(_p, d, err => { 
            if(err) throw err;
            console.log(chalk.green("Completed!\n"), "Cleared all invisible characters")
        })
    })
}

function infect(options) {
    let _p = options.path;
    _p = path.resolve(_p);

    if(!fs.existsSync(_p)) {
        return console.log("File", chalk.yellow(_p), "does not exist!");
    }

    fs.readFile(_p, (err, data) => {
        if(err) throw err;

        let out = makeDirty(data, options);

        fs.writeFile(_p, out.data, err => { 
            if(err) throw err;
            console.log(chalk.green("Completed!\n"), "Inserted", chalk.blue(out.insertedChars), "invisible characters with a", chalk.blue(config.chances) + "%", "chance")
        })
    })
}


function makeDirty(str, options) {
    
    function shouldInsert(){
        return Math.random() >= (100 - config.chances) / 100;
    }

    str = str.toString();

    let insertedChars = 0;
    let newStr = "";
    
    for(let i = 0; i < str.length; i++) {
        let char = str[i];
        if(config.places.indexOf(char) >= 0 && shouldInsert()) {
            newStr += config.chars[Math.round(Math.random() * (config.chars.length - 1))];
            insertedChars++;
        }
        newStr += char;
    }

    return {data: newStr, insertedChars};
}