const db = require("../../models");

const property = {
  price: 200000,
  description: "This is the house of your dreams",
  filters: ["petsAllowed"],
  images: ["https://geekculture.co/wp-content/uploads/2019/12/Pickle-Rick-3.jpeg"],
  surface: 200,
  contactInfo: {
    phone: "827948827",
    email: "pepe@mail.com"
  },
}

const PROPERTIES = [
  {
    employee_id: "5d6ede6a0ba62570afcedd3a",
    kind: "Home",
    homeType: "house",
    bedRooms: 3,
    bathRooms: 2,
    equipment: "full",
    condition: "newHome",
    address: {
      street: "C/Sant Antoni",
      number: 50,
      city: "Cerdañola del Vallés",
      state: "Catalonia",
      country: "Spain",
      coordinates: {
        lat: 0.1234,
        long: 1.2314
      }
    },
    ...property
  },
  {
    employee_id: "5d6ede6a0ba62570afcedd3a",
    kind: "Office",
    buildingUse: "coWorking",
    address: {
      street: "C/Sant Antoni",
      number: 50,
      city: "Barcelona",
      state: "Catalonia",
      country: "Spain",
      coordinates: {
        lat: 0.1234,
        long: 1.2314
      }
    },
    ...property
  }
];

const EMPLOYEES = [
  {
    _id: "5d6ede6a0ba62570afcedd3a",
    firstname: "Pepe",
    lastname: "Martinez",
    email: "pepe@mail.com",
    phone: "827948827",
  },
  {
    _id: "5d6ede6a0ba62570afcedd3b",
    firstname: "Home",
    lastname: "house",
    email: "qsdfsdfg@asdasd.com",
    phone: "625989438",
  }
];

async function seedTestPropertiesDB() {
  const testEmployee = getTestEmployee1();

  const newEmployee = await db.Employee.create(testEmployee);

  const propertiesWithEmployee = PROPERTIES.map(property => ({
    ...property,
    employee_id: newEmployee._id
  }));

  await db.Property.insertMany(propertiesWithEmployee);
}

function getHome() {
  return PROPERTIES[0];
}

function getOffice() {
  return PROPERTIES[1];
}

function getTestEmployee1() {
  return EMPLOYEES[0];
}

function getTestEmployee2() {
  return EMPLOYEES[1];
}

module.exports = {
  getHome,
  getOffice,
  getTestEmployee1,
  getTestEmployee2,
  seedTestPropertiesDB
};
