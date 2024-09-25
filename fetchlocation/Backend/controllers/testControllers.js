exports.submitText = (req, res) => {
  const { text } = req.body;
  console.log("Received data:", text);

  res.status(200).json({ message: "Data received successfully!", data: text });
};
