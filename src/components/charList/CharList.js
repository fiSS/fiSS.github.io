import {Component} from 'react';
import PropTypes from 'prop-types';

import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import MarvelService from '../../services/MarvelService';
import './charList.scss';

class CharList extends Component {

    state = {
        charList: [],
        loading: true,
        error: false,
        newItemLoading: false,
        offset: 1541,
        charEnded: false
    }
    
    marvelService = new MarvelService();

    componentDidMount() {
        // this.foo.bar = 0;
        this.onRequest();
    }

    //метод отвечает за запрос на сервер, 1-й раз вызываем, когда компонент отрендерился в componentDidMount, без аргумента, чтобы ориентироваться на _baseOffset в компоненте MarvelService.js, когда этот метод запускается, у нас есть метод onCharListLoading который переключает новое состоряние в true, далее когда мы получаем наши элементы с сервера мы запускаем onCharListLoaded котопый получает в себя новые данные newCharList из этих новых данных формируем новое состояние, при этом если мы первый раз запускаем эту функцию, то charList: [...charList(пустой массив), ...newCharList] и он не во что не развернется и у нас будет только вот эта часть: newCharList, в последующих запусках тут будут старые элементы: charList, а тут будут новые: newCharList, в итоге они сложаться в один массив.
    onRequest = (offset) => {
        this.onCharListLoading();
        this.marvelService.getAllCharacters(offset)
            .then(this.onCharListLoaded)
            .catch(this.onError)
    }

    onCharListLoading = () => {
        this.setState({
            newItemLoading: true
        })
    }

    onCharListLoaded = (newCharList) => {
        let ended = false;
        if(newCharList.length < 9) {
            ended = true;
        }

     
        this.setState(({offset, charList}) => ({
            charList: [...charList, ...newCharList],
            loading: false,
            newItemLoading: false,
            offset: offset + 9,
            charEnded: ended
        }))
    }

    onError = () => {
        this.setState({
            error: true,
            loading: false
        })
    }
    
    
    itemRefs = [];

    setRef = (ref) => {
        this.itemRefs.push(ref);
    }

    focusOnItem = (id) => {
         // Я реализовал вариант чуть сложнее, и с классом и с фокусом
        // Но в теории можно оставить только фокус, и его в стилях использовать вместо класса
        // На самом деле, решение с css-классом можно сделать, вынеся персонажа
        // в отдельный компонент. Но кода будет больше, появится новое состояние
        // и не факт, что мы выиграем по оптимизации за счет бОльшего кол-ва элементов

        // По возможности, не злоупотребляйте рефами, только в крайних случаях
        this.itemRefs.forEach(item => item.classList.remove('char__item_selected'));
        this.itemRefs[id].classList.add('char__item_selected');
        this.itemRefs[id].focus();

    }

    // Этот метод создан для оптимизации, 
    // чтобы не помещать такую конструкцию в метод render
    renderItems(arr) {
        const items =  arr.map((item, i) => {
            let imgStyle = {'objectFit' : 'cover'};
            if (item.thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') {
                imgStyle = {'objectFit' : 'unset'};
            }
            
            return (
                <li 
                className="char__item"
                tabIndex={0}
                ref={this.setRef}
                key={item.id}
                onClick={() => {
                    this.props.onCharSelected(item.id);
                    this.focusOnItem(i);
                }}
                onKeyPress = {(e) => {
                    if (e.key === ' ' || e.key === "Enter") {
                        this.props.onCharSelected(item.id);
                        this.focusOnItem(i);
                    }
                }}>
                    <img src={item.thumbnail} alt={item.name} style={imgStyle}/>
                    <div className="char__name">{item.name}</div>
            </li>
        )
    });
        // А эта конструкция вынесена для центровки спиннера/ошибки
        return (
            <ul className="char__grid">
                {items}
            </ul>
        )
    }

    render() {

        const {charList, loading, error, offset, newItemLoading, charEnded} = this.state;
        
        const items = this.renderItems(charList);

        const errorMessage = error ? <ErrorMessage/> : null;
        const spinner = loading ? <Spinner/> : null;
        const content = !(loading || error) ? items : null;

        return (
            <div className="char__list">
                {errorMessage}
                {spinner}
                {content}
                <button
                 className="button button__main button__long"
                 disabled={newItemLoading}
                 style = {{'display': charEnded ? 'none' : "block"}}
                 onClick={() => this.onRequest(offset)}>
                    <div className="inner">load more</div>
                </button>
            </div>
        )
    }
}

CharList.propTypes = {
    onCharSelected: PropTypes.number.isRequired
}

export default CharList;

// import { Component } from 'react/cjs/react.production.min';

// import MarvelService from '../../services/MarvelService';
// import './charList.scss';
// import abyss from '../../resources/img/abyss.jpg';

// class CharList extends Component {
    
//     state = {
//         name: null,
//         path: null
//     }

//     marvelService = new MarvelService();

//     createChar = () => {
//         const id = Math.floor(Math.random() * (1011400 - 1011000) + 1011000);
//         this.marvelService
//             .getAllCharacters(id)
//             .then(res => {

//             })
//     }

//     render() {
//         const {name, path} = this.state;
//         return (
//             <div className="char__list">
//                 <ul className="char__grid">
//                     <li className="char__item">
//                         <img src={path} alt="abyss" />
//                         <div className="char__name">{name}</div>
//                     </li>
//                     <li className="char__item char__item_selected">
//                         <img src={abyss} alt="abyss" />
//                         <div className="char__name">Abyss</div>
//                     </li>
//                     <li className="char__item">
//                         <img src={abyss} alt="abyss" />
//                         <div className="char__name">Abyss</div>
//                     </li>
//                     <li className="char__item">
//                         <img src={abyss} alt="abyss" />
//                         <div className="char__name">Abyss</div>
//                     </li>
//                     <li className="char__item">
//                         <img src={abyss} alt="abyss" />
//                         <div className="char__name">Abyss</div>
//                     </li>
//                     <li className="char__item">
//                         <img src={abyss} alt="abyss" />
//                         <div className="char__name">Abyss</div>
//                     </li>
//                     <li className="char__item">
//                         <img src={abyss} alt="abyss" />
//                         <div className="char__name">Abyss</div>
//                     </li>
//                     <li className="char__item">
//                         <img src={abyss} alt="abyss" />
//                         <div className="char__name">Abyss</div>
//                     </li>
//                     <li className="char__item">
//                         <img src={abyss} alt="abyss" />
//                         <div className="char__name">Abyss</div>
//                     </li>
//                 </ul>
//                 <button className="button button__main button__long">
//                     <div className="inner">load more</div>
//                 </button>
//             </div>
//         )
//     }
// }

// export default CharList;