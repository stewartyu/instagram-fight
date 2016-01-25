import React from 'react';
import {Link} from 'react-router';
import HomeStore from '../stores/HomeStore'
import HomeActions from '../actions/HomeActions';
import {first, without, findWhere} from 'underscore';

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
    console.log(image);
    HomeActions.vote(image);
  }

  render() {
    var images = this.state.images.map((image, index) => {
        return (
            <div className="vote__image" key={image.id}>
                <img src={image.images.standard_resolution.url} onClick={this.handleClick.bind(this, image)} />
            </div>
        );
    });
    /*var images = '';
    if (this.state.images.hasOwnProperty('image1')) {
        var image1 = this.state.images.image1.images.standard_resolution.url;
        var image2 = this.state.images.image2.images.standard_resolution.url;
        images = <div className="vote">
            <div className="vote__image"><img src={image1} /></div>
            <div className="vote__image"><img src={image2} /></div>
        </div>;
    }*/

    return (
      <div className='container'>
        <div className="vote">{images}</div>
      </div>
    );
  }
}

export default Home;
