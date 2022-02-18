import { NextApiRequest, NextApiResponse } from 'next';
import { apiBackend } from '../../../services/api';
import Cors from 'cors';

type WebhookHotmart = {
  data: {
    product: {
      has_co_production: boolean;
      name: string;
      id: number;
    };
    commissions: [
      { source: string; value: number },
      { source: string; value: number }
    ];
    purchase: {
      order_date: number;
      original_offer_price: { currency_value: string; value: number };
      price: { value: number };
      payment: { installments_number: number; type: string };
      approved_date: number;
      full_price: { value: number };
      transaction: string;
      status: string;
    };
    affiliates: [{ name: string }];
    producer: { name: string };
    buyer: { email: string };
  };
  id: string;
  creation_date: number;
  event: string;
  version: string;
};

const cors = Cors({
  methods: ['POST'],
});

function runMiddleware(req, res, fn) {
  return new Promise((resolve, reject) => {
    fn(req, res, result => {
      if (result instanceof Error) {
        return reject(result);
      }

      return resolve(result);
    });
  });
}
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    await runMiddleware(req, res, cors);
    try {
      const webhook: WebhookHotmart = req.body;
      console.log(JSON.stringify(webhook));

      const { data } = webhook as WebhookHotmart;

      apiBackend
        .post('/purchase', {
          product: data.product.name,
          transaction: data.purchase.transaction,
          status: data.purchase.status,
          email: data.buyer.email,
        })
        .then(response => console.log(response));
    } catch (error) {
      console.log(error);
    }
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method not allowed');
  }
}
