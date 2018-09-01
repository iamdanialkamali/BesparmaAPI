import express from 'express';
import user_routes from './users';
import task_routes from './tasks';
import auth_routes from './auth';
import costumers_routes from './customers'

const router = express.Router();

// Adding first endpoint to server app
router.get('/', (req, res) => {
	res.json({
        msg: 'hello'
    });
});

/** GET /api-status - Check Service status  */
router.get('/api-status', (req, res) => {
    res.json({
        status: "ok"
    });
});

router.use('/auth', auth_routes);
router.use('/users', user_routes);
router.use('/tasks', task_routes);

router.use('/customers', costumers_routes)


export default router;