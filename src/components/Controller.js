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
      setTimeout(() => this.setState({friendStatus: 'active'}), 6500)
      this.setState({
        reuseStatus: 'complete',
      }, this.props.handleClick('reuse'))
    }else { return null;}
  }
  handleClickFriend() {
    if (this.state.friendStatus==='active') {
      setTimeout(() => this.setState({fnfStatus: 'active'}), 1500)
      this.setState({
        friendStatus: 'complete',
      }, this.props.handleClick('friend'))
    }else { return null;}
  }
  handleClickFnf() {
    if (this.state.fnfStatus==='active') {
      this.setState({
        fnfStatus: 'complete',
      }, this.props.handleClick('fnf'))
    }else { return null;}
  }
  render () {
    return (

      <ul className="progress-indicator stepped stacked">
        <li className={this.state.reuseStatus}>
          <span onClick={this.handleClickReuse} className="bubble reuse"></span>
          <div className="stacked-text">
              <div className='title'>1. Using Reusable Packaging</div>
              <div className='content'>Try to not use single-use plastic packaging in your daily life.</div>
          </div>
        </li>
        <li className={this.state.friendStatus}>
            <span onClick={this.handleClickFriend} className="bubble friend"></span>
            <div className="stacked-text">
                <div className='title'>2. Share the idea with friends</div>
                <div className='content'>You're using less plastic packaging now, the next step is persuading your frineds also use reusable packaging.</div>
            </div>
        </li>
        <li className={this.state.fnfStatus}>
            <span onClick={this.handleClickFnf} className="bubble fnf"></span>
            <div className="stacked-text">
                <div className='title'>3. Communication</div>
                <div className='content'>Try to share this idea to more people. You can write blogs, make some videos, post on social media, and help your frind to share the idea to their friends easily.</div>
            </div>
        </li>
      </ul>
    );
  }
}

export default Controller;
