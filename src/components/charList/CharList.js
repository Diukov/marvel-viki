import { Component } from 'react';
import MarvelService from '../../services/MarvelService';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import './charList.scss';

class CharList extends Component {
  state = {
    charList: [],
    loading: true,
    error: false,
    newItemsLoading: false,
    offset: 210,
    charEnded: false,
    step: 9,
  };

  marvelService = new MarvelService();

  componentDidMount() {
    this.onRequest();
  }

  onRequest = (offset) => {
    this.onCharListLoading();

    this.marvelService
      .getAllCharacters(offset)
      .then(this.onCharListLoaded)
      .catch(this.onError);
  };

  onCharListLoading = () => {
    this.setState({
      newItemsLoading: true,
    });
  };

  onCharListLoaded = (newCharList) => {
    if (newCharList.length < this.state.step) {
      this.setState({
        charEnded: true,
      });
    }

    this.setState(({ step, offset, charList }) => ({
      charList: [...charList, ...newCharList],
      loading: false,
      newItemsLoading: false,
      offset: offset + step,
    }));
  };

  onError = () => {
    this.setState({
      loading: false,
      error: true,
    });
  };

  renderItems(arr) {
    const items = arr.map((item) => {
      const { id, name, thumbnail } = item;
      const imgStyle = {
        objectFit: 'cover',
      };
      const thumbnailPath =
        'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg';

      if (thumbnail === thumbnailPath) {
        imgStyle.objectFit = 'unset';
      }

      return (
        <li
          className='char__item'
          key={id}
          onClick={() => this.props.onCharSelected(id)}
        >
          <img src={thumbnail} alt={name} style={imgStyle} />
          <div className='char__name'>{name}</div>
        </li>
      );
    });
    return <ul className='char__grid'>{items}</ul>;
  }

  render() {
    const { charList, loading, error, offset, newItemsLoading, charEnded } =
      this.state;

    const items = this.renderItems(charList);

    const errorMessage = error ? <ErrorMessage /> : null;
    const spinner = loading ? <Spinner /> : null;
    const content = !(loading || error) ? items : null;
    return (
      <div className='char__list'>
        {errorMessage}
        {spinner}
        {content}
        <button
          disabled={newItemsLoading}
          style={{ display: charEnded ? 'none' : 'block' }}
          className='button button__main button__long'
          onClick={() => this.onRequest(offset)}
        >
          <div className='inner'>load more</div>
        </button>
      </div>
    );
  }
}

export default CharList;
