export default function handler(req, res) {
  if (req.method === "POST") {
    const { name, email } = req.body;

    console.log("New payment:", name, email);

    return res.status(200).json({ message: "OK" });
  }

  return res.status(405).json({ message: "Method not allowed" });
}
    