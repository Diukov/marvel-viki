class MarvelServise {
  _apiBase = 'https://gateway.marvel.com:443/v1/public/';
  _apiKey = 'apikey=9d31556199931e9de9e3e42314da9562';
  _defaultOffset = 210;

  getResourse = async (url) => {
    let res = await fetch(url);

    if (!res.ok) {
      throw new Error(`Could not fetch ${url}, status: ${res.status}`);
    }

    return await res.json();
  };

  getAllCharacters = async (offset = this._defaultOffset) => {
    const characters = await this.getResourse(
      `${this._apiBase}characters?limit=9&offset=${offset}&${this._apiKey}`,
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
      description: char.description
        ? `${char.description.slice(0, 210)}...`
        : 'There is no description for this character',
      thumbnail: `${char.thumbnail.path}.${char.thumbnail.extension}`,
      homepage: char.urls[0].url,
      wiki: char.urls[1].url,
      comics: char.comics.items,
      id: char.id,
    };
  };
}

export default MarvelServise;
