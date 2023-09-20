const { error } = require("./src/constants");
const File = require("./src/file");
const assert = require("assert");

// this is an IFEE (self-executable function)
(async () => {
  // variables inside this block will only be valid during their execution
  {
    const filePath = "./mocks/emptyFile-invalid.csv";
    const filePath2 = "./mocks/fiveItems-invalid.csv";
    const expected = new Error(error.FILE_LENGTH_ERROR_MESSAGE);
    const result = File.csvToJson(filePath, filePath2);
    await assert.rejects(result, expected);
  }

  // since all the variables are inserted into blocs, we can use the same names
  {
    const filePath = "./mocks/invalid-header.csv";
    const expected = new Error(error.FILE_FIELDS_ERROR_MESSAGE);
    const result = File.csvToJson(filePath);
    await assert.rejects(result, expected);
  }

  // This is the valid one, so the expected is the values of the csv
  {
    const filePath = "./mocks/threeItems-valid.csv";
    const expected = [
      {
        id: 1,
        name: "jose",
        profession: "manager",
        age: 22,
      },
      {
        id: 2,
        name: "charles",
        profession: "operator",
        age: 35,
      },
      {
        id: 3,
        name: "ana",
        profession: "analyst",
        age: 20,
      },
    ];
    const result = await File.csvToJson(filePath);
    assert.deepEqual(result, expected);
  }
})();
