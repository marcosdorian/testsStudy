// geting info from the Star Wars api
class Service {
  async makeRequest(url) {
    return (await fetch(url)).json();
  }

  async getPlanets(url) {
    const data = await this.makeRequest(url);
    // names come like the JSON: surface_water and not surfaceWater (JS pattern)
    return {
      name: data.name,
      surfaceWater: data.surface_water,
      appearedIn: data.films.length,
    };
  }
}

module.exports = Service;
