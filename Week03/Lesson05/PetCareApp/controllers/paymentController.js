const mockServices = require('../data/mockServices');

function preparePayment(req, res) {
  const serviceId = req.params.serviceId;

  if (!/^[1-9]\d*$/.test(serviceId)) {
    return res.status(404).json({ error: 'Service not found' });
  }

  const parsedServiceId = Number(serviceId);
  if (!Number.isSafeInteger(parsedServiceId)) {
    return res.status(404).json({ error: 'Service not found' });
  }

  const service = mockServices.find(item => item.id === parsedServiceId);
  if (!service) {
    return res.status(404).json({ error: 'Service not found' });
  }

  return res.status(200).json({
    serviceId: service.id,
    serviceName: service.name,
    amount: service.price,
    currency: 'sgd',
    status: 'READY_FOR_PAYMENT'
  });
}

module.exports = { preparePayment };
