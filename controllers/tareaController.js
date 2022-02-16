const Tarea = require('../models/Tarea');
const Proyecto = require('../models/Proyecto');
const { validationResult } = require('express-validator');

// Crear una nueva tarea
exports.crearTarea = async(req, res) => {
    // Revisar validacion
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
        res.status(400).json({
            errores: errores.array()
        });
    }
    try {
        // Extraer el proyecto y comprobar si existe
        const { proyecto } = req.body;
        const proyectoExist = await Proyecto.findById(proyecto);
        if (!proyectoExist) {
            return res.status(404).json({ msg: 'Proyecto no encontrado.' })
        }
        // Verificar si el proyecto pertenece al usuario autenticado
        if (proyectoExist.creador.toString() !== req.usuario.id) {
            return res.status(401).json({
                msg: 'No autorizado.'
            });
        }
        // Creamos la tarea
        const tarea = new Tarea(req.body);
        await tarea.save();
        res.json({ tarea });
    } catch (err) {
        console.log(err);
        res.status(500).send('Hubo un error')
    }
}

// Obtiene las tareas por proyecto
exports.obtenerTareas = async(req, res) => {
    try {
        // Extraer el proyecto y comprobar si existe
        const { proyecto } = req.query;
        const proyectoExist = await Proyecto.findById(proyecto);
        if (!proyectoExist) {
            return res.status(404).json({ msg: 'Proyecto no encontrado.' })
        }
        // Verificar si el proyecto pertenece al usuario autenticado
        if (proyectoExist.creador.toString() !== req.usuario.id) {
            return res.status(401).json({
                msg: 'No autorizado.'
            });
        }
        // Obtener las tareas por proyecto
        const tareas = await Tarea.find({ proyecto: proyecto }).sort({ creado: -1 });
        res.json({ tareas });
    } catch (err) {
        console.log(err);
        res.status(500).send('Hubo un error')
    }
}

// Actualizar tarea
exports.actualizarTarea = async(req, res) => {
    try {
        // Extraer el proyecto y comprobar si existe
        const { proyecto, nombre, estado } = req.body;
        // Revisar si la tarea existe
        let tarea = await Tarea.findById(req.params.id);
        if (!tarea) {
            return res.status(404).json({
                msg: 'No existe esta tarea.'
            });
        }
        // Verificar si el proyecto pertenece al usuario autenticado
        const proyectoExist = await Proyecto.findById(proyecto);
        if (proyectoExist.creador.toString() !== req.usuario.id) {
            return res.status(401).json({
                msg: 'No autorizado.'
            });
        }
        // Crear un objeto con la nueva informacion
        const nuevaTarea = {};
        nuevaTarea.nombre = nombre;
        nuevaTarea.estado = estado;

        // Guardar la tarea
        tarea = await Tarea.findOneAndUpdate({ _id: req.params.id }, { $set: nuevaTarea }, { new: true });
        res.json({ tarea });
    } catch (err) {
        console.log(err);
        res.status(500).send('Hubo un error')
    }
}

// Eliminar una tarea
exports.eliminarTarea = async(req, res) => {
    try {
        // Extraer el proyecto y comprobar si existe
        const { proyecto } = req.query;
        // Revisar si la tarea existe
        let tarea = await Tarea.findById(req.params.id);
        if (!tarea) {
            return res.status(404).json({
                msg: 'No existe esta tarea.'
            });
        }
        // Verificar si el proyecto pertenece al usuario autenticado
        const proyectoExist = await Proyecto.findById(proyecto);
        if (proyectoExist.creador.toString() !== req.usuario.id) {
            return res.status(401).json({
                msg: 'No autorizado.'
            });
        }
        // Eliminar la tarea
        await Tarea.findOneAndRemove({ _id: req.params.id });
        res.json({ msg: "Tarea eliminada" });
    } catch (err) {
        console.log(err);
        res.status(500).send('Hubo un error')
    }
}