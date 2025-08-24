// server/routes/partyRoutes.js

const express = require('express');
const router = express.Router();
const Party = require('../models/Party');
const Cheque = require('../models/Cheque');

// GET all parties
router.get('/', async (req, res) => {
  try {
    const parties = await Party.find();
    res.json(parties);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch parties' });
  }
});

// POST a new party
router.post('/', async (req, res) => {
  try {
    const { name } = req.body;
    const newParty = new Party({ name, entries: [] });
    await newParty.save();
    res.status(201).json(newParty);
  } catch (err) {
    res.status(500).json({ error: 'Failed to add party' });
  }
});

// GET a party by ID
router.get('/:id', async (req, res) => {
  try {
    const party = await Party.findById(req.params.id);
    if (!party) return res.status(404).json({ error: 'Party not found' });
    res.json(party);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching party' });
  }
});

// Add new entry to a party
router.post('/:id/entries', async (req, res) => {
  try {
    const { 
      itemName, 
      numberOfItems, 
      rate, 
      bnam, 
      jama, 
      amount,
      type, 
      description,
      selectedChequeIds = []   // 👈 cheque IDs from frontend
    } = req.body;

    // Calculate bill if items/rate given
    let totalBill = (numberOfItems && rate) ? numberOfItems * rate : 0;

    let chequeSum = 0;
    if (type === "cheque" && selectedChequeIds.length > 0) {
      const cheques = await Cheque.find({ 
        _id: { $in: selectedChequeIds }, 
        status: "available" 
      });

      chequeSum = cheques.reduce((acc, c) => acc + c.amount, 0);
      totalBill = chequeSum;
    }

    const party = await Party.findById(req.params.id);
    if (!party) return res.status(404).json({ error: 'Party not found' });

    // Get last remaining balance
    const lastBalance = party.entries.length > 0
      ? party.entries[party.entries.length - 1].remainingBalance
      : 0;

    // Ensure numeric values (0 if null/undefined)
    const bnamValue = Number(bnam) || 0;
    const jamaValue = Number(jama) || 0;

    // If payment is cheque, override with chequeSum
    const finalBnam = type === "cheque" && bnamValue > 0 ? chequeSum : bnamValue;
    const finalJama = type === "cheque" && jamaValue > 0 ? chequeSum : jamaValue;

    // ✅ New balance logic
    const remainingBalance = lastBalance + finalJama - finalBnam;

    // New entry
    const newEntry = {
      itemName: itemName || "",
      numberOfItems: numberOfItems || 0,
      rate: rate || 0,
      totalBill,
      bnam: finalBnam,
      jama: finalJama,
      type: type || "",
      amount:amount || "",
      description: description || "",
      remainingBalance,
      date: new Date()
    };

    // Push to party entries
    party.entries.push(newEntry);
    await party.save();

    // update cheque status if used
    if (type === "cheque" && selectedChequeIds.length > 0) {
      const lastEntry = party.entries[party.entries.length - 1];
      await Cheque.updateMany(
        { _id: { $in: selectedChequeIds } },
        { $set: { status: "used", usedInEntry: lastEntry._id } }
      );
    }

    res.status(201).json({ message: 'Entry added', entry: newEntry });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to add entry' });
  }
});

// Update an entry
router.put('/:partyId/entries/:entryId', async (req, res) => {
  try {
    const {
      itemName,
      numberOfItems,
      rate,
      amount,
      totalBill,
      bnam,
      jama,
      type,
      description
    } = req.body;

    const party = await Party.findById(req.params.partyId);
    if (!party) return res.status(404).json({ error: 'Party not found' });

    const entryIndex = party.entries.findIndex(entry => entry._id.toString() === req.params.entryId);
    if (entryIndex === -1) return res.status(404).json({ error: 'Entry not found' });

    // Update the entry fields
    const updatedEntry = {
      ...party.entries[entryIndex],
      itemName: itemName || "",
      numberOfItems: numberOfItems || 0,
      rate: rate || 0,
      amount: amount || "",
      totalBill: totalBill || 0,
      bnam: bnam || 0,
      jama: jama || 0,
      type: type || "cash",
      description: description || ""
    };

    party.entries[entryIndex] = updatedEntry;

    // Recalculate all balances from this entry forward
    for (let i = 0; i < party.entries.length; i++) {
      const previousBalance = i === 0 ? 0 : party.entries[i - 1].remainingBalance;
      party.entries[i].remainingBalance = previousBalance + 
        (party.entries[i].jama || 0) - 
        (party.entries[i].bnam || 0);
    }

    await party.save();

    res.json({ message: 'Entry updated', updatedEntry: party.entries[entryIndex] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update entry' });
  }
});

// Delete an entry
router.delete('/:partyId/entries/:entryId', async (req, res) => {
  try {
    const party = await Party.findById(req.params.partyId);
    if (!party) return res.status(404).json({ error: 'Party not found' });

    const entryIndex = party.entries.findIndex(entry => entry._id.toString() === req.params.entryId);
    if (entryIndex === -1) return res.status(404).json({ error: 'Entry not found' });

    // Remove the entry
    party.entries.splice(entryIndex, 1);

    // Recalculate all balances from the deleted point forward
    for (let i = 0; i < party.entries.length; i++) {
      const previousBalance = i === 0 ? 0 : party.entries[i - 1].remainingBalance;
      party.entries[i].remainingBalance = previousBalance + 
        (party.entries[i].jama || 0) - 
        (party.entries[i].bnam || 0);
    }

    await party.save();
    res.json({ message: 'Entry deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete entry' });
  }
});

module.exports = router;
