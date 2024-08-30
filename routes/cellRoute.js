import { Router } from 'express';
import { calculatePayment, createMultipleCells, deleteCell, exitVehicle, getCellById, getCells, getCellsByState, parkVehicle, postCell, updateCell } from '../controller/cellController.js';

const router = Router();

router.post('/', postCell);
router.post('/multiple', createMultipleCells);
router.get('/', getCells);
router.get('/:id', getCellById);
router.get('/state/:state', getCellsByState);
router.put('/:id', updateCell);
router.delete('/:id', deleteCell);
router.post('/park', parkVehicle);
router.post('/:numberCell/exit', exitVehicle);
router.get('/:numberCell/payment', calculatePayment);



export default router;