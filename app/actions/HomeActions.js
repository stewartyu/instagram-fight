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

  vote(winner, loser) {
    $.ajax({
      type: 'PUT',
      url: '/api/images' ,
      data: { winner: winner, loser: loser }
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
