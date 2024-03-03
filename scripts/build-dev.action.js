const esbuild = require("esbuild");
const { createServer } = require("http");
const serveHander = require('serve-handler');

async function action() {
  const serve = this.opts()['serve'] === true;

  if (serve) {
    const server = createServer((req, res) => serveHander(req, res, { public: 'public' }));

    server.listen(3000, () => console.log('Listening http://localhost:3000/'));
  }

  const context = await esbuild.context({
    entryPoints: [
      './src/index.ts'
    ],
    bundle: true,
    tsconfig: './tsconfig.json',
    outdir: './public/dist',
  });

  await context.watch();

  console.log('Watching...');
}

module.exports = action;