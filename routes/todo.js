const dotenv = require('dotenv');
var ObjectID = require('mongodb').ObjectId;
dotenv.config();
var express = require("express");
var router = express.Router();

const { blogsDB } = require("../mongo");

const createTodo = async (title, desc, startDate, endDate, userid) => {

    //console.log(title, desc, startDate, endDate)

    try {
        const collection = await blogsDB().collection("todos")

        const newTodo = {
            title: title,
            completed: false,
            desc: desc,
            startDate: startDate,
            endDate: endDate,
            userid: userid
        }

        await collection.insertOne(newTodo);
        // Save user functionality
        return true;
    } catch (e) {
        console.error(e);
        return false;
    }
}


router.post("/", async function (req, res, next) {

    const title = req.body.title
    const desc = req.body.desc
    const startDate = req.body.startDate
    const endDate = req.body.endDate
    const userid = req.body.userid




    const newTodoMessage = await createTodo(title, desc, startDate, endDate, userid);
    if (newTodoMessage === true) {
        res.json({ success: true });
    }
    if (newTodoMessage === false) {
        res.json({ success: false });
    }
})
//kennels.findByIdAndUpdate({"5db6b26730f133b65dbbe459"},{"breed": "Great Dane"})

//collection.update({_id:"123"}, {author:"Jessica", title:"Mongo facts"});


router.put('/:id', async function (req, res, next) {

    const title = req.body.title;
    const id = req.params.id;
    // const completed = req.body.completed;
    const desc = req.body.desc;
    const startDate = req.body.startDate;
    const endDate = req.body.endDate;
    const userid = req.body.userid;
    const admin = req.body.admin;



    const collection = await blogsDB().collection('todos');

    let response = null;

    if (admin === true) {
        response = await collection.updateOne({ _id: ObjectID(id) }, { $set: { title: title, desc: desc, startDate: startDate, endDate: endDate } });
    } else {
        response = await collection.updateOne({ _id: ObjectID(id), userid: userid }, { $set: { title: title, desc: desc, startDate: startDate, endDate: endDate } });
    }

    res.json({ success: true })
})

router.put('/complete/:id', async function (req, res, next) {

    const collection = await blogsDB().collection('todos');
    const id = req.params.id;
    const userid = req.body.userid;
    const admin = req.body.admin;


    //const complete = req.body.complete;

    const todo = await collection.findOne({ _id: ObjectID(id) })

    let response = null;

    if (admin === true) {
        response = await collection.updateOne({ _id: ObjectID(id) }, { $set: { completed: !todo.completed } });
    } else {
        response = await collection.updateOne({ _id: ObjectID(id), userid: userid }, { $set: { completed: !todo.completed } });
    }

    //console.log(response);
    res.json({ success: true })
})

router.delete('/:id', async function (req, res, next) {
    const id = req.params.id;
    const userid = req.body.userid;
    const admin = req.body.admin;
    const collection = await blogsDB().collection('todos');

    let response = null;

    if (admin === true) {
        response = await collection.deleteOne({ _id: ObjectID(id) });
    } else {

        response = await collection.deleteOne({ _id: ObjectID(id), userid: userid });
    }



    res.json({ success: true })
})

router.post('/:userid', async function (req, res, next) {


    // check if the use is admin

    const admin = req.body.admin;
    console.log('admin here', admin)


    const collection = await blogsDB().collection('todos');
    const userid = req.params.userid;

    let response = null;
    if (admin === true) {
        response = await collection.find().toArray()
    } else {
        response = await collection.find({ userid: userid }).toArray()
    }



    res.json({
        success: true,
        data: response
    })

})
module.exports = router;