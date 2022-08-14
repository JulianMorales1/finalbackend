


const dotenv = require('dotenv');

var ObjectID = require('mongodb').ObjectId;
dotenv.config();
var express = require("express");
var router = express.Router();

const { blogsDB } = require("../mongo");

const createTodo = async (title) => {

    try {
        const collection = await blogsDB().collection("todos")

        const newTodo = {
            title: title,

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

    const newTodoMessage = await createTodo(title);
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
    console.log(id, title)

    const collection = await blogsDB().collection('todos');


    const response = await collection.updateOne({ _id: ObjectID(id) }, { $set: { title: title } });
    console.log(response);
    res.json({ success: true })
})

router.delete('/:id', async function (req, res, next) {
    const id = req.params.id;
    const collection = await blogsDB().collection('todos');


    const response = await collection.deleteOne({ _id: ObjectID(id) });
    console.log(response)

    res.json({ success: true })
})

router.get('/', async function (req, res, next) {

    const collection = await blogsDB().collection('todos');

    const response = await collection.find().toArray()

    console.log(response)
    res.json({
        success: true,
        data: response
    })

})
module.exports = router;