import React, { Component } from 'react';
import './App.css';
import Socket from './socket'
import stamps from './stamps'

console.log(stamps);


class App extends Component {
  constructor() {
    super();
    global.socket = new Socket();
    global.socket.callback = this.onMessage.bind(this);
    global.app = this;
    this.state = {
      name: window.localStorage.getItem('name'),
      messages: [],
      inputMode: false,
    }
  }

  onMessage(data) {
    var {messages} = this.state;
    if (data.is_reload) {
      messages = data.data;
      console.log(data);
    } else {
      messages.push(data);
    }

    this.setState({messages: messages});
  }

  onTopPartClick() {
    console.log('top');
    this.setState({inputMode: false});
  }

  onBottomPartClick() {
    console.log('bottom');
    this.setState({inputMode: true});
  }

  render() {
    const topStyle = {
      height: '60%',
    };

    const bottomStyle = {
      height: '40%',
    };

    if (!this.state.inputMode) {
      topStyle.height = 'calc(100% - 59px)';
      bottomStyle.height = '59px';
    }

    return (
      <div className="App">
        <NameForm name={this.state.name}></NameForm>
        <Header name={this.state.name} />
        <div className="top" style={topStyle} onClick={e => this.onTopPartClick()}>
          <Messages messages={this.state.messages}></Messages>
        </div>
        <div className="bottom" onClick={e => this.onBottomPartClick()} style={bottomStyle}>
          <TextArea></TextArea>
          <Stamps></Stamps>
        </div>
      </div>
    );
  }
}

const Header = props => {
  const {name} = props;

  const onClick = () => {
    window.localStorage.removeItem('name');
    global.app.setState({name: null});
  }

  return (
    <div className="Header">
      <div className="row">
        <div className="name col s10">
          {name}
        </div>
        <div className="btn col s2 red darken-4" onClick={onClick}>LOGOUT</div>
      </div>
    </div>
    )
}

class NameForm extends Component {
  onClick() {
    const name = this.input.value;
    window.localStorage.setItem("name", name);
    global.app.setState({name: name});
  }

  render() {
    const {name} = this.props;

    var style = {};
    if (name) {
      style.display = 'None';
    } else {
      console.log('hoge')
    }

    return (
      <div className="NameForm" style={style}>
        <div className="container">
          <div className="logo">
            <img src="/images/logo.jpg" alt=""/>
          </div>
          <div className="title">
            お名前を入力してください
          </div>
          <div className="form">
            <input type="text" ref={el => this.input = el}/>
          </div>
          <div className="row">
            <div className="login-button btn col s12 white" onClick={this.onClick.bind(this)}>
              ログイン
            </div>
          </div>
        </div>
      </div>
    )
  }
}

class Messages extends Component {
  componentDidMount() {
    this.scrollToBottom();
  }

  componentDidUpdate() {
    this.scrollToBottom()
  }

  scrollToBottom() {
    const {messages} = this.props;
    // this.messagesEnd.scrollIntoView({ behavior: 'smooth' })
    // window.scrollTo(0, 0);
    this.body.scrollTop = messages.length * 1000;
  }

  render() {
    const {messages} = this.props;

    const style = {
      height: '100%',
    }

    return (
      <div className="Messages" style={style} ref={el => {this.body = el}}>
        <div className="container">
          {messages.map((message, i) => (
            <Message message={message} key={i}/>
            ))}
          <div className="messagesEnd" ref={el => {this.messagesEnd = el}}></div>
        </div>
      </div>
      )
  }
}

const Message = (props) => {
  const {message} = props;

  var offset = '';
  var mine = "";
  if (message.name == global.app.state.name) {
    offset = ' offset-s4';
    mine = ' mine';
  }

  var content;
  if (message.type == 'text') {
    content = (
      <div className={"text col s8" + offset + mine}>
        {message.value}
      </div>
      );
  } else {
    content = (
      <div className={"stamp col s8" + offset}>
        <img src={"images/stamps/" + message.value.name} alt=""/>
      </div>
      );
  }
  return (
    <div className="Message">
      <div className={'name' + mine}>{message.name}</div>
      <div className="row">
        {content}
      </div>
    </div>
    );
}


class TextArea extends Component {
  constructor() {
    super()
    this.state = {
      text: '',
    };
  }

  onKeyPress(e) {
    if (e.key == 'Enter') {
      this.setState({
        text: '',
      });
      e.preventDefault()
      this.send();
      return false;
    }
  }

  onChange(e) {
    this.setState({text: e.target.value})
  }

  send() {
    if (this.state.text && this.state.text.length > 0) {
      global.socket.send({
        type: 'text',
        name: global.app.state.name,
        value: this.state.text,
      })
      this.setState({text: ''});
    }
  }

  render() {
    return (
      <div className="TextArea">
        <div className="container">
          <form>
            <div className="row">
              <div className="col s10">
                <input type="text" 
                onKeyPress={this.onKeyPress.bind(this)} 
                onChange={this.onChange.bind(this)}
                value={this.state.text}
                />
              </div>
              <div className="btn col s2" onClick={this.send.bind(this)}>送信</div>
            </div>
          </form>
        </div>
      </div>
    )
  }
}

class Stamps extends Component {

  onClick(stamp) {
    // console.log(stamp.name);
    global.socket.send({
      type: 'stamp',
      value: stamp,
      name: global.app.state.name,
    });
  }

  render () {
    const style = {
      // height: 'calc(40% - 59px)',
      height: 'calc(100% - 59px)',
    }

    return (
      <div className="Stamps" style={style}>
        <div className="row flex">
          {stamps.map((stamp, index) => {
            return (
              <div className="Stamp col s3" key={index} onClick={() => {this.onClick(stamp)}}>
                <img src={'/images/stamps/' + stamp.name} alt=""/>
              </div>
              )
          })}
        </div>
      </div>
    )
  }
}

export default App;
