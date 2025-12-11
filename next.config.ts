module.exports = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "https://discovery-call-backend.onrender.com/api/:path*", // Replace with your external server's URL
      },
    ];
  },
};
