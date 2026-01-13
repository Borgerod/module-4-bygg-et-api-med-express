//? From tutorial - prob wont use
// import fs from "fs";
// import path from "path";

// /**
//  * Reads and converts and returns a JSON-string as an object.
//  * @param {string} dbName
//  * @returns {object}
//  */
// module.exports.readJsonDB = (dbName) => {
//   const filePath = path.join(__dirname, "data", `${dbName}.db.json`);

//   if (!fs.existsSync(filePath)) {
//     throw new Error(`File ${dbName} does not exist in "./data"!`);
//   }

//   const buffer = fs.readFileSync(filePath);
//   const obj = JSON.parse(buffer.toString("utf8"));

//   return obj;
// };

// /**
//  * Converts and writes an object as a JSON-file.
//  * @param {string} dbName
//  * @param {string} data
//  */
// module.exports.writeJsonDB = (dbName, data) => {
//   const filePath = path.join(__dirname, "data", `${dbName}.db.json`);

//   if (!fs.existsSync(filePath)) {
//     throw new Error(`File ${dbName} does not exist in "./data"!`);
//   }

//   fs.writeFileSync(filePath, data, { encoding: "utf8" });
// };
