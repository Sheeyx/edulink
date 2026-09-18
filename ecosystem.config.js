module.exports = {
  apps: [
    {
      name: 'edulink',
      script: 'npm',
      args: 'run start -- -p 3007',
      cwd: __dirname,
      env: {
        NODE_ENV: 'production',
      },
    },
  ],
};
