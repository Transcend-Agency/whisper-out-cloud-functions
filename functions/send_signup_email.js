exports.sendEmailOnNewUser = functions.firestore
  .document('users/{userId}')
  .onCreate(async (snap, context) => {
    const userData = snap.data();

    // Check if the 'authorized' field is set to false
    if (!userData.authorized) {
      // Define the recipients and email content
      const mailOptions = {
        from: 'your-email@gmail.com',
        to: ['whisperoutlaunch@gmail.com', `${userData.email}`], // Emails to send to
        subject: 'New  User Alert',
        text: `A new user has been added to the database with the following details:
        
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


  module.exports = sendEmailOnNewUser;