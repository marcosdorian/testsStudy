const Service = require("./service");
const assert = require("assert");
const BASE_URL_1 = "https://swapi.dev/api/planets/1/";
const BASE_URL_2 = "https://swapi.dev/api/planets/2/";
const { createSandbox } = require("sinon");
const sinon = createSandbox();
const mocks = {
  tatooine: require("./../mocks/tatooine.json"),
  alderaan: require("./../mocks/alderaan.json"),
};

(async () => {
  /* {
    // it goes to the api to consult, but it spends money
    // the idea is to bring info once and save it
    const service = new Service();
    const dados = await service.makeRequest(BASE_URL_2);

    // stringfy the JSON so you can copy and paste
    // copy the result for BASE_URLs so you don't have to pay for each consult you make
    console.log("dados", JSON.stringify(dados));
  } */

  const service = new Service();
  const stub = sinon.stub(service, service.makeRequest.name);

  // now that we have the content, we don't go to the api, but take info from the JSON
  stub.withArgs(BASE_URL_1).resolves(mocks.tatooine);

  stub.withArgs(BASE_URL_2).resolves(mocks.alderaan);

  {
    const expected = {
      name: "Tatooine",
      surfaceWater: "1",
      appearedIn: 5,
    };

    const results = await service.getPlanets(BASE_URL_1);
    assert.deepStrictEqual(results, expected);
  }

  {
    const expected = {
      name: "Alderaan",
      surfaceWater: "40",
      appearedIn: 2,
    };

    const results = await service.getPlanets(BASE_URL_2);
    assert.deepStrictEqual(results, expected);
  }
})();
