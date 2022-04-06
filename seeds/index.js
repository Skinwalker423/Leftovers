const mongoose = require('mongoose');
const cityData = require('./cities.js');
const { descriptors, places } = require('./seedHelper');
const { faker } = require('@faker-js/faker');
const Schema = mongoose.Schema;

mongoose.connect('mongodb://localhost:27017/leftovers');

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('db connected main index')
});


function rngArrElement(arr){
  const rngIndex = Math.floor(Math.random() * arr.length);
  return arr[rngIndex];
}

function titleGenerator(){
  return `${rngArrElement(descriptors)} ${rngArrElement(places)}`;
  
}

// const city = rngArrElement(cityData).city;
// const state = rngArrElement(cityData).state;
// const location = `${city}, ${state}`
// const title = titleGenerator();

// const randomName = faker.name.findName(); 
// const randomEmail = faker.internet.email(); 
// const randomAvatar = faker.image.avatar();
// const randomLorem = faker.lorem.paragraph();


const prepperSchema = new mongoose.Schema({
    name: String,
    price: Number,
    image: String,
    location: String,
    description: String,
    author: {type: Schema.Types.ObjectId, ref: 'User'}
})

const Prepper = new mongoose.model('Prepper', prepperSchema);


const dbPreppers = async function(){

  await Prepper.deleteMany({});

  for(let i = 0; i < 10; i++ ){
    const city = rngArrElement(cityData).city;
    const state = rngArrElement(cityData).state;
    const location = `${city}, ${state}`
    const randomName = faker.name.findName();  
    const randomAvatar = faker.image.avatar();
    const randomLorem = faker.lorem.paragraph();
    const rngPrice = Math.floor(Math.random()* 100);

    const rngPrepper = await new Prepper({
        name: randomName,
        image: randomAvatar,
        location: location,
        description: randomLorem,
        price: rngPrice,
        author: "622d4b05000bd0fb86217536"
      })
    await rngPrepper.save();
    } 
}

dbPreppers().then(() => {
  mongoose.connection.close();
  console.log('d/c from db')
}).catch(err => err)


