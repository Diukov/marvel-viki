import { Component } from 'react';
import MarvelService from '../../services/MarvelService';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';

import './randomChar.scss';
import mjolnir from '../../resources/img/mjolnir.png';

class RandomChar extends Component {
  state = {
    char: {},
    loading: true,
    error: false,
  };

  componentDidMount() {
    this.updateChar();
    // this.timerId = setInterval(this.updateChar, 3000);
  }

  // componentWillUnmount() {
  //   clearInterval(this.timerId);
  // }

  MarvelService = new MarvelService();

  onCharLoaded = (char) => {
    this.setState({ char, loading: false });
  };

  onCharLoading = () => {
    this.setState({ loading: true });
  };

  onError = () => {
    this.setState({ error: true, loading: false });
  };

  updateChar = () => {
    const id = Math.floor(Math.random() * (1011400 - 1011000) + 1011000);
    this.onCharLoading();

    this.MarvelService.getCharacter(id)
      .then(this.onCharLoaded)
      .catch(this.onError);
  };

  render() {
    const { char, loading, error } = this.state;
    const errorMessage = error ? <ErrorMessage /> : null;
    const spinner = loading ? <Spinner /> : null;
    const content = !(loading || errorMessage) ? <View char={char} /> : null;

    return (
      <div className='randomchar'>
        {errorMessage}
        {spinner}
        {content}
        <div className='randomchar__static'>
          <p className='randomchar__title'>
            Random character for today!
            <br />
            Do you want to get to know him better?
          </p>
          <p className='randomchar__title'>Or choose another one</p>
          <button onClick={this.updateChar} className='button button__main'>
            <div className='inner'>try it</div>
          </button>
          <img src={mjolnir} alt='mjolnir' className='randomchar__decoration' />
        </div>
      </div>
    );
  }
}

const View = ({ char }) => {
  const { name, description, thumbnail, homepage, wiki } = char;
  const randomCharClassName =
    thumbnail ===
    'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg'
      ? 'randomchar__img_none'
      : 'randomchar__img';

  return (
    <div className='randomchar__block'>
      <img
        src={thumbnail}
        alt='Random character'
        className={randomCharClassName}
      />
      <div className='randomchar__info'>
        <p className='randomchar__name'>{name}</p>
        <p className='randomchar__descr'>{description}</p>
        <div className='randomchar__btns'>
          <a href={homepage} className='button button__main'>
            <div className='inner'>Homepage</div>
          </a>
          <a href={wiki} className='button button__secondary'>
            <div className='inner'>Wiki</div>
          </a>
        </div>
      </div>
    </div>
  );
};

export default RandomChar;
