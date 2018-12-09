import fs from 'fs';
// import program from 'commander';

// program
//   .command('rn <dir>')
//   .option('-r, --recursive', 'Remove recursively')
//   .action((dir, cmd) => {
//     console.log('rename directory content files ' + dir + (cmd.recursive ? ' recursively' : ''));
//   })

const cmd = { recursive: true };

const unAllowed = [
  /.DS_Store/
]
const fileRegExp = /S[0-9][0-9]E[0-9][0-9]/;
const foderRegExp = /Season.[0-9]{1,3}/;
const argsDir = process.argv[2];
const files = [];
const folders = [];
const renameFolders = false;

function parseDir(directory, recipient) {
  const subdir = fs.readdirSync(directory, 'utf8');
  subdir.forEach((subdirN) => {
    const path_string = [directory, subdirN].join('/');
    if (fs.lstatSync(path_string).isDirectory()) {
      folders.push(path_string);
      if (cmd.recursive) {
        parseDir(path_string, recipient);
      }
    }
    else {
      recipient.push(path_string);
    }
  });
}
function transformAndRenameFile(path) {
  let elts = path.split('/');
  const fileName = elts.pop();
  const rootPath = elts.join('/');
  unAllowed.forEach((regex) => {
    if (regex.exec(fileName))
      return;
  })
  console.log('dirFound', fileName);
  const extension = fileName.split('.').pop();
  const result = [fileRegExp.exec(fileName), extension].join('.');
  console.log('result:', result);
  fs.renameSync([rootPath, fileName].join('/'), [rootPath, result].join('/'));
}

function transformAndRenameFolder(path) {
  let elts = path.split('/');
  const folderName = elts.pop();
  const rootPath = elts.join('/');
  unAllowed.forEach((regex) => {
    if (regex.exec(folderName))
      return;
  })
  console.log('Found: ', folderName);
  const result = folderName.replace('.', ' ');
  console.log('result:', result);
  fs.renameSync([rootPath, folderName].join('/'), [rootPath, result].join('/'));
}

parseDir(argsDir, files);
files.forEach((file) => {
  file.replace('//', '/');
  transformAndRenameFile(file)
});

if (renameFolders) {
  folders.forEach((folder) => {
    folder.replace('//', '/');
    transformAndRenameFolder(folder)
  });
}
