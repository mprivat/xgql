module.exports = {
  '*.tf': [(filenames) => filenames.map((filename) => `terraform fmt '${filename}'`), 'git add'],
};

