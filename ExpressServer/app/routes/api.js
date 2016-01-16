var Task = require('../models/task');


module.exports = function (express, io) {
    var router = express.Router();
    router.get('/task', function (req, res) {
    Task.find({}, function (err, result) {
        if(err){
            console.error(err);
            res.send(err);
        } else {
            res.json(result);
        }
    });
});
    router.post('/task', function (req, res) {
    var task = new Task();
    task.nameTask = req.body.nameTask;
    task.save(function (err, data) {
        if(err){
            console.error(err);
            res.send(err);
        } else {
            res.json({
                message: "create task successfully"
            });
            io.emit('add', data);
        }
    })
});
    router.get('/task/:id', function (req, res) {
    var id = req.params.id;
    Task.findById(id, function (err, result) {
        if(err){
            console.error(err);
            res.send(err);
        } else {
            res.json(result);
        }
    })
});
    router.put('/task/:id',function (req, res) {
    Task.findById(req.params.id, function (err, result) {
        if(err){
            console.error(err);
            res.send(err);
        } else {
            result.nameTask = req.body.nameTask;
            result.completed = req.body.completed;
            result.save(function (err) {
                if(err){
                    console.error(err);
                    res.send(err);
                } else {
                    res.json({
                        message: "Update Successfully!",
                        task: result
                    });
                }
            });
        }
    });
});
    router.delete('/task/:id', function (req, res) {
    Task.findById(req.params.id, function (err, result) {
        if(err){
            console.error(err);
            res.send(err);
        } else{
            Task.findByIdAndRemove(req.params.id, function (err) {
                if (err) {
                    console.error(err);
                    res.send(err);
                } else {
                    res.json({
                        message: "Delete Task Successfully"
                    });
                    io.emit('remove', result);
                }
            });
        }
    });
});
    return router;
}
