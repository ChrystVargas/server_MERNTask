const Proyecto = require('../models/Proyecto');
const { validationResult } = require('express-validator');

exports.crearProyecto = (req, res) => {
    // Revisar validacion
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
        res.status(400).json({
            errores: errores.array()
        });
    }

    try {
        // Crear un nuevo proyecto
        const proyecto = new Proyecto(req.body);

        // Guardar el creador via JWT
        proyecto.creador = req.usuario.id;

        proyecto.save();
        res.json(proyecto);
    } catch (err) {
        console.log(err);
        res.status(500).send('Hubo un error')
    }
}

// Obtener los proyectos del usuario actual
exports.obtenerProyectos = async(req, res) => {
    try {
        const proyectos = await Proyecto.find({ creador: req.usuario.id });
        res.json({ proyectos });
    } catch (err) {
        console.log(err);
        res.status(500).send('Hubo un error')
    }
}

// Actualizar un proyecto
exports.actualizarProyecto = async(req, res) => {
    // Revisar validacion
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
        res.status(400).json({
            errores: errores.array()
        });
    }
    // Extraer la informacion del proyecto
    const { nombre } = req.body
    const nuevoProyecto = {};

    if (nombre) {
        nuevoProyecto.nombre = nombre;
    }

    try {
        // Revisar el ID
        let proyecto = await Proyecto.findById(req.params.id);
        // Si existe el proyecto o no
        if (!proyecto) {
            return res.status(404).json({
                msg: 'Proyecto no encontrado'
            });
        }
        // Verificar el creador del proyecto
        if (proyecto.creador.toString() !== req.usuario.id) {
            return res.status(401).json({
                msg: 'No autorizado.'
            });
        }
        // Actualizar
        proyecto = await Proyecto.findByIdAndUpdate({ _id: req.params.id }, { $set: nuevoProyecto }, { new: true });
        res.json({ proyecto });

    } catch (err) {
        console.log(err);
        res.status(500).send('Hubo un error')
    }
}

// Elimina un proyecto por su ID
exports.eliminarProyecto = async(req, res) => {
    try {
        // Revisar el ID
        let proyecto = await Proyecto.findById(req.params.id);
        // Si existe el proyecto o no
        if (!proyecto) {
            return res.status(404).json({
                msg: 'Proyecto no encontrado'
            });
        }
        // Verificar el creador del proyecto
        if (proyecto.creador.toString() !== req.usuario.id) {
            return res.status(401).json({
                msg: 'No autorizado.'
            });
        }
        // Eliminar el proyecto
        await Proyecto.findOneAndRemove({ _id: req.params.id });
        res.json({ mes: 'Proyecto eliminado.' });
    } catch (err) {
        console.log(err);
        res.status(500).send('Hubo un error')
    }
}