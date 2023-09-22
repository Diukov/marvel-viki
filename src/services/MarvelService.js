class MarvelServise {
  _apiBase = 'https://gateway.marvel.com:443/v1/public/';
  _apiKey = 'apikey=9d31556199931e9de9e3e42314da9562';

  getResourse = async (url) => {
    let res = await fetch(url);

    if (!res.ok) {
      throw new Error(`Could not fetch ${url}, status: ${res.status}`);
    }

    return await res.json();
  };

  getAllCharacters = async () => {
    const characters = await this.getResourse(
      `${this._apiBase}characters?limit=9&offset=210&${this._apiKey}`,
    );

    return characters.data.results.map(this._transformCharacter);
  };

  getCharacter = async (id) => {
    const char = await this.getResourse(
      `${this._apiBase}characters/${id}?${this._apiKey}`,
    );

    return this._transformCharacter(char.data.results[0]);
  };

  _transformCharacter = (char) => {
    return {
      name: char.name,
      description: char.description,
      thumbnail: `${char.thumbnail.path}.${char.thumbnail.extension}`,
      homepage: char.urls[0].url,
      wiki: char.urls[1].url,
    };
  };
}

export default MarvelServise;
