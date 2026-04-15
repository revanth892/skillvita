module.exports = {
  apps: [
    {
      name: "skillvita",
      cwd: "/var/www/skillvita",
      script: "npm",
      args: "start",
      env: {
        NODE_ENV: "production",
        PORT: 3000,
      },
    },
  ],
};
