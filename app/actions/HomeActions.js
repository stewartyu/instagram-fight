import alt from '../alt';

class HomeActions {
  constructor() {
    this.generateActions(
      'getTwoImagesSuccess',
      'getTwoImagesFail',
      'voteFail'
    );
  }

  getTwoImages() {
    $.ajax({ url: '/api/images' })
      .done(data => {
        this.actions.getTwoImagesSuccess(data);
      })
      .fail(jqXhr => {
        this.actions.getTwoImagesFail(jqXhr.responseJSON.message);
      });
  }

  vote(winner) {
    $.ajax({
      type: 'PUT',
      url: '/api/images' ,
      data: { winner: winner.id }
    })
      .done(() => {
        this.actions.getTwoImages();
      })
      .fail((jqXhr) => {
        this.actions.voteFail(jqXhr.responseJSON.message);
      });
  }
}

export default alt.createActions(HomeActions);
