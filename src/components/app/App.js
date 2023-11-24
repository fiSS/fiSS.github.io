import { Component } from "react/cjs/react.production.min";

import PropTypes from "prop-types";
import AppHeader from "../appHeader/AppHeader";
import RandomChar from "../randomChar/RandomChar";
import CharList from "../charList/CharList";
import CharInfo from "../charInfo/CharInfo";
import ErrorBoundary from "../errorBoundary/ErrorBoundary";

import decoration from '../../resources/img/vision.png';

class App extends Component {

    state = {
        selectedChar: null
    }

    onCharSelected = (id) => {
        this.setState({
            selectedChar: id
        })
    }

    toggleRandomChar = () => {
        this.setState((state) => {
            return {
                showRandomChar: !state.showRandomChar
            }
        })
    }

    render() {
        return (
            <div className="app">
                <AppHeader />
                <main>
                    {this.state.showRandomChar ? <RandomChar /> : null}
                    <ErrorBoundary>
                        <RandomChar />
                    </ErrorBoundary>
                    {/* <button onClick={this.toggleRandomChar}>Click me</button> */}
                    <div className="char__content">
                        <ErrorBoundary>
                            <CharList onCharSelected={this.onCharSelected} />
                        </ErrorBoundary>
                        <ErrorBoundary>
                            <CharInfo charId={this.state.selectedChar} />
                        </ErrorBoundary>
                    </div>
                    <img className="bg-decoration" src={decoration} alt="vision" />
                </main>
            </div>
        )
        
    }

   }

   CharList.propTypes = {
    onCharSelected: PropTypes.func.isRequired
}
   

export default App;