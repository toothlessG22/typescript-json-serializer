"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var zoo_1 = require("../models/zoo");
var employee_1 = require("../models/employee");
var panther_1 = require("../models/panther");
var gender_1 = require("../models/gender");
var status_1 = require("../models/status");
var snake_1 = require("../models/snake");
exports.data = {
    'id': 15,
    'name': 'The Greatest Zoo',
    'city': 'Bordeaux',
    'country': 'France',
    'boss': {
        'id': 1,
        'name': 'Bob Razowsky',
        'birthdate': '1984-04-03T22:00:00.000Z',
        'email': 'bob.razowsky@tgzoo.fr',
        'gender': 1
    },
    'employees': [
        {
            'id': 1,
            'name': 'Bob Razowsky',
            'birthdate': '1984-04-03T22:00:00.000Z',
            'email': 'bob.razowsky@tgzoo.fr',
            'gender': 1
        },
        {
            'id': 2,
            'name': 'Mikasa Ackerman',
            'birthdate': '1984-01-11T22:00:00.000Z',
            'email': 'mikasa.ackerman@tgzoo.fr',
            'gender': 0
        },
        {
            'id': 3,
            'name': 'Red Redington',
            'birthdate': '1970-12-04T22:00:00.000Z',
            'email': 'red.redington@tgzoo.fr',
            'gender': 1
        },
        {
            'id': 4,
            'name': 'Fried Richter',
            'birthdate': '1994-04-01T22:00:00.000Z',
            'email': 'fried.richter@tgzoo.fr',
            'gender': 1
        }
    ],
    'Animals': [
        {
            'id': 1,
            'name': 'Bagheera',
            'birthdate': '2010-01-11T22:00:00.000Z',
            'numberOfPaws': 4,
            'gender': 1,
            'childrenIdentifiers': [
                2,
                3
            ],
            'color': 'black',
            'isSpeckled': false,
            'status': 'Sick'
        },
        {
            'id': 2,
            'name': 'Jolene',
            'birthdate': '2017-03-10T22:00:00.000Z',
            'numberOfPaws': 4,
            'gender': 0,
            'color': 'blond',
            'isSpeckled': true,
            'status': 'Alive'
        },
        {
            'id': 3,
            'name': 'Ka',
            'birthdate': '2018-09-09T00:00:00.000Z',
            'numberOfPaws': 0,
            'gender': 1,
            'isPoisonous': true,
            'status': 'Alive'
        },
        {
            'id': 4,
            'name': 'Schrodinger',
            'birthdate': '2015-03-05T22:00:00.000Z',
            'numberOfPaws': 4,
            'gender': 1,
            'color': 'brown',
            'isSpeckled': false,
            'status': 'Dead and alive'
        }
    ],
    'mascot': {
        'id': 1,
        'name': 'Bagheera',
        'birthdate': '2010-01-11T22:00:00.000Z',
        'numberOfPaws': 4,
        'gender': 1,
        'childrenIdentifiers': [
            2,
            3
        ],
        'color': 'black',
        'isSpeckled': false,
        'status': 'Sick'
    }
};
var boss = new employee_1.Employee();
boss.birthdate = new Date(exports.data.boss.birthdate);
boss.email = exports.data.boss.email;
boss.gender = gender_1.Gender.Male;
boss.id = exports.data.boss.id;
boss.name = exports.data.boss.name;
var mikasa = new employee_1.Employee();
mikasa.birthdate = new Date(exports.data.employees[1].birthdate);
mikasa.email = exports.data.employees[1].email;
mikasa.gender = gender_1.Gender.Female;
mikasa.id = exports.data.employees[1].id;
mikasa.name = exports.data.employees[1].name;
var red = new employee_1.Employee();
red.birthdate = new Date(exports.data.employees[2].birthdate);
red.email = exports.data.employees[2].email;
red.gender = gender_1.Gender.Male;
red.id = exports.data.employees[2].id;
red.name = exports.data.employees[2].name;
var fried = new employee_1.Employee();
fried.birthdate = new Date(exports.data.employees[3].birthdate);
fried.email = exports.data.employees[3].email;
fried.gender = gender_1.Gender.Male;
fried.id = exports.data.employees[3].id;
fried.name = exports.data.employees[3].name;
var bagheera = new panther_1.Panther();
bagheera.birthdate = new Date(exports.data.Animals[0].birthdate);
bagheera.childrenIds = exports.data.Animals[0].childrenIdentifiers;
bagheera.color = exports.data.Animals[0].color;
bagheera.gender = gender_1.Gender.Male;
bagheera.id = exports.data.Animals[0].id;
bagheera.isSpeckled = exports.data.Animals[0].isSpeckled;
bagheera.name = exports.data.Animals[0].name;
bagheera.numberOfPaws = exports.data.Animals[0].numberOfPaws;
bagheera.status = status_1.Status.Sick;
var jolene = new panther_1.Panther();
jolene.birthdate = new Date(exports.data.Animals[1].birthdate);
jolene.color = exports.data.Animals[1].color;
jolene.gender = gender_1.Gender.Female;
jolene.id = exports.data.Animals[1].id;
jolene.isSpeckled = exports.data.Animals[1].isSpeckled;
jolene.name = exports.data.Animals[1].name;
jolene.numberOfPaws = exports.data.Animals[1].numberOfPaws;
jolene.status = status_1.Status.Alive;
var ka = new snake_1.Snake();
ka.birthdate = new Date(exports.data.Animals[2].birthdate);
ka.gender = gender_1.Gender.Male;
ka.id = exports.data.Animals[2].id;
ka.isPoisonous = exports.data.Animals[2].isPoisonous;
ka.name = exports.data.Animals[2].name;
ka.numberOfPaws = exports.data.Animals[2].numberOfPaws;
ka.status = status_1.Status.Alive;
var schrodinger = new panther_1.Panther();
schrodinger.birthdate = new Date(exports.data.Animals[3].birthdate);
schrodinger.color = exports.data.Animals[3].color;
schrodinger.gender = gender_1.Gender.Male;
schrodinger.id = exports.data.Animals[3].id;
schrodinger.isSpeckled = exports.data.Animals[3].isSpeckled;
schrodinger.name = exports.data.Animals[3].name;
schrodinger.numberOfPaws = exports.data.Animals[3].numberOfPaws;
schrodinger.status = status_1.Status.DeadAndAlive;
var zoo = new zoo_1.Zoo();
zoo.animals = [bagheera, jolene, ka, schrodinger];
zoo.boss = boss;
zoo.city = exports.data.city;
zoo.country = exports.data.country;
zoo.employees = [boss, mikasa, red, fried];
zoo.id = exports.data.id;
zoo.mascot = bagheera;
zoo.name = exports.data.name;
exports.deserializedData = zoo;
