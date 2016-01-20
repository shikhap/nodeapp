/*
 * @jsx React.DOM
 */
var React = require('react'),
    _ = require('underscore');
    //i18n = require('./utils/strings');

var Home = React.createClass({

  render: function() {

    return (
      <div>
        <div className="home">
          <header>
            <h1>
              test home
            </h1>
          </header>
        </div>
      </div>
    );
  }
});

module.exports = Home;
