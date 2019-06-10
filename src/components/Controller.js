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
        <li className={this.state.reuseStatus}>
          <span onClick={this.handleClickReuse} class="bubble reuse"></span>
          <div class="stacked-text">
              <div className='title'>1. Using Reusable Packaging</div>
              <div className='content'>Try to not use single-use plastic packaging in your daily life.</div>
          </div>
        </li>
        <li className={this.state.friendStatus}>
            <span onClick={this.handleClickFriend} class="bubble friend"></span>
            <div class="stacked-text">
                <div className='title'>2. Share the idea with friends</div>
                <div className='content'>You're using less plastic packaging now, the next step is persuading your frineds also use reusable packaging.</div>
            </div>
        </li>
        <li className={this.state.fnfStatus}>
            <span onClick={this.handleClickFnf} class="bubble fnf"></span>
            <div class="stacked-text">
                <div className='title'>3. Communication</div>
                <div className='content'>Try to share this idea to more people. You can write blogs, make some videos, post on social media, and help your frind to share the idea to their friends easily.</div>
            </div>
        </li>
      </ul>
    );
  }
}

export default Controller;
