const jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
    // Leer el token del header
    const token = req.header('x-auth-token');

    // Revisar si no hay un token
    if (!token) {
        return res.status(401).json({
            msg: 'No hay un token, permiso denegado.'
        })
    }
    // Validar token
    try {
        const cifrado = jwt.verify(token, process.env.SECRETA);
        req.usuario = cifrado.usuario;
        next();
    } catch (err) {
        res.status(401).json({
            msg: 'Token no valido.'
        })
    }
}