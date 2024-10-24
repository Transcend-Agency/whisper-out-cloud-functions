/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const functions = require('firebase-functions');
const admin = require('firebase-admin');
const nodemailer = require('nodemailer');

// Initialize Firebase Admin SDK
admin.initializeApp();

// Setup nodemailer transporter using Gmail (or any other service)
const senderEmail = functions.config().email.sender;
const senderPassword = functions.config().email.password;

// Create reusable transporter object using the default SMTP transport
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: senderEmail,
    pass: senderPassword
  }
});

// Cloud Function to send an email when a new user is added to Firestore
exports.sendEmailOnNewUser = functions.firestore
  .document('users/{userId}')
  .onCreate(async (snap, context) => {
    const userData = snap.data();

    // Check if the 'authorized' field is set to false
    if (!userData.authorized) {
      // Define the recipients and email content
      const mailOptions = {
        from: 'whisperoutlaunch@gmail.com',
        to: [ userData.email], // Emails to send to
        subject: 'New User Alert',
        text: `A new company has been registered by this user:
        
        Name: ${userData.name}
        Email: ${userData.email}
        Authorized: ${userData.authorized}
        
        Please take appropriate action.`
      };

      // Send the email
      try {
        await transporter.sendMail(mailOptions);
        console.log('Email sent successfully');
      } catch (error) {
        console.error('Error sending email:', error);
      }
    }
  });


// Configure nodemailer using a Gmail SMTP server (or another service)







