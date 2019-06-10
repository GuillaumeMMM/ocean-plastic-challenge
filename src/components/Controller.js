import React from 'react'

class Controller extends React.Component {
  render () {
    return (
      <ul class="progress-indicator stepped stacked">
        <li>
          <span class="bubble reuse-active"></span>
          <span class="stacked-text">
              <span class="fa fa-calendar"></span> Step 1.
              <span class="subdued">/ do something do something  do something  do something </span>
          </span>
        </li>
        <li>
            <span class="bubble friend-lock"></span>
            <span class="stacked-text">
                <span class="fa fa-calendar"></span> Step 2.
                <span class="subdued">/ Some stuff happened. It was amazing.</span>
            </span>
        </li>
        <li>
            <span class="bubble fandf-lock"></span>
            <span class="stacked-text">
                <span class="fa fa-calendar"></span> Step 3.
                <span class="subdued">/ What a wild day!</span>
            </span>
        </li>
      </ul>
    );
  }
}

export default Controller;
