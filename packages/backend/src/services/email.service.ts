import nodemailer from 'nodemailer';
import { Shipment, Bid, User } from '@prisma/client';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.mailtrap.io',
  port: parseInt(process.env.SMTP_PORT || '2525'),
  auth: {
    user: process.env.SMTP_USER || 'your-user',
    pass: process.env.SMTP_PASS || 'your-password',
  },
});

export const sendShipmentCreatedEmail = async (shipment: Shipment, customer: User) => {
  await transporter.sendMail({
    from: '"GoHaul" <noreply@gohaul.com>',
    to: customer.email,
    subject: 'New Shipment Created',
    html: `
      <h1>Your shipment has been created</h1>
      <p>Shipment details:</p>
      <ul>
        <li>Origin: ${shipment.origin}</li>
        <li>Destination: ${shipment.destination}</li>
        <li>Size: ${shipment.size}</li>
        <li>Weight: ${shipment.weight}kg</li>
      </ul>
    `,
  });
};

export const sendBidPlacedEmail = async (bid: Bid, shipment: Shipment, customer: User) => {
  await transporter.sendMail({
    from: '"GoHaul" <noreply@gohaul.com>',
    to: customer.email,
    subject: 'New Bid Received',
    html: `
      <h1>New bid received on your shipment</h1>
      <p>Bid details:</p>
      <ul>
        <li>Price: $${bid.price}</li>
        <li>ETA: ${bid.eta.toLocaleDateString()}</li>
      </ul>
    `,
  });
};

export const sendBidAcceptedEmail = async (bid: Bid, shipment: Shipment, transporterUser: User) => {
  await transporter.sendMail({
    from: '"GoHaul" <noreply@gohaul.com>',
    to: transporterUser.email,
    subject: 'Your Bid Was Accepted',
    html: `
      <h1>Congratulations! Your bid was accepted</h1>
      <p>Shipment details:</p>
      <ul>
        <li>Origin: ${shipment.origin}</li>
        <li>Destination: ${shipment.destination}</li>
        <li>Size: ${shipment.size}</li>
        <li>Weight: ${shipment.weight}kg</li>
      </ul>
    `,
  });
}; 