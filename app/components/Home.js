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

  handleClick(character) {
    var winner = character.characterId;
    var loser = first(without(this.state.characters, findWhere(this.state.characters, { characterId: winner }))).characterId;
    HomeActions.vote(winner, loser);
  }

  render() {
    var images = '';
    if (this.state.images.hasOwnProperty('image1')) {
        var image1 = this.state.images.image1.images.standard_resolution.url;
        var image2 = this.state.images.image2.images.standard_resolution.url;
        images = <div><img src={image1} /><img src={image2} /></div>;
    }

    return (
      <div className='container'>
        {images}
      </div>
    );
  }
}

export default Home;
