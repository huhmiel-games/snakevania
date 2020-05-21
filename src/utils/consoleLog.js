export const consoleLog = (data) => {
  if (window.console && console.log) {
    console.log(data);
  }
};

export const consoleTable = (data) => {
  if (window.console && console.table) {
    console.table(data);
  }
};

export const consoleWarn = (data) => {
  if (window.console && console.warn) {
    console.warn(data);
  }
};

export const consoleInfo = (data, data2) => {
  if (window.console && console.info) {
    console.info(`%c      --- ${data} --- from ${data2}`, 'color: blue');
  }
};

