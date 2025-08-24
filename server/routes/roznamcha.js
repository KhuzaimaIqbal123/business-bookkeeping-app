const express = require('express');
const router = express.Router();

const Entry = require('../models/Entry');
const CapitalModel = require('../models/Capital');
const Cheque = require('../models/Cheque');
const Party = require('../models/Party');

// 🔹 Helper to update Party ledger
async function updatePartyLedger(data) {
  if (
    data.category === 'party' &&
    (data.paymentType === 'cash' || data.paymentType === 'cheque')
  ) {
    const party = await Party.findOne({ name: data.partyName });
    if (party) {
      const lastBalance =
        party.entries.length > 0
          ? party.entries[party.entries.length - 1].remainingBalance
          : 0;

      const bnamValue = data.type === 'expense' ? Number(data.amount) || 0 : 0;
      const jamaValue = data.type === 'income' ? Number(data.amount) || 0 : 0;

      const remainingBalance = lastBalance + jamaValue - bnamValue;

      party.entries.push({
        itemName: data.description || '',
        numberOfItems: 0,
        rate: 0,
        totalBill: 0,
        bnam: bnamValue,
        jama: jamaValue,
        type: data.paymentType,
        description: data.description || '',
        date: new Date(),
        remainingBalance,
      });

      await party.save();
    }
  }
}

// 🔸 Add new entry
router.post('/add', async (req, res) => {
  try {
    const data = req.body;

    if (data.numberOfCheques) data.numberOfCheques = Number(data.numberOfCheques);
    if (data.amount !== undefined) data.amount = Number(data.amount);

    // Income by Cheque
    if (data.type === 'income' && data.paymentType === 'cheque') {
      const chequeDetails = Array.isArray(data.chequeDetails)
        ? data.chequeDetails
        : [];

      const normalizedChequeDetails = chequeDetails.map((chq) => ({
        amount: Number(chq.amount) || 0,
        date: chq.date ? new Date(chq.date) : new Date(),
      }));

      const sum = normalizedChequeDetails.reduce((s, c) => s + c.amount, 0);

      data.amount = sum;
      data.numberOfCheques = normalizedChequeDetails.length;
      data.chequeDetails = normalizedChequeDetails;

      const entry = new Entry(data);
      await entry.save();
      await updatePartyLedger(data);

      const chequeDocs = normalizedChequeDetails.map((chq) => ({
        amount: chq.amount,
        date: chq.date,
        partyName: data.partyName || null,
        sourceEntry: entry._id,
        status: 'available',
      }));

      await Cheque.insertMany(chequeDocs);

      return res.status(201).json({ success: true, entry });
    }

    // Expense by Cheque
    else if (data.type === 'expense' && data.paymentType === 'cheque') {
      const selectedChequeIds = Array.isArray(data.selectedChequeIds)
        ? data.selectedChequeIds
        : [];

      const cheques = await Cheque.find({
        _id: { $in: selectedChequeIds },
        status: 'available',
      });

      const sum = cheques.reduce((s, c) => s + (Number(c.amount) || 0), 0);

      data.amount = sum;
      data.numberOfCheques = cheques.length;
      data.usedChequeIds = cheques.map((c) => c._id);
      data.chequeDetails = [];

      const entry = new Entry(data);
      await entry.save();
      await updatePartyLedger(data);

      await Cheque.updateMany(
        { _id: { $in: data.usedChequeIds } },
        { $set: { status: 'used', usedInEntry: entry._id } }
      );

      return res.status(201).json({ success: true, entry });
    }

    // Normal Entry
    else {
      const entry = new Entry(data);
      await entry.save();
      await updatePartyLedger(data);

      return res.status(201).json({ success: true, entry });
    }
  } catch (err) {
    console.error('Error saving entry:', err);
    res.status(400).json({ success: false, error: err.message });
  }
});

// 🔸 Get today's entries
router.get('/today', async (req, res) => {
  const start = new Date();
  start.setHours(0, 0, 0, 0);

  const end = new Date();
  end.setHours(23, 59, 59, 999);

  try {
    const entries = await Entry.find({ date: { $gte: start, $lte: end } });
    res.json(entries);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🔸 Get all available cheques
router.get('/cheques/available', async (req, res) => {
  try {
    const cheques = await Cheque.find({ status: 'available' });
    res.json(cheques);
  } catch (err) {
    console.error('Error fetching available cheques:', err);
    res.status(500).json({ error: err.message });
  }
});

// 🔸 Get summary
router.get('/summary', async (req, res) => {
  const start = new Date();
  start.setHours(0, 0, 0, 0);

  const end = new Date();
  end.setHours(23, 59, 59, 999);

  try {
    const entries = await Entry.find({ date: { $gte: start, $lte: end } });

    const summary = {
      income: { cash: 0, cheque: 0 },
      expense: { cash: 0, cheque: 0 },
    };

    entries.forEach((entry) => {
      if (entry.type === 'income') {
        summary.income[entry.paymentType] += entry.amount;
      } else {
        summary.expense[entry.paymentType] += entry.amount;
      }
    });

    const capitalDoc = await CapitalModel.findOne().sort({ updatedAt: -1 });
    const capital = capitalDoc?.currentCapital || 0;

    const availableCheques = await Cheque.find({ status: 'available' });

    const totalAvailableChequesAmount = availableCheques.reduce(
      (sum, chq) => sum + (Number(chq.amount) || 0),
      0
    );

    const updatedCapital =
      capital +
      summary.income.cash +
      summary.income.cheque -
      (summary.expense.cash + summary.expense.cheque);

    const amountInHandCash = updatedCapital - totalAvailableChequesAmount;
    const amountInHandCheques = totalAvailableChequesAmount;

    res.json({
      ...summary,
      capital,
      updatedCapital,
      availableCheques,
      amountInHandCash,
      amountInHandCheques,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🔸 Capital routes
router.get('/capital', async (req, res) => {
  try {
    const capital = await CapitalModel.findOne().sort({ updatedAt: -1 });

    const todayDate = new Date().toISOString().split('T')[0];
    let isNewDate = true;

    if (capital && capital.lastUpdatedDate === todayDate) {
      isNewDate = false;
    }

    res.json({
      currentCapital: capital ? capital.currentCapital : 0,
      lastUpdatedDate: capital ? capital.lastUpdatedDate : null,
      isNewDate,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🔸 Delete entry
router.delete('/:id', async (req, res) => {
  try {
    const entry = await Entry.findByIdAndDelete(req.params.id);

    if (!entry) {
      return res
        .status(404)
        .json({ success: false, message: 'Entry not found' });
    }

    res.json({ success: true, message: 'Entry deleted successfully' });
  } catch (err) {
    console.error('Error deleting entry:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// 🔸 Update entry
router.put('/:id', async (req, res) => {
  try {
    const data = req.body;

    if (data.amount !== undefined) data.amount = Number(data.amount);
    if (data.numberOfCheques) data.numberOfCheques = Number(data.numberOfCheques);

    const updatedEntry = await Entry.findByIdAndUpdate(req.params.id, data, {
      new: true,
    });

    if (!updatedEntry) {
      return res
        .status(404)
        .json({ success: false, message: 'Entry not found' });
    }

    res.json({ success: true, entry: updatedEntry });
  } catch (err) {
    console.error('Error updating entry:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// 🔸 Set capital
router.post('/set-capital', async (req, res) => {
  const { amount } = req.body;

  if (typeof amount !== 'number' || amount < 0) {
    return res
      .status(400)
      .json({ success: false, message: 'Invalid amount' });
  }

  try {
    const todayDate = new Date().toISOString().split('T')[0];
    let capital = await CapitalModel.findOne();

    if (capital) {
      if (capital.lastUpdatedDate === todayDate) {
        // ✅ Always return latest capital & isNewDate
        return res.status(400).json({
          success: false,
          message: 'Capital already set for today',
          currentCapital: capital.currentCapital,
          isNewDate: false,
        });
      }

      capital.currentCapital = amount;
      capital.lastUpdatedDate = todayDate;
      await capital.save();
    } else {
      capital = new CapitalModel({
        currentCapital: amount,
        lastUpdatedDate: todayDate,
      });
      await capital.save();
    }

    // ✅ Return fresh data for frontend without another call
    res.json({
      success: true,
      currentCapital: capital.currentCapital,
      lastUpdatedDate: capital.lastUpdatedDate,
      isNewDate: false,
    });
  } catch (err) {
    console.error('Error setting capital:', err);
    res.status(500).json({ success: false });
  }
});

module.exports = router;
