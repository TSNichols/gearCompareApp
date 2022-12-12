const ejs = require('ejs') // embedded javascript
const express = require('express') // server
const app = express() // creates shortcut to use everywhere else
const path = require('path') // built into express
const mongoose = require('mongoose')
const bodyParser = require('body-parser')

const Rope = require('./models/rope')

const appDB = 'GearDB'

mongoose.connect(`mongodb://127.0.0.1:27017/${appDB}`)
    .then( ()=> { 
        console.log(`Connected to ${appDB}`)
    })
    .catch( (err) => {
        console.log(`Connection to ${appDB} failed`)
        console.log(err.message)
    })

app.use(express.static(path.join(__dirname, '/public'))) // serve static resources
app.use(bodyParser.json())

app.set('view engine', 'ejs') //requires a folder of "views" in same directory  
app.set('views', path.join(__dirname, '/views')) //path.join adds /views to working directory of app.js (this file)

// app.use will execute on every request
// app.use((req, res) => {})

//      Routing
//  /products/:productType
//  /product/:productID

// executes when a blank request is made to the website
app.get('/', (req, res) => {
    res.render('homePage')
})

// executes when a request is made to this address (/products)
app.get('/products/:productType', async (req, res) => {
    // const { productType } = req.params // pull values from request
    const dataFilters = await Rope.aggregate([
        {$set:
            {minPrice:
                {$first:
                    {$minN:
                        {input:'$seller.totalPrice',n:1}}}}},
        {$set:
            {seller:
                {$first:
                    {$filter:
                        {input:'$seller',
                        cond:{$eq:['$$this.totalPrice','$minPrice']},
                        limit:1}}}}},
        {$unset:'minPrice'},
        {$group: { 
            _id: null,
            brands: { "$addToSet": "$brand" },
            maxPrice: { "$max": "$seller.totalPrice" }, 
            minPrice: { "$min": "$seller.totalPrice" },
            maxDia: { "$max": "$diameter"},
            minDia: { "$min": "$diameter"},
            maxLength: { "$max": "$length"},
            minLength: { "$min": "$length"},
        }},
        {$project: {
            _id: 0,
            b: {
                "$sortArray": { input: "$brands", sortBy: 1 }
            },
            x: {
                min: "$minPrice",
                max: "$maxPrice",
            },
            d: {
                min: "$minDia",
                max: "$maxDia",
            },
            l: {
                min: "$minLength",
                max: "$maxLength",
            },
        }}
    ])

    const data = await Rope.aggregate([
        {$sort: { _id:1 }},
        {$limit: 50},
        {$set:
            {minPrice:
                {$first:
                    {$minN:
                        {input:'$seller.totalPrice',n:1}}}}},
        {$set:
            {seller:
                {$first:
                    {$filter:
                        {input:'$seller',
                        cond:{$eq:['$$this.totalPrice','$minPrice']},
                        limit:1}}}}},
        {$unset:'minPrice'},
    ])
    res.render('productTypePage',{ data, dataFilters: dataFilters[0] })
})

app.post('/products/:productType', async (req, res) => {
    const data = await Rope.aggregate([
        {$match:
            {$and:[
                { brand: { $in: req.body.brand } },
                { length: { $gte: req.body.length[0] } },
                { length: { $lte: req.body.length[1] } },
                { diameter: { $gte: req.body.diameter[0] } },
                { diameter: { $lte: req.body.diameter[1] } },
                ]
            }
        },
        {$sort:{_id:1}},
        {$limit: 50},
        {$set:
            {minPrice:
                {$first:
                    {$minN:
                        {input:'$seller.totalPrice',n:1}}}}},
        {$set:
            {seller:
                {$first:
                    {$filter:
                        {input:'$seller',
                        cond:{$eq:['$$this.totalPrice','$minPrice']},
                        limit:1}}}}},
        {$unset:'minPrice'},
    ])
    res.send( { data } )
})

app.get('/product/:productID', async (req, res) => {
    const { productID } = req.params
    const product = await Rope.findById(productID)
    res.render('productPage', { product })
})

// If request doesn't match any above - redirect to home page
app.get('*', (req, res) => {
    res.redirect('/')
})

// Starts the server - listening for requests at Localhost:3000
app.listen(3000, () => {
    console.log('LISTENING ON http://localhost:3000/')
})
