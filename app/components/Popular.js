import React from 'react';
import PopularStore from '../stores/PopularStore'
import PopularActions from '../actions/PopularActions';

class Popular extends React.Component {

  constructor(props) {
    super(props);
    this.state = PopularStore.getState();
    this.onChange = this.onChange.bind(this);
  }

  componentDidMount() {
    PopularStore.listen(this.onChange);
    PopularActions.getImages();
  }

  componentWillUnmount() {
    PopularStore.unlisten(this.onChange);
  }

  onChange(state) {
    this.setState(state);
  }

  render() {
    var images = this.state.images.map((image, index) => {
        return (
            <a className="vote__image-container" key={image.imageId}>
                <img className="vote__image" src={image.url} />
                <span>{image.wins}</span>
            </a>
        );
    });

    return (
        <div className='container'>
            <div className="vote">{images}</div>
        </div>
    );
  }
}

export default Popular;
