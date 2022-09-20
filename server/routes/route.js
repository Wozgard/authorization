const router = app => {
    app.get('/route', (req, res) => {
        res.send({
            message: 'ALO'
        });
    });
}

module.exports = router;