import express from 'express';
import SPCtrl from '../controllers/serviceProvider';
import auth from '../../config/jwt';

const router = express.Router();

router.route('/')
  /** GET /api/users - Get list of users */
  .get(auth, userCtrl.list)

  /** POST /api/users - Create new user */
  .post(userCtrl.create);

router.route('/:SPId')
  /** GET /api/users/:userId - Get user */
  .get(userCtrl.get)

  /** PUT /api/users/:userId - Update user */
  .put(userCtrl.update)

  /** DELETE /api/users/:userId - Delete user */
  .delete(userCtrl.remove);

/** Load user when API with userId route parameter is hit */
router.param('SPId', SPCtrl.load);

export default router;