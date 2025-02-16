export default function test(req, res) {
    if (req.method === 'GET') {
        res.status(200).json({ message: 'This is a test message', success: true });
    } else {
        res.setHeader('Allow', ['GET']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
