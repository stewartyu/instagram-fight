import React from 'react';
import HomeStore from '../stores/HomeStore'
import HomeActions from '../actions/HomeActions';

class Home extends React.Component {

  constructor(props) {
    super(props);
    this.state = HomeStore.getState();
    this.onChange = this.onChange.bind(this);
  }

  componentDidMount() {
    HomeStore.listen(this.onChange);
    HomeActions.getTwoImages();
  }

  componentWillUnmount() {
    HomeStore.unlisten(this.onChange);
  }

  onChange(state) {
    this.setState(state);
  }

  handleClick(image) {
    HomeActions.vote(image);
  }

  render() {
    var images = this.state.images.map((image, index) => {
        return (
            <a className="vote__image-container" key={image.id}>
                <img className="vote__image" src={image.images.standard_resolution.url} onClick={this.handleClick.bind(this, image)} />
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

export default Home;
