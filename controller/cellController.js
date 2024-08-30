import Cell from '../models/cell.js';
import getNextCellsManyN from '../models/cell.js';
import bcrypt from 'bcrypt';

export async function getCells(req, res) {
  try {
    const cells = await Cell.find();
    res.json(cells);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
}

export async function postCell(req, res) {
  try {
    const cellCount = await Cell.countDocuments();
    if (cellCount >= 10) {
      return res.status(400).json({ msg: 'Maximum number of cells reached' });
    }

    const numberCell = await Cell.getNextCellNumber();
    const cell = new Cell({ numberCell });
    await cell.save();
    res.status(201).json({ msg: 'Cell created successfully', cell });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
}

export async function createMultipleCells(req, res) {
  try {
    const { numCells } = req.body;
    const createdCells = [];

    for (let i = 0; i < numCells; i++) {
      const numberCell = await Cell.getNextCellNumber();
      const cell = new Cell({ numberCell });
      await cell.save();
      createdCells.push(cell);
    }

    res.status(201).json({ 
      msg: `${numCells} cells created successfully`, 
      cells: createdCells 
    });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
}


export async function getCellById(req, res) {
  try {
    const cell = await Cell.findById(req.params.id);
    if (!cell) {
      return res.status(404).json({ msg: 'Cell not found' });
    }
    res.json(cell);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
}

export async function getCellsByState(req, res) {
  try {
    const cells = await Cell.find({ state: req.params.state });
    res.json(cells);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
}

export async function updateCell(req, res) {
  try {
    const cell = await Cell.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!cell) {
      return res.status(404).json({ msg: 'Cell not found' });
    }
    res.json(cell);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
}

export async function deleteCell(req, res) {
  try {
    const cell = await Cell.findByIdAndDelete(req.params.id);
    if (!cell) {
      return res.status(404).json({ msg: 'Cell not found' });
    }
    res.json({ msg: 'Cell deleted successfully' });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
}

export async function parkVehicle(req, res) {
  try {
    const { numberCell, plateVehicle } = req.body;
    const cell = await Cell.findOne({numberCell:numberCell});
    
    if (!cell) {
      return res.status(404).json({ msg: 'Cell not found' });
    }
    
    if (cell.state === 'unavailable') {
      return res.status(400).json({ msg: 'Cell is already occupied' });
    }
    
    const pinString = `${cell.numberCell}${plateVehicle}`;
    // const pin = await bcrypt.hash(pinString, 10);
    const pin = pinString;

    cell.state = 'unavailable';
    cell.plateVehicle = plateVehicle;
    cell.pin = pin;
    cell.dateEntry = new Date();
    
    const updatedCell = await cell.save();
    
    res.json({ msg: 'Vehicle parked successfully', cell: updatedCell });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
}

export async function exitVehicle(req, res) {
  try {
    const { numberCell } = req.params;
    const cell = await Cell.findOne({numberCell:numberCell});
    
    if (!cell) {
      return res.status(404).json({ msg: 'Cell not found' });
    }
    
    if (cell.state === 'available') {
      return res.status(400).json({ msg: 'No vehicle found in this cell' });
    }
    
    cell.state = 'available';
    cell.plateVehicle = null;
    cell.pin = null;
    cell.dateEntry = null;
    cell.departureDate = new Date();
    
    const updatedCell = await cell.save();
    
    res.json({ msg: 'Vehicle exited successfully', cell: updatedCell });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
}

export async function calculatePayment(req, res) {
  try {
    const numberCell = req.params.numberCell;
    const cell = await Cell.findOne({ numberCell });
    if (!cell || cell.state === 'available') {
      return res.status(404).json({ msg: 'No vehicle found in this cell' });
    }
    const now = new Date();
    const hours = Math.max(1, Math.floor((now - cell.dateEntry) / (1000 * 60 * 60)));
    const payment = hours * 5000;
    res.json({ hours, payment });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
}