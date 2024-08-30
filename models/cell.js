import { model, Schema } from "mongoose";

const CellSchema = new Schema({
    numberCell: {
        type: Number,
        unique: true,
        required: true,
    },
    state: {
        type: String,
        required: true,
        enum: ['available', 'unavailable'],
        default: 'available'
    },
    plateVehicle: {
        type: String,
        maxlength: [6, 'Max 6 characters'],
        minlength: [5, 'Min 5 characters'],
        default: null,
        index: false  // Explicitly tell Mongoose not to index this field
    },
    dateEntry: {
        type: Date,
        default: null
    },
    departureDate: {
        type: Date,
        default: null
    },
    pin: {
        type: String,
        default: null
    },
}, { 
    versionKey: false,
    autoIndex: false  // Disable auto-indexing
});

// Statics
CellSchema.statics.getNextCellNumber = async function() {
    const maxCell = await this.findOne({}, {numberCell: 1}, {sort: {numberCell: -1}});
    return maxCell ? maxCell.numberCell + 1 : 1;
};

// Ensure indices
CellSchema.index({ numberCell: 1 }, { unique: true });

const Cell = model('Cells', CellSchema, 'Cells');

// Explicitly create indices
Cell.createIndexes().catch(error => console.error('Error creating indexes:', error));

export default Cell;