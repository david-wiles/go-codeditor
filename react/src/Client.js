// DEBUG make configurable
const url = "http://localhost:30301";

export default class Client {
  constructor() {
    // store credentials
  }

  save(file, text) {
    return new Promise((resolve, reject) => {
      fetch(url + "/save?f=" + file, {
        method: "POST",
        body: text
      })
        .then(res => res.json())
        .then(body => resolve(body))
        .catch(err => reject(err));
    });
  }

  open(file) {
    return new Promise((resolve, reject) => {
      fetch(url + "/open?f=" + file)
        .then(res => res.json())
        .then(body => resolve(body))
        .catch(err => reject(err));
    });
  }

  ls(dir, recurse) {
    return new Promise((resolve, reject) => {
      fetch(url + "/ls?dir=" + dir + (recurse ? '&recurse=true' : ''))
        .then(res => res.json())
        .then(body => resolve(body))
        .catch(err => reject(err));
    });
  }
}
