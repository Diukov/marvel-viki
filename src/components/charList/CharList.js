import { Component } from 'react';
import PropTypes from 'prop-types';

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

  itemRefs = [];

  setRef = (ref) => {
    this.itemRefs.push(ref);
  };

  focus = (id) => {
    this.itemRefs.forEach((item) =>
      item.classList.remove('char__item_selected'),
    );
    this.itemRefs[id].classList.add('char__item_selected');
    this.itemRefs[id].focus();
  };

  renderItems(arr) {
    const items = arr.map((item, index) => {
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
          tabIndex={0}
          ref={this.setRef}
          key={id}
          onClick={() => {
            this.props.onCharSelected(id);
            this.focus(index);
          }}
          onKeyPress={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              this.props.onCharSelected(id);
              this.focus(index);
            }
          }}
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

CharList.propTypes = {
  onCharSelected: PropTypes.func,
};

export default CharList;
