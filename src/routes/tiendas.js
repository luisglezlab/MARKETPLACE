const express = require('express');
const router = express.Router();

const pool = require('../database');
const { isLoggedIn, bloqueado } = require('../lib/auth');

router.get('/add', isLoggedIn, bloqueado, async (req, res) => {
         const admin = await pool.query('SELECT * FROM users WHERE tipo_usuario = "Admin" and id = ?',[req.user.id]);
    res.render('tiendas/add', {admin});
});

router.post('/add',  isLoggedIn, bloqueado, async (req, res) => {
    const { nombre_tienda, description, url } = req.body;
    const newLink = {
        nombre_tienda,
        description,
        url,
        user_id: req.user.id
    };
    await pool.query('INSERT INTO tiendas set ?', [newLink]);


    const tienda_visitada = "Creó la tienda " + nombre_tienda;
    var ip = req.header('x-forwarded-for') || req.connection.remoteAddress;
    if (ip.includes('::ffff:')) {
        ip = ip.split(':').reverse()[0]
    }
    console.log(ip);
    const actividad = {
        tienda_visitada,
        ip,
        user_id: req.user.id
    };
    await pool.query('INSERT INTO actividad set ?', [actividad]);

    
    
    req.flash('success', 'Tu tienda ha sido registrada exitosamente');
    res.redirect('/tiendas');
});

router.get('/',  isLoggedIn, bloqueado, async (req, res) => {
    const tiendas = await pool.query('SELECT * FROM tiendas WHERE user_id = ?',[req.user.id]);
         const admin = await pool.query('SELECT * FROM users WHERE tipo_usuario = "Admin" and id = ?',[req.user.id]);
    res.render('tiendas/list', { tiendas, admin });
});

router.get('/delete/:id', isLoggedIn, bloqueado,  async (req, res) => {
    const { id } = req.params;
    const row = await pool.query('SELECT nombre_tienda FROM tiendas WHERE id_tienda = ?', [id]);
    const tienda = row[0];    
    const tienda_visitada = "Eliminó la tienda " + tienda.nombre_tienda;
    var ip = req.header('x-forwarded-for') || req.connection.remoteAddress;
    if (ip.includes('::ffff:')) {
        ip = ip.split(':').reverse()[0]
    }
    console.log(ip);
    const actividad = {
        tienda_visitada,
        ip,
        user_id: req.user.id
    };
    await pool.query('INSERT INTO actividad set ?', [actividad]);

    
    await pool.query('DELETE FROM tiendas WHERE id_tienda = ?', [id]);
    req.flash('success', 'Tu tienda ha sido eliminada');
    res.redirect('/tiendas');
});

router.get('/edit/:id',  isLoggedIn, bloqueado, async (req, res) => {
    const { id } = req.params;
    const tiendas = await pool.query('SELECT * FROM tiendas WHERE id_tienda = ?', [id]);
    const admin = await pool.query('SELECT * FROM users WHERE tipo_usuario = "Admin" and id = ?',[req.user.id]);
    res.render('tiendas/edit', { tienda: tiendas[0], admin });
});

router.post('/edit/:id', isLoggedIn, bloqueado,  async (req, res) => {
    const { id } = req.params;
    const { nombre_tienda, description, url } = req.body;
    const newLink = {
        nombre_tienda,
        description,
        url,
        user_id: req.user.id
    };
    await pool.query('UPDATE tiendas set ? WHERE id_tienda = ?', [newLink, id]);


    const tienda_visitada = "Editó la tienda " + nombre_tienda;
    var ip = req.header('x-forwarded-for') || req.connection.remoteAddress;
    if (ip.includes('::ffff:')) {
        ip = ip.split(':').reverse()[0]
    }
    console.log(ip);
    const actividad = {
        tienda_visitada,
        ip,
        user_id: req.user.id
    };
    await pool.query('INSERT INTO actividad set ?', [actividad]);

    
    req.flash('success', 'Tu tienda ha sido actualizada');
    res.redirect('/tiendas');
});

module.exports = router;