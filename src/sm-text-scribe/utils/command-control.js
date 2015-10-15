let enabled;

function backupFunctions(...fns) {
  fns
    .filter(fn => !document[fn]._simpla)
    .forEach(fn => document[`_${fn}`] = document[fn]);
};

// Backem up
backupFunctions('queryCommandEnabled', 'execCommand');

document.queryCommandEnabled = function(...args) {
  let command = args[0],
      want = document._queryCommandEnabled.apply(this, args);

  if (!enabled) {
    return want;
  }

  return enabled.indexOf(command) !== -1 && want;
};

document.execCommand = function(...args) {
  let command = args[0];

  if (!enabled || enabled.indexOf(command) === -1) {
    document._execCommand.apply(this, args);
  }
};


export function bindCommands(commands) {
  enabled = commands;
};
