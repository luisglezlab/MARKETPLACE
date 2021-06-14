const express = require('express');
const router = express.Router();
const helpers = require('../lib/helpers');

const pool = require('../database');
const passport = require('passport');
const { isLoggedIn, bloqueado, nobloqueado, isNotLoggedIn } = require('../lib/auth');

router.post('/signup', isNotLoggedIn, passport.authenticate('local.signup', {
    successRedirect: '/inicio',
    failureRedirect: '/',
    failureFlash: true
}));

router.get('/signin', isNotLoggedIn, (req, res) => {
    res.render('auth/signin');
});

router.get('/inicio',  isLoggedIn, bloqueado, bloqueado, async (req, res) => {
    const admin = await pool.query('SELECT * FROM users WHERE tipo_usuario = "Admin" and id = ?',[req.user.id]);
    const tiendas = await pool.query('SELECT tiendas.nombre_tienda, tiendas.description, tiendas.url, users.nombre, users.reportado, users.id FROM users INNER JOIN tiendas ON users.id=tiendas.user_id WHERE users.reportado != "bloqueado"');
    res.render('inicio', { tiendas, admin });
});

router.get('/reportar/:id',  isLoggedIn, bloqueado, async (req, res) => {
    const { id } = req.params;
    const admin = await pool.query('UPDATE users set reportado = "reportado" WHERE id = ?',[id]); 


    const row = await pool.query('SELECT nombre FROM users WHERE id = ?', [id]);
    const tienda = row[0];    
    const tienda_visitada = "reportó a " + tienda.nombre;
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

    req.flash('success', 'La cuenta fue reportada');
    res.redirect('/inicio');
});

router.get('/bloqueado',  isLoggedIn, nobloqueado, async (req, res) => {
    res.render('bloqueado');
});

router.post('/actividad',  isLoggedIn, bloqueado, async (req, res) => {
    const { tienda_visitada, url } = req.body;
    var ip = req.header('x-forwarded-for') || req.connection.remoteAddress;
    if (ip.includes('::ffff:')) {
        ip = ip.split(':').reverse()[0]
    }
    console.log(ip);
    const newLink = {
        tienda_visitada,
        ip,
        user_id: req.user.id
    };
    await pool.query('INSERT INTO actividad set ?', [newLink]);
    res.redirect(url);
});

router.get('/logout', isLoggedIn, async (req, res) => {

              
    const tienda_visitada = "Cerro sesión";
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


    req.logOut();
    res.redirect('/');
});
router.post('/signin', isNotLoggedIn, (req, res, next) => {
    passport.authenticate('local.signin',{
       successRedirect: '/inicio',
       failureRedirect: '/signin',
       failureFlash: true 
    })(req, res, next);
});

module.exports = router;