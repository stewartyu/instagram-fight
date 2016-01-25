import alt from '../alt';

class PopularActions {
  constructor() {
    this.generateActions(
      'getImagesSuccess',
      'getImagesFail'
    );
  }

  getImages() {
    $.ajax({ url: '/api/popular' })
      .done(data => {
        this.actions.getImagesSuccess(data);
      })
      .fail(jqXhr => {
        this.actions.getImagesFail(jqXhr.responseJSON.message);
      });
  }
}

export default alt.createActions(PopularActions);
