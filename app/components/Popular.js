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
            <div className="list__item-container" key={image.imageId}>
                <span className="list__item-rank">{index + 1}</span>
                <img className="list__item-image" src={image.url} />
                <span className="list__item-wins">{image.wins}</span>
            </div>
        );
    });

    return (
        <div className="container">
            <div className="list">{images}</div>
        </div>
    );
  }
}

export default Popular;
