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
        <li onClick={this.handleClickReuse} className={this.state.reuseStatus}>
          <span className="bubble reuse"></span>
          <span className="stacked-text">
              <span className="fa fa-calendar"></span> Step 1.
              <span className="subdued">/ do something do something  do something  do something </span>
          </span>
        </li>
        <li className={this.state.friendStatus}>
            <span onClick={this.handleClickFriend} className="bubble friend"></span>
            <span className="stacked-text">
                <span className="fa fa-calendar"></span> Step 2.
                <span className="subdued">/ Some stuff happened. It was amazing.</span>
            </span>
        </li>
        <li className={this.state.fnfStatus}>
            <span onClick={this.handleClickFnf} className="bubble fnf"></span>
            <span className="stacked-text">
                <span className="fa fa-calendar"></span> Step 3.
                <span className="subdued">/ What a wild day!</span>
            </span>
        </li>
      </ul>
    );
  }
}

export default Controller;
