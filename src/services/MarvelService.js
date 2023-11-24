
class MarvelService {
    _apiBase = 'https://gateway.marvel.com:443/v1/public/';
    _apikey = 'apikey=838aa17065726fbd51bd356abc613101';
    _baseOffset = 210;

    getResource = async (url) => {
        let res = await fetch(url);

        if (!res.ok) {
            throw new Error(`Couldnt not fetch ${url}, status: ${res.status}`);
        }

        return await res.json();
    }

    getAllCharacters = async (offset = this._baseOffset) => {
        const res = await this.getResource(`${this._apiBase}characters?orderBy=name&limit=9&offset=${offset}&${this._apikey}`);
        return res.data.results.map(this._transformCharacter);
    }

    getCharacter = async (id) => {
        const res = await this.getResource(`${this._apiBase}characters/${id}?orderBy=name&&${this._apikey}`);
        return this._transformCharacter(res.data.results[0]);
    }

    // char.description ? char.description.length > 230 ? char.description.slice(0, 200) + '...' : char.description : 'No description' идентичная проверка на колличество символов и отсутствие описания

    _transformCharacter = (char) => {
        // if (char.description === "") {
        //     char.description = "Описания персонажа пока что нет";
        //   } else if (char.description.length > 200) {
        //     char.description = char.description.slice(0, 200) + '...'
        //   }

    
        return {
            id: char.id,
            name: char.name,
            description: char.description ? char.description.length > 230 ? char.description.slice(0, 200) + '...' : char.description : 'Описания персонажа пока что нет',
            thumbnail: char.thumbnail.path + '.' + char.thumbnail.extension,
            homepage: char.urls[0].url,
            wiki: char.urls[1].url,
            comics: char.comics.items
        }
    }
}

export default MarvelService;