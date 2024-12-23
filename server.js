const http = require('http');
const { Readable } = require('stream');

const port = 3000;

const server = http.createServer((req, res) => {
    if (req.url === '/download') {
        const totalSize = 10 ** 15; // One quadrillion characters
        const chunkSize = 1024 * 1024; // 1 MB chunks

        let downloadedSize = 0;

        const readableStream = new Readable({
            read() {
                if (downloadedSize >= totalSize) {
                    this.push(null); // End the stream
                    return;
                }

                const remainingSize = totalSize - downloadedSize;
                const currentChunkSize = Math.min(chunkSize, remainingSize);
                const chunk = 'q'.repeat(currentChunkSize);

                this.push(chunk);
                downloadedSize += currentChunkSize;
            }
        });

        res.setHeader('Content-Disposition', 'attachment; filename="one_quadrillion_qs.txt"');
        res.setHeader('Content-Type', 'text/plain');
        readableStream.pipe(res);
    } else {
        res.statusCode = 404;
        res.setHeader('Content-Type', 'text/plain');
        res.end('Not Found');
    }
});

server.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});