const Ticket = require('../../models/ticket');
const { ErrorResponse } = require('../../middleware/errorManager');
const { TicketContext } = require('./ticketContext');
const { ticketFactory } = require('./ticketFactory');
const { findOne } = require('../../models/customer');

const updateState = async (req, res, next) => {
  // includere anche: descrizione del problema, prezzo effettivo, storico

  const { id, newstate } = req.body;

  try {
    // retrive dello stato attuale del ticket
    const ticket = await Ticket.findById({ _id: id });
    if (!ticket) {
      // ticket non trovato
      return new ErrorResponse('Ticket non trovato', 404);
    }

    let context = new TicketContext(ticketFactory(ticket.stato));
    if (!context.isValid(newstate)) {
      // transizione di stato non valida
      return new ErrorResponse(
        'Tranzazione di stato illegale: ' + ticket.stato + ' -/-> ' + newstate,
        404
      );
    }

    // set del nuovo stato
    ticket.stato = newstate;

    // aggiornamento dello stato
    const newTicket = await ticket.save();
    res.status(200).json({ newTicket });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  updateState,
};
