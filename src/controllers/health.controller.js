exports.healthCheck = (req, res) => {
  res.status(200).json({
    success: true,
    service: "Chatbot Service Platform",
    status: "UP",
    timestamp: new Date().toISOString(),
  });
};
