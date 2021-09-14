#! /usr/bin/env node

import fs from 'fs';
import path from 'path';
import yargs from 'yargs';
import imagemin from 'imagemin';
import { hideBin } from 'yargs/helpers';
import imageminSvgo from 'imagemin-svgo';
import imageminJpegtran from 'imagemin-jpegtran';
import imageminPngquant from 'imagemin-pngquant';
import imageminGifsicle from 'imagemin-gifsicle';

const { argv } = yargs(hideBin(process.argv))
  .option('source', {
    alias: 's',
    type: 'string',
    requiresArg: true,
    describe: 'source directory with images to optimize',
  })
  .option('destination', {
    alias: 'd',
    type: 'string',
    requiresArg: true,
    describe: 'the folder where you want to save the optimized images',
  })
  .demandOption(['s', 'd'])
  .help();

const { source, destination } = argv;
const projectDirectory = process.cwd();

const sourceProjectDirectory = `${projectDirectory}/${source}`;
const destinationProjectDirectory = `${projectDirectory}/${destination}`;

try {
  const sourceDirectoryStat = fs.statSync(sourceProjectDirectory);
  if (sourceDirectoryStat.isFile()) {
    throw new Error('source directory is not a directory');
  }

  const destinationDirectoryStat = fs.statSync(destinationProjectDirectory);
  if (destinationDirectoryStat.isFile()) {
    throw new Error('destination directory is not a directory');
  }
} catch (e) {
  console.error(e);
}

function getFilesizeInBytes(filename) {
  const stats = fs.statSync(filename);

  return stats.size;
}

function niceBytes(value) {
  const units = ['bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

  let l = 0;
  let n = parseInt(value, 10) || 0;

  while (n >= 1024 && ++l) {
    n = n / 1024;
  }

  return n.toFixed(n < 10 && l > 0 ? 1 : 0) + ' ' + units[l];
}

imagemin([`${sourceProjectDirectory}/**/*.{jpg,png,svg,gif}`], {
  plugins: [
    imageminJpegtran({
      progressive: true,
    }),
    imageminPngquant({
      strip: true,
      quality: [0.1, 0.6],
    }),
    imageminSvgo(),
    imageminGifsicle({
      optimizationLevel: 3,
    }),
  ],
}).then((_files) => {
  _files.forEach((_file) => {
    const source = path.parse(_file.sourcePath);
    const filenameWithExtension = `${source.name}${source.ext}`;
    const destinationPath = `${destinationProjectDirectory}/${filenameWithExtension}`;

    fs.writeFileSync(destinationPath, _file.data);

    const newFileSize = getFilesizeInBytes(destinationPath);
    const oldFileSize = getFilesizeInBytes(_file.sourcePath);

    console.log(
      `Filename: '${filenameWithExtension}' was optimised from '${niceBytes(
        oldFileSize,
      )}' to '${niceBytes(newFileSize)}'.`,
    );
  });
});
