import { Component } from 'react';

import MarvelService from '../../services/MarvelService';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import Skeleton from '../skeleton/Skeleton';

import './charInfo.scss';

class CharInfo extends Component {
  state = {
    char: null,
    loading: false,
    error: false,
  };

  marvelService = new MarvelService();

  componentDidMount() {
    this.updateChar();
  }

  componentDidUpdate(prevProps) {
    if (this.props.charId !== prevProps.charId) {
      this.updateChar();
    }
  }

  updateChar = () => {
    const { charId } = this.props;

    if (!charId) {
      return;
    }

    this.onCharLoading();

    this.marvelService
      .getCharacter(charId)
      .then(this.onCharLoaded)
      .catch(this.onError);
  };

  onCharLoaded = (char) => {
    this.setState({ char, loading: false });
  };

  onCharLoading = () => {
    this.setState({ loading: true });
  };

  onError = () => {
    this.setState({ error: true, loading: false });
  };

  render() {
    const { char, loading, error } = this.state;
    const skeleton = loading || !char ? <Skeleton /> : null;
    const errorMessage = error ? <ErrorMessage /> : null;
    const spinner = loading ? <Spinner /> : null;
    const content = !(loading || errorMessage || !char) ? (
      <View char={char} />
    ) : null;

    return (
      <div className='char__info'>
        {skeleton}
        {errorMessage}
        {spinner}
        {content}
      </div>
    );
  }
}

const View = ({ char }) => {
  const { name, description, thumbnail, homepage, wiki, comics } = char;
  const imgStyle = {
    objectFit: 'cover',
  };
  const thumbnailPath =
    'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg';

  if (thumbnail === thumbnailPath) {
    imgStyle.objectFit = 'contain';
  }

  return (
    <>
      <div className='char__basics'>
        <img src={thumbnail} alt={name} style={imgStyle} />
        <p className='char__info-name'>{name}</p>
        <div className='char__btns'>
          <a
            href={homepage}
            // style={{ marginRight: '30px' }}
            className='button button__main'
          >
            <div className='inner'>Homepage</div>
          </a>
          <a href={wiki} className='button button__secondary'>
            <div className='inner'>Wiki</div>
          </a>
        </div>
        <p className='char__descr'>{description}</p>
        <div className='char__comics'>
          Comics:
          <ul className='char__comics-list'>
            {comics.length === 0 ? (
              <li className='char__comics-item'>
                There is no comics for this character
              </li>
            ) : null}
            {comics.map((item, i) => {
              if (i > 9) return null;

              return (
                <li className='char__comics-item' key={i}>
                  {item.name}
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </>
  );
};

export default CharInfo;
