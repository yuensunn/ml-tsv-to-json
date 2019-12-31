
// var os = require('os');
// var fs = require('fs');
// fs.readFile("./lol.tsv", 'utf8', function (err, data) {
//     let lines = data.split(os.EOL)
//     let jsons = [{}, {}, {}];
//     lines.forEach(x => {
//         let phrase = x.split('\t');
//         phrase.forEach((str, index) => {
//             if (index > 0 && !!phrase[0]) {
//                 jsons[index - 1] = { ...(jsons[index - 1]), [phrase[0]]: str }

//             }
//         })
//     })
//     if (!fs.exists('./generated', e => console.log(e))) {
//         fs.mkdir('generated', e => {
//             console.log(e)
//         });
//     }
//     jsons.forEach(j => {
//         fs.writeFile(`./generated/${j["LocaleValue"]}.json`, JSON.stringify(j), (e) => {
//             console.log(e);
//         });
//     })

// });

