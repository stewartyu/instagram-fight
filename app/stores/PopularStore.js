import alt from '../alt';
import PopularActions from '../actions/PopularActions';

class PopularStore {
  constructor() {
    this.bindActions(PopularActions);
    this.images = [];
  }

  getImagesSuccess(data) {
    this.images = data;
  }

  getImagesFail(errorMessage) {
    toastr.error(errorMessage);
  }
}

export default alt.createStore(PopularStore);
