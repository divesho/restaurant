var express = require('express');
var router = express.Router();
var repository = require('./repository.js').repository;
var config = require('./../config');
var path = require('path');

router.get('/', (req, res) => {
    res.status(200).send("welcome to restaurants!");
});

router.get('/admin', (req, res) => {
    res.status(200).sendFile(path.resolve(__dirname + '/../build/index.html'));
});

router.post('/login', (req, res) => {
    if(req.body.name === config.admin.name && req.body.password === config.admin.password) {
        res.status(200).send({"status": "success", "result": {msg: "user logged in successfully!", jwtToken: '1234567890'}});
    } else {
        res.status(400).send({"error": "Please enter valid user name and password"});
    }
});

// ----- Category APIs Starts -----
router.get('/category', (req, res) => {
    repository.getCategoryList()
        .then(data => {
            res.status(200).send({"status": "success", "result": data});
        })
        .catch(err => {
            res.status(err.code).send({"error": err.errMsg});
        });
});

router.put('/category', (req, res) => {
    repository.addCategory(req.body.list)
        .then(data => {
            res.status(200).send({"status": "success", "result": data});
        })
        .catch(err => {
            res.status(err.code).send({"error": err.errMsg});
        });
});

router.post('/category', (req, res) => {
    repository.updateCategory(req.body.id, req.body.value)
        .then(data => {
            res.status(200).send({"status": "success", "result": data});
        })
        .catch(err => {
            res.status(err.code).send({"error": err.errMsg});
        });
});

router.delete('/category', (req, res) => {
    repository.deleteCategory(req.body.id)
        .then(data => {
            res.status(200).send({"status": "success", "result": data});
        })
        .catch(err => {
            res.status(err.code).send({"error": err.errMsg});
        });
});
// ----- Category APIs Ends -----

// ----- Menu APIs Starts -----
router.get('/fullMenu', (req, res) => {
    repository.fullMenu()
        .then(data => {
            res.status(200).send({"status": "success", "result": data});
        })
        .catch(err => {
            res.status(err.code).send({"error": err.errMsg});
        });
});

router.get('/availableMenu', (req, res) => {
    repository.availableMenu()
        .then(data => {
            res.status(200).send({"status": "success", "result": data});
        })
        .catch(err => {
            res.status(err.code).send({"error": err.errMsg});
        });
});

router.put('/menu', (req, res) => {
    repository.addMenu(req.body.list)
        .then(data => {
            res.status(200).send({"status": "success", "result": data});
        })
        .catch(err => {
            res.status(err.code).send({"error": err.errMsg});
        });
});

router.put('/menu/upload', (req, res) => {
    repository.uploadMenu(req.body.list)
        .then(data => {
            res.status(200).send({"status": "success", "result": data});
        })
        .catch(err => {
            res.status(err.code).send({"error": err.errMsg});
        });
});

router.post('/menu', (req, res) => {
    var paramlist = [
        req.body.cid,
        req.body.item,
        req.body.shortdesc,
        req.body.fullprice,
        req.body.halfprice,
        req.body.foodtype,
        req.body.available,
        req.body.id
    ]

    repository.updateMenu(paramlist, req.body.id)
        .then(data => {
            res.status(200).send({"status": "success", "result": data});
        })
        .catch(err => {
            res.status(err.code).send({"error": err.errMsg});
        });
});

router.delete('/menu', (req, res) => {
    repository.deleteMenu(req.body.id)
        .then(data => {
            res.status(200).send({"status": "success", "result": data});
        })
        .catch(err => {
            res.status(err.code).send({"error": err.errMsg});
        });
});
// ----- Menu APIs Ends -----

module.exports = router;