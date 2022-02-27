// DEBUG make configurable
const url = "http://localhost:30301";

const appendFileEntry = (rootTree, dir, entry) => {
  let nameParts = entry.name
    .slice(dir.length)
    .split("/");

  let tree = rootTree;
  for (let i = 0; i < nameParts.length; i += 1) {
    if (tree.subTree[nameParts[i]]) {
      tree = tree.subTree[nameParts[i]];
    } else {
      // The last part should always entry this branch because file names must be unique.
      // However, we may enter this branch before the last part if there is only one file in the dir
      tree.subTree[nameParts[i]] = {
        isDir: entry.isDir,
        name: nameParts[nameParts.length - 1],
        path: dir + nameParts.join("/"),
        subTree: {}
      };
    }
  }
};

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

  buildTree(dir, recurse) {
    return new Promise((resolve, reject) => {
      this.ls(dir, recurse)
        .then(res => {
          let tree = {
            isDir: true,
            path: res.dir,
            name: res.dir.split("/").pop(),
            subTree: {}
          };

          // Roll entries into arrays
          res.entries.forEach((entry) => appendFileEntry(tree, res.dir, entry));
          resolve(tree);
        })
        .catch(err => reject(err));
    });
  }
}
