import React from 'react';
import {Link} from 'react-router';

class App extends React.Component {
    render() {
        return (
            <div>
                <header>
                    <Link to="/">Instagram Fight</Link>
                    <Link to="/popular">Most Popular</Link>
                </header>
                {this.props.children}
            </div>
        );
    }
}

export default App;
