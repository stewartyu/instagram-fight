var config = {
    instagram_redirect_uri: 'http://instagram-fight.herokuapp.com/handleauth',
    instagram_client_id: '633013de7720450bb667343b674a8064',
    instagram_client_secret: '6364e84b3d6c45e38b8edeb818cad695',
    database: process.env.MONGOLAB_URI || 'mongodb://localhost/instagramfight'
}
module.exports = config;
