import { Component } from 'react/cjs/react.production.min';
import ErrorMessage from '../errorMessage/ErrorMessage';
import Spinner from '../spinner/Spinner';
import MarvelService from '../../services/MarvelService';

import './randomChar.scss';
import mjolnir from '../../resources/img/mjolnir.png';

class RandomChar extends Component {
    // constructor(props) {
    //     super(props);
    // this.updateChar();
    //     console.log('constructor');
    // }

    state = {
        char: {},
        loading: true,
        error: false
    }

    marvelService = new MarvelService();

    componentDidMount() {
        // this.foo.bar = 0;

        this.updateChar();
        // this.timerId = setInterval(this.updateChar, 3000);
        console.log('mount');
    }

    componentWillUnmount() {
        clearInterval(this.timerId);
        console.log('umount');
    }

    onCharLoaded = (char) => {
        console.log('update');
        this.setState({
            char, //сокращение от char: char
            loading: false
        })
    }

    onCharLoading = () => {
        this.setState({
            loading: true
        })
    }

    onError = () => {
        this.setState({
            loading: false,
            error: true
        })
    }

    updateChar = () => {
        this.onCharLoading();
        const id = Math.floor(Math.random() * (1011400 - 1011000) + 1011000);
        this.marvelService
            .getCharacter(id)
            .then(this.onCharLoaded)
            .catch(this.onError);
    }


    updateAllChar = () => {
        // const id = Math.floor(Math.random() * (1011400 - 1011000) + 1011000);
        this.onCharLoading();
        this.marvelService
            .getAllCharacters()
            .then(res => console.log(res))
            .catch(this.onError);
    }





    render() {
        console.log('render');
        const { error, char, loading } = this.state;
        const errorMessage = error ? <ErrorMessage /> : null;
        const spinner = loading ? <Spinner /> : null;
        const content = !(loading || error) ? <View char={char} /> : null;

        return (
            <div className="randomchar">
                {errorMessage}
                {spinner}
                {content}

                <div className="randomchar__static">
                    <p className="randomchar__title">
                        Random character for today!<br />
                        Do you want to get to know him better?
                    </p>
                    <p className="randomchar__title">
                        Or choose another one
                    </p>
                    <button className="button button__main" onClick={this.updateChar}>
                        <div className="inner">try it</div>
                    </button>
                    <img src={mjolnir} alt="mjolnir" className="randomchar__decoration" />
                </div>
            </div>
        )
    }
}

//простой рендарящий компонент, просто как аргумент получает объект с данными принимает его в себя и возвращает участок верстки, чтобы просто отобразать, а вся логика идет в основном компоненте
const View = ({ char }) => {
    const { name, description, thumbnail, homepage, wiki } = char;
    
    let imgStyle = thumbnail === "http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg" ? {'objectFit': 'contain'} : {'objectFit': 'cover'};

    
    // let imgStyle
    // if (thumbnail === "http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg") {
    //         imgStyle = {'objectFit': 'contain'}
    // } else {
    //     imgStyle = {'objectFit': 'cover'}
    // }

    return (
        <div className="randomchar__block">
            <img src={thumbnail} alt="Random character" className="randomchar__img" style={imgStyle}/>
            <div className="randomchar__info">
                <p className="randomchar__name">{name}</p>
                <p className="randomchar__descr">
                    {description}
                </p>
                <div className="randomchar__btns">
                    <a href={homepage} className="button button__main">
                        <div className="inner">homepage</div>
                    </a>
                    <a href={wiki} className="button button__secondary">
                        <div className="inner">Wiki</div>
                    </a>
                </div>
            </div>
        </div>
    )


}

export default RandomChar;
