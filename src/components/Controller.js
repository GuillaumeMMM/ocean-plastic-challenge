import React from 'react'

class Controller extends React.Component {
  constructor() {
    super();
    this.state ={
      reuseStatus: 'active',
      friendStatus: 'lock',
      fnfStatus: 'lock'
    };
    this.handleClickReuse = this.handleClickReuse.bind(this);
    this.handleClickFriend = this.handleClickFriend.bind(this);
    this.handleClickFnf = this.handleClickFnf.bind(this);
  }

  handleClickReuse() {
    console.log('click reuse');
    if (this.state.reuseStatus==='active') {
      this.setState({
        reuseStatus: 'complete',
        friendStatus: 'active',
      })
    }else { return null;}
  }
  handleClickFriend() {
    if (this.state.friendStatus==='active') {
      this.setState({
        friendStatus: 'complete',
        fnfStatus: 'active',
      })
    }else { return null;}
  }
  handleClickFnf() {
    if (this.state.fnfStatus==='active') {
      this.setState({
        fnfStatus: 'complete',
      })
    }else { return null;}
  }
  render () {
    return (
      <ul class="progress-indicator stepped stacked">
        <li onClick={this.handleClickReuse} className={this.state.reuseStatus}>
          <span class="bubble reuse"></span>
          <span class="stacked-text">
              <span class="fa fa-calendar"></span> Step 1.
              <span class="subdued">/ do something do something  do something  do something </span>
          </span>
        </li>
        <li className={this.state.friendStatus}>
            <span onClick={this.handleClickFriend} class="bubble friend"></span>
            <span class="stacked-text">
                <span class="fa fa-calendar"></span> Step 2.
                <span class="subdued">/ Some stuff happened. It was amazing.</span>
            </span>
        </li>
        <li className={this.state.fnfStatus}>
            <span onClick={this.handleClickFnf} class="bubble fnf"></span>
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
