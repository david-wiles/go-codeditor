// DEBUG make configurable
const url = "http://localhost:30301";

export class Client {
  constructor() {
    // store credentials
  }

  save(file, text) {
    return new Promise((resolve, reject) => {
      fetch(url + "/save?f=" + file, {
        method: "POST",
        body: text
      })
        .then(res => resolve(res))
        .catch(err => reject(err));
    });
  }

  open(file) {
    return new Promise((resolve, reject) => {
      fetch(url + "/open?f=" + file)
        .then(resolve(res))
        .catch(err => reject(err));
    });
  }

  ls(dir) {
    return new Promise((resolve, reject) => {
      fetch(url + "/ls?dir=" + dir)
        .then(resolve(res))
        .catch(err => reject(err));
    });
  }
}
