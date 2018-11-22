var fs = require('fs');
var glob = require('glob');
var path = require('path');
carga();
function carga(temp) {

    glob(path.normalize(path.resolve(__dirname, '../cdn.landing.engine/templates/*.php')), function(err, files) {
        if (err) {
            process.send("Error: " + err);
        } else {
           
            console.log(files);
             for (index in files) {

    fs.writeFile(path.resolve(__dirname, '../cdn.landing.engine/templates/final/'+files[index].split("/").pop()+".tpl") ,files[index].split("/").pop().replace(".php",""), function(err) {
        if (err) {
          console.log("error")
        } else {
            console.log("listo")

        };
    });

    }
        }
    });
}

