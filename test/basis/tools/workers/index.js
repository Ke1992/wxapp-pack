worker.onMessage((res) => {
    if (res.msg === 'hello worker') {
        worker.postMessage({
            data: 'this is worker data',
        });
    }
});
