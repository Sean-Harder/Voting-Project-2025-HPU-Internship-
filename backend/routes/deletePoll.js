// // DELETE route
// app.delete('/Polls/:id', async (req, res) => {
//     try {
//         const result = await Poll.findByIdAndDelete(req.params.id);

//         if (!result) {
//             return res.status(404).json({ message: 'Poll not found' });
//         }

//         res.status(200).json({ message: 'Poll deleted successfully' });
//     } catch (err) {
//         res.status(500).json({ message: 'Error deleting poll', error: err.message });
//     }
// });