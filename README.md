# image-optimizer-cli

Simple CLI written to optimize images with following extensions: jpg, gif, svg, png. Under the hood, it uses a [imagemin](https://www.npmjs.com/package/imagemin) packages.

## bootstrap
```bash
git clone https://github.com/playerony/image-optimizer-cli.git
cd image-optimizer-cli
npm install
```

## register globally as a CLI (not required)

After installation just invoke `npm install -g` to register a new CLI. You'll get global access to `image-optimizer` command.

## usage

```bash
image-optimizer -s=images -d=optimised
```

* Options:
  -s, --source -> source directory with images to optimize [string] [required]
  -d, --destination -> the folder where you want to save the optimized images [string] [required]     

## license

MIT
