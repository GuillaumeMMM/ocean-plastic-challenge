import React from 'react'

class Controller extends React.Component {
  render () {
    return (
      <ul class="progress-indicator stepped stacked">
        <li class="completed warning">
            <a href="#">
                <span class="bubble"></span>
                <span class="stacked-text">
                    <span class="fa fa-calendar"></span> June 3rd, 2014
                    <span class="subdued">/ Added a thing. <em>Pssst... I'm a link!</em></span>
                </span>
            </a>
        </li>
        <li class="completed">
            <span class="bubble"></span>
            <span class="stacked-text">
                <span class="fa fa-calendar"></span> May 21st, 2014
                <span class="subdued">/ Some stuff happened. It was amazing.</span>
            </span>
        </li>
        <li>
            <span class="bubble"></span>
            <span class="stacked-text">
                <span class="fa fa-calendar"></span> April 11th, 2014
                <span class="subdued">/ What a wild day!</span>
            </span>
        </li>
      </ul>
    );
  }
}

export default Controller;
