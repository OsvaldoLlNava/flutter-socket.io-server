//Mensajes de Sockets

const { io } = require('../index.js');
const Band = require('../models/band.js');
const Bands = require('../models/bands.js');

const bands = new Bands();

bands.addBand(new Band("quesito"));
bands.addBand(new Band("atun"));
bands.addBand(new Band("pollito"));
bands.addBand(new Band("cheto"));

// console.log(bands);

io.on('connection', client => {
    console.log("Cliente Conectado");


    client.emit('active-bands', bands.getBands());

    client.on('disconnect', () => {
        console.log("Cliente Desconectado");
    });


    client.on('mensaje', (payload) => {
        console.log('Mensaje!! ', payload);

        io.emit('mensaje', { admin: "Nuevo Mensaje" });
    });

    client.on('emitir-mensaje', (payload) => {
        console.log('Nuevo Mensaje!! ', payload);

        // io.emit('nuevo-mensaje', payload); //esto lo envia a todos
        client.broadcast.emit('nuevo-mensaje', payload); //esto lo envia a todos menos al cliente que envia el mensaje
    });

    client.on('vote-band', (payload) => {
        // console.log(payload);
        bands.voteBand(payload.id);
        io.emit('active-bands', bands.getBands());
    });

    client.on('add-band', (payload) => {
        bands.addBand(new Band(payload.name));
        io.emit('active-bands', bands.getBands());

    });


    client.on('delete-band', (payload) => {
        bands.deleteBand(payload.id);
        io.emit('active-bands', bands.getBands());

    })

});