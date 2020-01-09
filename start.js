// let us = require('./en-US');
// let cn = require('./zh-CN');
// let tw = require('./zh-TW');

// var os = require("os");

// var fs = require('fs')
// var logger = fs.createWriteStream('log.tsv', {
//     flags: 'w' // 'a' means appending (old data will be preserved)
// })


// Object.keys(us).forEach(x => {
//     logger.write(`${x}\t${us[x]}\t${cn[x]?cn[x]:"NOT FOUND"}\t${tw[x]?tw[x]:"NOT FOUND"}${os.EOL}`);
// })


// logger.end();




const express = require("express");
const path = require("path");
const app = express();
const os = require('os');
const axios = require('axios');
const multer = require('multer');
const archiver = require('archiver');


const archive = (folderName, onclose) => {
    const zipName = folderName + ".zip";
    const source = path.join(__dirname,  folderName);
    const out = path.join(__dirname, "tmp", zipName);

    const archive = archiver('zip', { zlib: { level: 9 } });
    const stream = fs.createWriteStream(out);

    archive
        .directory(source, false)
        .on('error', err => {
            console.log(err);
            throw err;
        })
        .pipe(stream);

    stream.on('close', onclose);
    archive.finalize();
    console.log("zip file created");


};

var fs = require('fs');

if (!fs.exists('./public/uploads', e => console.log(e))) {
    fs.mkdir('./public/uploads', e => {
        console.log(e)
    });
}
if (!fs.exists('./tmp', e => console.log(e))) {
    fs.mkdir('./tmp', e => {
        console.log(e)
    });
}
var upload = multer({
    storage: multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, 'public/uploads/')
        },
        filename: function (req, file, cb) {
            cb(null, file.originalname)
        }
    })
})


app.set("view engine", "pug");

app.use(express.static(__dirname + "/public"));
app.use(express.static(__dirname + "/tmp"));

app.get("/", (req, res) => {
    res.render("index", {
        title: "CSV TO JSON",
        download: () => {
            console.log('jey');
        }
    });
});


app.post('/', upload.single('csv'), async function (req, res) {

    fs.readFile(req.file.destination + req.file.filename, 'utf8', function (err, data) {

        let lines = data.split(os.EOL)
        let jsons = [{}, {}, {}];
        lines.forEach(x => {

            let phrase = x.split('\t');
            phrase.forEach((str, index) => {
                if (index > 0 && !!phrase[0]) {
                    jsons[index - 1] = { ...(jsons[index - 1]), [phrase[0]]: str }
                }
            })
        })
        if (!fs.exists('./generated', e => console.log(e))) {
            fs.mkdir('generated', e => {
                console.log(e)
            });
        }
        jsons.forEach(j => {
            fs.writeFile(`./generated/${j["LocaleValue"]}.json`, JSON.stringify(j), (e) => {
                console.log(e);
            });
        })


        archive("generated", () => {
            res.download(`${__dirname}/tmp/generated.zip`);

        });

    });


});

const server = app.listen(process.env.PORT, () => {
    console.log(`Express running → PORT ${server.address().port}`);
});