//? Do each time opening/testing/etc.
//* mongod      (starts MongoDB server)

//! -------------------------------------------------------------------

// This script should generate and add a number of randomized entries to the DB for testing

const mongoose = require('mongoose')
const { db } = require('./models/rope')
const Rope = require('./models/rope')
const DB = "GearDB"

// Randomizing
const diameters = [6, 7, 8, 9, 9.2, 9.4, 9.5, 9.6, 9.8, 9.9, 10, 10.2]
const lengths = [30, 35, 40, 45, 50, 60, 70, 80]
const brands = ["Black Diamond", "Petzl", "Mammut", "Sterling", "Edelrid"]
const keywords = ["Alpine Rope", "Workhorse Rope", "Gym Rope", "Crag Rope"]
const sellers = ["Amazon", "Backcountry", "REI", "Moosejaw"]
const discounts = [0, 10, 15, 20, 30, 40, 50, 60, 70]
const falls = [5, 6, 7, 8, 9, 10, 11, 12, 13, 14]
const dynElongs = [30, 31, 32, 33, 34, 35]
const staElongs = [5.1, 5.2, 5.3, 5.4, 5.5]
const bools = [true, false]

const getRand = function (array) { return array[ Math.floor( Math.random() * array.length ) ] }
const getBasePrice =  function (dia, len) { return 49.95 + len + dia / 0.1 }
const getWeight = function (dia) { return Math.round( dia * 5.9 ) }

// Creates and/or Connects to database "RandomTestingDB"
mongoose.connect(`mongodb://localhost:27017/${DB}`)
    .then(()=> { 
        console.log(`Connected to ${DB}`)
    })
    .catch(err => {
        console.log(`Failed to connect to ${DB}`)
        console.log(err)
    })

const createEntries = function (numNew) {
    var arr = []
    for (let i = 1; i <= numNew; i++) {
        var r = new Rope
        r.brand = getRand(brands)
        r.diameter = (getRand(diameters)).toFixed(1)
        r.length = getRand(lengths)
        r.name = r.diameter.toFixed(1) + " " + getRand(keywords)
        r.base = getBasePrice(r.diameter, r.length)
        r.falls = getRand(falls)
        r.dynElong = getRand(dynElongs)
        r.staElong = getRand(staElongs)
        r.halfMark = getRand(bools)
        r.weight = getWeight(r.diameter)
        r.uiaaRated.single = getRand(bools)
        r.uiaaRated.half = getRand(bools)
        r.uiaaRated.twin = getRand(bools)
        for (let j = 0; j < sellers.length; j++) {
            let disc = getRand(discounts)
            let total = (r.base*(1-(disc/100))).toFixed(2)
            let sellerObj = {
                name: sellers[j],
                basePrice: r.base,
                discount: disc,
                totalPrice: total,
            }
            r.seller.push(sellerObj)
        }
        arr.push(r)
    }
    Rope.insertMany(arr, function(error, docs){
        console.log(`${numNew} documents inserted to ropes collection`)
        mongoose.disconnect()
            .then(()=> { 
                console.log(`Disconnected from ${DB}`)
            })
            .catch(err => {
                console.log(`Failed to disconnect from ${DB}`)
                console.log(err)
            })
    })
}

createEntries(120)