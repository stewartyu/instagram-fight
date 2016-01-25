import React from 'react';
import {Link} from 'react-router';

class App extends React.Component {
    render() {
        return (
            <div>
                <header>
                    <Link to="/" className="header__logo"><img src="/img/logo.png" /></Link>
                    <Link to="/popular" className="header__popular">Most Popular</Link>
                </header>
                {this.props.children}
            </div>
        );
    }
}

export default App;
