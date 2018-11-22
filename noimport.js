var glob = require('glob');
var path = require('path');
var request = require('request');
const fs = require("fs");
var formula=new RegExp("googleapis((?!\\)).)*\\)");
    glob(path.normalize(path.resolve(__dirname, '../adwebs.css/sources_sass/**/*.scss')), function(err, files) {
        if (err) {
            console.log("Error: " + err);
        } else {
            for (var index in files){
                check(files[index]);
            }
        }
    });

function check(file){
                fs.readFile(file, (err, data, isdone) => {
                    if (err) {
                        console.log("No encuentro template " + file + " " + err);
                    } else {
                        console.log("archivo "+file)
                    var code_template = data.toString();
                    if (code_template.match(formula)){ 
                        var direc=code_template.match(formula).toString()
                        console.log("encuentro "+direc);
                        console.log("encuentrob "+direc.substr(0,direc.length - 4));
                    contenido(file, code_template, "@import url('https://fonts."+direc.substr(0,direc.length - 4), "https://fonts."+direc.substr(0,direc.length - 4));
                }
                    }
                })
}

function contenido(miarchivo, micodigo,miruta,  url){
request(url, function (error, response, body) {
  console.log(url + "  "+body);
  if (!error && response.statusCode == 200) {
   console.log( body);
                var cambiado= micodigo.replace(miruta, body)
                console.log("mimi "+miruta);
                console.log(cambiado);
               fs.writeFile(miarchivo, cambiado, function(err) {
                if (err) {
                    return console.log("Error en escritura " + err)
                } else {
                    console.log("finito");
                };
            });
  }
});
}