export default class Socket {
  constructor() {
    this.callback = null;
    this.active = true;
    this.connect()
  }

  connect() {
    const uri = "ws://" + window.location.hostname + ":5032"
    this.socket = new WebSocket(uri);
    this.socket.addEventListener('open', e => this.onOpen());
    this.socket.addEventListener('message', e => this.onMessage(JSON.parse(e.data)));
    this.socket.addEventListener('close', e => this.onClose());
    this.socket.addEventListener('error', e => this.onError(e));
  }

  onOpen() {
    console.log('open');
    if (window.location.href.match(/admin$/)) {
      this.send({
        event: 'admin',
      });
    }
  }

  onMessage(data) {
    console.log(data);
    if (this.callback) {
      this.callback(data);
    }
  }

  onError(e) {
    console.log(e);
    this.socket.close();
  }

  onClose() {
    console.log('closed');
    if (this.active) {
      setTimeout(this.connect.bind(this), 1000)
    }
  }

  send(data) {
    this.socket.send(JSON.stringify(data));
  }

  close() {
    this.active = false;
    console.log('close')
    this.socket.close()
  }
}
