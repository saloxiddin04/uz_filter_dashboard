export const CAPIWS = {
  URL:
    (window.location.protocol.toLowerCase() === "https:"
      ? "wss://127.0.0.1:64443"
      : "ws://127.0.0.1:64646") + "/service/cryptapi",
  callFunction: function (funcDef, callback, error) {
    if (!window.WebSocket) {
      if (error) {
        window.addEventListener('error', (event) => {
          if (event.message && event.message.includes('WebSocket connection to')) {
            return
          }
        });
        error()
      }
      return;
    }
    let socket;
    try {
      socket = new WebSocket(this.URL);
    } catch (e) {
      if (error) {
        window.addEventListener('error', (event) => {
          if (event.message && event.message.includes('WebSocket connection to')) {
            return
          }
        });
        error()
      }
      error(e);
    }
    socket.onerror = function (e) {
      if (error) error(e);
    };
    socket.onmessage = function (event) {
      let data = JSON.parse(event.data);
      socket.close();
      callback(event, data);
    };
    socket.onopen = function () {
      socket.send(JSON.stringify(funcDef));
    };
  },
  version: function (callback, error) {
    if (!window.WebSocket) {
      if (error) {
        window.addEventListener('error', (event) => {
          if (event.message && event.message.includes('WebSocket connection to')) {
            return
          }
        });
        error()
      }
      return;
    }
    let socket;
    try {
      socket = new WebSocket(this.URL);
    } catch (e) {
      error(e);
    }
    socket.onerror = function (e) {
      if (error) {
        window.addEventListener('error', (event) => {
          if (event.message && event.message.includes('WebSocket connection to')) {
            return
          }
        });
        error()
      }
    };
    socket.onmessage = function (event) {
      let data = JSON.parse(event.data);
      socket.close();
      callback(event, data);
    };
    socket.onopen = function () {
      let o = { name: "version" };
      socket.send(JSON.stringify(o));
    };
  },
  apidoc: function (callback, error) {
    if (!window.WebSocket) {
      if (error) error();
      return;
    }
    let socket;
    try {
      socket = new WebSocket(this.URL);
    } catch (e) {
      if (error) {
        window.addEventListener('error', (event) => {
          if (event.message && event.message.includes('WebSocket connection to')) {
            return
          }
        });
        error()
      }
      error(e);
    }
    socket.onerror = function (e) {
      if (error) {
        window.addEventListener('error', (event) => {
          if (event.message && event.message.includes('WebSocket connection to')) {
            return
          }
        });
        error()
      }
    };
    socket.onmessage = function (event) {
      let data = JSON.parse(event.data);
      socket.close();
      callback(event, data);
    };
    socket.onopen = function () {
      let o = { name: "apidoc" };
      socket.send(JSON.stringify(o));
    };
  },
  apikey: function (domainAndKey, callback, error) {
    if (!window.WebSocket) {
      if (error) {
        window.addEventListener('error', (event) => {
          if (event.message && event.message.includes('WebSocket connection to')) {
            return
          }
        });
        error()
      }
      return;
    }
    let socket;
    try {
      socket = new WebSocket(this.URL);
    } catch (e) {
      if (error) {
        window.addEventListener('error', (event) => {
          if (event.message && event.message.includes('WebSocket connection to')) {
            return
          }
        });
        error()
      }
      error(e);
    }
    socket.onerror = function (e) {
      if (error) error(e);
    };
    socket.onmessage = function (event) {
      let data = JSON.parse(event.data);
      socket.close();
      callback(event, data);
    };
    socket.onopen = function () {
      let o = { name: "apikey", arguments: domainAndKey };
      socket.send(JSON.stringify(o));
    };
  },
};