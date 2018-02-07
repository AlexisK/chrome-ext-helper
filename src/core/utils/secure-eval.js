export function secureEval(expr, timeLimit = 10) {
    return new Promise((resolve) => {
        let contextFrame = document.createElement('iframe');
        contextFrame.setAttribute('sandbox', 'allow-scripts');
        contextFrame.setAttribute('style', 'display: none;');

        contextFrame.setAttribute('src', 'data:text/html;base64,' + btoa(`
            <script>
                const evalWorkerSource = \`
                    onmessage = function(event) {
                        try {
                            eval(event.data);
                        }
                        catch(error) {
                            postMessage({
                                error: error.toString()
                            });
                        }
                    }
                \`;
                window.addEventListener('secure-eval-message', (event) => {
                    const blob = new window.Blob([evalWorkerSource], { type: 'application/javascript' });
                    const objectURL = window.URL.createObjectURL(blob);
                    const evalWorker = new Worker(objectURL, {type:'module'});
                    evalWorker.postMessage(event.data);
                    setTimeout(() => {
                        evalWorker.terminate();
                        window.parent.postMessage(Object.assign({}, {
                            type: 'secure-eval-iframe-worker-terminated'
                        }), '*');
                    }, ${timeLimit});
                    evalWorker.addEventListener('secure-eval-message', (event) => {
                        window.parent.postMessage(Object.assign({}, event.data, {
                            type: 'secure-eval-iframe-result'
                        }), '*');
                    });
                });
            </script>
        `));

        contextFrame.addEventListener('load', () => {
            contextFrame.contentWindow.postMessage(expr, '*');
        });

        window.addEventListener('secure-eval-message', windowListener);

        document.body.appendChild(contextFrame);

        function windowListener(event) {
            window.removeEventListener('secure-eval-message', windowListener);
            document.body.removeChild(contextFrame);
            resolve(event.data);
        }
    });
}
